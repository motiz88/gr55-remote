import React, {
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  AsciiStringField,
  FieldDefinition,
  StructDefinition,
  getAddresses,
  parse,
} from "./RolandAddressMap";
import { RolandDataTransferContext } from "./RolandDataTransfer";
import { RolandRemotePatchContext } from "./RolandRemotePageContext";
import { pack7 } from "./RolandSysExProtocol";
import useCancellablePromise from "./useCancellablePromise";
import { usePatchMap } from "./usePatchMap";

const CompactPatchDefinition = new StructDefinition(
  pack7(0x000000),
  "User patch (compact)",
  {
    common: new StructDefinition(pack7(0x000000), "Common", {
      patchName: new FieldDefinition(
        pack7(0x0001),
        "Patch Name",
        new AsciiStringField(16)
      ),
    }),
  }
);

const CompactPatchDefinitionAddresses = getAddresses(CompactPatchDefinition, 0);

export type RolandGR55PatchDescription = {
  readonly status: "pending" | "rejected" | "resolved";
  readonly error: Error | null | void;
  readonly identity: {
    readonly bankMSB: number;
    readonly pc: number;
    readonly patchNumberLabel: string;
    readonly styleLabel: string;
    readonly userPatch?: {
      readonly patchNumber: number;
      readonly baseAddress: number;
    };
  };
  readonly data: {
    readonly name: string;
  } | null;
};

const RolandGR55RemotePatchDescriptions = React.createContext<{
  readonly patches: RolandGR55PatchDescription[] | null;
  readonly reloadData: () => void;
}>({ patches: null, reloadData: () => {} });

export function RolandGR55RemotePatchDescriptionsContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const patchMap = usePatchMap();
  const { requestData } = useContext(RolandDataTransferContext);
  const userPatchDescriptionsMut = useRef<{ name: string }[]>([]);
  const [userPatchDescriptions, setUserPatchDescriptions] = useState<
    { name: string }[]
  >([]);
  const [invalidationCount, setInvalidationCount] = useState(0);
  const [, userPatchDescriptionsError, userPatchDescriptionsStatus] =
    useCancellablePromise(
      useCallback(
        async (signal) => {
          // Manually register a dependency on the invalidation count to force a refetch in invalidateData.
          // eslint-disable-next-line no-unused-expressions
          invalidationCount;
          if (!patchMap || !requestData) {
            throw new Error(
              "No patch map or request data available. Is a GR-55 connected?"
            );
          }
          const promises = [];
          for (const patch of patchMap.patchList) {
            const { userPatch } = patch;
            if (!userPatch) {
              continue;
            }
            if (userPatchDescriptionsMut.current[userPatch.patchNumber]) {
              continue;
            }
            promises.push(
              (async () => {
                const compactPatchData = await requestData(
                  CompactPatchDefinition,
                  userPatch.baseAddress,
                  signal,
                  "read_patch_list"
                );
                const [patchName] = parse(
                  compactPatchData[
                    userPatch.baseAddress +
                      CompactPatchDefinitionAddresses.common.patchName.address
                  ],
                  CompactPatchDefinitionAddresses.common.patchName.definition,
                  0
                );
                userPatchDescriptionsMut.current[userPatch.patchNumber] = {
                  name: patchName.value,
                };
              })()
            );
          }
          await Promise.all(promises);
          setUserPatchDescriptions((prev) => {
            // merge prev and current
            const size = Math.max(
              prev.length,
              userPatchDescriptionsMut.current.length
            );
            const result: typeof prev = [];
            for (let i = 0; i < size; i++) {
              result.push(userPatchDescriptionsMut.current[i] ?? prev[i]);
            }
            return result;
          });
        },
        [patchMap, requestData, invalidationCount]
      )
    );

  const invalidateData = useMemo(
    () => () => {
      userPatchDescriptionsMut.current = [];
      setInvalidationCount((x) => x + 1);
    },
    []
  );

  const invalidatePatch = useCallback(
    (userPatchNumber: number) => {
      delete userPatchDescriptionsMut.current[userPatchNumber];
      setInvalidationCount((x) => x + 1);
    },
    [setInvalidationCount]
  );

  const remotePatchState = useContext(RolandRemotePatchContext);
  const remotePatchStateInner = useMemo(
    () => ({
      ...remotePatchState,
      async saveAndSelectUserPatch(userPatchNumber: number) {
        await remotePatchState.saveAndSelectUserPatch(userPatchNumber);
        invalidatePatch(userPatchNumber);
      },
    }),
    [invalidatePatch, remotePatchState]
  );

  const state = useMemo(() => {
    if (!patchMap) {
      return { patches: null, reloadData: invalidateData };
    }

    const patches = patchMap.patchList.map((patch) => {
      if (patch.userPatch) {
        return {
          status: userPatchDescriptionsStatus,
          error: userPatchDescriptionsError,
          identity: {
            bankMSB: patch.bankMSB,
            pc: patch.pc,
            patchNumberLabel: patch.patchNumberLabel,
            styleLabel: patch.styleLabel,
            userPatch: patch.userPatch,
          },
          data: userPatchDescriptions
            ? userPatchDescriptions[patch.userPatch.patchNumber]
            : null,
        } as const;
      } else {
        return {
          status: "resolved",
          error: null,
          identity: {
            bankMSB: patch.bankMSB,
            pc: patch.pc,
            patchNumberLabel: patch.patchNumberLabel,
            styleLabel: patch.styleLabel,
          },
          data: {
            name: patch.builtInName!,
          },
        } as const;
      }
    });
    return { patches, reloadData: invalidateData };
  }, [
    invalidateData,
    patchMap,
    userPatchDescriptions,
    userPatchDescriptionsError,
    userPatchDescriptionsStatus,
  ]);
  return (
    <RolandGR55RemotePatchDescriptions.Provider value={state}>
      <RolandRemotePatchContext.Provider value={remotePatchStateInner}>
        {children}
      </RolandRemotePatchContext.Provider>
    </RolandGR55RemotePatchDescriptions.Provider>
  );
}

export function useRolandGR55RemotePatchDescriptions() {
  return useContext(RolandGR55RemotePatchDescriptions);
}

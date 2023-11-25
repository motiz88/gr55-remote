import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { AtomReference, FieldDefinition } from "./RolandAddressMap";
import { RolandDataTransferContext } from "./RolandDataTransfer";
import { RolandIoSetupContext } from "./RolandIoSetup";
import { RolandRemotePatchContext as PATCH } from "./RolandRemotePageContext";
import { useRolandRemotePatchSelection } from "./RolandRemotePatchSelection";
import { useUserOptions } from "./UserOptions";
import useCancellablePromise from "./useCancellablePromise";
import { usePatchMap } from "./usePatchMap";

type RolandRemotePatchAutoSaveContextType = Readonly<{
  autoSaveSyncStatus: "pending" | "resolved" | "rejected" | null;
  isAutoSaveEnabled: boolean;
  setAutoSaveEnabled: (autoSaveEnabled: boolean) => void;
  setAndPersistRemoteField: (
    field: AtomReference<FieldDefinition<any>>,
    value: Uint8Array,
    previousValue: void | Uint8Array
  ) => void;
}>;

const RolandRemotePatchAutoSaveContext =
  createContext<RolandRemotePatchAutoSaveContextType>({
    autoSaveSyncStatus: null,
    isAutoSaveEnabled: false,
    setAutoSaveEnabled() {},
    setAndPersistRemoteField() {},
  });

export function RolandRemotePatchAutoSaveContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const [{ enableExperimentalFeatures }] = useUserOptions();
  const remotePatchState = useContext(PATCH);
  const patchMap = usePatchMap();
  const { selectedPatch } = useRolandRemotePatchSelection();
  const { selectedDevice } = useContext(RolandIoSetupContext);
  const { setField } = useContext(RolandDataTransferContext);

  const patchList = patchMap?.patchList;
  const baseAddressByUserPatchNumber = useMemo(() => {
    if (patchList == null) {
      return null;
    }
    const map = new Map();
    for (const patch of patchList) {
      if (patch.userPatch) {
        map.set(patch.userPatch.patchNumber, patch.userPatch.baseAddress);
      }
    }
    return map;
  }, [patchList]);

  const patch = useMemo(() => {
    if (!patchMap || !selectedPatch) {
      return undefined;
    }
    // NOTE: O(n), but patch changes are rare
    return patchMap.patchList.find(
      (p) =>
        p.bankMSB === selectedPatch.bankSelectMSB && p.pc === selectedPatch.pc
    );
  }, [patchMap, selectedPatch]);
  const userPatchNumber = patch?.userPatch?.patchNumber;
  const { saveAndSelectUserPatch } = remotePatchState;
  const [isAutoSaveEnabled, setIsAutoSaveEnabledState] = useState(
    enableExperimentalFeatures
  );
  const setAutoSaveEnabled = useCallback(
    (nextValue: boolean) => {
      if (!isAutoSaveEnabled && nextValue) {
        if (userPatchNumber == null) {
          return;
        }
        saveAndSelectUserPatch(userPatchNumber);
      }
      setIsAutoSaveEnabledState(nextValue);
    },
    [isAutoSaveEnabled, saveAndSelectUserPatch, userPatchNumber]
  );
  useEffect(() => {
    // TODO: Remove/refine
    setAutoSaveEnabled(enableExperimentalFeatures);
  }, [enableExperimentalFeatures, setAutoSaveEnabled]);
  const [
    autoSavePersistenceInvalidationCount,
    setAutoSavePersistenceInvalidationCount,
  ] = useState(0);
  const { persistUserDataToMemory } = remotePatchState;
  const [, , autoSaveSyncStatus] = useCancellablePromise(
    useCallback(
      async (signal) => {
        // Manually register a dependency on the invalidation count to retrigger the command as necessary.
        // eslint-disable-next-line no-unused-expressions
        autoSavePersistenceInvalidationCount;
        if (!isAutoSaveEnabled) {
          return;
        }
        // persistUserDataToMemory is potentially slow on the device side, which hogs the queue
        // and prevents other commands from being sent. Delay the command to keep the app responsive
        // immediately after an interaction.
        await delay(2500);
        // We might have been aborted during the delay.
        if (signal?.aborted) {
          throw new Error("Aborted");
        }
        // TODO: Report a different status between this point and "resolved", to avoid implying that
        // saving takes a long time while we're just waiting above.
        return persistUserDataToMemory(signal);
      },
      [
        autoSavePersistenceInvalidationCount,
        isAutoSaveEnabled,
        persistUserDataToMemory,
      ]
    )
  );
  const setAndPersistRemoteField = useCallback(
    (
      field: AtomReference<FieldDefinition<any>>,
      value: Uint8Array,
      previousValue: void | Uint8Array
    ) => {
      if (!isAutoSaveEnabled) {
        return;
      }
      if (userPatchNumber == null) {
        return;
      }
      if (selectedDevice == null) {
        return;
      }
      if (selectedDevice.sysExConfig?.addressMap == null) {
        return;
      }
      const mirroredField = {
        ...field,
        address:
          field.address -
          selectedDevice.sysExConfig.addressMap.temporaryPatch.address +
          baseAddressByUserPatchNumber!.get(userPatchNumber)!,
      };
      setField!(mirroredField, value, "write_deferred");
      setAutoSavePersistenceInvalidationCount((x) => x + 1);
    },
    [
      baseAddressByUserPatchNumber,
      isAutoSaveEnabled,
      selectedDevice,
      setField,
      userPatchNumber,
    ]
  );
  const context = useMemo(
    () => ({
      autoSaveSyncStatus,
      isAutoSaveEnabled,
      setAutoSaveEnabled,
      setAndPersistRemoteField,
    }),
    [
      autoSaveSyncStatus,
      isAutoSaveEnabled,
      setAndPersistRemoteField,
      setAutoSaveEnabled,
    ]
  );
  const remotePatchStateWithAutoSave = useMemo(
    () => ({
      ...remotePatchState,
      isModifiedSinceSave:
        remotePatchState.isModifiedSinceSave && !isAutoSaveEnabled,
      // setRemoteField: setAndPersistRemoteField,
    }),
    [isAutoSaveEnabled, remotePatchState /*, setAndPersistRemoteField */]
  );
  return (
    <RolandRemotePatchAutoSaveContext.Provider value={context}>
      <PATCH.Provider value={remotePatchStateWithAutoSave}>
        {children}
      </PATCH.Provider>
    </RolandRemotePatchAutoSaveContext.Provider>
  );
}

export function useRolandRemotePatchAutoSave() {
  return useContext(RolandRemotePatchAutoSaveContext);
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

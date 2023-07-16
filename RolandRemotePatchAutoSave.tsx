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
import { usePatchMap } from "./usePatchMap";

type RolandRemotePatchAutoSaveContextType = Readonly<{
  isAutoSaveEnabled: boolean;
  setAutoSaveEnabled: (autoSaveEnabled: boolean) => void;
}>;

const RolandRemotePatchAutoSaveContext =
  createContext<RolandRemotePatchAutoSaveContextType>({
    isAutoSaveEnabled: false,
    setAutoSaveEnabled() {},
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
  const context = useMemo(
    () => ({
      isAutoSaveEnabled,
      setAutoSaveEnabled,
    }),
    [isAutoSaveEnabled, setAutoSaveEnabled]
  );
  const remotePatchStateWithAutoSave = useMemo(
    () => ({
      ...remotePatchState,
      isModifiedSinceSave:
        remotePatchState.isModifiedSinceSave && !isAutoSaveEnabled,
      setRemoteField(
        field: AtomReference<FieldDefinition<any>>,
        value: Uint8Array,
        previousValue: void | Uint8Array
      ) {
        remotePatchState.setRemoteField(field, value, previousValue);
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
        setField!(mirroredField, value);
      },
    }),
    [
      baseAddressByUserPatchNumber,
      isAutoSaveEnabled,
      remotePatchState,
      selectedDevice,
      setField,
      userPatchNumber,
    ]
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

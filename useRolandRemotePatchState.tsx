import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { AtomReference, FieldDefinition } from "./RolandAddressMap";
import { RolandDataTransferContext } from "./RolandDataTransfer";
import { RolandGR55SysExConfig } from "./RolandDevices";
import { RolandIoSetupContext } from "./RolandIoSetup";
import { useRolandRemotePatchSelection } from "./RolandRemotePatchSelection";
import { useRolandRemotePageState } from "./useRolandRemotePageState";

export function useRolandRemotePatchState() {
  const { selectedDevice } = useContext(RolandIoSetupContext);
  const sysExConfig = selectedDevice?.sysExConfig ?? RolandGR55SysExConfig;
  const addressMap = sysExConfig.addressMap;

  const remotePageState = useRolandRemotePageState(
    addressMap?.temporaryPatch,
    "read_patch_details"
  );
  const rolandDataTransfer = useContext(RolandDataTransferContext);

  const { selectedPatch } = useRolandRemotePatchSelection();
  const previousPatch = usePrevious(selectedPatch);
  useEffect(() => {
    if (!selectedPatch) {
      return;
    }
    if (
      previousPatch?.bankSelectMSB !== selectedPatch.bankSelectMSB ||
      previousPatch?.pc !== selectedPatch.pc
    ) {
      remotePageState.reloadData();
      // Strictly speaking there is a race condition here, but we block the user
      // from editing the patch while a reload is in progress, so we can clear this
      // flag early with no ill effects.
      setModifiedSinceSave(false);
    }
  }, [selectedPatch, previousPatch, remotePageState]);

  // NOTE: This bit is intentionally not cleared on reloads. Reloads only sync with the
  // temporary patch storage, but we want to keep track of whether the user has made
  // changes that need to be saved from the temporary patch to permanent storage.
  const [isModifiedSinceSave, setModifiedSinceSave] = useState(false);

  const setRemoteField = useCallback(
    <T extends FieldDefinition<any>>(
      field: AtomReference<T>,
      value: Uint8Array | ReturnType<T["type"]["decode"]>
    ) => {
      setModifiedSinceSave(true);
      remotePageState.setRemoteField(field, value);
    },
    [remotePageState]
  );

  const saveAndSelectUserPatch = useCallback(
    async (userPatchNumber: number) => {
      if (sysExConfig.commands?.saveAndSelectUserPatch) {
        setModifiedSinceSave(false);
        await sysExConfig.commands?.saveAndSelectUserPatch?.(
          userPatchNumber,
          rolandDataTransfer
        );
      }
      // TODO: Fallback to using raw data transfer if no canned command is available.
    },
    [rolandDataTransfer, sysExConfig.commands]
  );

  return useMemo(
    () => ({
      ...remotePageState,
      setRemoteField,
      isModifiedSinceSave,
      setModifiedSinceSave,
      saveAndSelectUserPatch,
    }),
    [
      isModifiedSinceSave,
      remotePageState,
      setRemoteField,
      saveAndSelectUserPatch,
    ]
  );
}

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

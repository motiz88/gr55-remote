import { useContext, useEffect, useRef } from "react";

import { RolandGR55SysExConfig } from "./RolandDevices";
import { RolandIoSetupContext } from "./RolandIoSetupContext";
import { useRolandRemotePatchSelection } from "./RolandRemotePatchSelection";
import { useRolandRemotePageState } from "./useRolandRemotePageState";

export function useRolandRemotePatchState() {
  const { selectedDevice } = useContext(RolandIoSetupContext);
  const sysExConfig = selectedDevice?.sysExConfig ?? RolandGR55SysExConfig;
  const addressMap = sysExConfig.addressMap;

  const remotePageState = useRolandRemotePageState(addressMap?.temporaryPatch);

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
    }
  }, [selectedPatch, previousPatch, remotePageState]);

  return remotePageState;
}

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

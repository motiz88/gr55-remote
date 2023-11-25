import { useContext } from "react";

import { RolandGR55SysExConfig } from "./RolandDevices";
import { RolandIoSetupContext } from "./RolandIoSetup";
import { useRolandRemotePageState } from "./useRolandRemotePageState";

export function useRolandRemoteSystemState() {
  const { selectedDevice } = useContext(RolandIoSetupContext);
  const sysExConfig = selectedDevice?.sysExConfig ?? RolandGR55SysExConfig;
  const addressMap = sysExConfig.addressMap;

  return useRolandRemotePageState(addressMap?.system, "read_utmost");
}

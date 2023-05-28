import { useContext } from "react";

import { RolandGR55AddressMapAbsolute as GR55 } from "./RolandGR55AddressMap";
import { AssignsMap } from "./RolandGR55Assigns";
import { RolandIoSetupContext } from "./RolandIoSetup";
import { RolandRemoteSystemContext as SYSTEM } from "./RolandRemotePageContext";
import { useRemoteField } from "./useRemoteField";

export function useAssignsMap(): AssignsMap | undefined {
  const { selectedDevice } = useContext(RolandIoSetupContext);
  const gr55Config = selectedDevice?.sysExConfig?.gr55;
  const [guitarBassSelect] = useRemoteField(
    SYSTEM,
    GR55.system.common.guitarBassSelect
  );

  if (!gr55Config) {
    return undefined;
  }

  if (guitarBassSelect === "GUITAR") {
    return gr55Config.assignsMapGuitarMode;
  }
  return gr55Config.assignsMapBassMode;
}

import { useContext } from "react";

import { RolandGR55AddressMapAbsolute as GR55 } from "./RolandGR55AddressMap";
import type { RolandGR55PatchMap } from "./RolandGR55PatchMap";
import { RolandIoSetupContext } from "./RolandIoSetupContext";
import { RolandRemoteSystemContext as SYSTEM } from "./RolandRemotePageContext";
import { useRemoteField } from "./useRemoteField";

export function usePatchMap(): RolandGR55PatchMap | undefined {
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
    return gr55Config.patchMapGuitarMode;
  }
  return gr55Config.patchMapBassMode;
}

import { useContext } from "react";

import { AssignsMap } from "./RolandGR55Assigns";
import { RolandIoSetupContext } from "./RolandIoSetupContext";
import { useGR55GuitarBassSelect } from "./useGR55GuitarBassSelect";

export function useAssignsMap(): AssignsMap | undefined {
  const { selectedDevice } = useContext(RolandIoSetupContext);
  const gr55Config = selectedDevice?.sysExConfig?.gr55;
  // TODO: loading states for system and patch data (Suspense?)
  const [guitarBassSelect = "GUITAR"] = useGR55GuitarBassSelect();

  if (!gr55Config) {
    return undefined;
  }

  if (guitarBassSelect === "GUITAR") {
    return gr55Config.assignsMapGuitarMode;
  }
  return gr55Config.assignsMapBassMode;
}

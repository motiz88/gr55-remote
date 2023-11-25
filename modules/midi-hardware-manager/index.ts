import { requireNativeModule } from "expo-modules-core";
import { Platform } from "react-native";

import MidiHardwareManagerView from "./src/MidiHardwareManagerView";

const MidiHardwareManager = requireNativeModule("MidiHardwareManager");

export function setNetworkSessionsEnabled(enabled: boolean) {
  if (Platform.OS === "ios") {
    MidiHardwareManager.setNetworkSessionsEnabled(enabled);
  }
}

export { MidiHardwareManagerView };

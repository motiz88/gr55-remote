import { requireNativeViewManager } from "expo-modules-core";
import * as React from "react";

import { MidiHardwareManagerViewProps } from "./MidiHardwareManager.types";

const NativeView: React.ComponentType<MidiHardwareManagerViewProps> =
  requireNativeViewManager("MidiHardwareManager");

export default function MidiHardwareManagerView(
  props: MidiHardwareManagerViewProps
) {
  return <NativeView {...props} />;
}

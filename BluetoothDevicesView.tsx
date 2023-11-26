import { requireNativeViewManager } from "expo-modules-core";
import * as React from "react";

import { MidiHardwareManagerViewProps } from "./modules/midi-hardware-manager/src/MidiHardwareManager.types";

const NativeView: React.ComponentType<MidiHardwareManagerViewProps> =
  requireNativeViewManager("MidiHardwareManager");

export function BluetoothDevicesView(props: MidiHardwareManagerViewProps) {
  return <NativeView {...props} />;
}

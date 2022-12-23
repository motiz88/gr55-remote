import * as React from "react";

import * as RolandSysExProtocol from "./RolandSysExProtocol";

export type DeviceDescriptor = {
  sysExConfig: RolandSysExProtocol.RolandSysExConfig | null;
  description: string;
  identity: RolandSysExProtocol.DeviceIdentity;
};

export const RolandIoSetupContext = React.createContext<{
  connectedDevices: ReadonlyMap<string, Readonly<DeviceDescriptor>>;
  selectedDevice: Readonly<DeviceDescriptor> | undefined;
  selectedDeviceKey: string | undefined;
  setSelectedDeviceKey: (key?: string) => void;
  includeFakeDevice: boolean;
  setIncludeFakeDevice: (includeFakeDevice: boolean) => void;
}>({
  connectedDevices: new Map(),
  selectedDevice: undefined,
  selectedDeviceKey: undefined,
  setSelectedDeviceKey: () => {},
  includeFakeDevice: false,
  setIncludeFakeDevice: () => {},
});

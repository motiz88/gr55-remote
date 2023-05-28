import type { MIDIMessageEvent } from "@motiz88/react-native-midi";
import { useContext, useEffect, useMemo, useRef, useState } from "react";

import { useStateWithStoredDefault } from "./AsyncStorageUtils";
import { MidiIoContext } from "./MidiIo";
import { AllSysExConfigs, RolandGR55SysExConfig } from "./RolandDevices";
import { DeviceDescriptor } from "./RolandIoSetupContext";
import * as RolandSysExProtocol from "./RolandSysExProtocol";

export function useRolandIoSetup() {
  const [includeFakeDevice, setIncludeFakeDevice] =
    useStateWithStoredDefault<boolean>(
      "@motiz88/gr55-remote/RolandIoSetup/includeFakeDevice",
      false
    );

  const { inputPort, outputPort } = useContext(MidiIoContext);
  const connectedDevicesRef = useRef(new Map());
  const [connectedDevicesSnapshot, setConnectedDevicesSnapshot] = useState<
    ReadonlyMap<string, Readonly<DeviceDescriptor>>
  >(new Map());

  // TODO: Persist selected device key
  const [selectedDeviceKey, setSelectedDeviceKey] = useState<string>();

  useEffect(() => {
    const handleIdentity = (
      identity: RolandSysExProtocol.DeviceIdentity,
      isFake?: boolean
    ) => {
      let deviceDescriptor: DeviceDescriptor | void;
      const deviceKey = [
        identity.manufacturerId.toString(16),
        identity.deviceFamily.toString(16),
        identity.deviceModel.toString(16),
        identity.deviceId.toString(16),
        isFake ? "FAKE" : "",
      ]
        .filter(Boolean)
        .join("-");

      for (const sysExConfig of AllSysExConfigs) {
        if (
          identity.manufacturerId === sysExConfig.manufacturerId &&
          identity.deviceFamily === sysExConfig.familyCode &&
          identity.deviceModel === sysExConfig.modelNumber
        ) {
          deviceDescriptor = {
            sysExConfig,
            description: sysExConfig.description + (isFake ? " (fake)" : ""),
            identity,
          };
          break;
        }
      }
      if (!deviceDescriptor) {
        deviceDescriptor = {
          sysExConfig: null,
          description: `Unknown device (manufacturer 0x${identity.manufacturerId.toString(
            16
          )}, family 0x${identity.deviceFamily.toString(
            16
          )}, model 0x${identity.deviceModel.toString(16)})`,
          identity,
        };
      }
      connectedDevicesRef.current.set(deviceKey, deviceDescriptor);
      setConnectedDevicesSnapshot(new Map(connectedDevicesRef.current));
      setSelectedDeviceKey(
        (currentSelectedKey) => currentSelectedKey ?? deviceKey
      );
    };

    const handleMidiMessage = (event: MIDIMessageEvent) => {
      const identity = RolandSysExProtocol.parseIdentityReplyMessage(
        event.data
      );
      if (identity) {
        handleIdentity(identity);
      }
    };

    connectedDevicesRef.current.clear();

    if (includeFakeDevice) {
      handleIdentity(
        {
          manufacturerId: RolandGR55SysExConfig.manufacturerId,
          deviceFamily: RolandGR55SysExConfig.familyCode,
          deviceModel: RolandGR55SysExConfig.modelNumber,
          deviceId: 0x7f,
          softwareRevisionLevel: 0x0100,
        },
        /* isFake */ true
      );
    }
    setConnectedDevicesSnapshot(new Map(connectedDevicesRef.current));

    if (!inputPort || !outputPort) {
      return;
    }
    outputPort.send(RolandSysExProtocol.BROADCAST_IDENTITY_REQUEST_MESSAGE);

    const myInputPort = inputPort;
    myInputPort.addEventListener("midimessage", handleMidiMessage);
    return () => {
      myInputPort.removeEventListener("midimessage", handleMidiMessage as any);
    };
  }, [inputPort, outputPort, includeFakeDevice, setSelectedDeviceKey]);

  const selectedDevice =
    selectedDeviceKey != null
      ? connectedDevicesSnapshot.get(selectedDeviceKey)
      : undefined;

  const rolandIoSetupContext = useMemo(
    () => ({
      connectedDevices: connectedDevicesSnapshot,
      selectedDevice,
      selectedDeviceKey,
      setSelectedDeviceKey,
      includeFakeDevice,
      setIncludeFakeDevice,
    }),
    [
      connectedDevicesSnapshot,
      includeFakeDevice,
      selectedDevice,
      selectedDeviceKey,
      setIncludeFakeDevice,
    ]
  );
  return rolandIoSetupContext;
}

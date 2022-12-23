import type { MIDIMessageEvent } from "@motiz88/react-native-midi";
import { useContext, useEffect, useMemo, useRef, useState } from "react";

import { MidiIoContext } from "./MidiIoContext";
import { AllSysExConfigs, RolandGR55SysExConfig } from "./RolandDevices";
import { DeviceDescriptor } from "./RolandIoSetupContext";
import * as RolandSysExProtocol from "./RolandSysExProtocol";

export function useRolandIoSetup() {
  const [includeFakeDevice, setIncludeFakeDevice] = useState(false);

  const { inputPort, outputPort } = useContext(MidiIoContext);
  const connectedDevicesRef = useRef(new Map());
  const [connectedDevicesSnapshot, setConnectedDevicesSnapshot] = useState<
    ReadonlyMap<string, Readonly<DeviceDescriptor>>
  >(new Map());

  useEffect(() => {
    if (includeFakeDevice) {
      connectedDevicesRef.current.set("FAKE-GR55", {
        sysExConfig: RolandGR55SysExConfig,
        description: "Fake GR-55",
        identity: {
          manufacturerId: RolandGR55SysExConfig.manufacturerId,
          deviceFamily: RolandGR55SysExConfig.familyCode,
          deviceModel: RolandGR55SysExConfig.modelNumber,
          deviceId: 0x7f,
          softwareRevisionLevel: 0x0100,
        },
      });
    } else {
      connectedDevicesRef.current.delete("FAKE-GR55");
    }

    setConnectedDevicesSnapshot(new Map(connectedDevicesRef.current));
  }, [includeFakeDevice]);

  useEffect(() => {
    if (!inputPort || !outputPort) {
      return;
    }
    const handleIdentity = (identity: RolandSysExProtocol.DeviceIdentity) => {
      let deviceDescriptor: DeviceDescriptor | void;
      const deviceKey = [
        identity.manufacturerId.toString(16),
        identity.deviceFamily.toString(16),
        identity.deviceModel.toString(16),
        identity.deviceId.toString(16),
      ].join("-");

      for (const sysExConfig of AllSysExConfigs) {
        if (
          identity.manufacturerId === sysExConfig.manufacturerId &&
          identity.deviceFamily === sysExConfig.familyCode &&
          identity.deviceModel === sysExConfig.modelNumber
        ) {
          deviceDescriptor = {
            sysExConfig,
            description: sysExConfig.description,
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
    setConnectedDevicesSnapshot(new Map(connectedDevicesRef.current));
    outputPort.send(RolandSysExProtocol.BROADCAST_IDENTITY_REQUEST_MESSAGE);

    const myInputPort = inputPort;
    myInputPort.addEventListener("midimessage", handleMidiMessage);
    return () => {
      myInputPort.removeEventListener("midimessage", handleMidiMessage as any);
    };
  }, [inputPort, outputPort]);
  const [selectedDeviceKey, setSelectedDeviceKey] = useState<
    string | undefined
  >();

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
    ]
  );
  return rolandIoSetupContext;
}

import { useFocusEffect } from "@react-navigation/core";
import React, { useCallback, useEffect } from "react";
import { View } from "react-native";
import { Device as BLEDevice } from "react-native-ble-plx";
import { List } from "react-native-paper";

import { BLEService } from "./BLEService";
import { PopoverAwareScrollView } from "./PopoverAwareScrollView";
import { ThemedText as Text } from "./ThemedText";
import {
  closeDeviceById,
  openBluetoothDevice,
  openedDevicesEmitter,
} from "./modules/midi-hardware-manager";
import { MidiHardwareManagerViewProps } from "./modules/midi-hardware-manager/src/MidiHardwareManager.types";
import useCancellablePromise from "./useCancellablePromise";

const emptyAsyncFn = async () => {};

type DeviceInfo = {
  id: string;
  name: string | null;
  localName: string | null;
};

function throwIfAborted(signal: AbortSignal) {
  if (signal.aborted) {
    throw new Error("Aborted");
  }
}

export function BluetoothDevicesView(props: MidiHardwareManagerViewProps) {
  const [mainAsyncFunction, setMainAsyncFunction] = React.useState<
    (signal: AbortSignal) => Promise<void>
  >(() => emptyAsyncFn);
  const [devices, setDevices] = React.useState<DeviceInfo[]>([]);
  const [state, setState] = React.useState<"scanning" | "idle">("idle");
  useFocusEffect(
    useCallback(() => {
      setState("scanning");
      setMainAsyncFunction(() => async (signal: AbortSignal) => {
        const devicesSeen = new Map<string, BLEDevice>();
        signal.addEventListener("abort", () => {
          setState("idle");
          BLEService.manager.stopDeviceScan();
        });
        await BLEService.requestBluetoothPermission();
        throwIfAborted(signal);
        await BLEService.initializeBLE();
        throwIfAborted(signal);
        await BLEService.scanDevices(
          (device) => {
            devicesSeen.set(device.id, device);
            setDevices(
              [...devicesSeen.values()].map((d) => {
                return {
                  id: d.id,
                  name: d.name,
                  localName: d.localName,
                };
              })
            );
          },
          [
            // BLE MIDI Service UUID
            "03B80E5A-EDE8-4B33-A751-6CE34EC4C700",
          ]
        );
      });
      return () => {
        setMainAsyncFunction(() => emptyAsyncFn);
      };
    }, [])
  );
  useCancellablePromise(mainAsyncFunction);
  const [openDevices, setOpenDevices] = React.useState<ReadonlySet<string>>(
    new Set()
  );
  useEffect(() => {
    const listener = (payload: ReadonlySet<string>) => {
      setOpenDevices(payload);
    };
    openedDevicesEmitter.addListener("devicesUpdated", listener);
    return () => {
      openedDevicesEmitter.removeListener("devicesUpdated", listener);
    };
  });
  const handleItemPress = useCallback(
    async (deviceId: string) => {
      if (openDevices.has(deviceId)) {
        await closeDeviceById(deviceId);
      } else {
        await openBluetoothDevice(deviceId);
      }
    },
    [openDevices]
  );
  return (
    <View style={props.style}>
      <PopoverAwareScrollView>
        {/* TODO: render the connected devices here, not just the scan results */}
        {devices.length === 0 ? (
          state === "idle" ? (
            <Text>No devices found</Text>
          ) : (
            <Text>Scanning for devices...</Text>
          )
        ) : (
          devices.map((device) => (
            <List.Item
              key={device.id}
              title={device.name ?? "<Unknown device>"}
              description={device.id}
              onPress={() => handleItemPress(device.id)}
              right={() =>
                openDevices.has(device.id) ? (
                  <List.Icon icon="bluetooth-connect" />
                ) : undefined
              }
            />
          ))
        )}
      </PopoverAwareScrollView>
    </View>
  );
}

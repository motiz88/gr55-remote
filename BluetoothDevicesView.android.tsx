import { useFocusEffect } from "@react-navigation/core";
import React, { useCallback, useMemo } from "react";
import { StyleSheet } from "react-native";
import { Device as BLEDevice } from "react-native-ble-plx";
import { List } from "react-native-paper";

import { BLEService } from "./BLEService";
import { PopoverAwareScrollView } from "./PopoverAwareScrollView";
import { useMainScrollViewSafeAreaStyle } from "./SafeAreaUtils";
import { ThemedText as Text } from "./ThemedText";
import {
  OpenBluetoothDeviceInfo,
  closeDeviceById,
  openBluetoothDevice,
  useOpenedDevices,
} from "./modules/midi-hardware-manager";
import { MidiHardwareManagerViewProps } from "./modules/midi-hardware-manager/src/MidiHardwareManager.types";
import useCancellablePromise from "./useCancellablePromise";

const emptyAsyncFn = async () => {};

type ScannedDeviceInfo = Readonly<{
  id: string;
  name: string | null;
  localName: string | null;
}>;

function throwIfAborted(signal: AbortSignal) {
  if (signal.aborted) {
    throw new Error("Aborted");
  }
}

function useBluetoothScannedDevices() {
  const [mainAsyncFunction, setMainAsyncFunction] = React.useState<
    (signal: AbortSignal) => Promise<void>
  >(() => emptyAsyncFn);
  const [devices, setDevices] = React.useState<ScannedDeviceInfo[]>([]);
  const [state, setState] = React.useState<"scanning" | "idle">("idle");
  useFocusEffect(
    useCallback(() => {
      setState("scanning");
      setMainAsyncFunction(() => async (signal: AbortSignal) => {
        const scannedDevices = new Map<string, BLEDevice>();
        signal.addEventListener("abort", () => {
          setState("idle");
          BLEService.manager.stopDeviceScan();
        });
        updateDevices();
        await BLEService.requestBluetoothPermission();
        throwIfAborted(signal);
        await BLEService.initializeBLE();
        throwIfAborted(signal);
        await BLEService.scanDevices(
          (device) => {
            scannedDevices.set(device.id, device);
            updateDevices();
          },
          [
            // BLE MIDI Service UUID
            "03B80E5A-EDE8-4B33-A751-6CE34EC4C700",
          ]
        );

        function updateDevices() {
          setDevices(
            [...scannedDevices.values()].map((d) => {
              return {
                id: d.id,
                name: d.name,
                localName: d.localName,
              } as ScannedDeviceInfo;
            })
          );
        }
      });
      return () => {
        setMainAsyncFunction(() => emptyAsyncFn);
      };
    }, [])
  );
  useCancellablePromise(mainAsyncFunction);

  return useMemo(
    () => ({
      devices,
      state,
    }),
    [devices, state]
  );
}

export function BluetoothDevicesView(props: MidiHardwareManagerViewProps) {
  const { devices: scannedDevices, state } = useBluetoothScannedDevices();

  const openDevices = useOpenedDevices();
  const handleItemPress = useCallback(
    async (device: ScannedDeviceInfo | OpenBluetoothDeviceInfo) => {
      if (openDevices.has(device.id)) {
        await closeDeviceById(device.id);
      } else {
        await openBluetoothDevice(device);
      }
    },
    [openDevices]
  );
  const devices = useMemo(() => {
    const result = new Map<
      string,
      {
        id: string;
        name: string | null;
        localName: string | null;
        status: "open" | "scanned";
      }
    >();
    for (const device of scannedDevices) {
      result.set(device.id, { ...device, status: "scanned" });
    }
    for (const device of openDevices.values()) {
      result.set(device.id, {
        ...device,
        status: "open",
      });
    }
    return result;
  }, [openDevices, scannedDevices]);
  const safeAreaStyle = useMainScrollViewSafeAreaStyle();
  return (
    <PopoverAwareScrollView
      style={props.style}
      contentContainerStyle={safeAreaStyle}
    >
      {/* TODO: render the connected devices here, not just the scan results */}
      {devices.size === 0 ? (
        state === "idle" ? (
          <Text style={styles.message}>No devices found.</Text>
        ) : (
          <Text style={styles.message}>Scanning for devices...</Text>
        )
      ) : (
        [...devices.values()].map((device) => (
          <List.Item
            key={device.id}
            title={device.name ?? "<Unknown device>"}
            description={device.id}
            onPress={() => handleItemPress(device)}
            right={() => (
              <Text style={styles.statusLabel}>
                {device.status === "open" ? "Connected" : "Not connected"}
              </Text>
            )}
          />
        ))
      )}
    </PopoverAwareScrollView>
  );
}

const styles = StyleSheet.create({
  message: {
    padding: 8,
  },
  statusLabel: {
    paddingTop: 8,
  },
});

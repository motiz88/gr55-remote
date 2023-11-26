import EventEmitter from "events";
import { requireNativeModule } from "expo-modules-core";
import { useEffect, useState } from "react";
import { Platform } from "react-native";

const MidiHardwareManager = requireNativeModule("MidiHardwareManager");

export function setNetworkSessionsEnabled(enabled: boolean) {
  if (Platform.OS === "ios") {
    MidiHardwareManager.setNetworkSessionsEnabled(enabled);
  }
}

export type MidiDeviceToken = number;

export type OpenBluetoothDeviceInfo = {
  id: string;
  name: string | null;
  localName: string | null;
};

class OpenedDeviceStore {
  public readonly tokensById = new Map<string, Set<MidiDeviceToken>>();
  private readonly idByToken = new Map<MidiDeviceToken, string>();
  public readonly devicesById = new Map<string, OpenBluetoothDeviceInfo>();

  public add(
    id: string,
    token: MidiDeviceToken,
    info: OpenBluetoothDeviceInfo
  ) {
    if (!this.tokensById.has(id)) {
      this.tokensById.set(id, new Set());
    }
    this.tokensById.get(id)!.add(token);
    this.idByToken.set(token, id);
    this.devicesById.set(id, info);
  }

  public remove(token: MidiDeviceToken) {
    const id = this.idByToken.get(token);
    if (id) {
      const tokens = this.tokensById.get(id)!;
      tokens.delete(token);
      if (tokens.size === 0) {
        this.tokensById.delete(id);
        this.devicesById.delete(id);
      }
      this.idByToken.delete(token);
    }
  }

  get ids() {
    return new Set(this.tokensById.keys());
  }
}

const openedDevicesStore = new OpenedDeviceStore();

export const openedDevicesEmitter = new EventEmitter();

export async function openBluetoothDevice(
  info: OpenBluetoothDeviceInfo
): Promise<MidiDeviceToken> {
  if (Platform.OS === "android") {
    const token = await MidiHardwareManager.openBluetoothDevice(info.id);
    openedDevicesStore.add(info.id, token, info);
    openedDevicesEmitter.emit(
      "devicesUpdated",
      new Map(openedDevicesStore.devicesById)
    );
    return token;
  }
  throw new Error("Not supported on this platform");
}

export function closeDevice(token: MidiDeviceToken) {
  if (Platform.OS === "android") {
    MidiHardwareManager.closeDevice(token);
    openedDevicesStore.remove(token);
    openedDevicesEmitter.emit(
      "devicesUpdated",
      new Map(openedDevicesStore.devicesById)
    );
  }
}

export function closeDeviceById(id: string) {
  if (Platform.OS === "android") {
    const tokens = openedDevicesStore.tokensById.get(id);
    if (tokens) {
      for (const token of tokens) {
        MidiHardwareManager.closeDevice(token);
        openedDevicesStore.remove(token);
      }
      openedDevicesEmitter.emit(
        "devicesUpdated",
        openedDevicesStore.devicesById
      );
    }
  }
}

export function useOpenedDevices() {
  const [openDevices, setOpenDevices] = useState<
    ReadonlyMap<string, OpenBluetoothDeviceInfo>
  >(new Map(openedDevicesStore.devicesById));
  useEffect(() => {
    const listener = (
      payload: ReadonlyMap<string, OpenBluetoothDeviceInfo>
    ) => {
      setOpenDevices(payload);
    };
    openedDevicesEmitter.addListener("devicesUpdated", listener);
    return () => {
      openedDevicesEmitter.removeListener("devicesUpdated", listener);
    };
  });
  return openDevices;
}

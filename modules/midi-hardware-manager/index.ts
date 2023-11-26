import EventEmitter from "events";
import { requireNativeModule } from "expo-modules-core";
import { Platform } from "react-native";

const MidiHardwareManager = requireNativeModule("MidiHardwareManager");

export function setNetworkSessionsEnabled(enabled: boolean) {
  if (Platform.OS === "ios") {
    MidiHardwareManager.setNetworkSessionsEnabled(enabled);
  }
}

export type MidiDeviceToken = number;

class OpenedDeviceStore {
  public readonly tokensById = new Map<string, Set<MidiDeviceToken>>();
  private readonly idByToken = new Map<MidiDeviceToken, string>();

  public add(id: string, token: MidiDeviceToken) {
    if (!this.tokensById.has(id)) {
      this.tokensById.set(id, new Set());
    }
    this.tokensById.get(id)!.add(token);
    this.idByToken.set(token, id);
  }

  public remove(token: MidiDeviceToken) {
    const id = this.idByToken.get(token);
    if (id) {
      const tokens = this.tokensById.get(id)!;
      tokens.delete(token);
      if (tokens.size === 0) {
        this.tokensById.delete(id);
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
  id: string
): Promise<MidiDeviceToken> {
  if (Platform.OS === "android") {
    const token = await MidiHardwareManager.openBluetoothDevice(id);
    openedDevicesStore.add(id, token);
    openedDevicesEmitter.emit("devicesUpdated", openedDevicesStore.ids);
    return token;
  }
  throw new Error("Not supported on this platform");
}

export function closeDevice(token: MidiDeviceToken) {
  if (Platform.OS === "android") {
    MidiHardwareManager.closeDevice(token);
    openedDevicesStore.remove(token);
    openedDevicesEmitter.emit("devicesUpdated", openedDevicesStore.ids);
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
      openedDevicesEmitter.emit("devicesUpdated", openedDevicesStore.ids);
    }
  }
}

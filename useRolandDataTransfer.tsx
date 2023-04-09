import { MIDIMessageEvent } from "@motiz88/react-native-midi";
import pLimit from "p-limit";
import { useContext, useEffect, useMemo, useRef } from "react";

import { MidiIoContext } from "./MidiIoContext";
import {
  AtomDefinition,
  FieldDefinition,
  AtomReference,
  fetchAndTokenize,
  RawDataBag,
} from "./RolandAddressMap";
import { RolandGR55SysExConfig } from "./RolandDevices";
import { RolandIoSetupContext } from "./RolandIoSetupContext";
import {
  parseDataResponseMessage,
  isValidChecksum,
  makeDataRequestMessage,
  ALL_DEVICES,
  makeDataSetMessage,
  GAP_BETWEEN_MESSAGES_MS,
} from "./RolandSysExProtocol";

type PendingFetch = {
  inputPortId: string;
  outputPortId: string | undefined;
  selectedDeviceKey: string | undefined;
  address: number;
  length: number;
  resolve: (value: Uint8Array) => void;
  reject: (reason?: any) => void;
  bytesReceived: number;
};

const globalQueue = pLimit(1);

export function useRolandDataTransfer() {
  const { outputPort, inputPort } = useContext(MidiIoContext);
  const { selectedDevice, selectedDeviceKey } =
    useContext(RolandIoSetupContext);
  const pendingFetches = useRef(new Set<PendingFetch>());
  const sysExConfig = selectedDevice?.sysExConfig ?? RolandGR55SysExConfig;
  const deviceId = selectedDevice?.identity.deviceId;
  useEffect(() => {
    if (deviceId == null) {
      return;
    }
    if (!inputPort) {
      return;
    }
    const handleMidiMessage = ({ data }: MIDIMessageEvent) => {
      const parsed = parseDataResponseMessage(sysExConfig, data);
      if (!parsed) {
        return;
      }
      if (deviceId != null && parsed.deviceId !== deviceId) {
        return;
      }

      // TODO: check address
      // Checksum validation is slow, save it for last
      if (!isValidChecksum(parsed)) {
        return;
      }

      for (const fetch of pendingFetches.current) {
        if (
          fetch.selectedDeviceKey !== selectedDeviceKey ||
          fetch.inputPortId !== inputPort.id ||
          fetch.outputPortId !== outputPort?.id
        ) {
          fetch.reject(new Error("Cancelled"));
          pendingFetches.current.delete(fetch);
          continue;
        }
        if (
          parsed.address === fetch.address &&
          parsed.address + parsed.valueBytes.length ===
            fetch.address + fetch.length
        ) {
          fetch.resolve(parsed.valueBytes);
          pendingFetches.current.delete(fetch);
        }
      }
    };
    const myInputPort = inputPort;
    myInputPort.addEventListener("midimessage", handleMidiMessage);
    return () => {
      myInputPort.removeEventListener("midimessage", handleMidiMessage as any);
    };
  }, [inputPort, outputPort, selectedDeviceKey, deviceId, sysExConfig]);

  return useMemo(() => {
    if (!outputPort || !inputPort || !selectedDevice) {
      return { requestData: undefined, setField: undefined };
    }
    const myOutputPort = outputPort;
    const fetchContiguous = (
      address: number,
      length: number
    ): Promise<Uint8Array> => {
      return new Promise((resolve, reject) => {
        const thisFetch = {
          resolve,
          reject,
          address,
          length,
          bytesReceived: 0,
          selectedDeviceKey,
          inputPortId: inputPort.id,
          outputPortId: outputPort.id,
        };
        pendingFetches.current.add(thisFetch);
        setTimeout(() => {
          pendingFetches.current.delete(thisFetch);
          reject(new Error("Data request timed out"));
        }, 5000);
        try {
          myOutputPort.send(
            makeDataRequestMessage(
              sysExConfig,
              deviceId ?? ALL_DEVICES,
              address,
              length
            )
          );
        } catch (e) {
          pendingFetches.current.delete(thisFetch);
          throw e;
        }
      });
    };

    // TODO: abort requests so rapid patch changes don't cause a backlog
    async function requestData<T extends AtomDefinition>(
      definition: T,
      baseAddress: number = 0
    ): Promise<RawDataBag> {
      const result = await fetchAndTokenize(
        definition,
        baseAddress,
        (...args) =>
          globalQueue(async () => {
            const result = await fetchContiguous(...args);
            await delay(GAP_BETWEEN_MESSAGES_MS);
            return result;
          })
      );
      return result;
    }

    function setField<T extends FieldDefinition<any>>(
      field: AtomReference<T>,
      newValue: Uint8Array | ReturnType<T["type"]["decode"]>
    ): void {
      let valueBytes;
      if (newValue instanceof Uint8Array) {
        valueBytes = newValue;
      } else {
        valueBytes = new Uint8Array(field.definition.size);
        field.definition.type.encode(
          newValue,
          valueBytes,
          0,
          field.definition.size
        );
      }
      const data = makeDataSetMessage(
        sysExConfig,
        deviceId ?? ALL_DEVICES,
        field.address,
        valueBytes
      );
      globalQueue(async () => {
        myOutputPort.send(data);
        await delay(GAP_BETWEEN_MESSAGES_MS);
      });
    }
    return { requestData, setField };
  }, [
    inputPort,
    selectedDevice,
    selectedDeviceKey,
    outputPort,
    deviceId,
    sysExConfig,
  ]);
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

import { MIDIMessageEvent } from "@motiz88/react-native-midi";
import PromiseThrottle from "promise-throttle";
import { useContext, useEffect, useMemo, useRef } from "react";

import { MidiIoContext } from "./MidiIoContext";
import {
  AtomDefinition,
  ParsedAtom,
  fetchAndParse,
  FieldDefinition,
  ParsedDataBag,
} from "./RolandAddressMap";
import { RolandGR55SysExConfig } from "./RolandDevices";
import { RolandIoSetupContext } from "./RolandIoSetupContext";
import {
  parseDataResponseMessage,
  isValidChecksum,
  makeDataRequestMessage,
  ALL_DEVICES,
  unpack7,
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

// The GR-55 can only handle 1 request at a time, and both reads/writes can get corrupted
// if they're too fast. To keep the UI responsive, users of RolandDataTransferContext
// should throttle their requests as well.
const globalQueue = new PromiseThrottle({
  requestsPerSecond: 1000 / GAP_BETWEEN_MESSAGES_MS,
});

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
        console.log(
          "Received invalid data claiming to be from 0x" +
            unpack7(parsed.address).toString(16) +
            " to 0x" +
            unpack7(parsed.address + parsed.valueBytes.length - 1).toString(16)
        );
        return;
      }

      console.log(
        "Received valid data from 0x" +
          unpack7(parsed.address).toString(16) +
          " to 0x" +
          unpack7(parsed.address + parsed.valueBytes.length - 1).toString(16)
      );
      if (!pendingFetches.current.size) {
        console.log("!! no pending fetches");
      }
      for (const fetch of pendingFetches.current) {
        if (
          fetch.selectedDeviceKey !== selectedDeviceKey ||
          fetch.inputPortId !== inputPort.id ||
          fetch.outputPortId !== outputPort?.id
        ) {
          fetch.reject(new Error("Cancelled"));
          console.log("eating stale fetch");
          pendingFetches.current.delete(fetch);
          continue;
        }
        if (
          parsed.address === fetch.address &&
          parsed.address + parsed.valueBytes.length ===
            fetch.address + fetch.length
        ) {
          console.log(
            `Response exactly matches a pending fetch for 0x${unpack7(
              fetch.address
            ).toString(16)}...0x${unpack7(
              fetch.address + fetch.length - 1
            ).toString(16)}, device ${fetch.selectedDeviceKey}`
          );
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
      console.log(
        "fetching data from 0x" +
          unpack7(address).toString(16) +
          " to 0x" +
          unpack7(address + length - 1).toString(16)
      );
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
    ): Promise<[ParsedAtom<T>, ParsedDataBag]> {
      console.log("requestData called");
      const result = await fetchAndParse(definition, baseAddress, (...args) =>
        globalQueue.add(() => fetchContiguous(...args))
      );
      return result;
    }

    function setField<T extends FieldDefinition<any>>(
      field: { address: number; definition: T },
      newValue: ReturnType<T["type"]["decode"]>
    ): void {
      const valueBytes = new Uint8Array(field.definition.type.size);
      field.definition.type.encode(newValue, valueBytes, 0, valueBytes.length);
      const data = makeDataSetMessage(
        sysExConfig,
        deviceId ?? ALL_DEVICES,
        field.address,
        valueBytes
      );
      globalQueue.add(async () => {
        myOutputPort.send(data);
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

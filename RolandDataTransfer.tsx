import { MIDIMessageEvent } from "@motiz88/react-native-midi";
import { useFocusEffect } from "@react-navigation/native";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";

import { MidiIoContext } from "./MidiIo";
import { MultiQueueScheduler } from "./MultiQueueScheduler";
import {
  AtomDefinition,
  FieldDefinition,
  AtomReference,
  fetchAndTokenize,
  RawDataBag,
} from "./RolandAddressMap";
import { RolandGR55SysExConfig } from "./RolandDevices";
import { RolandIoSetupContext } from "./RolandIoSetup";
import {
  parseDataResponseMessage,
  isValidChecksum,
  makeDataRequestMessage,
  ALL_DEVICES,
  makeDataSetMessage,
  GAP_BETWEEN_MESSAGES_MS,
  unpack7,
} from "./RolandSysExProtocol";
import { useUserOptions } from "./UserOptions";

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

function useRolandDataTransferImpl() {
  const { outputPort, inputPort } = useContext(MidiIoContext);
  const { selectedDevice, selectedDeviceKey } =
    useContext(RolandIoSetupContext);
  const refCountByQueueId = useRef(new Map<string, number>());
  const scheduler = useRef<MultiQueueScheduler<string>>();
  if (!scheduler.current) {
    scheduler.current = new MultiQueueScheduler([
      "write_utmost",
      "read_utmost",
      "read_default",
    ]);
  }
  const updateSchedulerPriorities = useCallback(() => {
    scheduler.current!.setPriorityOrder([
      "write_utmost",
      "read_utmost",
      ...refCountByQueueId.current.keys(),
      "read_default",
    ]);
  }, []);
  const registerQueueAsPriority = useCallback(
    (queueId: string) => {
      const refCount = refCountByQueueId.current.get(queueId) ?? 0;
      refCountByQueueId.current.set(queueId, refCount + 1);
      updateSchedulerPriorities();
    },
    [updateSchedulerPriorities]
  );
  const unregisterQueueAsPriority = useCallback(
    (queueId: string) => {
      const refCount = refCountByQueueId.current.get(queueId) ?? 0;
      if (refCount <= 1) {
        refCountByQueueId.current.delete(queueId);
        updateSchedulerPriorities();
      } else {
        refCountByQueueId.current.set(queueId, refCount - 1);
      }
    },
    [updateSchedulerPriorities]
  );
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

  const [{ enableExperimentalFeatures }] = useUserOptions();

  return useMemo(() => {
    if (!outputPort || !inputPort || !selectedDevice) {
      return {
        requestData: undefined,
        setField: undefined,
        registerQueueAsPriority,
        unregisterQueueAsPriority,
      };
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

    async function requestData<T extends AtomDefinition>(
      definition: T,
      baseAddress: number = 0,
      signal?: AbortSignal,
      queueID: string = "read_default"
    ): Promise<RawDataBag> {
      let lastQueueStartTimestamp = performance.now();
      let totalQueueTime = 0,
        totalDelayTime = 0,
        totalFetchTime = 0;
      let chunkCount = 0,
        atomCount = 0;
      try {
        return await fetchAndTokenize(definition, baseAddress, (...args) =>
          scheduler.current!.enqueue(async () => {
            if (signal?.aborted) {
              throw new Error("Aborted");
            }
            ++chunkCount;

            const dequeueTimestamp = performance.now();
            totalQueueTime += dequeueTimestamp - lastQueueStartTimestamp;

            const beforeFetchTimestamp = performance.now();
            const result = await fetchContiguous(...args);
            const afterFetchTimestamp = performance.now();
            totalFetchTime += afterFetchTimestamp - beforeFetchTimestamp;

            const beforeDelayTimestamp = performance.now();
            await delay(GAP_BETWEEN_MESSAGES_MS);
            const afterDelayTimestamp = performance.now();
            totalDelayTime += afterDelayTimestamp - beforeDelayTimestamp;
            lastQueueStartTimestamp = performance.now();
            atomCount += Object.keys(result).length;
            return result;
          }, queueID)
        );
      } finally {
        if (enableExperimentalFeatures) {
          // Performance logging is an "experimental feature", until we possibly split it out into its own option
          console.log(
            "🧪 " +
              `${signal?.aborted ? "(ABORTED) " : ""}Request for ${
                definition.description
              } (0x${unpack7(baseAddress)
                .toString(16)
                .padStart(8, "0")}) queued for ${Math.round(
                totalQueueTime
              )}ms, fetched in ${Math.round(
                totalFetchTime
              )}ms, delayed for ${Math.round(
                totalDelayTime
              )}ms (${atomCount} atoms in ${chunkCount} chunk(s))`
          );
        }
      }
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
      scheduler.current!.enqueue(async () => {
        myOutputPort.send(data);
        await delay(GAP_BETWEEN_MESSAGES_MS);
      }, "write_utmost");
    }
    return {
      requestData,
      setField,
      registerQueueAsPriority,
      unregisterQueueAsPriority,
    };
  }, [
    outputPort,
    inputPort,
    selectedDevice,
    registerQueueAsPriority,
    unregisterQueueAsPriority,
    selectedDeviceKey,
    sysExConfig,
    deviceId,
    enableExperimentalFeatures,
  ]);
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function useQueryPriority(queueID: string): void {
  const { registerQueueAsPriority, unregisterQueueAsPriority } = useContext(
    RolandDataTransferContext
  );
  useEffect(() => {
    registerQueueAsPriority(queueID);
    return () => {
      unregisterQueueAsPriority(queueID);
    };
  }, [queueID, registerQueueAsPriority, unregisterQueueAsPriority]);
}

export function useFocusQueryPriority(queueID: string): void {
  const { registerQueueAsPriority, unregisterQueueAsPriority } = useContext(
    RolandDataTransferContext
  );
  useFocusEffect(
    useCallback(() => {
      registerQueueAsPriority(queueID);
      return () => {
        unregisterQueueAsPriority(queueID);
      };
    }, [queueID, registerQueueAsPriority, unregisterQueueAsPriority])
  );
}

export const RolandDataTransferContext = createContext<{
  requestData:
    | undefined
    | (<T extends AtomDefinition>(
        block: T,
        baseAddress?: number,
        signal?: AbortSignal,
        queueID?: string
      ) => Promise<RawDataBag>);
  setField:
    | undefined
    | (<T extends FieldDefinition<any>>(
        field: AtomReference<T>,
        newValue: Uint8Array | ReturnType<T["type"]["decode"]>
      ) => void);
  registerQueueAsPriority: (queueID: string) => void;
  unregisterQueueAsPriority: (queueID: string) => void;
}>({
  requestData: undefined,
  setField: undefined,
  registerQueueAsPriority: () => {},
  unregisterQueueAsPriority: () => {},
});

export function RolandDataTransferContainer({
  children,
}: {
  children?: React.ReactNode;
}) {
  const rolandDataTransfer = useRolandDataTransferImpl();
  return (
    <RolandDataTransferContext.Provider value={rolandDataTransfer}>
      {children}
    </RolandDataTransferContext.Provider>
  );
}

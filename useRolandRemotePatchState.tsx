import { MIDIMessageEvent } from "@motiz88/react-native-midi";
import EventEmitter from "events";
import {
  useRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import usePromise from "react-use-promise";
import { throttle } from "throttle-debounce";

import { MidiIoContext } from "./MidiIoContext";
import {
  AtomReference,
  FieldDefinition,
  ParsedDataBag,
} from "./RolandAddressMap";
import { RolandDataTransferContext } from "./RolandDataTransferContext";
import { RolandGR55SysExConfig } from "./RolandDevices";
import { RolandIoSetupContext } from "./RolandIoSetupContext";
import {
  BULK_DATA_TRANSFER_SIZE_PER_MESSAGE,
  GAP_BETWEEN_MESSAGES_MS,
} from "./RolandSysExProtocol";

export function useRolandRemotePatchState() {
  const { selectedDevice, selectedDeviceKey } =
    useContext(RolandIoSetupContext);
  const { requestData } = useContext(RolandDataTransferContext);
  const sysExConfig = selectedDevice?.sysExConfig ?? RolandGR55SysExConfig;
  const addressMap = sysExConfig.addressMap;

  const [invalidationCount, setInvalidationCount] = useState(0);

  const [patchData, patchReadError, patchReadStatus] = usePromise(async () => {
    if (!requestData) {
      return Promise.reject(new Error("No device available"));
    }
    if (!addressMap) {
      return Promise.reject(new Error("No address map available"));
    }
    const remoteData = await requestData(
      addressMap.temporaryPatch.definition,
      addressMap.temporaryPatch.address
    );
    const oldLocalOverrides = localOverrides.current;
    localOverrides.current = {};
    for (const address of Object.keys(oldLocalOverrides)) {
      subscriptions.current!.emit(
        address,
        remoteData[1][address as unknown as number].value
      );
    }
    return remoteData;
  }, [
    requestData,
    selectedDeviceKey,
    sysExConfig,
    addressMap,
    invalidationCount,
  ]);

  const { inputPort } = useContext(MidiIoContext);

  const invalidatePatchData = useMemo(
    () =>
      throttle(
        Math.ceil(
          (addressMap?.temporaryPatch.definition.size ?? 1) /
            BULK_DATA_TRANSFER_SIZE_PER_MESSAGE
        ) * GAP_BETWEEN_MESSAGES_MS,
        () => setInvalidationCount((x) => x + 1)
      ),
    [addressMap?.temporaryPatch.definition.size]
  );

  useEffect(() => {
    if (!inputPort) {
      return;
    }
    const handleMidiMessage = ({ data }: MIDIMessageEvent) => {
      // program change, any channel
      if ((data[0] & 0xf0) === 0xc0) {
        invalidatePatchData();
      }
    };

    inputPort.addEventListener("midimessage", handleMidiMessage);

    return () => {
      inputPort.removeEventListener("midimessage", handleMidiMessage as any);
    };
  }, [inputPort, selectedDevice, inputPort?.state, invalidatePatchData]);

  const localOverrides = useRef<ParsedDataBag>({});

  const setLocalOverride = useCallback(
    <T extends FieldDefinition<any>>(
      field: AtomReference<T>,
      value: ReturnType<T["type"]["decode"]>
    ) => {
      localOverrides.current[field.address] = { value };
      subscriptions.current!.emit(field.address.toString(), value);
    },
    []
  );

  const subscriptions = useRef<EventEmitter>();
  if (!subscriptions.current) {
    subscriptions.current = new EventEmitter();
  }
  const subscribeToField = useCallback(
    <T extends FieldDefinition<any>>(
      field: AtomReference<T>,
      listener: (value: ReturnType<T["type"]["decode"]>) => void
    ) => {
      subscriptions.current!.addListener(field.address.toString(), listener);
      return () => {
        subscriptions.current!.removeListener(
          field.address.toString(),
          listener
        );
      };
    },
    []
  );

  return useMemo(
    () => ({
      patchData,
      patchReadError,
      patchReadStatus,
      reloadPatchData: invalidatePatchData,
      localOverrides: localOverrides.current,
      subscribeToField,
      setLocalOverride,
    }),
    [
      patchData,
      patchReadError,
      patchReadStatus,
      invalidatePatchData,
      localOverrides,
      subscribeToField,
      setLocalOverride,
    ]
  );
}

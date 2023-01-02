import EventEmitter from "events";
import { useRef, useCallback, useContext, useMemo, useState } from "react";
import usePromise from "react-use-promise";
import { throttle } from "throttle-debounce";

import {
  AtomReference,
  FieldDefinition,
  FieldType,
  RawDataBag,
} from "./RolandAddressMap";
import { RolandDataTransferContext } from "./RolandDataTransferContext";
import { RolandIoSetupContext } from "./RolandIoSetupContext";
import {
  BULK_DATA_TRANSFER_SIZE_PER_MESSAGE,
  GAP_BETWEEN_MESSAGES_MS,
} from "./RolandSysExProtocol";

export function useRolandRemotePageState(page: AtomReference | void) {
  const { selectedDeviceKey } = useContext(RolandIoSetupContext);
  const { requestData, setField } = useContext(RolandDataTransferContext);

  const [invalidationCount, setInvalidationCount] = useState(0);

  const [pageData, pageReadError, pageReadStatus] = usePromise(async () => {
    if (!requestData) {
      return Promise.reject(new Error("No device available"));
    }
    if (!page) {
      return Promise.reject(new Error("No address map available"));
    }
    const remoteData = await requestData(page.definition, page.address);
    const oldLocalOverrides = localOverrides.current;
    localOverrides.current = {};
    for (const address of Object.keys(oldLocalOverrides)) {
      subscriptions.current!.emit(
        address,
        remoteData[address as unknown as number]
      );
    }
    return remoteData;
  }, [requestData, selectedDeviceKey, invalidationCount]);

  const invalidateData = useMemo(
    () =>
      throttle(
        Math.ceil(
          (page?.definition.size ?? 1) / BULK_DATA_TRANSFER_SIZE_PER_MESSAGE
        ) * GAP_BETWEEN_MESSAGES_MS,
        () => setInvalidationCount((x) => x + 1)
      ),
    [page?.definition.size]
  );

  const localOverrides = useRef<RawDataBag>({});

  const setLocalOverride = useCallback(
    <T extends FieldDefinition<FieldType<any>>>(
      field: AtomReference<T>,
      value: Uint8Array | ReturnType<T["type"]["decode"]>
    ) => {
      let valueBytes;
      if (value instanceof Uint8Array) {
        valueBytes = value;
      } else {
        valueBytes = new Uint8Array(field.definition.size);
        field.definition.type.encode(
          value,
          valueBytes,
          0,
          field.definition.size
        );
      }
      localOverrides.current[field.address] = valueBytes;
      subscriptions.current!.emit(field.address.toString(), valueBytes);
    },
    []
  );

  const subscriptions = useRef<EventEmitter>();
  if (!subscriptions.current) {
    subscriptions.current = new EventEmitter();
    // This is the max number of connected components that may be mounted at any given time.
    // TODO: Seems high. Look into alternatives for broadcasting assign state changes (context?) and reduce this.
    subscriptions.current.setMaxListeners(1000);
  }
  const subscribeToField = useCallback(
    <T extends FieldDefinition<any>>(
      field: AtomReference<T>,
      listener: (valueBytes: Uint8Array) => void
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

  const setRemoteField = useCallback(
    <T extends FieldDefinition<any>>(
      field: AtomReference<T>,
      value: Uint8Array | ReturnType<T["type"]["decode"]>
    ) => {
      setField?.(field, value);
      setLocalOverride(field, value);
    },
    [setField, setLocalOverride]
  );

  return useMemo(
    () => ({
      pageData,
      pageReadError,
      pageReadStatus,
      reloadData: invalidateData,
      localOverrides: localOverrides.current,
      subscribeToField,
      setLocalOverride,
      setRemoteField,
    }),
    [
      pageData,
      pageReadError,
      pageReadStatus,
      invalidateData,
      localOverrides,
      subscribeToField,
      setLocalOverride,
      setRemoteField,
    ]
  );
}

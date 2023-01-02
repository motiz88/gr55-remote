import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { throttle } from "throttle-debounce";

import { FieldReference, FieldType } from "./RolandAddressMap";
import { RolandDataTransferContext } from "./RolandDataTransferContext";
import { RolandRemotePageContext } from "./RolandRemotePageContext";
import { GAP_BETWEEN_MESSAGES_MS } from "./RolandSysExProtocol";

export function useRemoteField<T>(
  page: RolandRemotePageContext,
  field: FieldReference<FieldType<T>>
): [T, (newValue: T) => void] {
  return useRemoteFieldImpl(page, field, undefined, /* detached */ false);
}

function useRemoteFieldImpl<T>(
  page: RolandRemotePageContext,
  field: FieldReference<FieldType<T>>,
  defaultValue: T | undefined,
  detached: boolean
): [T, (newValue: T) => void] {
  const { setField } = useContext(RolandDataTransferContext);
  const setFieldThrottled = useMemo(() => {
    if (setField) {
      return throttle(GAP_BETWEEN_MESSAGES_MS, setField);
    }
  }, [setField]);

  const { pageData, localOverrides, setLocalOverride, subscribeToField } =
    useContext(page);

  const [valueBytes, setValueBytes] = useState(() => {
    let valueBytes: Uint8Array | undefined = localOverrides?.[field.address];
    if (valueBytes) {
      return valueBytes;
    }
    valueBytes = pageData?.[field.address];
    if (valueBytes) {
      return valueBytes;
    }
    valueBytes = new Uint8Array(field.definition.size);
    field.definition.type.encode(
      defaultValue ?? field.definition.type.emptyValue,
      valueBytes,
      0,
      field.definition.size
    );
    return valueBytes;
  });

  useEffect(() => {
    const newValueBytes =
      localOverrides?.[field.address] ?? pageData?.[field.address];
    if (newValueBytes != null) {
      setValueBytes(newValueBytes);
    }
  }, [field.address, localOverrides, pageData]);

  useEffect(
    () =>
      detached
        ? undefined
        : subscribeToField(field, (newValueBytes: Uint8Array) => {
            setValueBytes(newValueBytes);
          }),
    [field, subscribeToField, detached]
  );

  const setAndSendValue = useCallback(
    (newValue: T) => {
      const newValueBytes = new Uint8Array(field.definition.size);
      field.definition.type.encode(
        newValue,
        newValueBytes,
        0,
        field.definition.size
      );
      setValueBytes(newValueBytes);
      setLocalOverride(field, newValueBytes);
      if (setFieldThrottled) {
        setFieldThrottled(field, newValueBytes);
      }
    },
    [setFieldThrottled, field, setLocalOverride]
  );
  const value = useMemo(() => {
    try {
      return field.definition.type.decode(valueBytes, 0, field.definition.size);
    } catch {
      // TODO: Is this safe? Errors can happen when interpreting the value as an enum, for example.
      // Might be good to replace with a tryDecode method or something.
      // Ideally we would Suspend out of this "missing value" state.
      return defaultValue ?? field.definition.type.emptyValue;
    }
  }, [defaultValue, field.definition.size, field.definition.type, valueBytes]);
  return [value, setAndSendValue];
}

export function useMaybeControlledRemoteField<T>(
  page: RolandRemotePageContext,
  field: FieldReference<FieldType<T>>,
  value: T | undefined,
  onValueChange: ((value: T) => void) | undefined
) {
  const isControlled = value != null;
  const [uncontrolledValue, setUncontrolledValue] = useRemoteFieldImpl(
    page,
    field,
    undefined,
    isControlled
  );
  const setValue = useCallback(
    (newValue: T) => {
      if (!isControlled) {
        setUncontrolledValue(newValue);
      }
      // Always fire the onValueChange event, even if controlled.
      // TODO: The component should ensure that this only fires for user-triggered changes (not in response to prop changes),
      // or at least provide a way to distinguish between them.
      onValueChange?.(newValue);
    },
    [onValueChange, setUncontrolledValue, isControlled]
  );
  return [value ?? uncontrolledValue, setValue] as const;
}

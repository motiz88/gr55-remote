import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { throttle } from "throttle-debounce";

import { FieldReference, FieldType, encode } from "./RolandAddressMap";
import { RolandRemotePageContext } from "./RolandRemotePageContext";
import { GAP_BETWEEN_MESSAGES_MS } from "./RolandSysExProtocol";

export function useRemoteField<T>(
  page: RolandRemotePageContext,
  field: FieldReference<FieldType<T>>
): [T, (newValue: T) => void, undefined | "pending" | "resolved" | "rejected"] {
  return useRemoteFieldImpl(page, field, undefined, /* detached */ false);
}

function useRemoteFieldImpl<T>(
  page: RolandRemotePageContext,
  field: FieldReference<FieldType<T>>,
  defaultValue: T | undefined,
  detached: boolean
): [T, (newValue: T) => void, undefined | "pending" | "resolved" | "rejected"] {
  const {
    pageData,
    pageReadStatus,
    localOverrides,
    setLocalOverride,
    subscribeToField,
    setRemoteField,
    // @ts-ignore TODO: Fix polymorphic context types
  } = useContext(page);

  const setFieldThrottled = useMemo(() => {
    return throttle(GAP_BETWEEN_MESSAGES_MS, setRemoteField);
  }, [setRemoteField]);

  const [valueBytes, setValueBytes] = useState(() => {
    let valueBytes: Uint8Array | undefined = localOverrides?.[field.address];
    if (valueBytes) {
      return valueBytes;
    }
    valueBytes = pageData?.[field.address];
    if (valueBytes) {
      return valueBytes;
    }
    valueBytes = encode(
      defaultValue ?? field.definition.type.emptyValue,
      field.definition.type
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
      const previousValueBytes =
        localOverrides?.[field.address] ?? pageData?.[field.address];
      const newValueBytes = encode(newValue, field.definition.type);
      setValueBytes(newValueBytes);
      setLocalOverride(field, newValueBytes);
      setFieldThrottled(field, newValueBytes, previousValueBytes);
    },
    [field, setLocalOverride, setFieldThrottled, localOverrides, pageData]
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
  return [value, setAndSendValue, pageReadStatus];
}

export function useMaybeControlledRemoteField<T>(
  page: RolandRemotePageContext,
  field: FieldReference<FieldType<T>>,
  value: T | undefined,
  onValueChange: ((value: T) => void) | undefined
) {
  const isControlled = value != null;
  const [uncontrolledValue, setUncontrolledValue, status] = useRemoteFieldImpl(
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
  return [value ?? uncontrolledValue, setValue, status] as const;
}

import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { throttle } from "throttle-debounce";

import { FieldReference, FieldType } from "./RolandAddressMap";
import { RolandDataTransferContext } from "./RolandDataTransferContext";
import { RolandRemotePatchContext } from "./RolandRemotePatchContext";
import { GAP_BETWEEN_MESSAGES_MS } from "./RolandSysExProtocol";

export function usePatchField<T>(
  field: FieldReference<FieldType<T>>
): [T, (newValue: T) => void] {
  return usePatchFieldImpl(field, undefined, /* detached */ false);
}

function usePatchFieldImpl<T>(
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

  const { patchData, localOverrides, setLocalOverride, subscribeToField } =
    useContext(RolandRemotePatchContext);

  const [valueBytes, setValueBytes] = useState(() => {
    let valueBytes: Uint8Array | undefined = localOverrides?.[field.address];
    if (valueBytes) {
      return valueBytes;
    }
    valueBytes = patchData?.[field.address];
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
      localOverrides?.[field.address] ?? patchData?.[field.address];
    if (newValueBytes != null) {
      setValueBytes(newValueBytes);
    }
  }, [field.address, localOverrides, patchData]);

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

export function useMaybeControlledPatchField<T>(
  field: FieldReference<FieldType<T>>,
  value: T | undefined,
  onValueChange: ((value: T) => void) | undefined
) {
  const isControlled = value != null;
  const [uncontrolledValue, setUncontrolledValue] = usePatchFieldImpl(
    field,
    undefined,
    isControlled
  );
  const setValue = useCallback(
    (newValue: T) => {
      if (!isControlled) {
        setUncontrolledValue(newValue);
      }
      // Always fire the onValueChange event, even if controlled
      onValueChange?.(newValue);
    },
    [onValueChange, setUncontrolledValue, isControlled]
  );
  return [value ?? uncontrolledValue, setValue] as const;
}

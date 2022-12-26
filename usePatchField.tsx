import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { throttle } from "throttle-debounce";

import {
  AtomReference,
  FieldDefinition,
  FieldReference,
  FieldType,
} from "./RolandAddressMap";
import { RolandDataTransferContext } from "./RolandDataTransferContext";
import { RolandRemotePatchContext } from "./RolandRemotePatchContext";
import { GAP_BETWEEN_MESSAGES_MS } from "./RolandSysExProtocol";

export function usePatchField<T extends FieldDefinition<any>>(
  field: AtomReference<T>,
  defaultValue?: ReturnType<T["type"]["decode"]>
): [
  ReturnType<T["type"]["decode"]>,
  (newValue: ReturnType<T["type"]["decode"]>) => void
] {
  return usePatchFieldImpl(field, defaultValue, /* detached */ false);
}

function usePatchFieldImpl<T extends FieldDefinition<any>>(
  field: AtomReference<T>,
  defaultValue: ReturnType<T["type"]["decode"]> | undefined,
  detached: boolean
): [
  ReturnType<T["type"]["decode"]>,
  (newValue: ReturnType<T["type"]["decode"]>) => void
] {
  // TODO: store *encoded* data here and in RolandDataTransferContext
  // so that fields can be aliased through multiple definitions.
  const { setField } = useContext(RolandDataTransferContext);
  const setFieldThrottled = useMemo(() => {
    if (setField) {
      return throttle(GAP_BETWEEN_MESSAGES_MS, setField);
    }
  }, [setField]);

  const { patchData, localOverrides, setLocalOverride, subscribeToField } =
    useContext(RolandRemotePatchContext);

  const [value, setValue] = useState(
    () =>
      localOverrides?.[field.address]?.value ??
      patchData?.[field.address]?.value ??
      defaultValue ??
      field.definition.type.emptyValue
  );

  useEffect(() => {
    const newValue =
      localOverrides?.[field.address]?.value ??
      patchData?.[field.address]?.value;
    if (newValue != null) {
      setValue(newValue);
    }
  }, [field.address, localOverrides, patchData]);

  useEffect(
    () =>
      detached
        ? undefined
        : subscribeToField(field, (newValue: T["type"]["decode"]) => {
            setValue(newValue);
          }),
    [field, subscribeToField, detached]
  );

  const setAndSendValue = useCallback(
    (newValue: T["type"]["decode"]) => {
      setValue(newValue);
      setLocalOverride(field, newValue);
      if (setFieldThrottled) {
        setFieldThrottled(field, newValue);
      }
    },
    [setFieldThrottled, field, setLocalOverride]
  );

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

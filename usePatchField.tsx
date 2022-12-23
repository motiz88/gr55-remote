import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { throttle } from "throttle-debounce";

import { FieldDefinition } from "./RolandAddressMap";
import { RolandDataTransferContext } from "./RolandDataTransferContext";
import { RolandRemotePatchContext } from "./RolandRemotePatchContext";
import { GAP_BETWEEN_MESSAGES_MS } from "./RolandSysExProtocol";

export function usePatchField<T extends FieldDefinition<any>>(
  field: { address: number; definition: T },
  defaultValue: ReturnType<T["type"]["decode"]>
): [
  ReturnType<T["type"]["decode"]>,
  (newValue: ReturnType<T["type"]["decode"]>) => void
] {
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
      patchData?.[1][field.address]?.value ??
      defaultValue
  );

  useEffect(() => {
    const newValue =
      localOverrides?.[field.address]?.value ??
      patchData?.[1][field.address]?.value;
    if (newValue != null) {
      setValue(newValue);
    }
  }, [field.address, localOverrides, patchData]);

  useEffect(
    () =>
      subscribeToField(field, (newValue: T["type"]["decode"]) => {
        setValue(newValue);
      }),
    [field, subscribeToField]
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

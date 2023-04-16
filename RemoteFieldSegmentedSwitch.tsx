import { useCallback, useMemo } from "react";

import { FieldStyles } from "./FieldStyles";
import { RemoteFieldRow } from "./RemoteFieldRow";
import { BooleanField, FieldReference } from "./RolandAddressMap";
import { RolandRemotePageContext } from "./RolandRemotePageContext";
import { SegmentedPicker } from "./SegmentedPicker";
import { useMaybeControlledRemoteField } from "./useRemoteField";

export function RemoteFieldSegmentedSwitch({
  page,
  field,
  value: valueProp,
  onValueChange: onValueChangeProp,
}: {
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  field: FieldReference<BooleanField>;
  inline?: boolean;
  segmented?: boolean;
  page: RolandRemotePageContext;
}) {
  const [value, onValueChange, status] = useMaybeControlledRemoteField(
    page,
    field,
    valueProp,
    onValueChangeProp
  );
  const invertedForDisplay = field.definition.type.invertedForDisplay;

  const handleLabelChange = useCallback(
    (label: string) => {
      onValueChange(label === field.definition.type.trueLabel);
    },
    [field, onValueChange]
  );
  const labelsInOrder = useMemo(
    () =>
      invertedForDisplay
        ? ([
            field.definition.type.trueLabel,
            field.definition.type.falseLabel,
          ] as const)
        : ([
            field.definition.type.falseLabel,
            field.definition.type.trueLabel,
          ] as const),
    [field, invertedForDisplay]
  );
  const isPending = status === "pending";
  return (
    <RemoteFieldRow page={page} field={field}>
      <SegmentedPicker
        style={FieldStyles.fieldControlInner}
        onValueChange={handleLabelChange}
        value={
          isPending
            ? undefined
            : (invertedForDisplay ? !value : value)
            ? field.definition.type.trueLabel
            : field.definition.type.falseLabel
        }
        values={labelsInOrder}
        disabled={isPending}
      />
    </RemoteFieldRow>
  );
}

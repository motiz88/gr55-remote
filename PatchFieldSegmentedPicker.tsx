import { useContext, useMemo } from "react";

import { FieldRowContext } from "./FieldRow";
import { PatchFieldRow } from "./PatchFieldRow";
import { PatchFieldStyles } from "./PatchFieldStyles";
import { EnumField, FieldReference } from "./RolandAddressMap";
import { SegmentedPicker } from "./SegmentedPicker";
import { useMaybeControlledPatchField } from "./usePatchField";

export function PatchFieldSegmentedPicker<T extends string>({
  field,
  value: valueProp,
  onValueChange: onValueChangeProp,
}: {
  field: FieldReference<EnumField<{ [encoded: number]: T }>>;
  value?: T;
  onValueChange?: (value: T) => void;
}) {
  const [value, onValueChange] = useMaybeControlledPatchField(
    field,
    valueProp,
    onValueChangeProp
  );
  const values = useMemo(
    () => Object.values(field.definition.type.labels),
    [field]
  );
  return (
    <PatchFieldRow field={field}>
      <SegmentedPickerControl
        value={value}
        onValueChange={onValueChange}
        values={values}
      />
    </PatchFieldRow>
  );
}

function SegmentedPickerControl<T extends string>({
  value,
  onValueChange,
  values,
}: {
  value: T;
  onValueChange: (value: T) => void;
  values: readonly T[];
}) {
  const { isAssigned } = useContext(FieldRowContext);

  return (
    <SegmentedPicker
      style={PatchFieldStyles.fieldControlInner}
      onValueChange={onValueChange}
      value={value}
      values={values}
      tintColor={isAssigned ? "cornflowerblue" : undefined}
    />
  );
}

import { useMemo } from "react";

import { FieldRow } from "./FieldRow";
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
    <FieldRow description={field.definition.description}>
      <SegmentedPicker
        style={PatchFieldStyles.fieldControlInner}
        values={values}
        value={value}
        onValueChange={onValueChange}
      />
    </FieldRow>
  );
}

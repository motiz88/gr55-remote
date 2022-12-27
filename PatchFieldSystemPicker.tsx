import { useMemo } from "react";

import { FieldRow } from "./FieldRow";
import { PatchFieldStyles } from "./PatchFieldStyles";
import { Picker } from "./Picker";
import {
  EnumField,
  FieldReference,
  FieldType,
  isEnumFieldReference,
  isNumericFieldReference,
  NumericField,
} from "./RolandAddressMap";
import { useMaybeControlledPatchField } from "./usePatchField";

export function PatchFieldSystemPicker<T extends number | string>({
  field,
  value: valueProp,
  onValueChange: onValueChangeProp,
}: {
  field: FieldReference<
    FieldType<T> & (EnumField<{ [encoded: number]: string }> | NumericField)
  >;
  value?: T;
  onValueChange?: (value: T) => void;
}) {
  const [value, onValueChange] = useMaybeControlledPatchField(
    field,
    valueProp,
    onValueChangeProp
  );
  const items = useMemo(() => {
    if (isEnumFieldReference(field)) {
      return Object.entries(field.definition.type.labels).map(
        ([encoded, label]) => (
          <Picker.Item label={label} key={encoded} value={label} />
        )
      );
    }
    if (!isNumericFieldReference(field)) {
      throw new Error("Expected enum or numeric field");
    }
    const items = [];
    for (
      let i = field.definition.type.min;
      i <= field.definition.type.max;
      i += field.definition.type.step
    ) {
      items.push(
        <Picker.Item
          label={field.definition.type.format(i)}
          key={i}
          value={i}
        />
      );
    }
    return items;
  }, [field]);
  return (
    <FieldRow description={field.definition.description}>
      <Picker
        onValueChange={onValueChange}
        selectedValue={value}
        style={PatchFieldStyles.fieldControlInner}
      >
        {items}
      </Picker>
    </FieldRow>
  );
}

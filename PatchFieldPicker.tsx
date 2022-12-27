import { PatchFieldSegmentedPicker } from "./PatchFieldSegmentedPicker";
import { PatchFieldSystemPicker } from "./PatchFieldSystemPicker";
import {
  EnumField,
  FieldReference,
  FieldType,
  isEnumFieldReference,
  NumericField,
} from "./RolandAddressMap";

export function PatchFieldPicker<T extends number | string>({
  field,
  value,
  onValueChange,
}: {
  field: FieldReference<
    FieldType<T> & (EnumField<{ [encoded: number]: string }> | NumericField)
  >;
  value?: T;
  onValueChange?: (value: T) => void;
}) {
  if (
    // TODO: Support SegmentedPicker for numeric fields
    isEnumFieldReference(field) &&
    // TODO: Use a layout-sensitive threshold
    Object.keys(field.definition.type.labels).length <= 3
  ) {
    return (
      <PatchFieldSegmentedPicker
        field={field}
        value={value as string}
        onValueChange={
          onValueChange as ((newValue: string) => void) | undefined
        }
      />
    );
  }
  return (
    <PatchFieldSystemPicker
      field={field}
      value={value}
      onValueChange={onValueChange}
    />
  );
}

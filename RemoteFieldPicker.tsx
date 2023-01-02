import { RemoteFieldSegmentedPicker } from "./RemoteFieldSegmentedPicker";
import { RemoteFieldSystemPicker } from "./RemoteFieldSystemPicker";
import {
  EnumField,
  FieldReference,
  FieldType,
  isEnumFieldReference,
  NumericField,
} from "./RolandAddressMap";
import { RolandRemotePageContext } from "./RolandRemotePageContext";

export function RemoteFieldPicker<T extends number | string>({
  page,
  field,
  value,
  onValueChange,
}: {
  page: RolandRemotePageContext;
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
      <RemoteFieldSegmentedPicker
        page={page}
        field={field}
        value={value as string}
        onValueChange={
          onValueChange as ((newValue: string) => void) | undefined
        }
      />
    );
  }
  return (
    <RemoteFieldSystemPicker
      page={page}
      field={field}
      value={value}
      onValueChange={onValueChange}
    />
  );
}

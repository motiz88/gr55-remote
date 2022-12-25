import { Picker } from "@react-native-picker/picker";
import { useMemo } from "react";
import { Text, View } from "react-native";

import { PatchFieldDirectPickerControlled } from "./PatchFieldDirectPicker";
import { PatchFieldStyles } from "./PatchFieldStyles";
import { EnumField, FieldReference } from "./RolandAddressMap";
import { usePatchField } from "./usePatchField";

export function PatchFieldPicker<T extends string>({
  field,
}: {
  field: FieldReference<EnumField<{ [encoded: number]: T }>>;
}) {
  const [value, setValue] = usePatchField(
    field,
    field.definition.type.labels[0]
  );
  return (
    <PatchFieldPickerControlled
      field={field}
      value={value}
      onValueChange={setValue}
    />
  );
}

export function PatchFieldPickerControlled<T extends string>({
  field,
  value,
  onValueChange,
}: {
  field: FieldReference<EnumField<{ [encoded: number]: T }>>;
  value: T;
  onValueChange: (value: T) => void;
}) {
  const items = useMemo(
    () =>
      Object.entries(field.definition.type.labels).map(([encoded, label]) => (
        <Picker.Item label={label} key={encoded} value={label} />
      )),
    [field]
  );
  if (Object.keys(field.definition.type.labels).length <= 3) {
    return (
      <PatchFieldDirectPickerControlled
        field={field}
        value={value}
        onValueChange={onValueChange}
      />
    );
  }
  return (
    <View style={PatchFieldStyles.fieldRow}>
      <Text style={PatchFieldStyles.fieldDescription}>
        {field.definition.description}
      </Text>
      <Picker
        onValueChange={onValueChange}
        selectedValue={value}
        style={PatchFieldStyles.fieldControl}
      >
        {items}
      </Picker>
    </View>
  );
}

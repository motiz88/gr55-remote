import { Picker } from "@react-native-picker/picker";
import { useMemo } from "react";
import { Text, View } from "react-native";

import { PatchFieldDirectPicker } from "./PatchFieldDirectPicker";
import { PatchFieldStyles } from "./PatchFieldStyles";
import { EnumField, FieldReference } from "./RolandAddressMap";
import { useMaybeControlledPatchField } from "./usePatchField";

export function PatchFieldPicker<T extends string>({
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
  const items = useMemo(
    () =>
      Object.entries(field.definition.type.labels).map(([encoded, label]) => (
        <Picker.Item label={label} key={encoded} value={label} />
      )),
    [field]
  );
  if (Object.keys(field.definition.type.labels).length <= 3) {
    return (
      <PatchFieldDirectPicker
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

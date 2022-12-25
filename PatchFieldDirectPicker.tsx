import { useMemo } from "react";
import { Text, View } from "react-native";

import { DirectPicker } from "./DirectPicker";
import { PatchFieldStyles } from "./PatchFieldStyles";
import { EnumField, FieldReference } from "./RolandAddressMap";

export function PatchFieldDirectPickerControlled<T extends string>({
  field,
  value,
  onValueChange,
}: {
  field: FieldReference<EnumField<{ [encoded: number]: T }>>;
  value: T;
  onValueChange: (value: T) => void;
}) {
  const values = useMemo(
    () => Object.values(field.definition.type.labels),
    [field]
  );
  return (
    <View style={PatchFieldStyles.fieldRow}>
      <Text style={PatchFieldStyles.fieldDescription}>
        {field.definition.description}
      </Text>
      <DirectPicker
        style={PatchFieldStyles.fieldControl}
        values={values}
        value={value}
        onValueChange={onValueChange}
      />
    </View>
  );
}

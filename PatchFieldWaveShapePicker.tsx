import { useMemo } from "react";
import { Text, View } from "react-native";

import { DirectPicker } from "./DirectPicker";
import { PatchFieldStyles } from "./PatchFieldStyles";
import { EnumField, FieldReference } from "./RolandAddressMap";
import { usePatchField } from "./usePatchField";

const iconsByShapeLabel = {
  SAW: require("./assets/icon-rising-sawtooth-wave.png"),
  SQU: require("./assets/icon-square-wave.png"),
  SQR: require("./assets/icon-square-wave.png"),
  TRI: require("./assets/icon-triangle-wave.png"),
  SIN: require("./assets/icon-sine-wave.png"),
  SAW1: require("./assets/icon-rising-sawtooth-wave.png"),
  SAW2: require("./assets/icon-falling-sawtooth-wave.png"),
};

type WaveShapeLabel = keyof typeof iconsByShapeLabel;

export function PatchFieldWaveShapePicker<T extends WaveShapeLabel>({
  field,
}: {
  field: FieldReference<EnumField<{ [encoded: number]: T }>>;
}) {
  const [value, setValue] = usePatchField(
    field,
    field.definition.type.labels[0]
  );
  return (
    <PatchFieldWaveShapePickerControlled
      field={field}
      value={value}
      onValueChange={setValue}
    />
  );
}

export function PatchFieldWaveShapePickerControlled<T extends WaveShapeLabel>({
  field,
  value,
  onValueChange,
}: {
  field: FieldReference<EnumField<{ [encoded: number]: T }>>;
  value: T;
  onValueChange: (value: T) => void;
}) {
  const values = useMemo(
    () =>
      Object.values(field.definition.type.labels).map((label) => ({
        value: label,
        icon: iconsByShapeLabel[label],
      })),
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

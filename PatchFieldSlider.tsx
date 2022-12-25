import Slider from "@react-native-community/slider";
import { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";

import { PatchFieldStyles } from "./PatchFieldStyles";
import { FieldReference, NumericField } from "./RolandAddressMap";
import { useMaybeControlledPatchField } from "./usePatchField";

export function PatchFieldSlider({
  field,
  value: valueProp,
  onValueChange: onValueChangeProp,
  inline,
}: {
  field: FieldReference<NumericField>;
  value?: number;
  onValueChange?: (value: number) => void;
  inline?: boolean;
}) {
  const [value, onValueChange] = useMaybeControlledPatchField(
    field,
    valueProp,
    onValueChangeProp
  );
  const handleValueChange = useCallback(
    (valueOrValues: number | number[]) => {
      if (typeof valueOrValues === "number") {
        onValueChange(valueOrValues);
      } else {
        onValueChange(valueOrValues[0]);
      }
    },
    [onValueChange]
  );
  const prettyValue = field.definition.type.format(value);
  const inlineSlider = (
    <View style={styles.sliderContainer}>
      <Text style={styles.sliderValueLabel}>{prettyValue}</Text>
      <Slider
        minimumValue={field.definition.type.min}
        maximumValue={field.definition.type.max}
        step={field.definition.type.step}
        onValueChange={handleValueChange}
        value={value}
      />
    </View>
  );
  if (inline) {
    return inlineSlider;
  }
  return (
    <View style={PatchFieldStyles.fieldRow}>
      <Text style={PatchFieldStyles.fieldDescription}>
        {field.definition.description}
      </Text>
      <View style={PatchFieldStyles.fieldControl}>{inlineSlider}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  sliderValueLabel: {},
  sliderContainer: { flex: 1 },
  sliderTrack: {
    height: 32,
  },
});

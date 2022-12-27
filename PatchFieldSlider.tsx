import Slider from "@react-native-community/slider";
import { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";

import { FieldRow } from "./FieldRow";
import { FieldReference, NumericField } from "./RolandAddressMap";
import { useMaybeControlledPatchField } from "./usePatchField";

export function PatchFieldSlider({
  field,
  value: valueProp,
  onValueChange: onValueChangeProp,
  inline,
  onSlidingStart,
  onSlidingComplete,
}: {
  field: FieldReference<NumericField>;
  value?: number;
  inline?: boolean;
  // TODO: fix type of value param, which can be number[]
  onValueChange?: (value: number) => void;
  onSlidingStart?: (value: number) => void;
  onSlidingComplete?: (value: number) => void;
}) {
  const [value, setValue] = useMaybeControlledPatchField(
    field,
    valueProp,
    onValueChangeProp
  );
  const handleValueChange = useCallback(
    (valueOrValues: number | number[]) => {
      if (typeof valueOrValues === "number") {
        setValue(valueOrValues);
      } else {
        setValue(valueOrValues[0]);
      }
    },
    [setValue]
  );
  const handleSlidingStart = useCallback(
    (valueOrValues: number | number[]) => {
      if (typeof valueOrValues === "number") {
        onSlidingStart?.(valueOrValues);
      } else {
        onSlidingStart?.(valueOrValues[0]);
      }
    },
    [onSlidingStart]
  );
  const handleSlidingComplete = useCallback(
    (valueOrValues: number | number[]) => {
      if (typeof valueOrValues === "number") {
        onSlidingComplete?.(valueOrValues);
      } else {
        onSlidingComplete?.(valueOrValues[0]);
      }
    },
    [onSlidingComplete]
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
        onSlidingStart={handleSlidingStart}
        onSlidingComplete={handleSlidingComplete}
        value={value}
      />
    </View>
  );
  if (inline) {
    return inlineSlider;
  }
  return (
    <FieldRow description={field.definition.description}>
      {inlineSlider}
    </FieldRow>
  );
}

const styles = StyleSheet.create({
  sliderValueLabel: {},
  sliderContainer: { flex: 1 },
  sliderTrack: {
    height: 32,
  },
});

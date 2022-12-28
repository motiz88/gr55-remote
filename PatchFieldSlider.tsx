import Slider from "@react-native-community/slider";
import { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";

import { PatchFieldRow } from "./PatchFieldRow";
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
  return (
    <PatchFieldRow field={field} inline={inline}>
      <SliderControl
        prettyValue={prettyValue}
        field={field}
        handleValueChange={handleValueChange}
        handleSlidingStart={handleSlidingStart}
        handleSlidingComplete={handleSlidingComplete}
        value={value}
      />
    </PatchFieldRow>
  );
}

function SliderControl({
  prettyValue,
  field,
  handleValueChange,
  handleSlidingStart,
  handleSlidingComplete,
  value,
}: {
  prettyValue: string;
  field: FieldReference<NumericField>;
  handleValueChange: (valueOrValues: number | number[]) => void;
  handleSlidingStart: (valueOrValues: number | number[]) => void;
  handleSlidingComplete: (valueOrValues: number | number[]) => void;
  value: number;
}) {
  // const { isAssigned } = useContext(FieldRowContext);
  // TODO: Show assigned state when all controls can reliably handle long press etc
  const isAssigned = false;

  return (
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
        thumbTintColor={isAssigned ? "cornflowerblue" : "white"}
      />
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

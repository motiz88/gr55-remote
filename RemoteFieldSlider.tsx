import Slider from "@react-native-community/slider";
import { useCallback } from "react";
import { StyleSheet, View } from "react-native";

import { PendingTextPlaceholder } from "./PendingContentPlaceholders";
import { RemoteFieldRow } from "./RemoteFieldRow";
import { FieldReference, NumericField } from "./RolandAddressMap";
import { RolandRemotePageContext } from "./RolandRemotePageContext";
import { useTheme } from "./Theme";
import { ThemedText as Text } from "./ThemedText";
import { useMaybeControlledRemoteField } from "./useRemoteField";

export function RemoteFieldSlider({
  page,
  field,
  value: valueProp,
  onValueChange: onValueChangeProp,
  inline,
  onSlidingStart,
  onSlidingComplete,
}: {
  page: RolandRemotePageContext;
  field: FieldReference<NumericField>;
  value?: number;
  inline?: boolean;
  // TODO: fix type of value param, which can be number[]
  onValueChange?: (value: number) => void;
  onSlidingStart?: (value: number) => void;
  onSlidingComplete?: (value: number) => void;
}) {
  const [value, setValue, status] = useMaybeControlledRemoteField(
    page,
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
    <RemoteFieldRow page={page} field={field} inline={inline}>
      <SliderControl
        prettyValue={prettyValue}
        field={field}
        handleValueChange={handleValueChange}
        handleSlidingStart={handleSlidingStart}
        handleSlidingComplete={handleSlidingComplete}
        value={value}
        isPending={status === "pending"}
      />
    </RemoteFieldRow>
  );
}

function SliderControl({
  prettyValue,
  field,
  handleValueChange,
  handleSlidingStart,
  handleSlidingComplete,
  value,
  isPending,
}: {
  prettyValue: string;
  field: FieldReference<NumericField>;
  handleValueChange: (valueOrValues: number | number[]) => void;
  handleSlidingStart: (valueOrValues: number | number[]) => void;
  handleSlidingComplete: (valueOrValues: number | number[]) => void;
  value: number;
  isPending: boolean;
}) {
  // const { isAssigned } = useContext(FieldRowContext);
  // TODO: Show assigned state when all controls can reliably handle long press etc
  const isAssigned = false;

  const theme = useTheme();

  return (
    <View style={styles.sliderContainer}>
      <View style={styles.labelRow}>
        {isPending ? (
          <PendingTextPlaceholder chars={4} />
        ) : (
          <Text>{prettyValue}</Text>
        )}
      </View>
      <Slider
        minimumValue={field.definition.type.min}
        maximumValue={field.definition.type.max}
        step={field.definition.type.step}
        onValueChange={handleValueChange}
        onSlidingStart={handleSlidingStart}
        onSlidingComplete={handleSlidingComplete}
        value={isPending ? field.definition.type.max : value}
        minimumTrackTintColor={
          isPending ? theme.colors.pendingTextPlaceholder : undefined
        }
        maximumTrackTintColor={
          isPending ? theme.colors.pendingTextPlaceholder : undefined
        }
        thumbTintColor={
          isPending
            ? theme.colors.pendingTextPlaceholder
            : isAssigned
            ? "cornflowerblue"
            : "white"
        }
        disabled={isPending}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sliderContainer: {
    flex: 1,
  },
  sliderTrack: {
    height: 32,
  },
  labelRow: {
    flexDirection: "row",
  },
});

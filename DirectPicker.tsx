import SegmentedControl, {
  NativeSegmentedControlIOSChangeEvent,
  SegmentedControlProps,
} from "@react-native-segmented-control/segmented-control";
import { useCallback, useMemo } from "react";
import { NativeSyntheticEvent } from "react-native";

export type Props<T extends string> = Omit<
  SegmentedControlProps,
  "onChange" | "selectedIndex" | "values" | "onValueChange"
> & {
  onValueChange?: (value: T) => void;
  value: T;
  values: readonly T[] | readonly { value: T; icon?: unknown }[];
};

export function DirectPicker<T extends string>({
  values,
  value,
  onValueChange,
  ...props
}: Props<T>) {
  const normalizedValues = useMemo(
    () =>
      values.map((item) => {
        if (typeof item === "string") {
          return { value: item };
        }
        return item;
      }),
    [values]
  );
  const labels = useMemo(
    () =>
      normalizedValues.map(
        (item) => (item.icon as string) /* TODO: this is a lie */ ?? item.value
      ),
    [normalizedValues]
  );
  const selectedIndex = useMemo(() => {
    return normalizedValues.findIndex((item) => item.value === value) ?? -1;
  }, [value, normalizedValues]);
  const onChange = useCallback(
    (e: NativeSyntheticEvent<NativeSegmentedControlIOSChangeEvent>) => {
      onValueChange?.(
        normalizedValues![e.nativeEvent.selectedSegmentIndex].value
      );
    },
    [normalizedValues, onValueChange]
  );

  return (
    <SegmentedControl
      // TODO: Make `values` readonly upstream
      values={labels}
      selectedIndex={selectedIndex}
      onChange={onChange}
      {...props}
    />
  );
}

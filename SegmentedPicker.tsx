import type {
  NativeSegmentedControlIOSChangeEvent,
  SegmentedControlProps,
} from "@react-native-segmented-control/segmented-control";
import SegmentedControlImpl from "@react-native-segmented-control/segmented-control";
// TODO: Use the native SegmentedControl for icons when iOS image resizing is fixed
import SegmentedControlImplWithIcons from "@react-native-segmented-control/segmented-control/js/SegmentedControl.js";
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

export function SegmentedPicker<T extends string>({
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
  const [labels, hasIcons] = useMemo(() => {
    let hasIcons;
    const labels = normalizedValues.map((item) => {
      hasIcons ||= item.icon != null;
      return (item.icon as string) /* TODO: this is a lie */ ?? item.value;
    });
    return [labels, hasIcons];
  }, [normalizedValues]);
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

  const Component = hasIcons
    ? SegmentedControlImplWithIcons
    : SegmentedControlImpl;

  return (
    <Component
      // TODO: Make `values` readonly upstream
      values={labels}
      selectedIndex={selectedIndex}
      onChange={onChange}
      {...props}
    />
  );
}

import { useCallback, useEffect, useMemo, useState } from "react";
import { StyleProp, ViewStyle } from "react-native";
import SwitchSelectorBase from "react-native-switch-selector";

export function SwitchSelector<T extends string>({
  value,
  onValueChange,
  options,
  style,
}: {
  value: T;
  onValueChange?: (value: T) => void;
  options: readonly { label: string; value: T }[];
  style?: StyleProp<ViewStyle>;
}) {
  const valueIndex = useMemo(
    () => options.findIndex((o) => o.value === value),
    [options, value]
  );
  const [valueFromUI, setValueFromUI] = useState<string | undefined>(undefined);
  const onPress = useCallback(
    (value: string) => {
      setValueFromUI(value);
      onValueChange?.(value as T);
    },
    [onValueChange]
  );

  // Remount the SwitchSelectorBase component when the value prop changes outside of the UI.
  const [invalidationCount, setInvalidationCount] = useState(0);
  useEffect(() => {
    if (value !== valueFromUI) {
      setInvalidationCount((c) => c + 1);
    }
  }, [value, valueFromUI]);

  return (
    <SwitchSelectorBase
      key={invalidationCount}
      options={options}
      initial={valueIndex}
      onPress={onPress}
      style={style}
      disableValueChangeOnPress
      textColor="#000000"
      selectedColor="#000000"
      buttonColor="#ffffff"
      backgroundColor="#dedfdf"
      buttonMargin={2}
      height={32}
    />
  );
}

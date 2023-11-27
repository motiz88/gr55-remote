import { useTheme } from "@react-navigation/native";
import { forwardRef } from "react";

import { Picker } from "./Picker";

export const ThemedPicker = forwardRef(function ThemedPicker<T>(
  {
    itemStyle,
    style,
    ...props
  }: React.ComponentPropsWithoutRef<typeof Picker<T>>,
  ref: React.ForwardedRef<Picker<T>>
) {
  const { colors } = useTheme();
  return (
    <Picker
      itemStyle={[{ color: colors.text }, itemStyle]}
      style={[
        { color: colors.text, backgroundColor: colors.background },
        style,
      ]}
      dropdownIconColor={colors.text}
      {...props}
      ref={ref}
    />
  );
}) as unknown as typeof Picker;

const { Item } = Picker;

ThemedPicker.Item = Item;

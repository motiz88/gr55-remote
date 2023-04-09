import { useTheme } from "@react-navigation/native";
import { forwardRef } from "react";

import { Picker } from "./Picker";

export const ThemedPicker = forwardRef(function ThemedPicker<T>(
  { itemStyle, ...props }: React.ComponentPropsWithoutRef<typeof Picker<T>>,
  ref: React.ForwardedRef<Picker<T>>
) {
  const { colors } = useTheme();
  return (
    <Picker
      itemStyle={[{ color: colors.text }, itemStyle]}
      {...props}
      ref={ref}
    />
  );
}) as unknown as typeof Picker;

const { Item } = Picker;

ThemedPicker.Item = Item;

import { Picker as PickerImpl, PickerProps } from "@react-native-picker/picker";
import { StyleSheet, View } from "react-native";

export function Picker<T>({ style, itemStyle, ...props }: PickerProps<T>) {
  return (
    <View style={[styles.container, style]}>
      <PickerImpl
        style={styles.picker}
        itemStyle={[itemStyle, styles.item]}
        {...props}
      />
    </View>
  );
}

Picker.Item = PickerImpl.Item;

export const styles = StyleSheet.create({
  picker: {},
  container: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#363536",
    borderRadius: 8,
  },
  item: {
    fontSize: 21,
  },
});

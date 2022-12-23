declare module "react-native-switch-selector" {
  import { ColorValue, TextStyle, ViewStyle } from "react-native";

  declare const SwitchSelector: React.ComponentType<{
    value?: number;
    initial?: number;
    options: readonly { label: string; value: string }[];
    style?: StyleProp<ViewStyle>;
    textColor?: ColorValue;
    buttonColor?: ColorValue;
    selectedColor?: ColorValue;
    backgroundColor?: ColorValue;
    buttonMargin?: number;
    height?: number;
    onPress?: (value: string) => void;
    disableValueChangeOnPress?: boolean;
    textStyle?: StyleProp<TextStyle>;
    selectedTextStyle?: StyleProp<TextStyle>;
  }>;

  export default SwitchSelector;
}

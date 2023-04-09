import { useTheme } from "@react-navigation/native";
import { forwardRef } from "react";
import { Text as RNText, Animated } from "react-native";

export const ThemedText = forwardRef(function ThemedText(
  { style, ...props }: React.ComponentPropsWithRef<typeof RNText>,
  ref: React.ForwardedRef<RNText>
) {
  const { colors } = useTheme();
  return (
    <RNText style={[{ color: colors.text }, style]} {...props} ref={ref} />
  );
});

export const AnimatedThemedText = Animated.createAnimatedComponent(ThemedText);

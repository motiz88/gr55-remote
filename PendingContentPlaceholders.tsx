import { memo } from "react";
import {
  View,
  Text as UnthemedText,
  StyleProp,
  TextStyle,
  ViewStyle,
  StyleSheet,
} from "react-native";

import { useTheme } from "./Theme";

export const PendingTextPlaceholder = memo(function PendingTextPlaceholder({
  chars,
  textStyle,
  style,
}: {
  chars: number;
  textStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
}) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.namePlaceholderView,
        {
          backgroundColor: theme.colors.pendingTextPlaceholder,
        },
        style,
      ]}
    >
      <UnthemedText style={[textStyle]}>
        {
          // U+2007 FIGURE SPACE interspersed with U+2060 WORD JOINER to prevent wrapping
          "\u2007\u2060".repeat(chars - 1) + "\u2007"
        }
      </UnthemedText>
    </View>
  );
});

const styles = StyleSheet.create({
  namePlaceholderView: {
    borderRadius: 4,
    transform: [{ scale: 0.9 }],
  },
});

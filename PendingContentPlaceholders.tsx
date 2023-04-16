import { memo } from "react";
import {
  Text as UnthemedText,
  StyleProp,
  TextStyle,
  StyleSheet,
} from "react-native";

import { useTheme } from "./Theme";

export const PendingTextPlaceholder = memo(function PendingTextPlaceholder({
  chars,
  textStyle,
}: {
  chars: number;
  textStyle?: StyleProp<TextStyle>;
}) {
  const theme = useTheme();
  return (
    <UnthemedText
      style={[
        styles.namePlaceholderView,
        {
          backgroundColor: theme.colors.pendingTextPlaceholder,
        },
        textStyle,
      ]}
    >
      {
        // U+2007 FIGURE SPACE interspersed with U+2060 WORD JOINER to prevent wrapping
        "\u2007\u2060".repeat(chars - 1) + "\u2007"
      }
    </UnthemedText>
  );
});

const styles = StyleSheet.create({
  namePlaceholderView: {
    // TODO: Border radius doesn't render in inline text context
    borderRadius: 4,
    overflow: "hidden",
    transform: [{ scale: 0.9 }],
  },
});

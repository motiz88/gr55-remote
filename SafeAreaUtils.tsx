import { useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Compute styles appropriate for the contentContainerStyle of a "main scroll view"
// (i.e. a scroll view that occupies the bottom of the screen with nothing below it)
export function useMainScrollViewSafeAreaStyle() {
  const insets = useSafeAreaInsets();

  const safeAreaStyle = useMemo(
    () => ({
      // TODO: Landscape mode?
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
    }),
    [insets]
  );
  return safeAreaStyle;
}

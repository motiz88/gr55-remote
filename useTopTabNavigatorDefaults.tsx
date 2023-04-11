import { useMemo } from "react";
import { Platform } from "react-native";

import { renderAdjustingMaterialTopTabBar } from "./AdjustingTabBar";
import { usePopovers } from "./Popovers";

export function useTopTabNavigatorDefaults() {
  const { closeAllPopovers } = usePopovers();

  return useMemo(
    () =>
      ({
        backBehavior: "history",
        screenListeners: {
          swipeStart: () => {
            closeAllPopovers();
          },
          tabPress: () => {
            closeAllPopovers();
          },
          blur: () => {
            closeAllPopovers();
          },
          focus: () => {
            if (Platform.OS === "web") {
              // HACK: Force @react-native-community/slider to update its position.
              // The fix in https://github.com/callstack/react-native-slider/pull/472 doens't work
              // on its own, because TabView uses CSS transform instead of scrolling to move between tabs.
              document.dispatchEvent(new Event("scroll"));
            }
          },
        },
        tabBar: renderAdjustingMaterialTopTabBar,
      } as const),
    [closeAllPopovers]
  );
}

import { useMemo } from "react";

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
        },
        tabBar: renderAdjustingMaterialTopTabBar,
      } as const),
    [closeAllPopovers]
  );
}

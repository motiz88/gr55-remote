import { MaterialTopTabBar } from "@react-navigation/material-top-tabs";
import { Dimensions, Platform, StyleProp, ViewStyle } from "react-native";

export const renderAdjustingMaterialTopTabBar =
  createAdjustingTabBar(MaterialTopTabBar);

// HOC to adjust tab widths to fit the screen such that the last visible tab is always
// half visible (if there are more tabs than can fit on the screen)
function createAdjustingTabBar<
  TabBarProps extends {
    descriptors: {
      [key: string]: {
        options?: {
          tabBarItemStyle?: StyleProp<ViewStyle>;
          tabBarScrollEnabled?: boolean;
        };
      };
    };
    layout: {
      width: number;
      height: number;
    };
  }
>(TabBar: React.ComponentType<TabBarProps>) {
  // NOTE: Not actually a component (because react-navigation calls it as a function)
  return function renderAdjustingTabBar(props: TabBarProps) {
    // The layout from react-navigation can take multiple seconds to reach the
    // correct value, so we use the window dimensions as a hacky workaround.
    const effectiveLayoutWidth =
      Dimensions.get("window").width ?? props.layout.width;
    const MINIMUM_TAB_WIDTH = Platform.select({
      ios: 75,
      default: 65,
    });
    const tabCount = Object.keys(props.descriptors).length;
    let tabsInView = Math.floor(effectiveLayoutWidth / MINIMUM_TAB_WIDTH);
    if (tabsInView < tabCount && tabsInView > 1) {
      // round down to the nearest half tab
      tabsInView -= 0.5;
    }
    const descriptors = Object.fromEntries(
      Object.entries(props.descriptors).map(([key, descriptor]) => [
        key,
        {
          ...descriptor,
          options: {
            ...descriptor.options,
            tabBarScrollEnabled: tabsInView < tabCount,
            tabBarItemStyle:
              tabsInView < tabCount && tabsInView > 0
                ? { width: effectiveLayoutWidth / tabsInView }
                : {},
          },
        },
      ])
    );
    return (
      <TabBar
        // On Android, TabBar doesn't rerender correctly at different sizes if we don't remount it
        key={effectiveLayoutWidth + "_" + tabsInView + "_" + tabCount}
        {...props}
        descriptors={descriptors}
      />
    );
  };
}

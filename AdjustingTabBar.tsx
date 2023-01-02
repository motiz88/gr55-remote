import { MaterialTopTabBar } from "@react-navigation/material-top-tabs";
import { Platform, StyleProp, ViewStyle } from "react-native";

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
    const MINIMUM_TAB_WIDTH = Platform.select({
      ios: 75,
      default: 65,
    });
    const tabCount = Object.keys(props.descriptors).length;
    let tabsInView = Math.floor(props.layout.width / MINIMUM_TAB_WIDTH);
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
              tabsInView < tabCount
                ? { width: props.layout.width / tabsInView }
                : {},
          },
        },
      ])
    );
    return <TabBar {...props} descriptors={descriptors} />;
  };
}

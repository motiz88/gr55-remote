import { useCallback, useMemo } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  ScrollViewProps,
} from "react-native";

import { usePopovers } from "./Popovers";

export function PopoverAwareScrollView({
  onScrollBeginDrag,
  onScroll,
  ...props
}: ScrollViewProps): JSX.Element {
  const { closeAllPopovers } = usePopovers();
  const handleScrollBeginDrag = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      closeAllPopovers();
      onScrollBeginDrag?.(event);
    },
    [closeAllPopovers, onScrollBeginDrag]
  );
  const handleScroll = useMemo(() => {
    if (Platform.OS !== "web") {
      return onScroll;
    }
    return (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      closeAllPopovers();
      onScroll?.(event);
    };
  }, [closeAllPopovers, onScroll]);
  return (
    <ScrollView
      scrollEventThrottle={0}
      {...props}
      onScrollBeginDrag={handleScrollBeginDrag}
      onScroll={handleScroll}
    />
  );
}

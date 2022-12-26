import { useState, useCallback, useRef } from "react";
import {
  RefreshControl as RefreshControlNative,
  Platform,
  RefreshControlProps,
} from "react-native";
import { RefreshControl as RefreshControlWeb } from "react-native-web-refresh-control";

export const RefreshControl = Platform.select<
  React.ComponentType<RefreshControlProps>
>({
  web: function RefreshControl({
    refreshing,
    onRefresh,
    ...props
  }: RefreshControlProps) {
    // Workaround for https://github.com/NiciusB/react-native-web-refresh-control/issues/11
    const [didRefresh, setDidRefresh] = useState(false);
    const timeout = useRef<ReturnType<typeof setTimeout>>();
    const handleRefresh = useCallback(() => {
      setDidRefresh(true);
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        setDidRefresh(false);
      }, 0);
      onRefresh?.();
    }, [onRefresh]);
    return (
      <RefreshControlWeb
        refreshing={refreshing || didRefresh}
        onRefresh={handleRefresh}
        {...props}
      />
    );
  },
  // Special-casing native here to preserve ref forwarding
  default: RefreshControlNative,
});

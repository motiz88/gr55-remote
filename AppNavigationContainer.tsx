import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import * as React from "react";
import { Linking, Platform, useColorScheme } from "react-native";

const PERSISTENCE_KEY = "NAVIGATION_STATE_V1";

export default function AppNavigationContainer({
  children,
}: {
  children?: React.ReactNode;
}) {
  const scheme = useColorScheme();

  const [isReady, setIsReady] = React.useState(!__DEV__);
  const [initialState, setInitialState] = React.useState();

  React.useEffect(() => {
    const restoreState = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();

        if (Platform.OS !== "web" && initialUrl == null) {
          // Only restore state if there's no deep link and we're not on web
          const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
          const state = savedStateString
            ? JSON.parse(savedStateString)
            : undefined;

          if (state !== undefined) {
            setInitialState(state);
          }
        }
      } finally {
        setIsReady(true);
      }
    };

    if (!isReady) {
      restoreState();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <NavigationContainer
      initialState={initialState}
      onStateChange={(state) =>
        AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
      }
      onUnhandledAction={(action) => {
        // Silence errors because of unhandled POP_TO_TOP actions. They're fine.
      }}
      theme={scheme === "dark" ? DarkTheme : DefaultTheme}
    >
      {children}
    </NavigationContainer>
  );
}

import {
  createTheme as createRNETheme,
  darkColors,
  lightColors,
  ThemeProvider as RNEThemeProvider,
} from "@rneui/themed";
import { createContext, useContext, useMemo } from "react";
import { Platform, useColorScheme } from "react-native";
import {
  MD2LightTheme,
  MD2DarkTheme,
  Provider as PaperProvider,
} from "react-native-paper";

export const DefaultTheme = {
  colors: {
    assigns: {
      // 10/11ths of the way from cornflowerblue to #f2f2f2
      background: "#E5EAF2",
      // 10/11ths of the way from cornflowerblue to #ffffff
      tabBarBackground: "#F1F5FD",
    },
    library: {
      selectedPatch: "#73b2f9",
    },
    pendingTextPlaceholder: "rgb(216, 216, 216)",
    searchBarText: "#000000",
    saveAsSummaryBackground: "#a3ff9e",
  },
};

export const DarkTheme = {
  colors: {
    assigns: {
      // 10/11ths of the way from cornflowerblue to #010101
      background: "#0A0E16",
      // 10/11ths of the way from cornflowerblue to #121212
      tabBarBackground: "#191E26",
    },
    library: {
      selectedPatch: "#05448b",
    },
    pendingTextPlaceholder: "rgb(39, 39, 41)",
    searchBarText: "#ffffff",
    saveAsSummaryBackground: "#1A4D26",
  },
};

export const rneTheme = createRNETheme({
  lightColors: {
    primary: "rgb(0, 122, 255)",
    background: "rgb(242, 242, 242)",
    white: "rgb(255, 255, 255)",
    black: "rgb(28, 28, 30)",
    divider: "rgb(216, 216, 216)",
    error: "rgb(255, 59, 48)",

    // Colors selected mostly to make SearchBar look passable on web
    grey0: "rgb(0, 0, 0)",
    grey1: "rgb(16, 16, 16)",
    grey2: "rgb(76, 76, 76)",
    grey3: "rgb(96, 96, 96)",
    grey4: "rgb(216, 216, 216)",
    grey5: "rgb(242, 242, 242)",
    ...Platform.select({
      ios: lightColors.platform.ios,
      android: lightColors.platform.android,
    }),
  },
  darkColors: {
    background: "rgb(28, 28, 30)",
    black: "rgb(255, 255, 255)",
    white: "rgb(28, 28, 30)",
    divider: "rgb(39, 39, 41)",
    error: "rgb(255, 69, 58)",

    // Colors selected mostly to make SearchBar look passable on web
    grey0: "rgb(0, 0, 0)",
    grey1: "rgb(16, 16, 16)",
    grey2: "rgb(76, 76, 76)",
    grey3: "rgb(229, 229, 231)",
    grey4: "rgb(242, 242, 242)",
    grey5: "rgb(255, 255, 255)",
    ...Platform.select({
      ios: darkColors.platform.ios,
      android: darkColors.platform.android,
    }),
    primary: "rgb(0, 122, 255)",
  },
});

const paperThemeDark = {
  ...MD2DarkTheme,
  colors: {
    ...MD2DarkTheme.colors,
    primary: rneTheme.darkColors?.primary,
  },
};

const paperThemeLight = {
  ...MD2LightTheme,
  colors: {
    ...MD2LightTheme.colors,
    primary: rneTheme.lightColors?.primary,
  },
};

const ThemeContext = createContext(DefaultTheme);

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children?: React.ReactNode }) {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? DarkTheme : DefaultTheme;
  const rneThemeWithMode = useMemo(
    () =>
      createRNETheme({
        ...rneTheme,
        mode: scheme === "dark" ? "dark" : "light",
      }),
    [scheme]
  );
  return (
    <ThemeContext.Provider value={theme}>
      <RNEThemeProvider key={scheme} theme={rneThemeWithMode}>
        <PaperProvider
          theme={scheme === "dark" ? paperThemeDark : paperThemeLight}
        >
          {children}
        </PaperProvider>
      </RNEThemeProvider>
    </ThemeContext.Provider>
  );
}

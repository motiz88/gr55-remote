import { createContext, useContext } from "react";
import { useColorScheme } from "react-native";

export const DefaultTheme = {
  colors: {
    assigns: {
      // 10/11ths of the way from cornflowerblue to #f2f2f2
      background: "#E5EAF2",
      // 10/11ths of the way from cornflowerblue to #ffffff
      tabBarBackground: "#F1F5FD",
    },
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
  },
};

const ThemeContext = createContext(DefaultTheme);

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children?: React.ReactNode }) {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? DarkTheme : DefaultTheme;
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

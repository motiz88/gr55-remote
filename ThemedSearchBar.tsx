import { SearchBar } from "@rneui/themed";
import { ComponentPropsWithoutRef } from "react";
import { Platform, useColorScheme } from "react-native";

import { useTheme } from "./Theme";

export function ThemedSearchBar(
  props: ComponentPropsWithoutRef<typeof SearchBar>
): JSX.Element {
  // TODO: Investigate why this doesn't update the first time the appearance changes
  const scheme = useColorScheme();
  const theme = useTheme();
  return (
    <SearchBar
      key={scheme}
      platform={Platform.select({
        ios: "ios",
        android: "android",
        default: "default",
      })}
      lightTheme={scheme === "light"}
      // TODO: If/when RNE fixes the bug with applying the theme colour to SearchBar's text colour, remove this
      inputStyle={{ color: theme.colors.searchBarText }}
      {...props}
    />
  );
}

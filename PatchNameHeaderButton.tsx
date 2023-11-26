import HeaderTitle from "@react-navigation/elements/src/Header/HeaderTitle";
import { useTheme as useNavigationTheme } from "@react-navigation/native";
import { Button } from "@rneui/themed";
import * as React from "react";
import { View } from "react-native";

import { useRenamePatchPrompt } from "./useRenamePatchPrompt";

export function PatchNameHeaderButton({
  children,
  tintColor,
  patchName,
  setPatchName,
}: {
  children: React.ReactNode;
  tintColor?: string | undefined;
  patchName: string;
  setPatchName: (newValue: string) => void;
}) {
  const theme = useNavigationTheme();

  const { renamePatch } = useRenamePatchPrompt({
    patchName,
    setPatchName,
  });

  const headerText = (
    <HeaderTitle tintColor={theme.colors.text}>{children}</HeaderTitle>
  );

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Button
        accessibilityLabel="Rename patch"
        type="clear"
        onPress={renamePatch}
      >
        {headerText}
      </Button>
    </View>
  );
}

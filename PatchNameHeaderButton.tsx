import { Feather } from "@expo/vector-icons";
import HeaderTitle from "@react-navigation/elements/src/Header/HeaderTitle";
import { useTheme as useNavigationTheme } from "@react-navigation/native";
import { Button } from "@rneui/themed";
import * as React from "react";
import { View } from "react-native";

import { useUserOptions } from "./UserOptions";
import { usePrompt } from "./usePrompt";

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
  const [{ enableExperimentalFeatures }] = useUserOptions();

  const { prompt } = usePrompt();

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <HeaderTitle tintColor={tintColor}>{children}</HeaderTitle>
      {enableExperimentalFeatures && (
        <Button
          accessibilityLabel="Rename patch"
          type="clear"
          onPress={async () => {
            const newPatchName = await prompt(
              "Edit patch name",
              patchName || "Untitled"
            );
            if (newPatchName == null || newPatchName === "") {
              return;
            }
            setPatchName(newPatchName);
          }}
        >
          <Feather
            name="edit"
            size={18}
            style={{ paddingHorizontal: 6, paddingTop: 7, paddingBottom: 3 }}
            color={theme.colors.primary}
          />
        </Button>
      )}
    </View>
  );
}

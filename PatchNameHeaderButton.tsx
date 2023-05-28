import { Feather } from "@expo/vector-icons";
import HeaderTitle from "@react-navigation/elements/src/Header/HeaderTitle";
import { useTheme as useNavigationTheme } from "@react-navigation/native";
import { Button } from "@rneui/themed";
import * as React from "react";
import { Alert, Platform, View } from "react-native";

import { useUserOptions } from "./UserOptions";

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
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <HeaderTitle tintColor={tintColor}>{children}</HeaderTitle>
      {enableExperimentalFeatures && (
        <Button
          accessibilityLabel="Rename patch"
          type="clear"
          onPress={async () => {
            const newPatchName = await promptForValue(
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

async function promptForValue(
  message: string,
  defaultValue: string
): Promise<string | null | void> {
  if (Platform.OS === "web") {
    return prompt(message, defaultValue);
  }
  // TODO: Support Android
  return new Promise((resolve) => {
    Alert.prompt(
      message,
      undefined,
      [
        { text: "Cancel", onPress: () => resolve(null), style: "cancel" },
        {
          text: "OK",
          onPress: (value) => resolve(value),
          style: "default",
        },
      ],
      "plain-text",
      defaultValue
    );
  });
}

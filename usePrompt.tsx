import { useCallback } from "react";
import { Alert, Platform } from "react-native";
import { useAlerts } from "react-native-paper-alerts";

export function usePrompt() {
  const alerts = useAlerts();
  const prompt = useCallback(
    (message: string, defaultValue: string): Promise<string | null | void> =>
      new Promise((resolve) => {
        if (Platform.OS === "web") {
          resolve(prompt(message, defaultValue));
          return;
        }
        if (Platform.OS === "ios") {
          Alert.prompt(
            message,
            undefined,
            [
              { text: "Cancel", onPress: () => resolve(null), style: "cancel" },
              {
                text: "OK",
                onPress: (value: string | undefined) => resolve(value),
                style: "default",
              },
            ],
            "plain-text",
            defaultValue
          );
          return;
        }
        // Primarily for Android
        // TODO: Doesn't work great with physical keyboard in emulator
        alerts.prompt(
          message,
          undefined,
          [
            { text: "Cancel", onPress: () => resolve(null), style: "cancel" },
            {
              text: "OK",
              onPress: (value: string) => resolve(value),
              style: "default",
            },
          ],
          "plain-text",
          defaultValue,
          undefined,
          { autoFocus: true }
        );
      }),
    [alerts]
  );
  return { prompt };
}

import React from "react";
import {
  Image,
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import UAParser from "ua-parser-js";

import { ThemedText as Text } from "./ThemedText";

function isLockedDownApplePlatform() {
  const ua = new UAParser().getResult();
  return ua.os.name === "iOS";
}

function getRecommendedBrowsers() {
  const ua = new UAParser().getResult();
  if (ua.os.name?.startsWith("Android")) {
    // Firefox for Android doesn't support Web MIDI
    return "Chrome, Opera or Edge";
  }
  return "Chrome, Firefox, Opera or Edge";
}

export function MIDINotAvailableView({
  reason,
}: {
  reason: "not-supported" | "permission-denied";
  // TODO: Add "permission-pending" reason and show a tailored message
}) {
  const dimensions = useWindowDimensions();

  return (
    <View style={[styles.center, styles.container]}>
      <Image
        source={require("./assets/midi-error.png")}
        style={{
          width: dimensions.width / 2,
          height: ((1404 / 3060) * dimensions.width) / 2,
          resizeMode: "stretch",
          borderWidth: 0,
        }}
      />
      <Text style={styles.errorText}>
        {Platform.select({
          web:
            reason === "not-supported"
              ? isLockedDownApplePlatform()
                ? // TODO: App Store link
                  "The Web MIDI API is not supported on iOS. Use a different device or try the GR-55 Editor iOS app."
                : "This browser does not support the Web MIDI API. Try " +
                  getRecommendedBrowsers() +
                  "."
              : reason === "permission-denied"
              ? "You need to grant MIDI permissions in order to use this app."
              : "Failed to initialize MIDI.",
          default: "Failed to initialize MIDI on this device.",
        })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    marginVertical: 8,
    textAlign: "center",
  },
  container: {
    padding: 8,
  },
});

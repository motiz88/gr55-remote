import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";

import { ThemedText as Text } from "./ThemedText";

export function LibraryPatchListNoResultsView() {
  const dimensions = useWindowDimensions();

  const graphicSize = Math.min(
    Math.round(dimensions.height / 4.26),
    Math.round(dimensions.width / 5.69)
  );

  return (
    <View style={[styles.center, styles.container]}>
      <FontAwesome name="search" size={graphicSize} color="grey" />
      <Text style={styles.errorText}>No matching patches.</Text>
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
  },
  container: {
    padding: 8,
  },
});

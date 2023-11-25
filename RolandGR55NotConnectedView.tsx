import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NavigationProp } from "@react-navigation/native";
import React from "react";
import {
  Button,
  Image,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

import { ThemedText as Text } from "./ThemedText";
import { RootTabParamList } from "./navigation";

export function RolandGR55NotConnectedView({
  navigation,
}: {
  navigation: NavigationProp<any, any, string>;
}) {
  const dimensions = useWindowDimensions();

  return (
    <View style={[styles.center, styles.container]}>
      <Image
        source={require("./assets/gr55-pixel-masked.png")}
        style={{
          width: dimensions.width / 2,
          height: ((601 / 1024) * dimensions.width) / 2,
          resizeMode: "stretch",
          borderWidth: 0,
        }}
      />
      <Text style={styles.errorText}>Not currently connected to a GR-55!</Text>
      <Button
        onPress={() =>
          (
            navigation.getParent(
              "RootTab"
            ) as BottomTabNavigationProp<RootTabParamList>
          ).navigate("SetupStack", {
            screen: "IoSetup",
          })
        }
        title="Go to setup"
      />
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

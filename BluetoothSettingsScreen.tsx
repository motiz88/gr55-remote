import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button } from "@rneui/themed";
import { useEffect } from "react";
import { Platform } from "react-native";

import { BluetoothDevicesView } from "./BluetoothDevicesView";
import { SetupStackParamList } from "./navigation";

export function BluetoothSettingsScreen({
  navigation,
}: NativeStackScreenProps<
  SetupStackParamList,
  "BluetoothSettings",
  "SetupStack"
>) {
  // TODO: Adapt look to match platform, this currently mimics the iOS nav bar
  useEffect(() => {
    navigation.setOptions({
      headerRight: ({ tintColor }) => (
        <Button
          onPress={() => navigation.pop()}
          type="clear"
          titleStyle={{ color: tintColor }}
        >
          Done
        </Button>
      ),
    });
  }, [navigation]);
  return <BluetoothDevicesView style={{ flex: 1 }} />;
}

export const canShowBluetoothSettings = Platform.select({
  ios: true,
  android: true,
  default: false,
});

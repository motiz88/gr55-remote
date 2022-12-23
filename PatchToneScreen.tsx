import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { Button, View } from "react-native";

import { PatchToneModelingScreen } from "./PatchToneModelingScreen";
import { PatchToneNormalScreen } from "./PatchToneNormalScreen";
import { PatchTonePCMScreen } from "./PatchTonePCMScreen";
import { RolandGR55AddressMapAbsolute as GR55 } from "./RolandGR55AddressMap";
import { PatchToneTabParamList, RootStackParamList } from "./navigation";
import { usePatchField } from "./usePatchField";

const Tab = createMaterialTopTabNavigator<PatchToneTabParamList>();

export function PatchToneScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "PatchTone">) {
  const [patchName] = usePatchField(GR55.temporaryPatch.common.patchName, "");
  useEffect(() => {
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation.setOptions({
      headerTitle: patchName + " > Tone",
      headerRight: () => (
        <View style={{ marginRight: 8 }}>
          <Button
            onPress={() => navigation.navigate("IoSetup", {})}
            title="Setup"
          />
        </View>
      ),
    });
  }, [navigation, patchName]);

  return (
    <Tab.Navigator id="PatchTone" backBehavior="history">
      <Tab.Screen name="Normal" component={PatchToneNormalScreen} />
      <Tab.Screen name="PCM1" component={PatchTonePCMScreen} />
      <Tab.Screen name="PCM2" component={PatchTonePCMScreen} />
      <Tab.Screen
        name="Modeling"
        component={PatchToneModelingScreen}
        options={{ title: "Model" }}
      />
    </Tab.Navigator>
  );
}

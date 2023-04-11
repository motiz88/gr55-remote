import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect } from "react";

import { PatchToneModelingScreen } from "./PatchToneModelingScreen";
import { PatchToneNormalScreen } from "./PatchToneNormalScreen";
import { PatchTonePCMScreen } from "./PatchTonePCMScreen";
import { RolandGR55AddressMapAbsolute as GR55 } from "./RolandGR55AddressMap";
import { RolandRemotePatchContext as PATCH } from "./RolandRemotePageContext";
import { PatchToneTabParamList, PatchStackParamList } from "./navigation";
import { useRemoteField } from "./useRemoteField";
import { useTopTabNavigatorDefaults } from "./useTopTabNavigatorDefaults";

const Tab = createMaterialTopTabNavigator<PatchToneTabParamList>();

export function PatchToneScreen({
  navigation,
}: NativeStackScreenProps<PatchStackParamList, "PatchTone">) {
  const [patchName] = useRemoteField(
    PATCH,
    GR55.temporaryPatch.common.patchName
  );
  useEffect(() => {
    navigation.setOptions({
      title: patchName + " > Tone",
    });
  }, [navigation, patchName]);

  return (
    <Tab.Navigator id="PatchTone" {...useTopTabNavigatorDefaults()}>
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

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect } from "react";

import { renderAdjustingMaterialTopTabBar } from "./AdjustingTabBar";
import { PatchToneModelingScreen } from "./PatchToneModelingScreen";
import { PatchToneNormalScreen } from "./PatchToneNormalScreen";
import { PatchTonePCMScreen } from "./PatchTonePCMScreen";
import { usePopovers } from "./Popovers";
import { RolandGR55AddressMapAbsolute as GR55 } from "./RolandGR55AddressMap";
import { RolandRemotePatchContext as PATCH } from "./RolandRemotePageContext";
import { PatchToneTabParamList, PatchStackParamList } from "./navigation";
import { useRemoteField } from "./useRemoteField";

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

  const { closeAllPopovers } = usePopovers();

  return (
    <Tab.Navigator
      id="PatchTone"
      backBehavior="history"
      screenListeners={{
        swipeStart: () => {
          closeAllPopovers();
        },
        tabPress: () => {
          closeAllPopovers();
        },
        blur: () => {
          closeAllPopovers();
        },
      }}
      tabBar={renderAdjustingMaterialTopTabBar}
    >
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

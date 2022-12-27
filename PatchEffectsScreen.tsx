import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { Button, Platform, useWindowDimensions, View } from "react-native";

import { PatchEffectsAmpScreen } from "./PatchEffectsAmpScreen";
import { PatchEffectsChorusScreen } from "./PatchEffectsChorusScreen";
import { PatchEffectsDelayScreen } from "./PatchEffectsDelayScreen";
import { PatchEffectsEQScreen } from "./PatchEffectsEQScreen";
import { PatchEffectsMFXScreen } from "./PatchEffectsMFXScreen";
import { PatchEffectsModScreen } from "./PatchEffectsModScreen";
import { PatchEffectsReverbScreen } from "./PatchEffectsReverbScreen";
import { PatchEffectsStructureScreen } from "./PatchEffectsStructureScreen";
import { RolandGR55AddressMapAbsolute as GR55 } from "./RolandGR55AddressMap";
import { PatchEffectsTabParamList, RootStackParamList } from "./navigation";
import { usePatchField } from "./usePatchField";

const Tab = createMaterialTopTabNavigator<PatchEffectsTabParamList>();

export function PatchEffectsScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "PatchEffects">) {
  const [patchName] = usePatchField(GR55.temporaryPatch.common.patchName);
  useEffect(() => {
    navigation.setOptions({
      title: patchName + " > Effects",
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

  // TODO: Make this split-view aware using context from the nearest navigator
  const { width } = useWindowDimensions();

  // TODO: Move this to a custom tab bar component
  const MINIMUM_TAB_WIDTH = Platform.select({
    ios: 75,
    default: 65,
  });
  const tabCount = 8;
  let tabsInView = Math.floor(width / MINIMUM_TAB_WIDTH);
  if (tabsInView < tabCount && tabsInView > 1) {
    // round down to the nearest half tab
    tabsInView -= 0.5;
  }

  return (
    <Tab.Navigator
      id="PatchEffects"
      screenOptions={{
        tabBarScrollEnabled: tabsInView < tabCount,
        tabBarItemStyle:
          tabsInView < tabCount ? { width: width / tabsInView } : {},
      }}
      backBehavior="history"
    >
      <Tab.Screen
        name="Struct"
        component={PatchEffectsStructureScreen}
        options={{ title: "STRUCT" }}
      />
      <Tab.Screen name="Amp" component={PatchEffectsAmpScreen} />
      <Tab.Screen name="Mod" component={PatchEffectsModScreen} />
      <Tab.Screen name="MFX" component={PatchEffectsMFXScreen} />
      <Tab.Screen name="DLY" component={PatchEffectsDelayScreen} />
      <Tab.Screen name="REV" component={PatchEffectsReverbScreen} />
      <Tab.Screen name="CHO" component={PatchEffectsChorusScreen} />
      <Tab.Screen name="EQ" component={PatchEffectsEQScreen} />
    </Tab.Navigator>
  );
}

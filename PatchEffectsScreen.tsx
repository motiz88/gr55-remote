import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect } from "react";

import { PatchEffectsAmpScreen } from "./PatchEffectsAmpScreen";
import { PatchEffectsChorusScreen } from "./PatchEffectsChorusScreen";
import { PatchEffectsDelayScreen } from "./PatchEffectsDelayScreen";
import { PatchEffectsEQScreen } from "./PatchEffectsEQScreen";
import { PatchEffectsMFXScreen } from "./PatchEffectsMFXScreen";
import { PatchEffectsModScreen } from "./PatchEffectsModScreen";
import { PatchEffectsReverbScreen } from "./PatchEffectsReverbScreen";
import { PatchEffectsStructureScreen } from "./PatchEffectsStructureScreen";
import { RolandGR55AddressMapAbsolute as GR55 } from "./RolandGR55AddressMap";
import { RolandRemotePatchContext as PATCH } from "./RolandRemotePageContext";
import { PatchEffectsTabParamList, PatchStackParamList } from "./navigation";
import { useRemoteField } from "./useRemoteField";
import { useTopTabNavigatorDefaults } from "./useTopTabNavigatorDefaults";

const Tab = createMaterialTopTabNavigator<PatchEffectsTabParamList>();

export function PatchEffectsScreen({
  navigation,
}: NativeStackScreenProps<PatchStackParamList, "PatchEffects">) {
  const [patchName] = useRemoteField(
    PATCH,
    GR55.temporaryPatch.common.patchName
  );
  useEffect(() => {
    navigation.setOptions({
      title: patchName + " > Effects",
    });
  }, [navigation, patchName]);

  return (
    <Tab.Navigator id="PatchEffects" {...useTopTabNavigatorDefaults()}>
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

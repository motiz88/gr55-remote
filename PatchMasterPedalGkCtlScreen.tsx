import {
  createMaterialTopTabNavigator,
  MaterialTopTabScreenProps,
} from "@react-navigation/material-top-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useContext, useEffect } from "react";
import { StyleSheet } from "react-native";

import { renderAdjustingMaterialTopTabBar } from "./AdjustingTabBar";
import { PopoverAwareScrollView } from "./PopoverAwareScrollView";
import { usePopovers } from "./Popovers";
import { RefreshControl } from "./RefreshControl";
import { RemoteFieldPicker } from "./RemoteFieldPicker";
import { RemoteFieldSlider } from "./RemoteFieldSlider";
import { RemoteFieldSwitch } from "./RemoteFieldSwitch";
import { FieldReference, NumericField } from "./RolandAddressMap";
import { RolandGR55AddressMapAbsolute as GR55 } from "./RolandGR55AddressMap";
import { RolandRemotePatchContext as PATCH } from "./RolandRemotePageContext";
import { useMainScrollViewSafeAreaStyle } from "./SafeAreaUtils";
import {
  PatchMasterPedalGkCtlTabParamList,
  PatchStackParamList,
} from "./navigation";
import { useRemoteField } from "./useRemoteField";

const Tab = createMaterialTopTabNavigator<PatchMasterPedalGkCtlTabParamList>();

export function PatchMasterPedalGkCtlScreen({
  navigation,
}: NativeStackScreenProps<PatchStackParamList, "PatchMasterPedalGkCtl">) {
  const [patchName] = useRemoteField(
    PATCH,
    GR55.temporaryPatch.common.patchName
  );
  useEffect(() => {
    navigation.setOptions({
      title: patchName + " > Pedal / GK Control",
    });
  }, [navigation, patchName]);

  const { closeAllPopovers } = usePopovers();

  return (
    <Tab.Navigator
      id="PatchMasterPedalGkCtl"
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
      <Tab.Screen name="Ctl" component={CtlScreen} />
      <Tab.Screen name="Exp" component={ExpScreen} />
      <Tab.Screen
        name="ExpOn"
        component={ExpOnScreen}
        options={{ title: "Exp On" }}
      />
      <Tab.Screen
        name="ExpSw"
        component={ExpSwScreen}
        options={{ title: "Exp Sw" }}
      />
      <Tab.Screen
        name="GkS1"
        component={GkS1Screen}
        options={{ title: "GK S1" }}
      />
      <Tab.Screen
        name="GkS2"
        component={GkS2Screen}
        options={{ title: "GK S2" }}
      />
      <Tab.Screen
        name="GkVol"
        component={GkVolScreen}
        options={{ title: "GK Vol" }}
      />
    </Tab.Navigator>
  );
}

function ButtonConfigScreen({
  navigation,
  button,
}: MaterialTopTabScreenProps<PatchMasterPedalGkCtlTabParamList> & {
  button:
    | typeof GR55.temporaryPatch.common.ctl
    | typeof GR55.temporaryPatch.common.expSw
    | typeof GR55.temporaryPatch.common.gkS1
    | typeof GR55.temporaryPatch.common.gkS2;
}) {
  const { reloadData } = useContext(PATCH);

  const safeAreaStyle = useMainScrollViewSafeAreaStyle();
  const [function_, setFunction] = useRemoteField(PATCH, button.function);
  // TODO: Ensure controller is set to PATCH SETTING in SYSTEM and offer a quick link to the setup
  return (
    <PopoverAwareScrollView
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={reloadData} />
      }
      style={[styles.container]}
      contentContainerStyle={safeAreaStyle}
    >
      {"status" in button && (
        <RemoteFieldSwitch page={PATCH} field={button.status} />
      )}
      <RemoteFieldPicker
        page={PATCH}
        field={button.function}
        value={function_}
        onValueChange={setFunction}
      />
      {"holdType" in button && function_ === "HOLD" && (
        <>
          <RemoteFieldPicker page={PATCH} field={button.holdType} />
          <RemoteFieldPicker page={PATCH} field={button.holdSwitchMode} />
          <RemoteFieldSwitch page={PATCH} field={button.holdPcmTone1} />
          <RemoteFieldSwitch page={PATCH} field={button.holdPcmTone2} />
        </>
      )}
      {function_ === "TONE SW" && (
        <>
          <RemoteFieldSwitch page={PATCH} field={button.offPcmTone1Switch} />
          <RemoteFieldSwitch page={PATCH} field={button.offPcmTone2Switch} />
          <RemoteFieldSwitch
            page={PATCH}
            field={button.offModelingToneSwitch}
          />
          <RemoteFieldSwitch page={PATCH} field={button.offNormalPuSwitch} />
          <RemoteFieldSwitch page={PATCH} field={button.onPcmTone1Switch} />
          <RemoteFieldSwitch page={PATCH} field={button.onPcmTone2Switch} />
          <RemoteFieldSwitch page={PATCH} field={button.onModelingToneSwitch} />
          <RemoteFieldSwitch page={PATCH} field={button.onNormalPuSwitch} />
        </>
      )}
    </PopoverAwareScrollView>
  );
}

function PedalOrKnobConfigScreen({
  navigation,
  pedalOrKnob,
  modControlMinField,
  modControlMaxField,
}: MaterialTopTabScreenProps<PatchMasterPedalGkCtlTabParamList> & {
  pedalOrKnob:
    | typeof GR55.temporaryPatch.common.expPdlOff
    | typeof GR55.temporaryPatch.common.expPdlOn
    | typeof GR55.temporaryPatch.common.gkVol;
  modControlMinField: FieldReference<NumericField>;
  modControlMaxField: FieldReference<NumericField>;
}) {
  const { reloadData } = useContext(PATCH);

  const safeAreaStyle = useMainScrollViewSafeAreaStyle();
  const [function_, setFunction] = useRemoteField(PATCH, pedalOrKnob.function);
  // TODO: Ensure controller is set to PATCH SETTING in SYSTEM and offer a quick link to the setup
  return (
    <PopoverAwareScrollView
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={reloadData} />
      }
      style={[styles.container]}
      contentContainerStyle={safeAreaStyle}
    >
      <RemoteFieldPicker
        page={PATCH}
        field={pedalOrKnob.function}
        value={function_}
        onValueChange={setFunction}
      />
      {function_ === "TONE VOLUME" && (
        <>
          <RemoteFieldSwitch
            page={PATCH}
            field={pedalOrKnob.volumeSwitchPCMTone1}
          />
          <RemoteFieldSwitch
            page={PATCH}
            field={pedalOrKnob.volumeSwitchPCMTone2}
          />
          <RemoteFieldSwitch
            page={PATCH}
            field={pedalOrKnob.volumeSwitchModelingTone}
          />
          <RemoteFieldSwitch
            page={PATCH}
            field={pedalOrKnob.volumeSwitchNormalPU}
          />
        </>
      )}
      {function_ === "PITCH BEND" && (
        <>
          <RemoteFieldSlider page={PATCH} field={pedalOrKnob.bendRange} />
          <RemoteFieldSwitch
            page={PATCH}
            field={pedalOrKnob.bendSwitchPCMTone1}
          />
          <RemoteFieldSwitch
            page={PATCH}
            field={pedalOrKnob.bendSwitchPCMTone2}
          />
          {/* TODO: Indicate that this is ignored if "12STR SW" is "ON" */}
          <RemoteFieldSwitch
            page={PATCH}
            field={pedalOrKnob.bendSwitchModelingTone}
          />
        </>
      )}
      {function_ === "MODULATION" && (
        <>
          {/* TODO: Range slider? */}
          <RemoteFieldSlider page={PATCH} field={pedalOrKnob.modulationMin} />
          <RemoteFieldSlider page={PATCH} field={pedalOrKnob.modulationMax} />
          <RemoteFieldSwitch
            page={PATCH}
            field={pedalOrKnob.modulationSwitchPCMTone1}
          />
          <RemoteFieldSwitch
            page={PATCH}
            field={pedalOrKnob.modulationSwitchPCMTone2}
          />
        </>
      )}
      {function_ === "CROSS FADER" && (
        <>
          <RemoteFieldPicker
            page={PATCH}
            field={pedalOrKnob.xfadePolarityPCMTone1}
          />
          <RemoteFieldPicker
            page={PATCH}
            field={pedalOrKnob.xfadePolarityPCMTone2}
          />
          <RemoteFieldPicker
            page={PATCH}
            field={pedalOrKnob.xfadePolarityModelingTone}
          />
          <RemoteFieldPicker
            page={PATCH}
            field={pedalOrKnob.xfadePolarityNormalPU}
          />
        </>
      )}
      {function_ === "DELAY LEVEL" && (
        <>
          {/* TODO: Range slider? */}
          <RemoteFieldSlider page={PATCH} field={pedalOrKnob.delayLevelMin} />
          <RemoteFieldSlider page={PATCH} field={pedalOrKnob.delayLevelMax} />
        </>
      )}
      {function_ === "REVERB LEVEL" && (
        <>
          {/* TODO: Range slider? */}
          <RemoteFieldSlider page={PATCH} field={pedalOrKnob.reverbLevelMin} />
          <RemoteFieldSlider page={PATCH} field={pedalOrKnob.reverbLevelMax} />
        </>
      )}
      {function_ === "CHORUS LEVEL" && (
        <>
          {/* TODO: Range slider? */}
          <RemoteFieldSlider page={PATCH} field={pedalOrKnob.chorusLevelMin} />
          <RemoteFieldSlider page={PATCH} field={pedalOrKnob.chorusLevelMax} />
        </>
      )}
      {function_ === "MOD CONTROL" && (
        <>
          {/* TODO: MOD CONTROL. Reinterpret min/max fields according to the current MOD */}
          <RemoteFieldSlider page={PATCH} field={modControlMinField} />
          <RemoteFieldSlider page={PATCH} field={modControlMaxField} />
        </>
      )}
    </PopoverAwareScrollView>
  );
}

function CtlScreen(
  props: MaterialTopTabScreenProps<PatchMasterPedalGkCtlTabParamList>
) {
  return (
    <ButtonConfigScreen {...props} button={GR55.temporaryPatch.common.ctl} />
  );
}

function ExpSwScreen(
  props: MaterialTopTabScreenProps<PatchMasterPedalGkCtlTabParamList>
) {
  return (
    <ButtonConfigScreen {...props} button={GR55.temporaryPatch.common.expSw} />
  );
}

function GkS1Screen(
  props: MaterialTopTabScreenProps<PatchMasterPedalGkCtlTabParamList>
) {
  return (
    <ButtonConfigScreen {...props} button={GR55.temporaryPatch.common.gkS1} />
  );
}

function GkS2Screen(
  props: MaterialTopTabScreenProps<PatchMasterPedalGkCtlTabParamList>
) {
  return (
    <ButtonConfigScreen {...props} button={GR55.temporaryPatch.common.gkS2} />
  );
}

function ExpScreen(
  props: MaterialTopTabScreenProps<PatchMasterPedalGkCtlTabParamList>
) {
  return (
    <PedalOrKnobConfigScreen
      {...props}
      pedalOrKnob={GR55.temporaryPatch.common.expPdlOff}
      modControlMinField={GR55.temporaryPatch.common.expPdlOffModControlMin}
      modControlMaxField={GR55.temporaryPatch.common.expPdlOffModControlMax}
    />
  );
}

function ExpOnScreen(
  props: MaterialTopTabScreenProps<PatchMasterPedalGkCtlTabParamList>
) {
  return (
    <PedalOrKnobConfigScreen
      {...props}
      pedalOrKnob={GR55.temporaryPatch.common.expPdlOn}
      modControlMinField={GR55.temporaryPatch.common.expPdlOnModControlMin}
      modControlMaxField={GR55.temporaryPatch.common.expPdlOnModControlMax}
    />
  );
}

function GkVolScreen(
  props: MaterialTopTabScreenProps<PatchMasterPedalGkCtlTabParamList>
) {
  return (
    <PedalOrKnobConfigScreen
      {...props}
      pedalOrKnob={GR55.temporaryPatch.common.gkVol}
      modControlMinField={GR55.temporaryPatch.common.gkVolModControlMin}
      modControlMaxField={GR55.temporaryPatch.common.gkVolModControlMax}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});

import FontAwesome from "@expo/vector-icons/FontAwesome";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { StackActions, useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useContext, useEffect } from "react";
import {
  Button,
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { PopoverAwareScrollView } from "./PopoverAwareScrollView";
import { usePopovers } from "./Popovers";
import { RefreshControl } from "./RefreshControl";
import { RemoteFieldSlider } from "./RemoteFieldSlider";
import { RemoteFieldSwitch } from "./RemoteFieldSwitch";
import {
  BooleanField,
  FieldReference,
  FieldType,
  NumericField,
} from "./RolandAddressMap";
import { RolandGR55AddressMapAbsolute as GR55 } from "./RolandGR55AddressMap";
import { RolandIoSetupContext } from "./RolandIoSetupContext";
import {
  RolandRemotePatchContext as PATCH,
  RolandRemoteSystemContext as SYSTEM,
  RolandRemotePageContext,
} from "./RolandRemotePageContext";
import { useMainScrollViewSafeAreaStyle } from "./SafeAreaUtils";
import {
  GlobalNavigationProp,
  PatchStackParamList,
  RootTabParamList,
} from "./navigation";
import { useRemoteField } from "./useRemoteField";

export function PatchMainScreen({
  navigation,
}: NativeStackScreenProps<
  PatchStackParamList,
  "PatchMain",
  "RootTab" | "PatchDrawer" | "PatchStack"
>) {
  const { selectedDevice } = useContext(RolandIoSetupContext);
  const [patchName] = useRemoteField(
    PATCH,
    GR55.temporaryPatch.common.patchName
  );
  useEffect(() => {
    navigation.setOptions({
      title: selectedDevice && patchName ? patchName : "GR-55 Editor",
      headerLeft: () =>
        selectedDevice ? (
          <DrawerToggleButton />
        ) : (
          <DrawerToggleButton
            // @ts-expect-error DrawerToggleButton passes props to Pressable which supports `disabled`
            disabled
            tintColor="lightgray"
          />
        ),
    });
  }, [navigation, patchName, selectedDevice]);

  // TODO: Also reload SYSTEM page on manual refresh
  const { reloadData } = useContext(PATCH);

  const safeAreaStyle = useMainScrollViewSafeAreaStyle();

  if (!selectedDevice) {
    return <NotConnectedView navigation={navigation} />;
  }

  return (
    <PopoverAwareScrollView
      refreshControl={
        // TODO: Connect this to the actual refresh state
        // TODO: Refactor to avoid duplication with all the other screens
        <RefreshControl refreshing={false} onRefresh={reloadData} />
      }
      style={[styles.container]}
      contentContainerStyle={safeAreaStyle}
    >
      <PopStackToTopOnTabPress />
      <RemoteFieldSlider
        page={PATCH}
        field={GR55.temporaryPatch.common.patchLevel}
      />
      <SectionWithHeading heading="Tone">
        <ToneSummaryView
          label="PCM1"
          muteField={GR55.temporaryPatch.patchPCMTone1.muteSwitch}
          levelLabel={
            <FieldLevelLabel
              page={PATCH}
              field={GR55.temporaryPatch.patchPCMTone1.partLevel}
            />
          }
          toneLabel={<PCMToneLabel tone={GR55.temporaryPatch.patchPCMTone1} />}
          onPress={() => navigation.navigate("PatchTone", { screen: "PCM1" })}
        />
        <ToneSummaryView
          label="PCM2"
          muteField={GR55.temporaryPatch.patchPCMTone2.muteSwitch}
          levelLabel={
            <FieldLevelLabel
              page={PATCH}
              field={GR55.temporaryPatch.patchPCMTone2.partLevel}
            />
          }
          toneLabel={<PCMToneLabel tone={GR55.temporaryPatch.patchPCMTone2} />}
          onPress={() => navigation.navigate("PatchTone", { screen: "PCM2" })}
        />
        <ToneSummaryView
          label="MODEL"
          muteField={GR55.temporaryPatch.modelingTone.muteSwitch}
          levelLabel={
            <FieldLevelLabel
              page={PATCH}
              field={GR55.temporaryPatch.modelingTone.level}
            />
          }
          toneLabel={<ModelToneLabel />}
          onPress={() =>
            navigation.navigate("PatchTone", { screen: "Modeling" })
          }
        />
        <ToneSummaryView
          label="NORMAL PICKUP"
          muteField={GR55.temporaryPatch.common.normalPuMute}
          levelLabel={
            <FieldLevelLabel
              page={PATCH}
              field={GR55.temporaryPatch.common.normalPuLevel}
            />
          }
          toneLabel={undefined}
          onPress={() => navigation.navigate("PatchTone", { screen: "Normal" })}
        />
      </SectionWithHeading>
      <SectionWithHeading heading="Effect">
        <ToneSummaryView
          label="AMP"
          muteField={GR55.temporaryPatch.ampModNs.ampSwitch}
          levelLabel={
            <FieldLevelLabel
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.ampLevel}
            />
          }
          toneLabel={
            <FieldLabel
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.ampType}
            />
          }
          onPress={() => navigation.navigate("PatchEffects", { screen: "Amp" })}
        />
        <ToneSummaryView
          label="MOD"
          muteField={GR55.temporaryPatch.ampModNs.modSwitch}
          levelLabel={<ModLevelLabel />}
          toneLabel={
            <FieldLabel
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.modType}
            />
          }
          onPress={() => navigation.navigate("PatchEffects", { screen: "Mod" })}
        />
        <ToneSummaryView
          label="MFX"
          muteField={GR55.temporaryPatch.mfx.mfxSwitch}
          levelLabel={<MFXLevelLabel />}
          toneLabel={
            <FieldLabel page={PATCH} field={GR55.temporaryPatch.mfx.mfxType} />
          }
          onPress={() => navigation.navigate("PatchEffects", { screen: "MFX" })}
        />
        <ToneSummaryView
          label="DELAY"
          muteField={GR55.temporaryPatch.sendsAndEq.delaySwitch}
          levelLabel={
            <FieldLevelLabel
              page={PATCH}
              field={GR55.temporaryPatch.sendsAndEq.delayEffectLevel}
            />
          }
          toneLabel={
            <FieldLabel
              page={PATCH}
              field={GR55.temporaryPatch.sendsAndEq.delayType}
            />
          }
          onPress={() => navigation.navigate("PatchEffects", { screen: "DLY" })}
        />
        <ToneSummaryView
          label="REVERB"
          muteField={GR55.temporaryPatch.sendsAndEq.reverbSwitch}
          levelLabel={
            <FieldLevelLabel
              page={PATCH}
              field={GR55.temporaryPatch.sendsAndEq.reverbEffectLevel}
            />
          }
          toneLabel={
            <FieldLabel
              page={PATCH}
              field={GR55.temporaryPatch.sendsAndEq.reverbType}
            />
          }
          onPress={() => navigation.navigate("PatchEffects", { screen: "REV" })}
        />
        <ToneSummaryView
          label="CHORUS"
          muteField={GR55.temporaryPatch.sendsAndEq.chorusSwitch}
          levelLabel={
            <FieldLevelLabel
              page={PATCH}
              field={GR55.temporaryPatch.sendsAndEq.chorusEffectLevel}
            />
          }
          toneLabel={
            <FieldLabel
              page={PATCH}
              field={GR55.temporaryPatch.sendsAndEq.chorusType}
            />
          }
          onPress={() => navigation.navigate("PatchEffects", { screen: "CHO" })}
        />
        <ToneSummaryView
          label="EQ"
          muteField={GR55.temporaryPatch.sendsAndEq.eqSwitch}
          levelLabel={
            <FieldLevelLabel
              page={PATCH}
              field={GR55.temporaryPatch.sendsAndEq.eqLevel}
            />
          }
          toneLabel={undefined}
          onPress={() => navigation.navigate("PatchEffects", { screen: "EQ" })}
        />
      </SectionWithHeading>
    </PopoverAwareScrollView>
  );
}

function FieldLabel({
  page,
  field,
}: {
  page: RolandRemotePageContext;
  field: FieldReference<FieldType<string>>;
}) {
  const [value] = useRemoteField(page, field);
  return <Text>{value}</Text>;
}

function PCMToneLabel({
  tone,
}: {
  tone: typeof GR55.temporaryPatch.patchPCMTone1;
}) {
  return <FieldLabel page={PATCH} field={tone.toneSelect} />;
}

function ModelToneLabel() {
  const modelingTone = GR55.temporaryPatch.modelingTone;

  // TODO: Check whether we need to read the bass mode switch from the patch or system page.
  // It's possible that the system setting is "mode on next restart" and the patch setting is the actual current mode.
  const [guitarBassSelect] = useRemoteField(
    SYSTEM,
    GR55.system.common.guitarBassSelect
  );
  const [toneCategory] = useRemoteField(
    PATCH,
    guitarBassSelect === "GUITAR"
      ? modelingTone.toneCategory_guitar
      : modelingTone.toneCategory_bass
  );
  const [toneNumberEGtr_guitar] = useRemoteField(
    PATCH,
    modelingTone.toneNumberEGtr_guitar
  );

  const [toneNumberAc_guitar] = useRemoteField(
    PATCH,
    modelingTone.toneNumberAc_guitar
  );

  const [toneNumberEBass_guitar] = useRemoteField(
    PATCH,
    modelingTone.toneNumberEBass_guitar
  );

  const [toneNumberSynth_guitar] = useRemoteField(
    PATCH,
    modelingTone.toneNumberSynth_guitar
  );

  const [toneNumberEBass_bass] = useRemoteField(
    PATCH,
    modelingTone.toneNumberEBass_bass
  );

  const [toneNumberEGtr_bass] = useRemoteField(
    PATCH,
    modelingTone.toneNumberEGtr_bass
  );

  const [toneNumberSynth_bass] = useRemoteField(
    PATCH,
    modelingTone.toneNumberSynth_bass
  );

  const toneNumber =
    toneCategory === "E.GTR"
      ? guitarBassSelect === "GUITAR"
        ? toneNumberEGtr_guitar
        : toneNumberEGtr_bass
      : toneCategory === "AC"
      ? toneNumberAc_guitar
      : toneCategory === "E.BASS"
      ? guitarBassSelect === "GUITAR"
        ? toneNumberEBass_guitar
        : toneNumberEBass_bass
      : toneCategory === "SYNTH"
      ? guitarBassSelect === "GUITAR"
        ? toneNumberSynth_guitar
        : toneNumberSynth_bass
      : "";
  return (
    <Text>
      {toneCategory} &gt; {toneNumber}
    </Text>
  );
}

function FieldLevelLabel({
  page,
  field,
}: {
  page: RolandRemotePageContext;
  field: FieldReference<NumericField>;
}) {
  const [level] = useRemoteField(page, field);
  return <>{field.definition.type.format(level)}</>;
}

function ModLevelLabel() {
  const [modType] = useRemoteField(PATCH, GR55.temporaryPatch.ampModNs.modType);
  let field;
  switch (modType) {
    case "OD/DS":
      field = GR55.temporaryPatch.ampModNs.odDsLevel;
      break;
    case "WAH":
      field = GR55.temporaryPatch.ampModNs.wahLevel;
      break;
    case "COMP":
      field = GR55.temporaryPatch.ampModNs.compLevel;
      break;
    case "LIMITER":
      field = GR55.temporaryPatch.ampModNs.limiterLevel;
      break;
    case "OCTAVE":
      field = GR55.temporaryPatch.ampModNs.octaveOctLevel;
      break;
    case "PHASER":
      field = GR55.temporaryPatch.ampModNs.phaserLevel;
      break;
    case "FLANGER":
      field = GR55.temporaryPatch.ampModNs.flangerLevel;
      break;
    case "TREMOLO":
      field = GR55.temporaryPatch.ampModNs.tremoloLevel;
      break;
    case "ROTARY":
      field = GR55.temporaryPatch.ampModNs.rotaryLevel;
      break;
    case "UNI-V":
      field = GR55.temporaryPatch.ampModNs.uniVLevel;
      break;
    case "PAN":
      field = GR55.temporaryPatch.ampModNs.panLevel;
      break;
    case "DELAY":
      field = GR55.temporaryPatch.ampModNs.delayEffectLevel;
      break;
    case "CHORUS":
      field = GR55.temporaryPatch.ampModNs.chorusEffectLevel;
      break;
    case "EQ":
      field = GR55.temporaryPatch.ampModNs.eqLevel;
      break;
    default:
      throw new Error("Unhandled mod type: " + modType);
  }
  return <FieldLevelLabel page={PATCH} field={field} />;
}

function MFXLevelLabel() {
  const [mfxType] = useRemoteField(PATCH, GR55.temporaryPatch.mfx.mfxType);
  let field;
  switch (mfxType) {
    case "EQ":
      field = GR55.temporaryPatch.mfx.eqLevel;
      break;
    case "SUPER FILTER":
      field = GR55.temporaryPatch.mfx.superFilterLevel;
      break;
    case "PHASER":
      field = GR55.temporaryPatch.mfx.phaserLevel;
      break;
    case "STEP PHASER":
      field = GR55.temporaryPatch.mfx.stepPhaserLevel;
      break;
    case "RING MODULATOR":
      field = GR55.temporaryPatch.mfx.ringModulatorLevel;
      break;
    case "TREMOLO":
      field = GR55.temporaryPatch.mfx.tremoloLevel;
      break;
    case "AUTO PAN":
      field = GR55.temporaryPatch.mfx.autoPanLevel;
      break;
    case "SLICER":
      field = GR55.temporaryPatch.mfx.slicerLevel;
      break;
    case "VK ROTARY":
      field = GR55.temporaryPatch.mfx.vkRotaryLevel;
      break;
    case "HEXA-CHORUS":
      field = GR55.temporaryPatch.mfx.hexaChorusLevel;
      break;
    case "SPACE-D":
      field = GR55.temporaryPatch.mfx.spaceDLevel;
      break;
    case "FLANGER":
      field = GR55.temporaryPatch.mfx.flangerLevel;
      break;
    case "STEP FLANGER":
      field = GR55.temporaryPatch.mfx.stepFlangerLevel;
      break;
    case "GUITAR AMP SIM":
      field = GR55.temporaryPatch.mfx.gtrAmpSimLevel;
      break;
    case "COMPRESSOR":
      field = GR55.temporaryPatch.mfx.compressorLevel;
      break;
    case "LIMITER":
      field = GR55.temporaryPatch.mfx.limiterLevel;
      break;
    case "3TAP PAN DELAY":
      field = GR55.temporaryPatch.mfx.threeTapDelayLevel;
      break;
    case "TIME CTRL DELAY":
      field = GR55.temporaryPatch.mfx.timeCtrlDelayLevel;
      break;
    case "LOFI COMPRESS":
      field = GR55.temporaryPatch.mfx.lofiCompressLevel;
      break;
    case "PITCH SHIFTER":
      field = GR55.temporaryPatch.mfx.pitchShifterLevel;
      break;
    default:
      throw new Error("Unhandled mfx type: " + mfxType);
  }
  return <FieldLevelLabel page={PATCH} field={field} />;
}

function ToneSummaryView({
  label,
  levelLabel,
  muteField,
  toneLabel,
  onPress,
}: {
  label: React.ReactNode;
  levelLabel: React.ReactNode;
  muteField: FieldReference<BooleanField>;
  toneLabel: React.ReactNode;
  onPress: () => void;
}) {
  return (
    <Pressable android_ripple={{ color: "lightgray" }} onPress={onPress}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          borderBottomWidth: 1,
          borderBottomColor: "lightgray",
          paddingTop: 16,
          alignItems: "center",
        }}
      >
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View style={{ marginEnd: 8 }}>
            <RemoteFieldSwitch page={PATCH} field={muteField} inline />
          </View>
          <Text style={{ textAlignVertical: "center" }}>{label}</Text>
          <Text style={{ textAlignVertical: "center" }}>
            {toneLabel ? ":" : ""} {toneLabel}
          </Text>
          <Text
            style={{
              textAlignVertical: "center",
              flex: 1,
              // Not RTL safe, sigh
              textAlign: "right",
              marginEnd: 8,
            }}
          >
            [Level: {levelLabel}]
          </Text>
        </View>
        <FontAwesome name="chevron-right" />
      </View>
    </Pressable>
  );
}

function SectionWithHeading({
  children,
  heading,
  onPress,
}: {
  children?: React.ReactNode;
  heading: React.ReactNode;
  onPress?: () => void;
}) {
  return (
    <View style={styles.sectionWithHeading}>
      {onPress ? (
        <HeadingLink onPress={onPress} heading={heading} />
      ) : (
        <Text style={styles.sectionHeading}>{heading}</Text>
      )}
      {children}
    </View>
  );
}

function HeadingLink({
  onPress,
  heading,
}: {
  onPress?: () => void;
  heading: React.ReactNode;
}) {
  return (
    <Pressable android_ripple={{ color: "lightgray" }} onPress={onPress}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          borderBottomWidth: 1,
          borderBottomColor: "lightgray",
          paddingTop: 16,
          alignItems: "center",
        }}
      >
        <Text style={styles.sectionHeading}>{heading}</Text>
        <FontAwesome name="chevron-right" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionWithHeading: {
    marginBottom: 16,
  },
  sectionHeading: {
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
  },
  errorText: {
    marginVertical: 8,
  },
  container: {
    padding: 8,
  },
});

function NotConnectedView({
  navigation,
}: {
  navigation: NativeStackScreenProps<
    PatchStackParamList,
    "PatchMain",
    "RootTab" | "PatchDrawer" | "PatchStack"
  >["navigation"];
}) {
  const dimensions = useWindowDimensions();

  return (
    <View style={[styles.center, styles.container]}>
      <Image
        source={require("./assets/gr55-pixel.png")}
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
          ).navigate("IoSetup", {})
        }
        title="Go to setup"
      />
    </View>
  );
}

function PopStackToTopOnTabPress() {
  const navigation = useNavigation<GlobalNavigationProp>();
  const { closeAllPopovers } = usePopovers();
  React.useEffect(() => {
    const unsubscribe = (
      navigation!.getParent(
        "RootTab"
      )! as BottomTabNavigationProp<RootTabParamList>
    ).addListener("tabPress", () => {
      closeAllPopovers();
      navigation.dispatch(StackActions.popToTop());
    });
    return unsubscribe;
  }, [closeAllPopovers, navigation]);

  return null;
}

import { useTheme as useNavigationTheme } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Slider } from "@rneui/themed";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  PanResponder,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Checkbox } from "react-native-paper";

import { FieldLabel, ModelToneLabel, PCMToneLabel } from "./PatchMainScreen";
import { PopoverAwareScrollView } from "./PopoverAwareScrollView";
import { RefreshControl } from "./RefreshControl";
import {
  BooleanField,
  EnumField,
  FieldReference,
  NumericField,
} from "./RolandAddressMap";
import { RolandGR55AddressMapAbsolute as GR55 } from "./RolandGR55AddressMap";
import { RolandRemotePatchContext as PATCH } from "./RolandRemotePageContext";
import { useMainScrollViewSafeAreaStyle } from "./SafeAreaUtils";
import { ThemedText as Text } from "./ThemedText";
import { PatchStackParamList } from "./navigation";
import { useRemoteField } from "./useRemoteField";

export function PatchMixerScreen({
  navigation,
}: NativeStackScreenProps<
  PatchStackParamList,
  "PatchMixer",
  "RootTab" | "PatchDrawer" | "PatchStack"
>) {
  const channelColorsLight = {
    /* some gentle colors for the channels, avoiding primary colors */
    PCM1: "#d2f297",
    PCM2: "#d2f297",
    MODEL: "#d2f297",
    NORMAL: "#d2f297",
    AMP: "#97d2f2",
    MOD: "#97a6f2",
    MFX: "#d297f2",
    BYPASS: "#f297d2",
    DELAY: "#98d8d8",
    REVERB: "#98d8d8",
    CHORUS: "#98d8d8",
    MAIN: "#cedede",
  };
  const channelColorsDark = {
    PCM1: "#567a3d",
    PCM2: "#567a3d",
    MODEL: "#567a3d",
    NORMAL: "#567a3d",
    AMP: "#355c70",
    MOD: "#3d4570",
    MFX: "#573d70",
    BYPASS: "#703d57",
    DELAY: "#356363",
    REVERB: "#356363",
    CHORUS: "#356363",
    MAIN: "#5c6b6b",
  };
  const { dark } = useNavigationTheme();
  const channelColors = dark ? channelColorsDark : channelColorsLight;

  const modLevelField = useModLevelField();
  const mfxLevelField = useMfxLevelField();

  // TODO: Also reload SYSTEM page on manual refresh
  const { reloadData } = useContext(PATCH);

  const safeAreaStyle = useMainScrollViewSafeAreaStyle();

  // TODO: Can there be a system-level guitar out override?
  const [guitarOutSource, setGuitarOutSource] = useRemoteField(
    PATCH,
    GR55.temporaryPatch.common.guitarOutSource
  );
  const modelingToneGuitarOut =
    guitarOutSource === "MODELING" || guitarOutSource === "BOTH";
  const normalPuGuitarOut =
    guitarOutSource === "NORMAL PU" || guitarOutSource === "BOTH";
  const setModelingToneGuitarOut = useCallback(
    (value: boolean) => {
      setGuitarOutSource(
        value
          ? normalPuGuitarOut
            ? "BOTH"
            : "MODELING"
          : normalPuGuitarOut
          ? "NORMAL PU"
          : "OFF"
      );
    },
    [setGuitarOutSource, normalPuGuitarOut]
  );
  const setNormalPuGuitarOut = useCallback(
    (value: boolean) => {
      setGuitarOutSource(
        value
          ? modelingToneGuitarOut
            ? "BOTH"
            : "NORMAL PU"
          : modelingToneGuitarOut
          ? "MODELING"
          : "OFF"
      );
    },
    [setGuitarOutSource, modelingToneGuitarOut]
  );
  // TODO: set isDragging more accurately so we can reenable scrolling
  const [isDragging, setIsDragging] = useState(false);
  return (
    <PopoverAwareScrollView
      alwaysBounceVertical
      disableScrollViewPanResponder
      decelerationRate={0}
      snapToAlignment="start"
      centerContent
      bounces={false}
      canCancelContentTouches={false}
      scrollEnabled={!isDragging}
      refreshControl={
        // TODO: Connect this to the actual refresh state
        // TODO: Refactor to avoid duplication with all the other screens
        <RefreshControl refreshing={false} onRefresh={reloadData} />
      }
      style={[styles.container]}
      contentContainerStyle={safeAreaStyle}
      horizontal
    >
      {/* Mixer view mockup */}
      <View
        style={{
          flexDirection: "row",
          height: 800,
          alignSelf: "center",
        }}
      >
        <MixerTrackLegend />
        {/* TODO: Support navigating from channel labels to detail screens */}
        <MixerTrack
          onDragInteractionStart={() => setIsDragging(true)}
          onDragInteractionEnd={() => setIsDragging(false)}
          label="PCM1"
          detailLabel={
            // TODO: Change "loading" background color to match the channel color
            <PCMToneLabel tone={GR55.temporaryPatch.patchPCMTone1} />
          }
          panField={GR55.temporaryPatch.patchPCMTone1.partPan}
          levelField={GR55.temporaryPatch.patchPCMTone1.partLevel}
          unmuteField={GR55.temporaryPatch.patchPCMTone1.muteSwitch}
          outputField={GR55.temporaryPatch.patchPCMTone1.partOutputMFXSelect}
          outputs={[
            { key: "AMP", label: "AMP", color: channelColors.AMP },
            { key: "MFX", label: "MFX", color: channelColors.MFX },
            { key: "BYPS", label: "BYPASS", color: channelColors.BYPASS },
          ]}
          channelColor={channelColors.PCM1}
        />
        <MixerTrack
          onDragInteractionStart={() => setIsDragging(true)}
          onDragInteractionEnd={() => setIsDragging(false)}
          label="PCM2"
          detailLabel={
            <PCMToneLabel tone={GR55.temporaryPatch.patchPCMTone2} />
          }
          panField={GR55.temporaryPatch.patchPCMTone2.partPan}
          levelField={GR55.temporaryPatch.patchPCMTone2.partLevel}
          unmuteField={GR55.temporaryPatch.patchPCMTone2.muteSwitch}
          outputField={GR55.temporaryPatch.patchPCMTone2.partOutputMFXSelect}
          outputs={[
            { key: "AMP", label: "AMP", color: channelColors.AMP },
            { key: "MFX", label: "MFX", color: channelColors.MFX },
            { key: "BYPS", label: "BYPASS", color: channelColors.BYPASS },
          ]}
          channelColor={channelColors.PCM2}
        />
        <MixerTrack
          onDragInteractionStart={() => setIsDragging(true)}
          onDragInteractionEnd={() => setIsDragging(false)}
          label="MODEL"
          detailLabel={<ModelToneLabel />}
          levelField={GR55.temporaryPatch.modelingTone.level}
          unmuteField={GR55.temporaryPatch.modelingTone.muteSwitch}
          outputField={GR55.temporaryPatch.common.lineSelectModel}
          outputs={[
            { key: "AMP", label: "AMP", color: channelColors.AMP },
            { key: "MFX", label: "MFX", color: channelColors.MFX },
            { key: "BYPS", label: "BYPASS", color: channelColors.BYPASS },
          ]}
          guitarOut={modelingToneGuitarOut}
          onGuitarOutChange={setModelingToneGuitarOut}
          channelColor={channelColors.MODEL}
        />
        <MixerTrack
          onDragInteractionStart={() => setIsDragging(true)}
          onDragInteractionEnd={() => setIsDragging(false)}
          label="NORMAL"
          levelField={GR55.temporaryPatch.common.normalPuLevel}
          unmuteField={GR55.temporaryPatch.common.normalPuMute}
          outputField={GR55.temporaryPatch.common.lineSelectNormalPU}
          outputs={[
            { key: "AMP", label: "AMP", color: channelColors.AMP },
            { key: "MFX", label: "MFX", color: channelColors.MFX },
            { key: "BYPS", label: "BYPASS", color: channelColors.BYPASS },
          ]}
          guitarOut={normalPuGuitarOut}
          onGuitarOutChange={setNormalPuGuitarOut}
          channelColor={channelColors.NORMAL}
        />
        <MixerTrack
          onDragInteractionStart={() => setIsDragging(true)}
          onDragInteractionEnd={() => setIsDragging(false)}
          label="AMP"
          detailLabel={
            <FieldLabel
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.ampType}
            />
          }
          levelField={GR55.temporaryPatch.ampModNs.ampLevel}
          unmuteField={GR55.temporaryPatch.ampModNs.ampSwitch}
          outputs={[{ key: "MOD", label: "MOD", color: channelColors.MOD }]}
          channelColor={channelColors.AMP}
        />
        <MixerTrack
          onDragInteractionStart={() => setIsDragging(true)}
          onDragInteractionEnd={() => setIsDragging(false)}
          label="MOD"
          detailLabel={
            <FieldLabel
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.modType}
            />
          }
          levelField={modLevelField}
          panField={GR55.temporaryPatch.ampModNs.modPan}
          unmuteField={GR55.temporaryPatch.ampModNs.modSwitch}
          outputField={GR55.temporaryPatch.common.effectStructure}
          outputs={[
            {
              key: "2",
              label: "MFX",
              color: channelColors.MFX,
            },
            { key: "1", label: "MAIN", color: channelColors.MAIN },
          ]}
          sends={[
            {
              label: "DELAY",
              color: channelColors.DELAY,
              field: GR55.temporaryPatch.ampModNs.modDelaySendLevel,
            },
            {
              label: "REV",
              color: channelColors.REVERB,
              field: GR55.temporaryPatch.ampModNs.modReverbSendLevel,
            },
            {
              label: "CHO",
              color: channelColors.CHORUS,
              field: GR55.temporaryPatch.ampModNs.modChorusSendLevel,
            },
          ]}
          channelColor={channelColors.MOD}
        />
        <MixerTrack
          onDragInteractionStart={() => setIsDragging(true)}
          onDragInteractionEnd={() => setIsDragging(false)}
          label="MFX"
          detailLabel={
            <FieldLabel page={PATCH} field={GR55.temporaryPatch.mfx.mfxType} />
          }
          levelField={mfxLevelField}
          panField={GR55.temporaryPatch.mfx.mfxPan}
          unmuteField={GR55.temporaryPatch.mfx.mfxSwitch}
          outputs={[{ key: "MAIN", label: "MAIN", color: channelColors.MAIN }]}
          sends={[
            {
              label: "DELAY",
              color: channelColors.DELAY,
              field: GR55.temporaryPatch.mfx.mfxDelaySendLevel,
            },
            {
              label: "REV",
              color: channelColors.REVERB,
              field: GR55.temporaryPatch.mfx.mfxReverbSendLevel,
            },
            {
              label: "CHO",
              color: channelColors.CHORUS,
              field: GR55.temporaryPatch.mfx.mfxChorusSendLevel,
            },
          ]}
          channelColor={channelColors.MFX}
        />
        <MixerTrack
          onDragInteractionStart={() => setIsDragging(true)}
          onDragInteractionEnd={() => setIsDragging(false)}
          label="BYPASS"
          outputs={[{ key: "MAIN", label: "MAIN", color: channelColors.MAIN }]}
          sends={[
            {
              label: "DELAY",
              color: channelColors.DELAY,
              field: GR55.temporaryPatch.common.bypassDelaySendLevel,
            },
            {
              label: "REV",
              color: channelColors.REVERB,
              field: GR55.temporaryPatch.common.bypassReverbSendLevel,
            },
            {
              label: "CHO",
              color: channelColors.CHORUS,
              field: GR55.temporaryPatch.common.bypassChorusSendLevel,
            },
          ]}
          channelColor={channelColors.BYPASS}
        />
        <MixerTrack
          onDragInteractionStart={() => setIsDragging(true)}
          onDragInteractionEnd={() => setIsDragging(false)}
          label="DELAY"
          detailLabel={
            <FieldLabel
              page={PATCH}
              field={GR55.temporaryPatch.sendsAndEq.delayType}
            />
          }
          levelField={GR55.temporaryPatch.sendsAndEq.delayEffectLevel}
          unmuteField={GR55.temporaryPatch.sendsAndEq.delaySwitch}
          outputs={[{ key: "MAIN", label: "MAIN", color: channelColors.MAIN }]}
          channelColor={channelColors.DELAY}
        />
        <MixerTrack
          onDragInteractionStart={() => setIsDragging(true)}
          onDragInteractionEnd={() => setIsDragging(false)}
          label="REVERB"
          detailLabel={
            <FieldLabel
              page={PATCH}
              field={GR55.temporaryPatch.sendsAndEq.reverbType}
            />
          }
          levelField={GR55.temporaryPatch.sendsAndEq.reverbEffectLevel}
          unmuteField={GR55.temporaryPatch.sendsAndEq.reverbSwitch}
          outputs={[{ key: "MAIN", label: "MAIN", color: channelColors.MAIN }]}
          channelColor={channelColors.REVERB}
        />
        <MixerTrack
          onDragInteractionStart={() => setIsDragging(true)}
          onDragInteractionEnd={() => setIsDragging(false)}
          label="CHORUS"
          detailLabel={
            <FieldLabel
              page={PATCH}
              field={GR55.temporaryPatch.sendsAndEq.chorusType}
            />
          }
          levelField={GR55.temporaryPatch.sendsAndEq.chorusEffectLevel}
          unmuteField={GR55.temporaryPatch.sendsAndEq.chorusSwitch}
          outputs={[{ key: "MAIN", label: "MAIN", color: channelColors.MAIN }]}
          channelColor={channelColors.CHORUS}
        />
        <MixerTrack
          onDragInteractionStart={() => setIsDragging(true)}
          onDragInteractionEnd={() => setIsDragging(false)}
          label="MAIN"
          levelField={GR55.temporaryPatch.common.patchLevel}
          channelColor={channelColors.MAIN}
        />
        <MixerTrackRightSpacer />
      </View>
    </PopoverAwareScrollView>
  );
}

function MixerTrack({
  label,
  guitarOut,
  outputField,
  outputs,
  sends,
  channelColor,
  panField,
  levelField,
  unmuteField,
  onGuitarOutChange,
  onDragInteractionStart,
  onDragInteractionEnd,
  detailLabel,
}: {
  label: string;
  guitarOut?: boolean;
  outputs?: { key: string; label: string; color: string }[];
  sends?: {
    label: string;
    color: string;
    field: FieldReference<NumericField>;
  }[];
  channelColor?: string;
  panField?: FieldReference<NumericField>;
  levelField?: FieldReference<NumericField>;
  unmuteField?: FieldReference<BooleanField>;
  outputField?: FieldReference<EnumField>;
  onGuitarOutChange?: (value: boolean) => void;
  onDragInteractionStart?: () => void;
  onDragInteractionEnd?: () => void;
  detailLabel?: React.ReactNode;
}) {
  const { colors } = useNavigationTheme();
  return (
    <View
      style={{
        borderColor: colors.border,
        flexDirection: "column",
        borderWidth: 0.5,
        borderRightWidth: 0,
        width: 100,
      }}
      key={label}
    >
      <View style={{ height: 135, paddingVertical: 8 }}>
        {sends?.map((send) => (
          <MixerTrackSendKnob
            key={send.label}
            label={send.label}
            color={send.color}
            field={send.field}
            onDragInteractionStart={onDragInteractionStart}
            onDragInteractionEnd={onDragInteractionEnd}
          />
        ))}
        {/* guitar out is like a send with an on/off switch instead of a level */}
        {guitarOut != null ? (
          <View
            style={{
              flexDirection: "row",
              paddingLeft: 8,
              paddingVertical: 4,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                textAlign: "left",
                flexGrow: 1,
                flexShrink: 1,
                fontSize: 14,
              }}
            >
              GT.OUT
            </Text>
            <Checkbox.Android
              status={guitarOut ? "checked" : "unchecked"}
              onPress={() => {
                onGuitarOutChange?.(!guitarOut);
              }}
            />
          </View>
        ) : null}
      </View>
      <MixerTrackOutputsMaybeConnected
        outputs={outputs}
        outputField={outputField}
      />
      <View
        style={{
          aspectRatio: 1,

          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {panField ? (
          <MixerTrackPanKnob
            field={panField}
            onDragInteractionStart={onDragInteractionStart}
            onDragInteractionEnd={onDragInteractionEnd}
          />
        ) : null}
      </View>
      <MixerTrackFaderMaybeConnected
        field={levelField}
        onDragInteractionStart={onDragInteractionStart}
        onDragInteractionEnd={onDragInteractionEnd}
      />
      <MixerTrackMuteButtonMaybeConnected field={unmuteField} />
      <Text
        style={{
          textAlign: "center",

          backgroundColor: channelColor,
          padding: 8,
          paddingBottom: 0,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          textAlign: "center",

          backgroundColor: channelColor,
          padding: 8,
          paddingTop: 1,
          fontSize: 11,
        }}
        numberOfLines={1}
      >
        {detailLabel}
      </Text>
    </View>
  );
}

function MixerTrackLegend() {
  return (
    <View
      style={{
        flexDirection: "column",
        width: 75,
        paddingHorizontal: 8,
      }}
    >
      <View style={{ height: 135, paddingVertical: 8 }}>
        <Text style={{ textAlign: "right" }}>Sends</Text>
      </View>
      <View style={{ height: 40, paddingVertical: 8 }}>
        <Text style={{ textAlign: "right" }}>Output</Text>
      </View>
      <View style={{ justifyContent: "center", height: 100 }}>
        <Text style={{ textAlign: "right" }}>Pan</Text>
      </View>
      <View style={{ flexGrow: 1 }}>
        {/* <Text style={{ textAlign: "right" }}>Level</Text> */}
      </View>
      <View
        style={{
          paddingVertical: 8,
        }}
      >
        {/* <Text style={{ textAlign: "right" }}>Mute</Text> */}
      </View>
      {/* <Text style={{ textAlign: "right" }}>Label</Text> */}
    </View>
  );
}

function MixerTrackRightSpacer() {
  const { colors } = useNavigationTheme();
  return (
    <View
      style={{
        flexDirection: "column",
        width: 75,
        paddingHorizontal: 8,
        borderLeftWidth: 0.5,
        borderColor: colors.border,
      }}
    />
  );
}

function MixerTrackMuteButtonMaybeConnected({
  field,
}: {
  field: FieldReference<BooleanField> | void;
}) {
  if (!field) {
    return <MixerTrackMuteButton value={false} enabled={false} />;
  }
  return <MixerTrackMuteButtonConnected field={field} />;
}

function MixerTrackMuteButtonConnected({
  field,
}: {
  field: FieldReference<BooleanField>;
}) {
  const [value, setValue] = useRemoteField(PATCH, field);
  const setMuteValue = useCallback(
    (newValue: boolean) => {
      setValue(!newValue);
    },
    [setValue]
  );
  return (
    <MixerTrackMuteButton
      value={!value}
      enabled
      onValueChange={setMuteValue}
      invertedForDisplay={field.definition.type.invertedForDisplay}
    />
  );
}

function MixerTrackMuteButton({
  value,
  enabled,
  onValueChange,
  invertedForDisplay = false,
}: {
  enabled: boolean;
  value: boolean;
  invertedForDisplay?: boolean;
  onValueChange?: (value: boolean) => void;
}) {
  const handlePress = useCallback(() => {
    onValueChange?.(!value);
  }, [onValueChange, value]);
  const { dark } = useNavigationTheme();
  return (
    <Pressable onPress={handlePress}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          paddingVertical: 8,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            borderWidth: 1,
            paddingHorizontal: 8,
            backgroundColor: (invertedForDisplay ? !value : value)
              ? dark
                ? "royalblue"
                : "lightblue"
              : "transparent",
            color: enabled ? (dark ? "white" : "black") : "transparent",
            borderColor: enabled ? (dark ? "white" : "black") : "transparent",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          M
        </Text>
      </View>
    </Pressable>
  );
}

function useModLevelField() {
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
  return field;
}

function useMfxLevelField() {
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
  return field;
}

function MixerTrackFaderMaybeConnected({
  field,
  onDragInteractionStart,
  onDragInteractionEnd,
}: {
  field: FieldReference<NumericField> | void;
  onDragInteractionStart?: () => void;
  onDragInteractionEnd?: () => void;
}) {
  return field ? (
    <MixerTrackFaderConnected
      field={field}
      onDragInteractionStart={onDragInteractionStart}
      onDragInteractionEnd={onDragInteractionEnd}
    />
  ) : (
    <MixerTrackFaderPlaceholder />
  );
}

function MixerTrackFaderPlaceholder() {
  return <View style={{ flexGrow: 1, borderWidth: 0 }} />;
}

function MixerTrackFaderConnected({
  field,
  onDragInteractionStart,
  onDragInteractionEnd,
}: {
  field: FieldReference<NumericField>;
  onDragInteractionStart?: () => void;
  onDragInteractionEnd?: () => void;
}) {
  const [value, setValue] = useRemoteField(PATCH, field);
  const handleValueChange = useCallback(
    (newValue: number) => {
      setValue(field.definition.type.max - newValue);
    },
    [setValue, field]
  );
  const { dark } = useNavigationTheme();
  return (
    <Pressable
      android_disableSound
      style={{
        paddingVertical: 40,
        paddingHorizontal: 40,
        flexGrow: 1,
      }}
    >
      <>
        {/* TODO: Slider does not respond to touches on outer half of fader handle when hanging out of the track bounds */}
        <Slider
          minimumValue={field.definition.type.min}
          maximumValue={field.definition.type.max}
          step={field.definition.type.step}
          value={field.definition.type.max - value}
          onSlidingStart={onDragInteractionStart}
          onSlidingComplete={onDragInteractionEnd}
          onValueChange={handleValueChange}
          orientation="vertical"
          allowTouchTrack
          minimumTrackTintColor={dark ? "#222" : "#ccc"}
          maximumTrackTintColor={dark ? "#666" : "#222"}
          style={{
            alignSelf: "center",
            flexGrow: 1,
          }}
          thumbStyle={{
            backgroundColor: "blue",
            height: 1,
            width: 32,
          }}
          thumbProps={{
            children: (
              <Animated.View
                style={{
                  alignSelf: "center",
                  borderWidth: 1,
                  borderLeftWidth: 2,
                  borderRightWidth: 2,
                  width: 32,
                  height: 64,
                  backgroundColor: dark ? "#999" : "#aaa",
                  justifyContent: "center",
                  bottom: 0,
                  transform: [{ translateY: -32 }],
                }}
              >
                {/* fader notch */}
                <View
                  style={{
                    alignSelf: "stretch",
                    borderWidth: 0.5,
                    borderColor: "black",
                  }}
                />
                {/* <Text style={{ position: "absolute", fontSize: 8 }}>
          {value} ({valuePercentStr})
        </Text> */}
              </Animated.View>
            ),
          }}
        />
      </>
    </Pressable>
  );
}

function MixerTrackOutputsMaybeConnected({
  outputs,
  outputField,
}: {
  outputs?: { key: string; label: string; color: string }[];
  outputField?: FieldReference<EnumField>;
}) {
  if (!outputs) {
    return <MixerTrackOutputs />;
  }
  if (!outputField) {
    return <MixerTrackOutputs outputs={outputs} value={outputs[0]!.key} />;
  }
  return (
    <MixerTrackOutputsConnected outputs={outputs} outputField={outputField} />
  );
}

function MixerTrackOutputsConnected({
  outputs,
  outputField,
}: {
  outputs: { key: string; label: string; color: string }[];
  outputField: FieldReference<EnumField>;
}) {
  const [value, setValue] = useRemoteField(PATCH, outputField);
  return (
    <MixerTrackOutputs
      outputs={outputs}
      value={value}
      onValueChange={setValue}
    />
  );
}

function MixerTrackOutputs({
  outputs,
  value,
  onValueChange,
}: {
  outputs?: { key: string; label: string; color: string }[];
  value?: string;
  onValueChange?: (value: string) => void;
}) {
  return (
    <View
      style={{
        height: 40,
        padding: 8,
        flexDirection: "row",
        zIndex: 1,
        overflow: "visible",
      }}
    >
      {outputs ? (
        <OutputPickerControl
          items={outputs}
          value={value!}
          onValueChange={onValueChange!}
        />
      ) : null}
    </View>
  );
}

function OutputPickerControl<T extends string>({
  items,
  value,
  onValueChange,
}: {
  items: { key: T; label: string; color: string }[];
  value: T;
  onValueChange: (value: T) => void;
}) {
  // TODO: Close when tapping outside
  const [isOpen, setIsOpen] = useState(false);
  const selectedItem = useMemo(
    () => items.find((item) => item.key === value),
    [items, value]
  );
  const handlePress = useCallback(() => {
    if (items.length <= 1) {
      return;
    }
    setIsOpen(!isOpen);
  }, [isOpen, items.length]);
  const handleItemPress = useCallback(
    (item: { key: T; label: string; color: string }) => {
      onValueChange(item.key);
      setIsOpen(false);
    },
    [onValueChange]
  );
  const itemElements = useMemo(
    () =>
      items
        .map((item) => (
          <Pressable
            key={item.key}
            onPress={() => {
              handleItemPress(item);
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 4,
                paddingHorizontal: 8,
                backgroundColor: item.color,
              }}
            >
              <Text
                style={{
                  textAlign: "left",
                  flexGrow: 1,
                  flexShrink: 1,
                  fontSize: 14,
                }}
              >
                {item.label}
              </Text>
            </View>
          </Pressable>
        ))
        .filter((item) => item != null),
    [handleItemPress, items]
  );
  return (
    <View
      style={{
        flexGrow: 1,
        height: 24,
      }}
    >
      {/* TODO: Touch feedback */}
      <Pressable
        onPress={handlePress}
        style={{
          borderWidth: 1,
          backgroundColor: selectedItem!.color,
          flexDirection: "row",
          flexGrow: 1,
          borderRadius: 4,
          overflow: "hidden",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            textAlign: "center",
            flexGrow: 1,
            // color: outputs.length > 1 ? "black" : "gray",
            // borderColor: outputs.length > 1 ? "black" : "gray",
          }}
        >
          {selectedItem!.label}
        </Text>
        {items.length > 1 ? (
          <Text style={{ paddingHorizontal: 8 }}>▼</Text>
        ) : null}
      </Pressable>
      {isOpen ? (
        <View
          style={{
            position: "absolute",
            top: 24,
            right: 0,
            left: 0,
          }}
        >
          {itemElements}
        </View>
      ) : null}
    </View>
  );
}

function MixerTrackSendKnob({
  label,
  color,
  field,
  onDragInteractionStart,
  onDragInteractionEnd,
}: {
  label: string;
  color: string;
  field: FieldReference<NumericField>;
  onDragInteractionStart?: () => void;
  onDragInteractionEnd?: () => void;
}) {
  const { panHandlers, style } = useRotaryKnob({
    field,
    onDragInteractionStart,
    onDragInteractionEnd,
  });
  const { dark } = useNavigationTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 4,
        paddingHorizontal: 8,
        // backgroundColor: color,
      }}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      {...panHandlers}
    >
      <Text
        style={{
          textAlign: "left",
          flexGrow: 1,
          flexShrink: 1,
          fontSize: 14,
        }}
      >
        {label}
      </Text>
      <Animated.View
        style={[
          {
            borderRadius: 32,
            width: 32,
            height: 32,
            backgroundColor: dark ? "#999" : "#aaa",
            borderColor: "black",
            borderWidth: 2,
          },
          style,
        ]}
      >
        {/* knob notch */}
        <View
          style={{
            alignSelf: "center",
            borderWidth: 0.5,
            borderColor: "black",
            height: 10,
          }}
        />
      </Animated.View>
    </View>
  );
}

function useRotaryKnob({
  field,
  onDragInteractionStart,
  onDragInteractionEnd,
}: {
  field: FieldReference<NumericField>;
  onDragInteractionStart?: () => void;
  onDragInteractionEnd?: () => void;
}) {
  const handlers = useRef({
    onDragInteractionStart,
    onDragInteractionEnd,
  });
  const [value, setValue] = useRemoteField(PATCH, field);
  const initialFrac =
    (value - field.definition.type.min) /
    (field.definition.type.max - field.definition.type.min);
  const rotateAnim = useRef<Animated.Value>();
  if (!rotateAnim.current) {
    rotateAnim.current = new Animated.Value(initialFrac, {
      useNativeDriver: true,
    });
  }
  const [isDragging, setIsDragging] = useState(false);
  useEffect(() => {
    if (isDragging) {
      return;
    }
    rotateAnim.current!.setValue(
      (value - field.definition.type.min) /
        (field.definition.type.max - field.definition.type.min)
    );
  }, [field.definition.type.max, field.definition.type.min, isDragging, value]);
  useEffect(() => {
    const listenerId = rotateAnim.current!.addListener(({ value }) => {
      setValue(
        value * (field.definition.type.max - field.definition.type.min) +
          field.definition.type.min
      );
    });

    return () => {
      // Remove the listener when the component unmounts
      rotateAnim.current!.removeListener(listenerId);
    };
  }, [
    field.definition.type.max,
    field.definition.type.min,
    rotateAnim,
    setValue,
  ]);

  // Create a pan responder to handle touch events
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsDragging(true);
        handlers.current.onDragInteractionStart?.();
      },
      onPanResponderMove: (event, gestureState) => {
        // Calculate the angle relative to the vertical axis
        let newValue =
          Math.atan2(gestureState.dy, gestureState.dx) * (180 / Math.PI);

        // Adjust the angle to match your dial's orientation
        newValue = ((newValue + 270) % 360) - 180;

        // Restricting to the range -145 to 145 degrees
        newValue = Math.min(Math.max(newValue, -145), 145) / 290 + 0.5;
        rotateAnim.current!.setValue(newValue);
      },
      onPanResponderRelease: () => {
        setIsDragging(false);
        handlers.current.onDragInteractionEnd?.();
      },
      onPanResponderTerminate: () => {
        setIsDragging(false);
        handlers.current.onDragInteractionEnd?.();
      },
      onPanResponderEnd: () => {
        setIsDragging(false);
        handlers.current.onDragInteractionEnd?.();
      },
      onPanResponderTerminationRequest: () => false,
    })
  );

  const style = {
    transform: [
      {
        rotate: rotateAnim.current!.interpolate({
          inputRange: [0, 1],
          outputRange: ["-145deg", "145deg"],
        }),
      },
    ],
  };

  return { style, panHandlers: panResponder.current.panHandlers };
}

function MixerTrackPanKnob({
  field,
  onDragInteractionStart,
  onDragInteractionEnd,
}: {
  field: FieldReference<NumericField>;
  onDragInteractionStart?: () => void;
  onDragInteractionEnd?: () => void;
}) {
  const { panHandlers, style } = useRotaryKnob({
    field,
    onDragInteractionStart,
    onDragInteractionEnd,
  });

  // const valueDegStr =
  //   ((2 * (value - field.definition.type.min)) /
  //     (field.definition.type.max - field.definition.type.min) -
  //     1) *
  //     145 +
  //   "deg";
  const { dark } = useNavigationTheme();
  return (
    <Animated.View
      {...panHandlers}
      style={[
        {
          borderRadius: 50,
          width: 50,
          height: 50,
          backgroundColor: dark ? "#999" : "#aaa",
          borderColor: "black",
          borderWidth: 2,
        },
        style,
      ]}
    >
      {/* pan notch */}
      <View
        style={{
          alignSelf: "center",
          borderWidth: 0.5,
          borderColor: "black",
          height: 10,
        }}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});

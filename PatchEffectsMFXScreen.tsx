import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { useContext } from "react";
import { StyleSheet } from "react-native";

import { PopoverAwareScrollView } from "./PopoverAwareScrollView";
import { RefreshControl } from "./RefreshControl";
import { RemoteFieldPicker } from "./RemoteFieldPicker";
import { RemoteFieldSegmentedSwitch } from "./RemoteFieldSegmentedSwitch";
import { RemoteFieldSlider } from "./RemoteFieldSlider";
import { RemoteFieldSwitch } from "./RemoteFieldSwitch";
import { RemoteFieldSwitchedSection } from "./RemoteFieldSwitchedSection";
import { RemoteFieldWaveShapePicker } from "./RemoteFieldWaveShapePicker";
import {
  BooleanField,
  EnumField,
  FieldReference,
  NumericField,
} from "./RolandAddressMap";
import { RolandGR55AddressMapAbsolute as GR55 } from "./RolandGR55AddressMap";
import { RolandRemotePatchContext as PATCH } from "./RolandRemotePageContext";
import { useMainScrollViewSafeAreaStyle } from "./SafeAreaUtils";
import { PatchEffectsTabParamList } from "./navigation";
import { useRemoteField } from "./useRemoteField";

const { mfx } = GR55.temporaryPatch;

export function PatchEffectsMFXScreen({
  navigation,
}: MaterialTopTabScreenProps<PatchEffectsTabParamList, "MFX">) {
  const { reloadData } = useContext(PATCH);

  const [mfxType, setMfxType] = useRemoteField(PATCH, mfx.mfxType);

  const safeAreaStyle = useMainScrollViewSafeAreaStyle();

  return (
    <PopoverAwareScrollView
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={reloadData} />
      }
      style={[styles.container]}
      contentContainerStyle={safeAreaStyle}
    >
      <RemoteFieldSwitchedSection page={PATCH} field={mfx.mfxSwitch}>
        <RemoteFieldSlider page={PATCH} field={mfx.mfxPan} />
        <RemoteFieldPicker
          page={PATCH}
          field={mfx.mfxType}
          value={mfxType}
          onValueChange={setMfxType}
        />
        {mfxType === "EQ" && (
          <>
            <RemoteFieldPicker page={PATCH} field={mfx.eqLowFreq} />
            <RemoteFieldSlider page={PATCH} field={mfx.eqLowGain} />
            <RemoteFieldPicker page={PATCH} field={mfx.eqMid1Freq} />
            <RemoteFieldSlider page={PATCH} field={mfx.eqMid1Gain} />
            <RemoteFieldPicker page={PATCH} field={mfx.eqMid1Q} />
            <RemoteFieldPicker page={PATCH} field={mfx.eqMid2Freq} />
            <RemoteFieldSlider page={PATCH} field={mfx.eqMid2Gain} />
            <RemoteFieldPicker page={PATCH} field={mfx.eqMid2Q} />
            <RemoteFieldPicker page={PATCH} field={mfx.eqHighFreq} />
            <RemoteFieldSlider page={PATCH} field={mfx.eqHighGain} />
            <RemoteFieldSlider page={PATCH} field={mfx.eqLevel} />
          </>
        )}
        {mfxType === "SUPER FILTER" && (
          <>
            <RemoteFieldPicker page={PATCH} field={mfx.superFilterFilterType} />
            <RemoteFieldPicker
              page={PATCH}
              field={mfx.superFilterFilterSlope}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={mfx.superFilterFilterCutoff}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={mfx.superFilterFilterResonance}
            />
            <RemoteFieldSlider page={PATCH} field={mfx.superFilterFilterGain} />
            <RemoteFieldSwitchedSection
              page={PATCH}
              field={mfx.superFilterModulationSw}
            >
              <RemoteFieldWaveShapePicker
                page={PATCH}
                field={mfx.superFilterModulationWave}
              />
            </RemoteFieldSwitchedSection>
            <TimeOrNoteField
              syncSwitchField={mfx.superFilterRateSyncSw}
              noteField={mfx.superFilterRateNote}
              timeField={mfx.superFilterRate}
            />
            <RemoteFieldSlider page={PATCH} field={mfx.superFilterDepth} />
            <RemoteFieldSlider page={PATCH} field={mfx.superFilterAttack} />
            <RemoteFieldSlider page={PATCH} field={mfx.superFilterLevel} />
          </>
        )}
        {mfxType === "PHASER" && (
          <>
            <RemoteFieldPicker page={PATCH} field={mfx.phaserMode} />
            <RemoteFieldSlider page={PATCH} field={mfx.phaserManual} />
            <TimeOrNoteField
              syncSwitchField={mfx.phaserRateSyncSw}
              noteField={mfx.phaserRateNote}
              timeField={mfx.phaserRate}
            />
            <RemoteFieldSlider page={PATCH} field={mfx.phaserDepth} />
            <RemoteFieldSegmentedSwitch
              page={PATCH}
              field={mfx.phaserPolarity}
            />
            <RemoteFieldSlider page={PATCH} field={mfx.phaserResonance} />
            <RemoteFieldSlider page={PATCH} field={mfx.phaserCrossFeedback} />
            <RemoteFieldSlider page={PATCH} field={mfx.phaserMix} />
            <RemoteFieldSlider page={PATCH} field={mfx.phaserLowGain} />
            <RemoteFieldSlider page={PATCH} field={mfx.phaserHighGain} />
            <RemoteFieldSlider page={PATCH} field={mfx.phaserLevel} />
          </>
        )}
        {mfxType === "STEP PHASER" && (
          <>
            <RemoteFieldPicker page={PATCH} field={mfx.stepPhaserMode} />
            <RemoteFieldSlider page={PATCH} field={mfx.stepPhaserManual} />
            <TimeOrNoteField
              syncSwitchField={mfx.stepPhaserRateSyncSw}
              noteField={mfx.stepPhaserRateNote}
              timeField={mfx.stepPhaserRate}
            />
            <RemoteFieldSlider page={PATCH} field={mfx.stepPhaserDepth} />
            <RemoteFieldSegmentedSwitch
              page={PATCH}
              field={mfx.stepPhaserPolarity}
            />
            <RemoteFieldSlider page={PATCH} field={mfx.stepPhaserResonance} />
            <RemoteFieldSlider
              page={PATCH}
              field={mfx.stepPhaserCrossFeedback}
            />
            <TimeOrNoteField
              syncSwitchField={mfx.stepPhaserStepRateSyncSw}
              noteField={mfx.stepPhaserStepRateNote}
              timeField={mfx.stepPhaserStepRate}
            />
            <RemoteFieldSlider page={PATCH} field={mfx.stepPhaserMix} />
            <RemoteFieldSlider page={PATCH} field={mfx.stepPhaserLowGain} />
            <RemoteFieldSlider page={PATCH} field={mfx.stepPhaserHighGain} />
            <RemoteFieldSlider page={PATCH} field={mfx.stepPhaserLevel} />
          </>
        )}
        {mfxType === "RING MODULATOR" && (
          <>
            <RemoteFieldSlider
              page={PATCH}
              field={mfx.ringModulatorFrequency}
            />
            <RemoteFieldSlider page={PATCH} field={mfx.ringModulatorSens} />
            <RemoteFieldSegmentedSwitch
              page={PATCH}
              field={mfx.ringModulatorPolarity}
            />
            <RemoteFieldSlider page={PATCH} field={mfx.ringModulatorLowGain} />
            <RemoteFieldSlider page={PATCH} field={mfx.ringModulatorHighGain} />
            <RemoteFieldSlider page={PATCH} field={mfx.ringModulatorBalance} />
            <RemoteFieldSlider page={PATCH} field={mfx.ringModulatorLevel} />
          </>
        )}
        {mfxType === "TREMOLO" && (
          <>
            <RemoteFieldWaveShapePicker
              page={PATCH}
              field={mfx.tremoloModWave}
            />
            <TimeOrNoteField
              syncSwitchField={mfx.tremoloRateSyncSw}
              noteField={mfx.tremoloRateNote}
              timeField={mfx.tremoloRate}
            />
            <RemoteFieldSlider page={PATCH} field={mfx.tremoloDepth} />
            <RemoteFieldSlider page={PATCH} field={mfx.tremoloLowGain} />
            <RemoteFieldSlider page={PATCH} field={mfx.tremoloHighGain} />
            <RemoteFieldSlider page={PATCH} field={mfx.tremoloLevel} />
          </>
        )}
        {mfxType === "AUTO PAN" && (
          <>
            <RemoteFieldWaveShapePicker
              page={PATCH}
              field={mfx.autoPanModWave}
            />
            <TimeOrNoteField
              syncSwitchField={mfx.autoPanRateSyncSw}
              noteField={mfx.autoPanRateNote}
              timeField={mfx.autoPanRate}
            />
            <RemoteFieldSlider page={PATCH} field={mfx.autoPanDepth} />
            <RemoteFieldSlider page={PATCH} field={mfx.autoPanLowGain} />
            <RemoteFieldSlider page={PATCH} field={mfx.autoPanHighGain} />
            <RemoteFieldSlider page={PATCH} field={mfx.autoPanLevel} />
          </>
        )}
        {mfxType === "SLICER" && (
          <>
            <RemoteFieldSlider page={PATCH} field={mfx.slicerPattern} />
            <TimeOrNoteField
              syncSwitchField={mfx.slicerRateSyncSw}
              noteField={mfx.slicerRateNote}
              timeField={mfx.slicerRate}
            />
            <RemoteFieldSlider page={PATCH} field={mfx.slicerAttack} />
            <RemoteFieldSwitchedSection
              page={PATCH}
              field={mfx.slicerInputSyncSw}
            >
              <RemoteFieldSlider
                page={PATCH}
                field={mfx.slicerInputSyncThreshold}
              />
            </RemoteFieldSwitchedSection>
            <RemoteFieldSlider page={PATCH} field={mfx.slicerLevel} />
          </>
        )}
        {mfxType === "VK ROTARY" && (
          <>
            <RemoteFieldSegmentedSwitch
              page={PATCH}
              field={mfx.vkRotarySpeed}
            />
            <RemoteFieldSwitch page={PATCH} field={mfx.vkRotaryBrake} />
            <RemoteFieldSlider
              page={PATCH}
              field={mfx.vkRotaryWooferSlowSpeed}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={mfx.vkRotaryWooferFastSpeed}
            />
            <RemoteFieldSlider page={PATCH} field={mfx.vkRotaryWooferTransUp} />
            <RemoteFieldSlider
              page={PATCH}
              field={mfx.vkRotaryWooferTransDown}
            />
            <RemoteFieldSlider page={PATCH} field={mfx.vkRotaryWooferLevel} />
            <RemoteFieldSlider
              page={PATCH}
              field={mfx.vkRotaryTweeterSlowSpeed}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={mfx.vkRotaryTweeterFastSpeed}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={mfx.vkRotaryTweeterTransUp}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={mfx.vkRotaryTweeterTransDown}
            />
            <RemoteFieldSlider page={PATCH} field={mfx.vkRotaryTweeterLevel} />
            <RemoteFieldSlider page={PATCH} field={mfx.vkRotarySpread} />
            <RemoteFieldSlider page={PATCH} field={mfx.vkRotaryLowGain} />
            <RemoteFieldSlider page={PATCH} field={mfx.vkRotaryHighGain} />
            <RemoteFieldSlider page={PATCH} field={mfx.vkRotaryLevel} />
          </>
        )}
        {mfxType === "HEXA-CHORUS" && (
          <>
            <RemoteFieldSlider page={PATCH} field={mfx.hexaChorusPreDelay} />
            <TimeOrNoteField
              syncSwitchField={mfx.hexaChorusRateSyncSw}
              noteField={mfx.hexaChorusRateNote}
              timeField={mfx.hexaChorusRate}
            />
            <RemoteFieldSlider page={PATCH} field={mfx.hexaChorusDepth} />
            <RemoteFieldSlider
              page={PATCH}
              field={mfx.hexaChorusPreDelayDeviation}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={mfx.hexaChorusDepthDeviation}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={mfx.hexaChorusPanDeviation}
            />
            <RemoteFieldSlider page={PATCH} field={mfx.hexaChorusLevel} />
          </>
        )}
        {mfxType === "SPACE-D" && (
          <>
            <RemoteFieldSlider page={PATCH} field={mfx.spaceDPreDelay} />
            <TimeOrNoteField
              syncSwitchField={mfx.spaceDRateSyncSw}
              noteField={mfx.spaceDRateNote}
              timeField={mfx.spaceDRate}
            />
            <RemoteFieldSlider page={PATCH} field={mfx.spaceDDepth} />
            <RemoteFieldSlider page={PATCH} field={mfx.spaceDPhase} />
            <RemoteFieldSlider page={PATCH} field={mfx.spaceDLowGain} />
            <RemoteFieldSlider page={PATCH} field={mfx.spaceDHighGain} />
            <RemoteFieldSlider page={PATCH} field={mfx.spaceDBalance} />
            <RemoteFieldSlider page={PATCH} field={mfx.spaceDLevel} />
          </>
        )}
        {mfxType === "FLANGER" && (
          <>
            <RemoteFieldPicker page={PATCH} field={mfx.flangerFilterType} />
            <RemoteFieldPicker page={PATCH} field={mfx.flangerCutoffFreq} />
            <RemoteFieldSlider page={PATCH} field={mfx.flangerPreDelay} />
            <TimeOrNoteField
              syncSwitchField={mfx.flangerRateSyncSw}
              noteField={mfx.flangerRateNote}
              timeField={mfx.flangerRate}
            />
            <RemoteFieldSlider page={PATCH} field={mfx.flangerDepth} />
            <RemoteFieldSlider page={PATCH} field={mfx.flangerPhase} />
            <RemoteFieldSlider page={PATCH} field={mfx.flangerFeedback} />
            <RemoteFieldSlider page={PATCH} field={mfx.flangerLowGain} />
            <RemoteFieldSlider page={PATCH} field={mfx.flangerHighGain} />
            <RemoteFieldSlider page={PATCH} field={mfx.flangerBalance} />
            <RemoteFieldSlider page={PATCH} field={mfx.flangerLevel} />
          </>
        )}
        {mfxType === "STEP FLANGER" && (
          <>
            <RemoteFieldPicker page={PATCH} field={mfx.stepFlangerFilterType} />
            <RemoteFieldPicker page={PATCH} field={mfx.stepFlangerCutoffFreq} />
            <RemoteFieldSlider page={PATCH} field={mfx.stepFlangerPreDelay} />
            <TimeOrNoteField
              syncSwitchField={mfx.stepFlangerRateSyncSw}
              noteField={mfx.stepFlangerRateNote}
              timeField={mfx.stepFlangerRate}
            />
            <RemoteFieldSlider page={PATCH} field={mfx.stepFlangerDepth} />
            <RemoteFieldSlider page={PATCH} field={mfx.stepFlangerPhase} />
            <RemoteFieldSlider page={PATCH} field={mfx.stepFlangerFeedback} />
            <TimeOrNoteField
              syncSwitchField={mfx.stepFlangerStepRateSyncSw}
              noteField={mfx.stepFlangerStepRateNote}
              timeField={mfx.stepFlangerStepRate}
            />
            <RemoteFieldSlider page={PATCH} field={mfx.stepFlangerLowGain} />
            <RemoteFieldSlider page={PATCH} field={mfx.stepFlangerHighGain} />
            <RemoteFieldSlider page={PATCH} field={mfx.stepFlangerBalance} />
            <RemoteFieldSlider page={PATCH} field={mfx.stepFlangerLevel} />
          </>
        )}
        {mfxType === "GUITAR AMP SIM" && <GuitarAmpSimSection />}
        {mfxType === "COMPRESSOR" && (
          <>
            <RemoteFieldSlider page={PATCH} field={mfx.compressorAttack} />
            <RemoteFieldSlider page={PATCH} field={mfx.compressorThreshold} />
            <RemoteFieldSlider page={PATCH} field={mfx.compressorPostGain} />
            <RemoteFieldSlider page={PATCH} field={mfx.compressorLowGain} />
            <RemoteFieldSlider page={PATCH} field={mfx.compressorHighGain} />
            <RemoteFieldSlider page={PATCH} field={mfx.compressorLevel} />
          </>
        )}
        {mfxType === "LIMITER" && (
          <>
            <RemoteFieldSlider page={PATCH} field={mfx.limiterRelease} />
            <RemoteFieldSlider page={PATCH} field={mfx.limiterThreshold} />
            <RemoteFieldPicker page={PATCH} field={mfx.limiterRatio} />
            <RemoteFieldSlider page={PATCH} field={mfx.limiterPostGain} />
            <RemoteFieldSlider page={PATCH} field={mfx.limiterLowGain} />
            <RemoteFieldSlider page={PATCH} field={mfx.limiterHighGain} />
            <RemoteFieldSlider page={PATCH} field={mfx.limiterLevel} />
          </>
        )}
        {mfxType === "3TAP PAN DELAY" && (
          <>
            <TimeOrNoteField
              syncSwitchField={mfx.threeTapDelayDelayLeftSyncSw}
              noteField={mfx.threeTapDelayDelayLeftNote}
              timeField={mfx.threeTapDelayDelayLeft}
            />
            <TimeOrNoteField
              syncSwitchField={mfx.threeTapDelayDelayRightSyncSw}
              noteField={mfx.threeTapDelayDelayRightNote}
              timeField={mfx.threeTapDelayDelayRight}
            />
            <TimeOrNoteField
              syncSwitchField={mfx.threeTapDelayDelayCenterSyncSw}
              noteField={mfx.threeTapDelayDelayCenterNote}
              timeField={mfx.threeTapDelayDelayCenter}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={mfx.threeTapDelayCenterFeedback}
            />
            <RemoteFieldPicker page={PATCH} field={mfx.threeTapDelayHFDamp} />
            <RemoteFieldSlider
              page={PATCH}
              field={mfx.threeTapDelayLeftLevel}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={mfx.threeTapDelayRightLevel}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={mfx.threeTapDelayCenterLevel}
            />
            <RemoteFieldSlider page={PATCH} field={mfx.threeTapDelayLowGain} />
            <RemoteFieldSlider page={PATCH} field={mfx.threeTapDelayHighGain} />
            <RemoteFieldSlider page={PATCH} field={mfx.threeTapDelayBalance} />
            <RemoteFieldSlider page={PATCH} field={mfx.threeTapDelayLevel} />
          </>
        )}
        {mfxType === "TIME CTRL DELAY" && (
          <>
            <TimeOrNoteField
              syncSwitchField={mfx.timeCtrlDelayDelayTimeSyncSw}
              noteField={mfx.timeCtrlDelayDelayTimeNote}
              timeField={mfx.timeCtrlDelayDelayTime}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={mfx.timeCtrlDelayAcceleration}
            />
            <RemoteFieldSlider page={PATCH} field={mfx.timeCtrlDelayFeedback} />
            <RemoteFieldPicker page={PATCH} field={mfx.timeCtrlDelayHFDamp} />
            <RemoteFieldSlider page={PATCH} field={mfx.timeCtrlDelayLowGain} />
            <RemoteFieldSlider page={PATCH} field={mfx.timeCtrlDelayHighGain} />
            <RemoteFieldSlider page={PATCH} field={mfx.timeCtrlDelayBalance} />
            <RemoteFieldSlider page={PATCH} field={mfx.timeCtrlDelayLevel} />
          </>
        )}
        {mfxType === "LOFI COMPRESS" && (
          <>
            <RemoteFieldSlider
              page={PATCH}
              field={mfx.lofiCompressPreFilterType}
            />
            <RemoteFieldSlider page={PATCH} field={mfx.lofiCompressLoFiType} />
            <RemoteFieldPicker
              page={PATCH}
              field={mfx.lofiCompressPostFilterType}
            />
            <RemoteFieldPicker
              page={PATCH}
              field={mfx.lofiCompressPostFilterCutoff}
            />
            <RemoteFieldSlider page={PATCH} field={mfx.lofiCompressLowGain} />
            <RemoteFieldSlider page={PATCH} field={mfx.lofiCompressHighGain} />
            <RemoteFieldSlider page={PATCH} field={mfx.lofiCompressBalance} />
            <RemoteFieldSlider page={PATCH} field={mfx.lofiCompressLevel} />
          </>
        )}
        {mfxType === "PITCH SHIFTER" && (
          <>
            <RemoteFieldSlider page={PATCH} field={mfx.pitchShifterCoarse} />
            <RemoteFieldSlider page={PATCH} field={mfx.pitchShifterFine} />
            <TimeOrNoteField
              syncSwitchField={mfx.pitchShifterDelayTimeSyncSw}
              noteField={mfx.pitchShifterDelayTimeNote}
              timeField={mfx.pitchShifterDelayTime}
            />
            <RemoteFieldSlider page={PATCH} field={mfx.pitchShifterFeedback} />
            <RemoteFieldSlider page={PATCH} field={mfx.pitchShifterLowGain} />
            <RemoteFieldSlider page={PATCH} field={mfx.pitchShifterHighGain} />
            <RemoteFieldSlider page={PATCH} field={mfx.pitchShifterBalance} />
            <RemoteFieldSlider page={PATCH} field={mfx.pitchShifterLevel} />
          </>
        )}
      </RemoteFieldSwitchedSection>
      {/* TODO: Should these be greyed out when the effect is off, or do the sends happen anyway? */}
      <RemoteFieldSlider page={PATCH} field={mfx.mfxDelaySendLevel} />
      <RemoteFieldSlider page={PATCH} field={mfx.mfxReverbSendLevel} />
      <RemoteFieldSlider page={PATCH} field={mfx.mfxChorusSendLevel} />
    </PopoverAwareScrollView>
  );
}

function TimeOrNoteField({
  syncSwitchField,
  noteField,
  timeField,
}: {
  syncSwitchField: FieldReference<BooleanField>;
  noteField: FieldReference<EnumField<any>>;
  timeField: FieldReference<NumericField>;
}) {
  const [syncSwitch, setSyncSwitch] = useRemoteField(PATCH, syncSwitchField);
  return (
    <>
      <RemoteFieldSwitch
        page={PATCH}
        field={syncSwitchField}
        value={syncSwitch}
        onValueChange={setSyncSwitch}
      />
      {syncSwitch ? (
        <RemoteFieldPicker page={PATCH} field={noteField} />
      ) : (
        <RemoteFieldSlider page={PATCH} field={timeField} />
      )}
    </>
  );
}

function GuitarAmpSimSection() {
  const [gtrAmpSimPreAmpType, setGtrAmpSimPreAmpType] = useRemoteField(
    PATCH,
    mfx.gtrAmpSimPreAmpType
  );
  return (
    <>
      <RemoteFieldSwitchedSection page={PATCH} field={mfx.gtrAmpSimPreAmpSw}>
        <RemoteFieldPicker
          page={PATCH}
          field={mfx.gtrAmpSimPreAmpType}
          value={gtrAmpSimPreAmpType}
          onValueChange={setGtrAmpSimPreAmpType}
        />
        <RemoteFieldSlider page={PATCH} field={mfx.gtrAmpSimPreAmpVolume} />
        <RemoteFieldSlider page={PATCH} field={mfx.gtrAmpSimPreAmpMaster} />
        <RemoteFieldPicker page={PATCH} field={mfx.gtrAmpSimPreAmpGain} />
        <RemoteFieldSlider page={PATCH} field={mfx.gtrAmpSimPreAmpBass} />
        <RemoteFieldSlider page={PATCH} field={mfx.gtrAmpSimPreAmpMiddle} />
        <RemoteFieldSlider page={PATCH} field={mfx.gtrAmpSimPreAmpTreble} />
        <RemoteFieldSlider page={PATCH} field={mfx.gtrAmpSimPreAmpPresence} />
        {(gtrAmpSimPreAmpType === "JC-120" ||
          gtrAmpSimPreAmpType === "CLEAN TWIN" ||
          gtrAmpSimPreAmpType === "BG LEAD") && (
          <RemoteFieldSwitch page={PATCH} field={mfx.gtrAmpSimPreAmpBright} />
        )}
      </RemoteFieldSwitchedSection>
      <RemoteFieldSwitchedSection page={PATCH} field={mfx.gtrAmpSimSpeakerSw}>
        <RemoteFieldPicker page={PATCH} field={mfx.gtrAmpSimSpeakerType} />
        <RemoteFieldPicker page={PATCH} field={mfx.gtrAmpSimMicSetting} />
        <RemoteFieldSlider page={PATCH} field={mfx.gtrAmpSimMicLevel} />
      </RemoteFieldSwitchedSection>
      <RemoteFieldSlider page={PATCH} field={mfx.gtrAmpSimDirectLevel} />
      <RemoteFieldSlider page={PATCH} field={mfx.gtrAmpSimPan} />
      <RemoteFieldSlider page={PATCH} field={mfx.gtrAmpSimLevel} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});

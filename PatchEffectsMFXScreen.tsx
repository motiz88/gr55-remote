import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { useContext } from "react";
import { StyleSheet, ScrollView, RefreshControl } from "react-native";

import {
  PatchFieldPicker,
  PatchFieldPickerControlled,
} from "./PatchFieldPicker";
import { PatchFieldSegmentedSwitch } from "./PatchFieldSegmentedSwitch";
import { PatchFieldSlider } from "./PatchFieldSlider";
import {
  PatchFieldSwitch,
  PatchFieldSwitchControlled,
} from "./PatchFieldSwitch";
import { PatchFieldSwitchedSection } from "./PatchFieldSwitchedSection";
import { PatchFieldWaveShapePicker } from "./PatchFieldWaveShapePicker";
import {
  BooleanField,
  EnumField,
  FieldReference,
  NumericField,
} from "./RolandAddressMap";
import { RolandGR55AddressMapAbsolute as GR55 } from "./RolandGR55AddressMap";
import { RolandRemotePatchContext } from "./RolandRemotePatchContext";
import { useMainScrollViewSafeAreaStyle } from "./SafeAreaUtils";
import { PatchEffectsTabParamList } from "./navigation";
import { usePatchField } from "./usePatchField";

const { mfx } = GR55.temporaryPatch;

export function PatchEffectsMFXScreen({
  navigation,
}: MaterialTopTabScreenProps<PatchEffectsTabParamList, "MFX">) {
  const { reloadPatchData } = useContext(RolandRemotePatchContext);

  const [mfxType, setMfxType] = usePatchField(
    mfx.mfxType,
    mfx.mfxType.definition.type.labels[0]
  );

  const safeAreaStyle = useMainScrollViewSafeAreaStyle();

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={reloadPatchData} />
      }
      style={[styles.container]}
      contentContainerStyle={safeAreaStyle}
    >
      <PatchFieldSwitchedSection field={mfx.mfxSwitch}>
        <PatchFieldSlider field={mfx.mfxPan} />
        <PatchFieldPickerControlled
          field={mfx.mfxType}
          value={mfxType}
          onValueChange={setMfxType}
        />
        {mfxType === "EQ" && (
          <>
            <PatchFieldPicker field={mfx.eqLowFreq} />
            <PatchFieldSlider field={mfx.eqLowGain} />
            <PatchFieldPicker field={mfx.eqMid1Freq} />
            <PatchFieldSlider field={mfx.eqMid1Gain} />
            <PatchFieldPicker field={mfx.eqMid1Q} />
            <PatchFieldPicker field={mfx.eqMid2Freq} />
            <PatchFieldSlider field={mfx.eqMid2Gain} />
            <PatchFieldPicker field={mfx.eqMid2Q} />
            <PatchFieldPicker field={mfx.eqHighFreq} />
            <PatchFieldSlider field={mfx.eqHighGain} />
            <PatchFieldSlider field={mfx.eqLevel} />
          </>
        )}
        {mfxType === "SUPER FILTER" && (
          <>
            <PatchFieldPicker field={mfx.superFilterFilterType} />
            <PatchFieldPicker field={mfx.superFilterFilterSlope} />
            <PatchFieldSlider field={mfx.superFilterFilterCutoff} />
            <PatchFieldSlider field={mfx.superFilterFilterResonance} />
            <PatchFieldSlider field={mfx.superFilterFilterGain} />
            <PatchFieldSwitchedSection field={mfx.superFilterModulationSw}>
              <PatchFieldWaveShapePicker
                field={mfx.superFilterModulationWave}
              />
            </PatchFieldSwitchedSection>
            <TimeOrNoteField
              syncSwitchField={mfx.superFilterRateSyncSw}
              noteField={mfx.superFilterRateNote}
              timeField={mfx.superFilterRate}
            />
            <PatchFieldSlider field={mfx.superFilterDepth} />
            <PatchFieldSlider field={mfx.superFilterAttack} />
            <PatchFieldSlider field={mfx.superFilterLevel} />
          </>
        )}
        {mfxType === "PHASER" && (
          <>
            <PatchFieldPicker field={mfx.phaserMode} />
            <PatchFieldSlider field={mfx.phaserManual} />
            <TimeOrNoteField
              syncSwitchField={mfx.phaserRateSyncSw}
              noteField={mfx.phaserRateNote}
              timeField={mfx.phaserRate}
            />
            <PatchFieldSlider field={mfx.phaserDepth} />
            <PatchFieldSegmentedSwitch field={mfx.phaserPolarity} />
            <PatchFieldSlider field={mfx.phaserResonance} />
            <PatchFieldSlider field={mfx.phaserCrossFeedback} />
            <PatchFieldSlider field={mfx.phaserMix} />
            <PatchFieldSlider field={mfx.phaserLowGain} />
            <PatchFieldSlider field={mfx.phaserHighGain} />
            <PatchFieldSlider field={mfx.phaserLevel} />
          </>
        )}
        {mfxType === "STEP PHASER" && (
          <>
            <PatchFieldPicker field={mfx.stepPhaserMode} />
            <PatchFieldSlider field={mfx.stepPhaserManual} />
            <TimeOrNoteField
              syncSwitchField={mfx.stepPhaserRateSyncSw}
              noteField={mfx.stepPhaserRateNote}
              timeField={mfx.stepPhaserRate}
            />
            <PatchFieldSlider field={mfx.stepPhaserDepth} />
            <PatchFieldSegmentedSwitch field={mfx.stepPhaserPolarity} />
            <PatchFieldSlider field={mfx.stepPhaserResonance} />
            <PatchFieldSlider field={mfx.stepPhaserCrossFeedback} />
            <TimeOrNoteField
              syncSwitchField={mfx.stepPhaserStepRateSyncSw}
              noteField={mfx.stepPhaserStepRateNote}
              timeField={mfx.stepPhaserStepRate}
            />
            <PatchFieldSlider field={mfx.stepPhaserMix} />
            <PatchFieldSlider field={mfx.stepPhaserLowGain} />
            <PatchFieldSlider field={mfx.stepPhaserHighGain} />
            <PatchFieldSlider field={mfx.stepPhaserLevel} />
          </>
        )}
        {mfxType === "RING MODULATOR" && (
          <>
            <PatchFieldSlider field={mfx.ringModulatorFrequency} />
            <PatchFieldSlider field={mfx.ringModulatorSens} />
            <PatchFieldSegmentedSwitch field={mfx.ringModulatorPolarity} />
            <PatchFieldSlider field={mfx.ringModulatorLowGain} />
            <PatchFieldSlider field={mfx.ringModulatorHighGain} />
            <PatchFieldSlider field={mfx.ringModulatorBalance} />
            <PatchFieldSlider field={mfx.ringModulatorLevel} />
          </>
        )}
        {mfxType === "TREMOLO" && (
          <>
            <PatchFieldWaveShapePicker field={mfx.tremoloModWave} />
            <TimeOrNoteField
              syncSwitchField={mfx.tremoloRateSyncSw}
              noteField={mfx.tremoloRateNote}
              timeField={mfx.tremoloRate}
            />
            <PatchFieldSlider field={mfx.tremoloDepth} />
            <PatchFieldSlider field={mfx.tremoloLowGain} />
            <PatchFieldSlider field={mfx.tremoloHighGain} />
            <PatchFieldSlider field={mfx.tremoloLevel} />
          </>
        )}
        {mfxType === "AUTO PAN" && (
          <>
            <PatchFieldWaveShapePicker field={mfx.autoPanModWave} />
            <TimeOrNoteField
              syncSwitchField={mfx.autoPanRateSyncSw}
              noteField={mfx.autoPanRateNote}
              timeField={mfx.autoPanRate}
            />
            <PatchFieldSlider field={mfx.autoPanDepth} />
            <PatchFieldSlider field={mfx.autoPanLowGain} />
            <PatchFieldSlider field={mfx.autoPanHighGain} />
            <PatchFieldSlider field={mfx.autoPanLevel} />
          </>
        )}
        {mfxType === "SLICER" && (
          <>
            <PatchFieldSlider field={mfx.slicerPattern} />
            <TimeOrNoteField
              syncSwitchField={mfx.slicerRateSyncSw}
              noteField={mfx.slicerRateNote}
              timeField={mfx.slicerRate}
            />
            <PatchFieldSlider field={mfx.slicerAttack} />
            <PatchFieldSwitchedSection field={mfx.slicerInputSyncSw}>
              <PatchFieldSlider field={mfx.slicerInputSyncThreshold} />
            </PatchFieldSwitchedSection>
            <PatchFieldSlider field={mfx.slicerLevel} />
          </>
        )}
        {mfxType === "VK ROTARY" && (
          <>
            <PatchFieldSegmentedSwitch field={mfx.vkRotarySpeed} />
            <PatchFieldSwitch field={mfx.vkRotaryBrake} />
            <PatchFieldSlider field={mfx.vkRotaryWooferSlowSpeed} />
            <PatchFieldSlider field={mfx.vkRotaryWooferFastSpeed} />
            <PatchFieldSlider field={mfx.vkRotaryWooferTransUp} />
            <PatchFieldSlider field={mfx.vkRotaryWooferTransDown} />
            <PatchFieldSlider field={mfx.vkRotaryWooferLevel} />
            <PatchFieldSlider field={mfx.vkRotaryTweeterSlowSpeed} />
            <PatchFieldSlider field={mfx.vkRotaryTweeterFastSpeed} />
            <PatchFieldSlider field={mfx.vkRotaryTweeterTransUp} />
            <PatchFieldSlider field={mfx.vkRotaryTweeterTransDown} />
            <PatchFieldSlider field={mfx.vkRotaryTweeterLevel} />
            <PatchFieldSlider field={mfx.vkRotarySpread} />
            <PatchFieldSlider field={mfx.vkRotaryLowGain} />
            <PatchFieldSlider field={mfx.vkRotaryHighGain} />
            <PatchFieldSlider field={mfx.vkRotaryLevel} />
          </>
        )}
        {mfxType === "HEXA-CHORUS" && (
          <>
            <PatchFieldSlider field={mfx.hexaChorusPreDelay} />
            <TimeOrNoteField
              syncSwitchField={mfx.hexaChorusRateSyncSw}
              noteField={mfx.hexaChorusRateNote}
              timeField={mfx.hexaChorusRate}
            />
            <PatchFieldSlider field={mfx.hexaChorusDepth} />
            <PatchFieldSlider field={mfx.hexaChorusPreDelayDeviation} />
            <PatchFieldSlider field={mfx.hexaChorusDepthDeviation} />
            <PatchFieldSlider field={mfx.hexaChorusPanDeviation} />
            <PatchFieldSlider field={mfx.hexaChorusLevel} />
          </>
        )}
        {mfxType === "SPACE-D" && (
          <>
            <PatchFieldSlider field={mfx.spaceDPreDelay} />
            <TimeOrNoteField
              syncSwitchField={mfx.spaceDRateSyncSw}
              noteField={mfx.spaceDRateNote}
              timeField={mfx.spaceDRate}
            />
            <PatchFieldSlider field={mfx.spaceDDepth} />
            <PatchFieldSlider field={mfx.spaceDPhase} />
            <PatchFieldSlider field={mfx.spaceDLowGain} />
            <PatchFieldSlider field={mfx.spaceDHighGain} />
            <PatchFieldSlider field={mfx.spaceDBalance} />
            <PatchFieldSlider field={mfx.spaceDLevel} />
          </>
        )}
        {mfxType === "FLANGER" && (
          <>
            <PatchFieldPicker field={mfx.flangerFilterType} />
            <PatchFieldPicker field={mfx.flangerCutoffFreq} />
            <PatchFieldSlider field={mfx.flangerPreDelay} />
            <TimeOrNoteField
              syncSwitchField={mfx.flangerRateSyncSw}
              noteField={mfx.flangerRateNote}
              timeField={mfx.flangerRate}
            />
            <PatchFieldSlider field={mfx.flangerDepth} />
            <PatchFieldSlider field={mfx.flangerPhase} />
            <PatchFieldSlider field={mfx.flangerFeedback} />
            <PatchFieldSlider field={mfx.flangerLowGain} />
            <PatchFieldSlider field={mfx.flangerHighGain} />
            <PatchFieldSlider field={mfx.flangerBalance} />
            <PatchFieldSlider field={mfx.flangerLevel} />
          </>
        )}
        {mfxType === "STEP FLANGER" && (
          <>
            <PatchFieldPicker field={mfx.stepFlangerFilterType} />
            <PatchFieldPicker field={mfx.stepFlangerCutoffFreq} />
            <PatchFieldSlider field={mfx.stepFlangerPreDelay} />
            <TimeOrNoteField
              syncSwitchField={mfx.stepFlangerRateSyncSw}
              noteField={mfx.stepFlangerRateNote}
              timeField={mfx.stepFlangerRate}
            />
            <PatchFieldSlider field={mfx.stepFlangerDepth} />
            <PatchFieldSlider field={mfx.stepFlangerPhase} />
            <PatchFieldSlider field={mfx.stepFlangerFeedback} />
            <TimeOrNoteField
              syncSwitchField={mfx.stepFlangerStepRateSyncSw}
              noteField={mfx.stepFlangerStepRateNote}
              timeField={mfx.stepFlangerStepRate}
            />
            <PatchFieldSlider field={mfx.stepFlangerLowGain} />
            <PatchFieldSlider field={mfx.stepFlangerHighGain} />
            <PatchFieldSlider field={mfx.stepFlangerBalance} />
            <PatchFieldSlider field={mfx.stepFlangerLevel} />
          </>
        )}
        {mfxType === "GUITAR AMP SIM" && <GuitarAmpSimSection />}
        {mfxType === "COMPRESSOR" && (
          <>
            <PatchFieldSlider field={mfx.compressorAttack} />
            <PatchFieldSlider field={mfx.compressorThreshold} />
            <PatchFieldSlider field={mfx.compressorPostGain} />
            <PatchFieldSlider field={mfx.compressorLowGain} />
            <PatchFieldSlider field={mfx.compressorHighGain} />
            <PatchFieldSlider field={mfx.compressorLevel} />
          </>
        )}
        {mfxType === "LIMITER" && (
          <>
            <PatchFieldSlider field={mfx.limiterRelease} />
            <PatchFieldSlider field={mfx.limiterThreshold} />
            <PatchFieldPicker field={mfx.limiterRatio} />
            <PatchFieldSlider field={mfx.limiterPostGain} />
            <PatchFieldSlider field={mfx.limiterLowGain} />
            <PatchFieldSlider field={mfx.limiterHighGain} />
            <PatchFieldSlider field={mfx.limiterLevel} />
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
            <PatchFieldSlider field={mfx.threeTapDelayCenterFeedback} />
            <PatchFieldPicker field={mfx.threeTapDelayHFDamp} />
            <PatchFieldSlider field={mfx.threeTapDelayLeftLevel} />
            <PatchFieldSlider field={mfx.threeTapDelayRightLevel} />
            <PatchFieldSlider field={mfx.threeTapDelayCenterLevel} />
            <PatchFieldSlider field={mfx.threeTapDelayLowGain} />
            <PatchFieldSlider field={mfx.threeTapDelayHighGain} />
            <PatchFieldSlider field={mfx.threeTapDelayBalance} />
            <PatchFieldSlider field={mfx.threeTapDelayLevel} />
          </>
        )}
        {mfxType === "TIME CTRL DELAY" && (
          <>
            <TimeOrNoteField
              syncSwitchField={mfx.timeCtrlDelayDelayTimeSyncSw}
              noteField={mfx.timeCtrlDelayDelayTimeNote}
              timeField={mfx.timeCtrlDelayDelayTime}
            />
            <PatchFieldSlider field={mfx.timeCtrlDelayAcceleration} />
            <PatchFieldSlider field={mfx.timeCtrlDelayFeedback} />
            <PatchFieldPicker field={mfx.timeCtrlDelayHFDamp} />
            <PatchFieldSlider field={mfx.timeCtrlDelayLowGain} />
            <PatchFieldSlider field={mfx.timeCtrlDelayHighGain} />
            <PatchFieldSlider field={mfx.timeCtrlDelayBalance} />
            <PatchFieldSlider field={mfx.timeCtrlDelayLevel} />
          </>
        )}
        {mfxType === "LOFI COMPRESS" && (
          <>
            <PatchFieldSlider field={mfx.lofiCompressPreFilterType} />
            <PatchFieldSlider field={mfx.lofiCompressLoFiType} />
            <PatchFieldPicker field={mfx.lofiCompressPostFilterType} />
            <PatchFieldPicker field={mfx.lofiCompressPostFilterCutoff} />
            <PatchFieldSlider field={mfx.lofiCompressLowGain} />
            <PatchFieldSlider field={mfx.lofiCompressHighGain} />
            <PatchFieldSlider field={mfx.lofiCompressBalance} />
            <PatchFieldSlider field={mfx.lofiCompressLevel} />
          </>
        )}
        {mfxType === "PITCH SHIFTER" && (
          <>
            <PatchFieldSlider field={mfx.pitchShifterCoarse} />
            <PatchFieldSlider field={mfx.pitchShifterFine} />
            <TimeOrNoteField
              syncSwitchField={mfx.pitchShifterDelayTimeSyncSw}
              noteField={mfx.pitchShifterDelayTimeNote}
              timeField={mfx.pitchShifterDelayTime}
            />
            <PatchFieldSlider field={mfx.pitchShifterFeedback} />
            <PatchFieldSlider field={mfx.pitchShifterLowGain} />
            <PatchFieldSlider field={mfx.pitchShifterHighGain} />
            <PatchFieldSlider field={mfx.pitchShifterBalance} />
            <PatchFieldSlider field={mfx.pitchShifterLevel} />
          </>
        )}
      </PatchFieldSwitchedSection>
    </ScrollView>
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
  const [syncSwitch, setSyncSwitch] = usePatchField(syncSwitchField, false);
  return (
    <>
      <PatchFieldSwitchControlled
        field={syncSwitchField}
        value={syncSwitch}
        onValueChange={setSyncSwitch}
      />
      {syncSwitch ? (
        <PatchFieldPicker field={noteField} />
      ) : (
        <PatchFieldSlider field={timeField} />
      )}
    </>
  );
}

function GuitarAmpSimSection() {
  const [gtrAmpSimPreAmpType, setGtrAmpSimPreAmpType] = usePatchField(
    mfx.gtrAmpSimPreAmpType,
    mfx.gtrAmpSimPreAmpType.definition.type.labels[0]
  );
  return (
    <>
      <PatchFieldSwitchedSection field={mfx.gtrAmpSimPreAmpSw}>
        <PatchFieldPickerControlled
          field={mfx.gtrAmpSimPreAmpType}
          value={gtrAmpSimPreAmpType}
          onValueChange={setGtrAmpSimPreAmpType}
        />
        <PatchFieldSlider field={mfx.gtrAmpSimPreAmpVolume} />
        <PatchFieldSlider field={mfx.gtrAmpSimPreAmpMaster} />
        <PatchFieldPicker field={mfx.gtrAmpSimPreAmpGain} />
        <PatchFieldSlider field={mfx.gtrAmpSimPreAmpBass} />
        <PatchFieldSlider field={mfx.gtrAmpSimPreAmpMiddle} />
        <PatchFieldSlider field={mfx.gtrAmpSimPreAmpTreble} />
        <PatchFieldSlider field={mfx.gtrAmpSimPreAmpPresence} />
        {(gtrAmpSimPreAmpType === "JC-120" ||
          gtrAmpSimPreAmpType === "CLEAN TWIN" ||
          gtrAmpSimPreAmpType === "BG LEAD") && (
          <PatchFieldSwitch field={mfx.gtrAmpSimPreAmpBright} />
        )}
      </PatchFieldSwitchedSection>
      <PatchFieldSwitchedSection field={mfx.gtrAmpSimSpeakerSw}>
        <PatchFieldPicker field={mfx.gtrAmpSimSpeakerType} />
        <PatchFieldPicker field={mfx.gtrAmpSimMicSetting} />
        <PatchFieldSlider field={mfx.gtrAmpSimMicLevel} />
      </PatchFieldSwitchedSection>
      <PatchFieldSlider field={mfx.gtrAmpSimDirectLevel} />
      <PatchFieldSlider field={mfx.gtrAmpSimPan} />
      <PatchFieldSlider field={mfx.gtrAmpSimLevel} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});

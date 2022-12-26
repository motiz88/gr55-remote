import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { useContext } from "react";
import { ScrollView, StyleSheet } from "react-native";

import { PatchFieldPicker } from "./PatchFieldPicker";
import { PatchFieldPlaceholder } from "./PatchFieldPlaceholder";
import { PatchFieldSegmentedPicker } from "./PatchFieldSegmentedPicker";
import { PatchFieldSegmentedSwitch } from "./PatchFieldSegmentedSwitch";
import { PatchFieldSlider } from "./PatchFieldSlider";
import { PatchFieldSwitch } from "./PatchFieldSwitch";
import { PatchFieldSwitchedSection } from "./PatchFieldSwitchedSection";
import { PatchFieldWaveShapePicker } from "./PatchFieldWaveShapePicker";
import { RefreshControl } from "./RefreshControl";
import { RolandGR55AddressMapAbsolute as GR55 } from "./RolandGR55AddressMap";
import { RolandRemotePatchContext } from "./RolandRemotePatchContext";
import { useMainScrollViewSafeAreaStyle } from "./SafeAreaUtils";
import { PatchToneTabParamList } from "./navigation";
import { useGR55GuitarBassSelect } from "./useGR55GuitarBassSelect";
import { usePatchField } from "./usePatchField";

const { modelingTone } = GR55.temporaryPatch;

export function PatchToneModelingScreen({
  navigation,
}: MaterialTopTabScreenProps<PatchToneTabParamList, "Modeling">) {
  // TODO: loading states for system and patch data (Suspense?)
  const [guitarBassSelect = "GUITAR"] = useGR55GuitarBassSelect();

  const { reloadPatchData } = useContext(RolandRemotePatchContext);

  const [toneCategory_guitar, setToneCategory_guitar] = usePatchField(
    modelingTone.toneCategory_guitar
  );

  const [toneCategory_bass, setToneCategory_bass] = usePatchField(
    modelingTone.toneCategory_bass
  );

  const [pitchShiftString1, setPitchShiftString1] = usePatchField(
    modelingTone.pitchShiftString1,
    0
  );

  const [pitchShiftFineString1, setPitchShiftFineString1] = usePatchField(
    modelingTone.pitchShiftFineString1,
    0
  );

  const [altTuneSwitch] = usePatchField(
    GR55.temporaryPatch.common.altTuneSwitch,
    false
  );

  const hide12StringControls =
    pitchShiftString1 !== 0 ||
    pitchShiftFineString1 !== 0 ||
    (guitarBassSelect === "GUITAR" && toneCategory_guitar === "E.BASS") ||
    (guitarBassSelect === "BASS" && toneCategory_bass === "E.GTR") ||
    altTuneSwitch;

  const [toneNumberEGtr_guitar, setToneNumberEGtr_guitar] = usePatchField(
    modelingTone.toneNumberEGtr_guitar
  );

  const [toneNumberAc_guitar, setToneNumberAc_guitar] = usePatchField(
    modelingTone.toneNumberAc_guitar
  );

  const [toneNumberEBass_guitar, setToneNumberEBass_guitar] = usePatchField(
    modelingTone.toneNumberEBass_guitar
  );

  const [toneNumberSynth_guitar, setToneNumberSynth_guitar] = usePatchField(
    modelingTone.toneNumberSynth_guitar
  );

  const [toneNumberEBass_bass, setToneNumberEBass_bass] = usePatchField(
    modelingTone.toneNumberEBass_bass
  );

  const [toneNumberEGtr_bass, setToneNumberEGtr_bass] = usePatchField(
    modelingTone.toneNumberEGtr_bass
  );

  const [toneNumberSynth_bass, setToneNumberSynth_bass] = usePatchField(
    modelingTone.toneNumberSynth_bass
  );

  const hideNoiseSuppressorControls =
    (guitarBassSelect === "GUITAR" &&
      ((toneCategory_guitar === "AC" && toneNumberAc_guitar === "NYLON") ||
        (toneCategory_guitar === "AC" && toneNumberAc_guitar === "SITAR") ||
        toneCategory_guitar === "SYNTH")) ||
    (guitarBassSelect === "BASS" && toneCategory_bass === "SYNTH");

  const safeAreaStyle = useMainScrollViewSafeAreaStyle();

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={reloadPatchData} />
      }
      style={[styles.container]}
      contentContainerStyle={safeAreaStyle}
    >
      <PatchFieldSwitchedSection field={modelingTone.muteSwitch}>
        {guitarBassSelect === "GUITAR" && (
          <>
            <PatchFieldSegmentedPicker
              field={modelingTone.toneCategory_guitar}
              value={toneCategory_guitar}
              onValueChange={setToneCategory_guitar}
            />
            {toneCategory_guitar === "E.GTR" && (
              <PatchFieldPicker
                field={modelingTone.toneNumberEGtr_guitar}
                value={toneNumberEGtr_guitar}
                onValueChange={setToneNumberEGtr_guitar}
              />
            )}
            {toneCategory_guitar === "AC" && (
              <PatchFieldPicker
                field={modelingTone.toneNumberAc_guitar}
                value={toneNumberAc_guitar}
                onValueChange={setToneNumberAc_guitar}
              />
            )}
            {toneCategory_guitar === "E.BASS" && (
              <PatchFieldPicker
                field={modelingTone.toneNumberEBass_guitar}
                value={toneNumberEBass_guitar}
                onValueChange={setToneNumberEBass_guitar}
              />
            )}
            {toneCategory_guitar === "SYNTH" && (
              <PatchFieldPicker
                field={modelingTone.toneNumberSynth_guitar}
                value={toneNumberSynth_guitar}
                onValueChange={setToneNumberSynth_guitar}
              />
            )}
          </>
        )}
        {guitarBassSelect === "BASS" && (
          <>
            <PatchFieldSegmentedPicker
              field={modelingTone.toneCategory_bass}
              value={toneCategory_bass}
              onValueChange={setToneCategory_bass}
            />
            {toneCategory_bass === "E.BASS" && (
              <PatchFieldPicker
                field={modelingTone.toneNumberEBass_bass}
                value={toneNumberEBass_bass}
                onValueChange={setToneNumberEBass_bass}
              />
            )}
            {toneCategory_bass === "SYNTH" && (
              <PatchFieldPicker
                field={modelingTone.toneNumberSynth_bass}
                value={toneNumberSynth_bass}
                onValueChange={setToneNumberSynth_bass}
              />
            )}
            {toneCategory_bass === "E.GTR" && (
              <PatchFieldPicker
                field={modelingTone.toneNumberEGtr_bass}
                value={toneNumberEGtr_bass}
                onValueChange={setToneNumberEGtr_bass}
              />
            )}
          </>
        )}
        <PatchFieldSlider field={modelingTone.level} />
        {/* TODO: different string controls for guitar/bass mode? */}
        <PatchFieldSlider field={modelingTone.string1Level} />
        <PatchFieldSlider field={modelingTone.string2Level} />
        <PatchFieldSlider field={modelingTone.string3Level} />
        <PatchFieldSlider field={modelingTone.string4Level} />
        <PatchFieldSlider field={modelingTone.string5Level} />
        <PatchFieldSlider field={modelingTone.string6Level} />
        <PatchFieldSlider
          field={modelingTone.pitchShiftString1}
          value={pitchShiftString1}
          onValueChange={setPitchShiftString1}
        />
        <PatchFieldSlider
          field={modelingTone.pitchShiftFineString1}
          value={pitchShiftFineString1}
          onValueChange={setPitchShiftFineString1}
        />
        {hide12StringControls ? (
          <>
            <PatchFieldPlaceholder>
              12-String mode not available with the current settings
            </PatchFieldPlaceholder>
          </>
        ) : (
          <>
            <PatchFieldSwitchedSection field={modelingTone.twelveStrSwitch}>
              <PatchFieldSlider field={modelingTone.twelveStrDirectLevel} />
              <PatchFieldSlider field={modelingTone.twelveStrShiftString1} />
              <PatchFieldSlider field={modelingTone.twelveStrFineString1} />
              <PatchFieldSlider field={modelingTone.twelveStrShiftString2} />
              <PatchFieldSlider field={modelingTone.twelveStrFineString2} />
              <PatchFieldSlider field={modelingTone.twelveStrShiftString3} />
              <PatchFieldSlider field={modelingTone.twelveStrFineString3} />
              <PatchFieldSlider field={modelingTone.twelveStrShiftString4} />
              <PatchFieldSlider field={modelingTone.twelveStrFineString4} />
              <PatchFieldSlider field={modelingTone.twelveStrShiftString5} />
              <PatchFieldSlider field={modelingTone.twelveStrFineString5} />
              <PatchFieldSlider field={modelingTone.twelveStrShiftString6} />
              <PatchFieldSlider field={modelingTone.twelveStrFineString6} />
            </PatchFieldSwitchedSection>
          </>
        )}
        {guitarBassSelect === "GUITAR" && toneCategory_guitar === "E.GTR" && (
          <>
            {(toneNumberEGtr_guitar === "CLA-ST" ||
              toneNumberEGtr_guitar === "MOD-ST") && (
              <PatchFieldPicker
                field={modelingTone.eGuitarPickupSelect5_guitar}
              />
            )}
            {(toneNumberEGtr_guitar === "H&H-ST" ||
              toneNumberEGtr_guitar === "TE" ||
              toneNumberEGtr_guitar === "LP" ||
              toneNumberEGtr_guitar === "P-90" ||
              toneNumberEGtr_guitar === "RICK" ||
              toneNumberEGtr_guitar === "335" ||
              toneNumberEGtr_guitar === "L4") && (
              <PatchFieldPicker
                field={modelingTone.eGuitarPickupSelect3_guitar}
              />
            )}
            {toneNumberEGtr_guitar === "LIPS" && (
              <PatchFieldPicker
                field={modelingTone.eGuitarPickupSelectLips_guitar}
              />
            )}
            <PatchFieldSlider field={modelingTone.eGuitarVolume_guitar} />
            <PatchFieldSlider field={modelingTone.eGuitarTone_guitar} />
          </>
        )}
        {guitarBassSelect === "GUITAR" &&
          toneCategory_guitar === "AC" &&
          toneNumberAc_guitar === "STEEL" && (
            <>
              <PatchFieldPicker field={modelingTone.steelType_guitar} />
              <PatchFieldSlider field={modelingTone.steelBody_guitar} />
              <PatchFieldSlider field={modelingTone.steelTone_guitar} />
            </>
          )}
        {guitarBassSelect === "GUITAR" &&
          toneCategory_guitar === "AC" &&
          toneNumberAc_guitar === "NYLON" && (
            <>
              <PatchFieldSlider field={modelingTone.nylonBody_guitar} />
              <PatchFieldSlider field={modelingTone.nylonAttack_guitar} />
              <PatchFieldSlider field={modelingTone.nylonTone_guitar} />
            </>
          )}
        {guitarBassSelect === "GUITAR" &&
          toneCategory_guitar === "AC" &&
          toneNumberAc_guitar === "SITAR" && (
            <>
              <PatchFieldPicker field={modelingTone.sitarPickup_guitar} />
              <PatchFieldSlider field={modelingTone.sitarSens_guitar} />
              <PatchFieldSlider field={modelingTone.sitarBody_guitar} />
              <PatchFieldSlider field={modelingTone.sitarColor_guitar} />
              <PatchFieldSlider field={modelingTone.sitarDecay_guitar} />
              <PatchFieldSlider field={modelingTone.sitarBuzz_guitar} />
              <PatchFieldSlider field={modelingTone.sitarAttack_guitar} />
              <PatchFieldSlider field={modelingTone.sitarTone_guitar} />
            </>
          )}
        {guitarBassSelect === "GUITAR" &&
          toneCategory_guitar === "AC" &&
          toneNumberAc_guitar === "BANJO" && (
            <>
              <PatchFieldSlider field={modelingTone.banjoAttack_guitar} />
              <PatchFieldSlider field={modelingTone.banjoReso_guitar} />
              <PatchFieldSlider field={modelingTone.banjoTone_guitar} />
            </>
          )}
        {guitarBassSelect === "GUITAR" &&
          toneCategory_guitar === "AC" &&
          toneNumberAc_guitar === "RESO" && (
            <>
              <PatchFieldSlider field={modelingTone.resoSustain_guitar} />
              <PatchFieldSlider field={modelingTone.resoResonance_guitar} />
              <PatchFieldSlider field={modelingTone.resoTone_guitar} />
            </>
          )}
        {guitarBassSelect === "GUITAR" && toneCategory_guitar === "E.BASS" && (
          <>
            {toneNumberEBass_guitar === "JB" && (
              <>
                <PatchFieldSlider field={modelingTone.eBassRearVolume_guitar} />
                <PatchFieldSlider
                  field={modelingTone.eBassFrontVolume_guitar}
                />
              </>
            )}
            <PatchFieldSlider field={modelingTone.eBassVolume_guitar} />
            <PatchFieldSlider field={modelingTone.eBassTone_guitar} />
          </>
        )}
        {(guitarBassSelect === "GUITAR"
          ? toneCategory_guitar
          : toneCategory_bass) === "SYNTH" && (
          <>
            {(guitarBassSelect === "GUITAR"
              ? toneNumberSynth_guitar
              : toneNumberSynth_bass) === "ANALOG GR" && (
              <>
                <PatchFieldPicker
                  field={
                    guitarBassSelect === "GUITAR"
                      ? modelingTone.gr300Mode_guitar
                      : modelingTone.gr300Mode_bass
                  }
                />
                <PatchFieldSwitch
                  field={
                    guitarBassSelect === "GUITAR"
                      ? modelingTone.gr300Comp_guitar
                      : modelingTone.gr300Comp_bass
                  }
                />
                <PatchFieldSlider
                  field={
                    guitarBassSelect === "GUITAR"
                      ? modelingTone.gr300Cutoff_guitar
                      : modelingTone.gr300Cutoff_bass
                  }
                />
                <PatchFieldSlider
                  field={
                    guitarBassSelect === "GUITAR"
                      ? modelingTone.gr300Resonance_guitar
                      : modelingTone.gr300Resonance_bass
                  }
                />
                <PatchFieldPicker
                  field={
                    guitarBassSelect === "GUITAR"
                      ? modelingTone.gr300EnvModSwitch_guitar
                      : modelingTone.gr300EnvModSwitch_bass
                  }
                />
                <PatchFieldSlider
                  field={
                    guitarBassSelect === "GUITAR"
                      ? modelingTone.gr300EnvModSens_guitar
                      : modelingTone.gr300EnvModSens_bass
                  }
                />
                <PatchFieldSlider
                  field={
                    guitarBassSelect === "GUITAR"
                      ? modelingTone.gr300EnvModAttack_guitar
                      : modelingTone.gr300EnvModAttack_bass
                  }
                />
                <PatchFieldPicker
                  field={
                    guitarBassSelect === "GUITAR"
                      ? modelingTone.gr300PitchSwitch_guitar
                      : modelingTone.gr300PitchSwitch_bass
                  }
                />
                <PatchFieldSlider
                  field={
                    guitarBassSelect === "GUITAR"
                      ? modelingTone.gr300PitchA_guitar
                      : modelingTone.gr300PitchA_bass
                  }
                />
                <PatchFieldSlider
                  field={
                    guitarBassSelect === "GUITAR"
                      ? modelingTone.gr300PitchAFine_guitar
                      : modelingTone.gr300PitchAFine_bass
                  }
                />
                <PatchFieldSlider
                  field={
                    guitarBassSelect === "GUITAR"
                      ? modelingTone.gr300PitchB_guitar
                      : modelingTone.gr300PitchB_bass
                  }
                />
                <PatchFieldSlider
                  field={
                    guitarBassSelect === "GUITAR"
                      ? modelingTone.gr300PitchBFine_guitar
                      : modelingTone.gr300PitchBFine_bass
                  }
                />
                <PatchFieldSwitch
                  field={
                    guitarBassSelect === "GUITAR"
                      ? modelingTone.gr300PitchDuet_guitar
                      : modelingTone.gr300PitchDuet_bass
                  }
                />
                <PatchFieldSwitchedSection
                  field={
                    guitarBassSelect === "GUITAR"
                      ? modelingTone.gr300SweepSwitch_guitar
                      : modelingTone.gr300SweepSwitch_bass
                  }
                >
                  <PatchFieldSlider
                    field={
                      guitarBassSelect === "GUITAR"
                        ? modelingTone.gr300SweepRise_guitar
                        : modelingTone.gr300SweepRise_bass
                    }
                  />
                  <PatchFieldSlider
                    field={
                      guitarBassSelect === "GUITAR"
                        ? modelingTone.gr300SweepFall_guitar
                        : modelingTone.gr300SweepFall_bass
                    }
                  />
                </PatchFieldSwitchedSection>
                <PatchFieldSwitchedSection
                  field={
                    guitarBassSelect === "GUITAR"
                      ? modelingTone.gr300VibratoSwitch_guitar
                      : modelingTone.gr300VibratoSwitch_bass
                  }
                >
                  <PatchFieldSlider
                    field={
                      guitarBassSelect === "GUITAR"
                        ? modelingTone.gr300VibratoRate_guitar
                        : modelingTone.gr300VibratoRate_bass
                    }
                  />
                  <PatchFieldSlider
                    field={
                      guitarBassSelect === "GUITAR"
                        ? modelingTone.gr300VibratoDepth_guitar
                        : modelingTone.gr300VibratoDepth_bass
                    }
                  />
                </PatchFieldSwitchedSection>
              </>
            )}
            {(guitarBassSelect === "GUITAR"
              ? toneNumberSynth_guitar
              : toneNumberSynth_bass) === "WAVE SYNTH" && (
              <>
                <PatchFieldWaveShapePicker
                  field={
                    guitarBassSelect === "GUITAR"
                      ? modelingTone.waveSynthType_guitar
                      : modelingTone.waveSynthType_bass
                  }
                />
                <PatchFieldSlider
                  field={
                    guitarBassSelect === "GUITAR"
                      ? modelingTone.waveSynthColor_guitar
                      : modelingTone.waveSynthColor_bass
                  }
                />
              </>
            )}
            {(guitarBassSelect === "GUITAR"
              ? toneNumberSynth_guitar
              : toneNumberSynth_bass) === "FILTER BASS" && (
              <>
                <PatchFieldSlider
                  field={
                    guitarBassSelect === "GUITAR"
                      ? modelingTone.filterBassCutoff_guitar
                      : modelingTone.filterBassCutoff_bass
                  }
                />
                <PatchFieldSlider
                  field={
                    guitarBassSelect === "GUITAR"
                      ? modelingTone.filterBassResonance_guitar
                      : modelingTone.filterBassResonance_bass
                  }
                />
                <PatchFieldSlider
                  field={
                    guitarBassSelect === "GUITAR"
                      ? modelingTone.filterBassFilterDecay_guitar
                      : modelingTone.filterBassFilterDecay_bass
                  }
                />
                <PatchFieldSlider
                  field={
                    guitarBassSelect === "GUITAR"
                      ? modelingTone.filterBassTouchSens_guitar
                      : modelingTone.filterBassTouchSens_bass
                  }
                />
                <PatchFieldSlider
                  field={
                    guitarBassSelect === "GUITAR"
                      ? modelingTone.filterBassColor_guitar
                      : modelingTone.filterBassColor_bass
                  }
                />
              </>
            )}
            {(guitarBassSelect === "GUITAR"
              ? toneNumberSynth_guitar
              : toneNumberSynth_bass) === "CRYSTAL" && (
              <>
                <PatchFieldSlider
                  field={
                    guitarBassSelect === "GUITAR"
                      ? modelingTone.crystalAttackLength_guitar
                      : modelingTone.crystalAttackLength_bass
                  }
                />
                <PatchFieldSlider
                  field={
                    guitarBassSelect === "GUITAR"
                      ? modelingTone.crystalModTune_guitar
                      : modelingTone.crystalModTune_bass
                  }
                />
                <PatchFieldSlider
                  field={
                    guitarBassSelect === "GUITAR"
                      ? modelingTone.crystalModDepth_guitar
                      : modelingTone.crystalModDepth_bass
                  }
                />
                <PatchFieldSlider
                  field={
                    guitarBassSelect === "GUITAR"
                      ? modelingTone.crystalAttackLevel_guitar
                      : modelingTone.crystalAttackLevel_bass
                  }
                />
                <PatchFieldSlider
                  field={
                    guitarBassSelect === "GUITAR"
                      ? modelingTone.crystalBody_guitar
                      : modelingTone.crystalBody_bass
                  }
                />
                <PatchFieldSlider
                  field={
                    guitarBassSelect === "GUITAR"
                      ? modelingTone.crystalSustain_guitar
                      : modelingTone.crystalSustain_bass
                  }
                />
              </>
            )}
            {(guitarBassSelect === "GUITAR"
              ? toneNumberSynth_guitar
              : toneNumberSynth_bass) === "ORGAN" && (
              <>
                <PatchFieldSlider
                  field={
                    guitarBassSelect === "GUITAR"
                      ? modelingTone.organFeet16_guitar
                      : modelingTone.organFeet16_bass
                  }
                />
                <PatchFieldSlider
                  field={
                    guitarBassSelect === "GUITAR"
                      ? modelingTone.organFeet8_guitar
                      : modelingTone.organFeet8_bass
                  }
                />
                <PatchFieldSlider
                  field={
                    guitarBassSelect === "GUITAR"
                      ? modelingTone.organFeet4_guitar
                      : modelingTone.organFeet4_bass
                  }
                />
                <PatchFieldSlider
                  field={
                    guitarBassSelect === "GUITAR"
                      ? modelingTone.organSustain_guitar
                      : modelingTone.organSustain_bass
                  }
                />
              </>
            )}
            {(guitarBassSelect === "GUITAR"
              ? toneNumberSynth_guitar
              : toneNumberSynth_bass) === "BRASS" && (
              <>
                <PatchFieldSlider
                  field={
                    guitarBassSelect === "GUITAR"
                      ? modelingTone.brassCutoff_guitar
                      : modelingTone.brassCutoff_bass
                  }
                />
                <PatchFieldSlider
                  field={
                    guitarBassSelect === "GUITAR"
                      ? modelingTone.brassResonance_guitar
                      : modelingTone.brassResonance_bass
                  }
                />
                <PatchFieldSlider
                  field={
                    guitarBassSelect === "GUITAR"
                      ? modelingTone.brassTouchSens_guitar
                      : modelingTone.brassTouchSens_bass
                  }
                />
                <PatchFieldSlider
                  field={
                    guitarBassSelect === "GUITAR"
                      ? modelingTone.brassSustain_guitar
                      : modelingTone.brassSustain_bass
                  }
                />
              </>
            )}
          </>
        )}
        {guitarBassSelect === "BASS" && toneCategory_bass === "E.GTR" && (
          <>
            {toneNumberEGtr_bass === "ST" && (
              <PatchFieldPicker
                field={modelingTone.eGuitarPickupSelect5_bass}
              />
            )}
            {toneNumberEGtr_bass === "LP" && (
              <PatchFieldPicker
                field={modelingTone.eGuitarPickupSelect3_bass}
              />
            )}
            <PatchFieldSlider field={modelingTone.eGuitarVolume_bass} />
            <PatchFieldSlider field={modelingTone.eGuitarTone_bass} />
          </>
        )}
        {guitarBassSelect === "BASS" && toneCategory_bass === "E.BASS" && (
          <>
            {(toneNumberEBass_bass === "JB" ||
              toneNumberEBass_bass === "VINT JB" ||
              toneNumberEBass_bass === "T-BIRD") && (
              <>
                <PatchFieldSlider field={modelingTone.eBassRearVolume_bass} />
                <PatchFieldSlider field={modelingTone.eBassFrontVolume_bass} />
                <PatchFieldSlider field={modelingTone.eBassVolume_bass} />
                <PatchFieldSlider field={modelingTone.eBassTone_bass} />
              </>
            )}
            {(toneNumberEBass_bass === "PB" ||
              toneNumberEBass_bass === "VINT PB") && (
              <>
                <PatchFieldSlider field={modelingTone.eBassVolume_bass} />
                <PatchFieldSlider field={modelingTone.eBassTone_bass} />
              </>
            )}
            {toneNumberEBass_bass === "M-MAN" && (
              <>
                <PatchFieldSlider field={modelingTone.eBassTreble_bass} />
                <PatchFieldSlider field={modelingTone.eBassBass_bass} />
                <PatchFieldSlider field={modelingTone.eBassVolume_bass} />
              </>
            )}
            {toneNumberEBass_bass === "RICK" && (
              <>
                <PatchFieldSlider field={modelingTone.eBassRearVolume_bass} />
                <PatchFieldSlider field={modelingTone.eBassFrontVolume_bass} />
                <PatchFieldSlider field={modelingTone.eBassRearTone_bass} />
                <PatchFieldSlider field={modelingTone.eBassFrontTone_bass} />
                <PatchFieldSlider field={modelingTone.eBassVolume_bass} />
                <PatchFieldPicker field={modelingTone.eBassPickupSelect_bass} />
              </>
            )}
            {toneNumberEBass_bass === "ACTIVE" && (
              <>
                <PatchFieldSlider field={modelingTone.eBassRearVolume_bass} />
                <PatchFieldSlider field={modelingTone.eBassFrontVolume_bass} />
                <PatchFieldSlider field={modelingTone.eBassTreble_bass} />
                <PatchFieldSlider field={modelingTone.eBassBass_bass} />
                <PatchFieldSlider field={modelingTone.eBassVolume_bass} />
              </>
            )}
            {toneNumberEBass_bass === "VIOLIN" && (
              <>
                <PatchFieldSlider field={modelingTone.eBassRearVolume_bass} />
                <PatchFieldSlider field={modelingTone.eBassFrontVolume_bass} />
                <PatchFieldSlider field={modelingTone.eBassVolume_bass} />
                <PatchFieldSwitch field={modelingTone.eBassTrebleSwitch_bass} />
                <PatchFieldSwitch field={modelingTone.eBassBassSwitch_bass} />
                <PatchFieldSegmentedSwitch
                  field={modelingTone.eBassRhythmSoloSwitch_bass}
                />
              </>
            )}
          </>
        )}
        {!hideNoiseSuppressorControls && (
          <PatchFieldSwitchedSection field={modelingTone.nsSwitch}>
            <PatchFieldSlider field={modelingTone.nsThreshold} />
            <PatchFieldSlider field={modelingTone.nsRelease} />
          </PatchFieldSwitchedSection>
        )}
      </PatchFieldSwitchedSection>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});

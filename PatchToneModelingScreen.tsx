import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { useContext } from "react";
import { StyleSheet } from "react-native";

import { FieldPlaceholder } from "./FieldPlaceholder";
import { PopoverAwareScrollView } from "./PopoverAwareScrollView";
import { RefreshControl } from "./RefreshControl";
import { RemoteFieldPicker } from "./RemoteFieldPicker";
import { RemoteFieldSegmentedPicker } from "./RemoteFieldSegmentedPicker";
import { RemoteFieldSegmentedSwitch } from "./RemoteFieldSegmentedSwitch";
import { RemoteFieldSlider } from "./RemoteFieldSlider";
import { RemoteFieldSwitch } from "./RemoteFieldSwitch";
import { RemoteFieldSwitchedSection } from "./RemoteFieldSwitchedSection";
import { RemoteFieldWaveShapePicker } from "./RemoteFieldWaveShapePicker";
import { ValueOf } from "./RolandAddressMap";
import { RolandGR55AddressMapAbsolute as GR55 } from "./RolandGR55AddressMap";
import {
  RolandRemoteSystemContext as SYSTEM,
  RolandRemotePatchContext as PATCH,
} from "./RolandRemotePageContext";
import { useMainScrollViewSafeAreaStyle } from "./SafeAreaUtils";
import { PatchToneTabParamList } from "./navigation";
import { useRemoteField } from "./useRemoteField";

const { modelingTone } = GR55.temporaryPatch;

export function PatchToneModelingScreen({
  navigation,
}: MaterialTopTabScreenProps<PatchToneTabParamList, "Modeling">) {
  const [guitarBassSelect] = useRemoteField(
    SYSTEM,
    GR55.system.common.guitarBassSelect
  );

  const { reloadData } = useContext(PATCH);

  const [toneCategory_guitar, setToneCategory_guitar] = useRemoteField(
    PATCH,
    modelingTone.toneCategory_guitar
  );

  const [toneCategory_bass, setToneCategory_bass] = useRemoteField(
    PATCH,
    modelingTone.toneCategory_bass
  );

  const [pitchShiftString1, setPitchShiftString1] = useRemoteField(
    PATCH,
    modelingTone.pitchShiftString1
  );

  const [pitchShiftFineString1, setPitchShiftFineString1] = useRemoteField(
    PATCH,
    modelingTone.pitchShiftFineString1
  );

  const [altTuneSwitch] = useRemoteField(
    PATCH,
    GR55.temporaryPatch.common.altTuneSwitch
  );

  const hide12StringControls =
    pitchShiftString1 !== 0 ||
    pitchShiftFineString1 !== 0 ||
    (guitarBassSelect === "GUITAR" && toneCategory_guitar === "E.BASS") ||
    (guitarBassSelect === "BASS" && toneCategory_bass === "E.GTR") ||
    altTuneSwitch;

  const [toneNumberEGtr_guitar, setToneNumberEGtr_guitar] = useRemoteField(
    PATCH,
    modelingTone.toneNumberEGtr_guitar
  );

  const [toneNumberAc_guitar, setToneNumberAc_guitar] = useRemoteField(
    PATCH,
    modelingTone.toneNumberAc_guitar
  );

  const [toneNumberEBass_guitar, setToneNumberEBass_guitar] = useRemoteField(
    PATCH,
    modelingTone.toneNumberEBass_guitar
  );

  const [toneNumberSynth_guitar, setToneNumberSynth_guitar] = useRemoteField(
    PATCH,
    modelingTone.toneNumberSynth_guitar
  );

  const [toneNumberEBass_bass, setToneNumberEBass_bass] = useRemoteField(
    PATCH,
    modelingTone.toneNumberEBass_bass
  );

  const [toneNumberEGtr_bass, setToneNumberEGtr_bass] = useRemoteField(
    PATCH,
    modelingTone.toneNumberEGtr_bass
  );

  const [toneNumberSynth_bass, setToneNumberSynth_bass] = useRemoteField(
    PATCH,
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
    <PopoverAwareScrollView
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={reloadData} />
      }
      style={[styles.container]}
      contentContainerStyle={safeAreaStyle}
    >
      <RemoteFieldSwitchedSection page={PATCH} field={modelingTone.muteSwitch}>
        {guitarBassSelect === "GUITAR" && (
          <>
            <RemoteFieldSegmentedPicker
              page={PATCH}
              field={modelingTone.toneCategory_guitar}
              value={toneCategory_guitar}
              onValueChange={setToneCategory_guitar}
            />
            {toneCategory_guitar === "E.GTR" && (
              <RemoteFieldPicker
                page={PATCH}
                field={modelingTone.toneNumberEGtr_guitar}
                value={toneNumberEGtr_guitar}
                onValueChange={setToneNumberEGtr_guitar}
              />
            )}
            {toneCategory_guitar === "AC" && (
              <RemoteFieldPicker
                page={PATCH}
                field={modelingTone.toneNumberAc_guitar}
                value={toneNumberAc_guitar}
                onValueChange={setToneNumberAc_guitar}
              />
            )}
            {toneCategory_guitar === "E.BASS" && (
              <RemoteFieldPicker
                page={PATCH}
                field={modelingTone.toneNumberEBass_guitar}
                value={toneNumberEBass_guitar}
                onValueChange={setToneNumberEBass_guitar}
              />
            )}
            {toneCategory_guitar === "SYNTH" && (
              <RemoteFieldPicker
                page={PATCH}
                field={modelingTone.toneNumberSynth_guitar}
                value={toneNumberSynth_guitar}
                onValueChange={setToneNumberSynth_guitar}
              />
            )}
          </>
        )}
        {guitarBassSelect === "BASS" && (
          <>
            <RemoteFieldSegmentedPicker
              page={PATCH}
              field={modelingTone.toneCategory_bass}
              value={toneCategory_bass}
              onValueChange={setToneCategory_bass}
            />
            {toneCategory_bass === "E.BASS" && (
              <RemoteFieldPicker
                page={PATCH}
                field={modelingTone.toneNumberEBass_bass}
                value={toneNumberEBass_bass}
                onValueChange={setToneNumberEBass_bass}
              />
            )}
            {toneCategory_bass === "SYNTH" && (
              <RemoteFieldPicker
                page={PATCH}
                field={modelingTone.toneNumberSynth_bass}
                value={toneNumberSynth_bass}
                onValueChange={setToneNumberSynth_bass}
              />
            )}
            {toneCategory_bass === "E.GTR" && (
              <RemoteFieldPicker
                page={PATCH}
                field={modelingTone.toneNumberEGtr_bass}
                value={toneNumberEGtr_bass}
                onValueChange={setToneNumberEGtr_bass}
              />
            )}
          </>
        )}
        <RemoteFieldSlider page={PATCH} field={modelingTone.level} />

        <PatchToneModelingDetails
          guitarBassSelect={guitarBassSelect}
          toneCategory_guitar={toneCategory_guitar}
          toneNumberEGtr_guitar={toneNumberEGtr_guitar}
          toneNumberAc_guitar={toneNumberAc_guitar}
          toneNumberEBass_guitar={toneNumberEBass_guitar}
          toneNumberSynth_guitar={toneNumberSynth_guitar}
          toneCategory_bass={toneCategory_bass}
          toneNumberEBass_bass={toneNumberEBass_bass}
          toneNumberEGtr_bass={toneNumberEGtr_bass}
          toneNumberSynth_bass={toneNumberSynth_bass}
        />

        {/* TODO: different string controls for guitar/bass mode? */}
        <RemoteFieldSlider page={PATCH} field={modelingTone.string1Level} />
        <RemoteFieldSlider page={PATCH} field={modelingTone.string2Level} />
        <RemoteFieldSlider page={PATCH} field={modelingTone.string3Level} />
        <RemoteFieldSlider page={PATCH} field={modelingTone.string4Level} />
        <RemoteFieldSlider page={PATCH} field={modelingTone.string5Level} />
        <RemoteFieldSlider page={PATCH} field={modelingTone.string6Level} />
        <RemoteFieldSlider
          page={PATCH}
          field={modelingTone.pitchShiftString1}
          value={pitchShiftString1}
          onValueChange={setPitchShiftString1}
        />
        <RemoteFieldSlider
          page={PATCH}
          field={modelingTone.pitchShiftFineString1}
          value={pitchShiftFineString1}
          onValueChange={setPitchShiftFineString1}
        />
        {hide12StringControls ? (
          <>
            <FieldPlaceholder>
              12-String mode not available with the current settings
            </FieldPlaceholder>
          </>
        ) : (
          <>
            <RemoteFieldSwitchedSection
              page={PATCH}
              field={modelingTone.twelveStrSwitch}
            >
              <RemoteFieldSlider
                page={PATCH}
                field={modelingTone.twelveStrDirectLevel}
              />
              <RemoteFieldSlider
                page={PATCH}
                field={modelingTone.twelveStrShiftString1}
              />
              <RemoteFieldSlider
                page={PATCH}
                field={modelingTone.twelveStrFineString1}
              />
              <RemoteFieldSlider
                page={PATCH}
                field={modelingTone.twelveStrShiftString2}
              />
              <RemoteFieldSlider
                page={PATCH}
                field={modelingTone.twelveStrFineString2}
              />
              <RemoteFieldSlider
                page={PATCH}
                field={modelingTone.twelveStrShiftString3}
              />
              <RemoteFieldSlider
                page={PATCH}
                field={modelingTone.twelveStrFineString3}
              />
              <RemoteFieldSlider
                page={PATCH}
                field={modelingTone.twelveStrShiftString4}
              />
              <RemoteFieldSlider
                page={PATCH}
                field={modelingTone.twelveStrFineString4}
              />
              <RemoteFieldSlider
                page={PATCH}
                field={modelingTone.twelveStrShiftString5}
              />
              <RemoteFieldSlider
                page={PATCH}
                field={modelingTone.twelveStrFineString5}
              />
              <RemoteFieldSlider
                page={PATCH}
                field={modelingTone.twelveStrShiftString6}
              />
              <RemoteFieldSlider
                page={PATCH}
                field={modelingTone.twelveStrFineString6}
              />
            </RemoteFieldSwitchedSection>
          </>
        )}
        {!hideNoiseSuppressorControls && (
          <RemoteFieldSwitchedSection
            page={PATCH}
            field={modelingTone.nsSwitch}
          >
            <RemoteFieldSlider page={PATCH} field={modelingTone.nsThreshold} />
            <RemoteFieldSlider page={PATCH} field={modelingTone.nsRelease} />
          </RemoteFieldSwitchedSection>
        )}
      </RemoteFieldSwitchedSection>
    </PopoverAwareScrollView>
  );
}

function PatchToneModelingDetails({
  guitarBassSelect,
  toneCategory_guitar,
  toneNumberEGtr_guitar,
  toneNumberAc_guitar,
  toneNumberEBass_guitar,
  toneNumberSynth_guitar,
  toneCategory_bass,
  toneNumberEBass_bass,
  toneNumberEGtr_bass,
  toneNumberSynth_bass,
}: {
  guitarBassSelect: ValueOf<typeof GR55.system.common.guitarBassSelect>;
  toneCategory_guitar: ValueOf<typeof modelingTone.toneCategory_guitar>;
  toneNumberEGtr_guitar: ValueOf<typeof modelingTone.toneNumberEGtr_guitar>;
  toneNumberAc_guitar: ValueOf<typeof modelingTone.toneNumberAc_guitar>;
  toneNumberEBass_guitar: ValueOf<typeof modelingTone.toneNumberEBass_guitar>;
  toneNumberSynth_guitar: ValueOf<typeof modelingTone.toneNumberSynth_guitar>;
  toneCategory_bass: ValueOf<typeof modelingTone.toneCategory_bass>;
  toneNumberEBass_bass: ValueOf<typeof modelingTone.toneNumberEBass_bass>;
  toneNumberEGtr_bass: ValueOf<typeof modelingTone.toneNumberEGtr_bass>;
  toneNumberSynth_bass: ValueOf<typeof modelingTone.toneNumberSynth_bass>;
}) {
  return (
    <>
      {guitarBassSelect === "GUITAR" && toneCategory_guitar === "E.GTR" && (
        <>
          {(toneNumberEGtr_guitar === "CLA-ST" ||
            toneNumberEGtr_guitar === "MOD-ST") && (
            <RemoteFieldPicker
              page={PATCH}
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
            <RemoteFieldPicker
              page={PATCH}
              field={modelingTone.eGuitarPickupSelect3_guitar}
            />
          )}
          {toneNumberEGtr_guitar === "LIPS" && (
            <RemoteFieldPicker
              page={PATCH}
              field={modelingTone.eGuitarPickupSelectLips_guitar}
            />
          )}
          <RemoteFieldSlider
            page={PATCH}
            field={modelingTone.eGuitarVolume_guitar}
          />
          <RemoteFieldSlider
            page={PATCH}
            field={modelingTone.eGuitarTone_guitar}
          />
        </>
      )}
      {guitarBassSelect === "GUITAR" &&
        toneCategory_guitar === "AC" &&
        toneNumberAc_guitar === "STEEL" && (
          <>
            <RemoteFieldPicker
              page={PATCH}
              field={modelingTone.steelType_guitar}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={modelingTone.steelBody_guitar}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={modelingTone.steelTone_guitar}
            />
          </>
        )}
      {guitarBassSelect === "GUITAR" &&
        toneCategory_guitar === "AC" &&
        toneNumberAc_guitar === "NYLON" && (
          <>
            <RemoteFieldSlider
              page={PATCH}
              field={modelingTone.nylonBody_guitar}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={modelingTone.nylonAttack_guitar}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={modelingTone.nylonTone_guitar}
            />
          </>
        )}
      {guitarBassSelect === "GUITAR" &&
        toneCategory_guitar === "AC" &&
        toneNumberAc_guitar === "SITAR" && (
          <>
            <RemoteFieldPicker
              page={PATCH}
              field={modelingTone.sitarPickup_guitar}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={modelingTone.sitarSens_guitar}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={modelingTone.sitarBody_guitar}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={modelingTone.sitarColor_guitar}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={modelingTone.sitarDecay_guitar}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={modelingTone.sitarBuzz_guitar}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={modelingTone.sitarAttack_guitar}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={modelingTone.sitarTone_guitar}
            />
          </>
        )}
      {guitarBassSelect === "GUITAR" &&
        toneCategory_guitar === "AC" &&
        toneNumberAc_guitar === "BANJO" && (
          <>
            <RemoteFieldSlider
              page={PATCH}
              field={modelingTone.banjoAttack_guitar}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={modelingTone.banjoReso_guitar}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={modelingTone.banjoTone_guitar}
            />
          </>
        )}
      {guitarBassSelect === "GUITAR" &&
        toneCategory_guitar === "AC" &&
        toneNumberAc_guitar === "RESO" && (
          <>
            <RemoteFieldSlider
              page={PATCH}
              field={modelingTone.resoSustain_guitar}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={modelingTone.resoResonance_guitar}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={modelingTone.resoTone_guitar}
            />
          </>
        )}
      {guitarBassSelect === "GUITAR" && toneCategory_guitar === "E.BASS" && (
        <>
          {toneNumberEBass_guitar === "JB" && (
            <>
              <RemoteFieldSlider
                page={PATCH}
                field={modelingTone.eBassRearVolume_guitar}
              />
              <RemoteFieldSlider
                page={PATCH}
                field={modelingTone.eBassFrontVolume_guitar}
              />
            </>
          )}
          <RemoteFieldSlider
            page={PATCH}
            field={modelingTone.eBassVolume_guitar}
          />
          <RemoteFieldSlider
            page={PATCH}
            field={modelingTone.eBassTone_guitar}
          />
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
              <RemoteFieldPicker
                page={PATCH}
                field={
                  guitarBassSelect === "GUITAR"
                    ? modelingTone.gr300Mode_guitar
                    : modelingTone.gr300Mode_bass
                }
              />
              <RemoteFieldSwitch
                page={PATCH}
                field={
                  guitarBassSelect === "GUITAR"
                    ? modelingTone.gr300Comp_guitar
                    : modelingTone.gr300Comp_bass
                }
              />
              <RemoteFieldSlider
                page={PATCH}
                field={
                  guitarBassSelect === "GUITAR"
                    ? modelingTone.gr300Cutoff_guitar
                    : modelingTone.gr300Cutoff_bass
                }
              />
              <RemoteFieldSlider
                page={PATCH}
                field={
                  guitarBassSelect === "GUITAR"
                    ? modelingTone.gr300Resonance_guitar
                    : modelingTone.gr300Resonance_bass
                }
              />
              <RemoteFieldPicker
                page={PATCH}
                field={
                  guitarBassSelect === "GUITAR"
                    ? modelingTone.gr300EnvModSwitch_guitar
                    : modelingTone.gr300EnvModSwitch_bass
                }
              />
              <RemoteFieldSlider
                page={PATCH}
                field={
                  guitarBassSelect === "GUITAR"
                    ? modelingTone.gr300EnvModSens_guitar
                    : modelingTone.gr300EnvModSens_bass
                }
              />
              <RemoteFieldSlider
                page={PATCH}
                field={
                  guitarBassSelect === "GUITAR"
                    ? modelingTone.gr300EnvModAttack_guitar
                    : modelingTone.gr300EnvModAttack_bass
                }
              />
              <RemoteFieldPicker
                page={PATCH}
                field={
                  guitarBassSelect === "GUITAR"
                    ? modelingTone.gr300PitchSwitch_guitar
                    : modelingTone.gr300PitchSwitch_bass
                }
              />
              <RemoteFieldSlider
                page={PATCH}
                field={
                  guitarBassSelect === "GUITAR"
                    ? modelingTone.gr300PitchA_guitar
                    : modelingTone.gr300PitchA_bass
                }
              />
              <RemoteFieldSlider
                page={PATCH}
                field={
                  guitarBassSelect === "GUITAR"
                    ? modelingTone.gr300PitchAFine_guitar
                    : modelingTone.gr300PitchAFine_bass
                }
              />
              <RemoteFieldSlider
                page={PATCH}
                field={
                  guitarBassSelect === "GUITAR"
                    ? modelingTone.gr300PitchB_guitar
                    : modelingTone.gr300PitchB_bass
                }
              />
              <RemoteFieldSlider
                page={PATCH}
                field={
                  guitarBassSelect === "GUITAR"
                    ? modelingTone.gr300PitchBFine_guitar
                    : modelingTone.gr300PitchBFine_bass
                }
              />
              <RemoteFieldSwitch
                page={PATCH}
                field={
                  guitarBassSelect === "GUITAR"
                    ? modelingTone.gr300PitchDuet_guitar
                    : modelingTone.gr300PitchDuet_bass
                }
              />
              <RemoteFieldSwitchedSection
                page={PATCH}
                field={
                  guitarBassSelect === "GUITAR"
                    ? modelingTone.gr300SweepSwitch_guitar
                    : modelingTone.gr300SweepSwitch_bass
                }
              >
                <RemoteFieldSlider
                  page={PATCH}
                  field={
                    guitarBassSelect === "GUITAR"
                      ? modelingTone.gr300SweepRise_guitar
                      : modelingTone.gr300SweepRise_bass
                  }
                />
                <RemoteFieldSlider
                  page={PATCH}
                  field={
                    guitarBassSelect === "GUITAR"
                      ? modelingTone.gr300SweepFall_guitar
                      : modelingTone.gr300SweepFall_bass
                  }
                />
              </RemoteFieldSwitchedSection>
              <RemoteFieldSwitchedSection
                page={PATCH}
                field={
                  guitarBassSelect === "GUITAR"
                    ? modelingTone.gr300VibratoSwitch_guitar
                    : modelingTone.gr300VibratoSwitch_bass
                }
              >
                <RemoteFieldSlider
                  page={PATCH}
                  field={
                    guitarBassSelect === "GUITAR"
                      ? modelingTone.gr300VibratoRate_guitar
                      : modelingTone.gr300VibratoRate_bass
                  }
                />
                <RemoteFieldSlider
                  page={PATCH}
                  field={
                    guitarBassSelect === "GUITAR"
                      ? modelingTone.gr300VibratoDepth_guitar
                      : modelingTone.gr300VibratoDepth_bass
                  }
                />
              </RemoteFieldSwitchedSection>
            </>
          )}
          {(guitarBassSelect === "GUITAR"
            ? toneNumberSynth_guitar
            : toneNumberSynth_bass) === "WAVE SYNTH" && (
            <>
              <RemoteFieldWaveShapePicker
                page={PATCH}
                field={
                  guitarBassSelect === "GUITAR"
                    ? modelingTone.waveSynthType_guitar
                    : modelingTone.waveSynthType_bass
                }
              />
              <RemoteFieldSlider
                page={PATCH}
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
              <RemoteFieldSlider
                page={PATCH}
                field={
                  guitarBassSelect === "GUITAR"
                    ? modelingTone.filterBassCutoff_guitar
                    : modelingTone.filterBassCutoff_bass
                }
              />
              <RemoteFieldSlider
                page={PATCH}
                field={
                  guitarBassSelect === "GUITAR"
                    ? modelingTone.filterBassResonance_guitar
                    : modelingTone.filterBassResonance_bass
                }
              />
              <RemoteFieldSlider
                page={PATCH}
                field={
                  guitarBassSelect === "GUITAR"
                    ? modelingTone.filterBassFilterDecay_guitar
                    : modelingTone.filterBassFilterDecay_bass
                }
              />
              <RemoteFieldSlider
                page={PATCH}
                field={
                  guitarBassSelect === "GUITAR"
                    ? modelingTone.filterBassTouchSens_guitar
                    : modelingTone.filterBassTouchSens_bass
                }
              />
              <RemoteFieldSlider
                page={PATCH}
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
              <RemoteFieldSlider
                page={PATCH}
                field={
                  guitarBassSelect === "GUITAR"
                    ? modelingTone.crystalAttackLength_guitar
                    : modelingTone.crystalAttackLength_bass
                }
              />
              <RemoteFieldSlider
                page={PATCH}
                field={
                  guitarBassSelect === "GUITAR"
                    ? modelingTone.crystalModTune_guitar
                    : modelingTone.crystalModTune_bass
                }
              />
              <RemoteFieldSlider
                page={PATCH}
                field={
                  guitarBassSelect === "GUITAR"
                    ? modelingTone.crystalModDepth_guitar
                    : modelingTone.crystalModDepth_bass
                }
              />
              <RemoteFieldSlider
                page={PATCH}
                field={
                  guitarBassSelect === "GUITAR"
                    ? modelingTone.crystalAttackLevel_guitar
                    : modelingTone.crystalAttackLevel_bass
                }
              />
              <RemoteFieldSlider
                page={PATCH}
                field={
                  guitarBassSelect === "GUITAR"
                    ? modelingTone.crystalBody_guitar
                    : modelingTone.crystalBody_bass
                }
              />
              <RemoteFieldSlider
                page={PATCH}
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
              <RemoteFieldSlider
                page={PATCH}
                field={
                  guitarBassSelect === "GUITAR"
                    ? modelingTone.organFeet16_guitar
                    : modelingTone.organFeet16_bass
                }
              />
              <RemoteFieldSlider
                page={PATCH}
                field={
                  guitarBassSelect === "GUITAR"
                    ? modelingTone.organFeet8_guitar
                    : modelingTone.organFeet8_bass
                }
              />
              <RemoteFieldSlider
                page={PATCH}
                field={
                  guitarBassSelect === "GUITAR"
                    ? modelingTone.organFeet4_guitar
                    : modelingTone.organFeet4_bass
                }
              />
              <RemoteFieldSlider
                page={PATCH}
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
              <RemoteFieldSlider
                page={PATCH}
                field={
                  guitarBassSelect === "GUITAR"
                    ? modelingTone.brassCutoff_guitar
                    : modelingTone.brassCutoff_bass
                }
              />
              <RemoteFieldSlider
                page={PATCH}
                field={
                  guitarBassSelect === "GUITAR"
                    ? modelingTone.brassResonance_guitar
                    : modelingTone.brassResonance_bass
                }
              />
              <RemoteFieldSlider
                page={PATCH}
                field={
                  guitarBassSelect === "GUITAR"
                    ? modelingTone.brassTouchSens_guitar
                    : modelingTone.brassTouchSens_bass
                }
              />
              <RemoteFieldSlider
                page={PATCH}
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
            <RemoteFieldPicker
              page={PATCH}
              field={modelingTone.eGuitarPickupSelect5_bass}
            />
          )}
          {toneNumberEGtr_bass === "LP" && (
            <RemoteFieldPicker
              page={PATCH}
              field={modelingTone.eGuitarPickupSelect3_bass}
            />
          )}
          <RemoteFieldSlider
            page={PATCH}
            field={modelingTone.eGuitarVolume_bass}
          />
          <RemoteFieldSlider
            page={PATCH}
            field={modelingTone.eGuitarTone_bass}
          />
        </>
      )}
      {guitarBassSelect === "BASS" && toneCategory_bass === "E.BASS" && (
        <>
          {(toneNumberEBass_bass === "JB" ||
            toneNumberEBass_bass === "VINT JB" ||
            toneNumberEBass_bass === "T-BIRD") && (
            <>
              <RemoteFieldSlider
                page={PATCH}
                field={modelingTone.eBassRearVolume_bass}
              />
              <RemoteFieldSlider
                page={PATCH}
                field={modelingTone.eBassFrontVolume_bass}
              />
              <RemoteFieldSlider
                page={PATCH}
                field={modelingTone.eBassVolume_bass}
              />
              <RemoteFieldSlider
                page={PATCH}
                field={modelingTone.eBassTone_bass}
              />
            </>
          )}
          {(toneNumberEBass_bass === "PB" ||
            toneNumberEBass_bass === "VINT PB") && (
            <>
              <RemoteFieldSlider
                page={PATCH}
                field={modelingTone.eBassVolume_bass}
              />
              <RemoteFieldSlider
                page={PATCH}
                field={modelingTone.eBassTone_bass}
              />
            </>
          )}
          {toneNumberEBass_bass === "M-MAN" && (
            <>
              <RemoteFieldSlider
                page={PATCH}
                field={modelingTone.eBassTreble_bass}
              />
              <RemoteFieldSlider
                page={PATCH}
                field={modelingTone.eBassBass_bass}
              />
              <RemoteFieldSlider
                page={PATCH}
                field={modelingTone.eBassVolume_bass}
              />
            </>
          )}
          {toneNumberEBass_bass === "RICK" && (
            <>
              <RemoteFieldSlider
                page={PATCH}
                field={modelingTone.eBassRearVolume_bass}
              />
              <RemoteFieldSlider
                page={PATCH}
                field={modelingTone.eBassFrontVolume_bass}
              />
              <RemoteFieldSlider
                page={PATCH}
                field={modelingTone.eBassRearTone_bass}
              />
              <RemoteFieldSlider
                page={PATCH}
                field={modelingTone.eBassFrontTone_bass}
              />
              <RemoteFieldSlider
                page={PATCH}
                field={modelingTone.eBassVolume_bass}
              />
              <RemoteFieldPicker
                page={PATCH}
                field={modelingTone.eBassPickupSelect_bass}
              />
            </>
          )}
          {toneNumberEBass_bass === "ACTIVE" && (
            <>
              <RemoteFieldSlider
                page={PATCH}
                field={modelingTone.eBassRearVolume_bass}
              />
              <RemoteFieldSlider
                page={PATCH}
                field={modelingTone.eBassFrontVolume_bass}
              />
              <RemoteFieldSlider
                page={PATCH}
                field={modelingTone.eBassTreble_bass}
              />
              <RemoteFieldSlider
                page={PATCH}
                field={modelingTone.eBassBass_bass}
              />
              <RemoteFieldSlider
                page={PATCH}
                field={modelingTone.eBassVolume_bass}
              />
            </>
          )}
          {toneNumberEBass_bass === "VIOLIN" && (
            <>
              <RemoteFieldSlider
                page={PATCH}
                field={modelingTone.eBassRearVolume_bass}
              />
              <RemoteFieldSlider
                page={PATCH}
                field={modelingTone.eBassFrontVolume_bass}
              />
              <RemoteFieldSlider
                page={PATCH}
                field={modelingTone.eBassVolume_bass}
              />
              <RemoteFieldSwitch
                page={PATCH}
                field={modelingTone.eBassTrebleSwitch_bass}
              />
              <RemoteFieldSwitch
                page={PATCH}
                field={modelingTone.eBassBassSwitch_bass}
              />
              <RemoteFieldSegmentedSwitch
                page={PATCH}
                field={modelingTone.eBassRhythmSoloSwitch_bass}
              />
            </>
          )}
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});

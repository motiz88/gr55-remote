import { RolandGR55AddressMapAbsolute as GR55 } from "./RolandGR55AddressMap";
import {
  AssignsMap,
  FieldAssignDefinition,
  MultiFieldAssignDefinition,
  VirtualFieldAssignDefinition,
} from "./RolandGR55Assigns";
const patch = GR55.temporaryPatch;

export const RolandGR55PatchAssignsMapGuitarMode = buildAssignsMap("GUITAR");
export const RolandGR55PatchAssignsMapBassMode = buildAssignsMap("BASS");

function buildAssignsMap(guitarBassSelect: "GUITAR" | "BASS") {
  return new AssignsMap([
    new FieldAssignDefinition(
      "PCM1 Tone Switch",
      patch.patchPCMTone1.muteSwitch
    ),
    new FieldAssignDefinition(
      "PCM1 Tone Number",
      patch.patchPCMTone1.toneSelect
    ),
    new FieldAssignDefinition("PCM1 Tone Level", patch.patchPCMTone1.partLevel),
    new FieldAssignDefinition(
      "PCM1 Tone Octave",
      patch.patchPCMTone1.partOctaveShift
    ),
    new FieldAssignDefinition(
      "PCM1 Tone Chromatic",
      patch.patchPCMTone1.chromatic
    ),
    new FieldAssignDefinition(
      "PCM1 Tone Legato",
      patch.patchPCMTone1.legatoSwitch
    ),
    new FieldAssignDefinition(
      "PCM1 Tone Lev Velo Sens",
      patch.patchPCMTone1Offset.tvaLevelVelocitySensOffset
    ),
    new FieldAssignDefinition(
      "PCM1 Tone Velo Curve Type",
      patch.patchPCMTone1Offset.tvaLevelVelocityCurve
    ),
    new FieldAssignDefinition(
      "PCM1 Tone Nuance Sw",
      patch.patchPCMTone1.nuanceSwitch
    ),
    new FieldAssignDefinition("PCM1 Tone Pan", patch.patchPCMTone1.partPan),
    new FieldAssignDefinition(
      "PCM1 Tone String Lev 1",
      patch.patchPCMTone1.string1Level
    ),
    new FieldAssignDefinition(
      "PCM1 Tone String Lev 2",
      patch.patchPCMTone1.string2Level
    ),
    new FieldAssignDefinition(
      "PCM1 Tone String Lev 3",
      patch.patchPCMTone1.string3Level
    ),
    new FieldAssignDefinition(
      "PCM1 Tone String Lev 4",
      patch.patchPCMTone1.string4Level
    ),
    new FieldAssignDefinition(
      "PCM1 Tone String Lev 5",
      patch.patchPCMTone1.string5Level
    ),
    new FieldAssignDefinition(
      "PCM1 Tone String Lev 6",
      patch.patchPCMTone1.string6Level
    ),
    new FieldAssignDefinition(
      "PCM1 Pitch Pitch shift",
      patch.patchPCMTone1.partCoarseTune
    ),
    new FieldAssignDefinition(
      "PCM1 Pitch Pitch Fine",
      patch.patchPCMTone1.partFineTune
    ),
    new FieldAssignDefinition(
      "PCM1 Pitch Portamento Sw",
      patch.patchPCMTone1.partPortamentoSwitch
    ),
    new FieldAssignDefinition(
      "PCM1 Pitch Portamento Type",
      patch.patchPCMTone1Offset.partPortamentoType
    ),
    new FieldAssignDefinition(
      "PCM1 Pitch Portamento Time",
      patch.patchPCMTone1.portamentoTime
    ),
    new FieldAssignDefinition(
      "PCM1 Filter Filter Type",
      patch.patchPCMTone1Offset.tvfFilterType
    ),
    new FieldAssignDefinition(
      "PCM1 Filter CutOff",
      patch.patchPCMTone1Offset.tvfCutoffFrequencyOffset
    ),
    new FieldAssignDefinition(
      "PCM1 Filter Resonance",
      patch.patchPCMTone1Offset.tvfResonanceOffset
    ),
    new FieldAssignDefinition(
      "PCM1 Filter Cutoff Velo Sens",
      patch.patchPCMTone1Offset.tvfCutoffVelocitySens
    ),
    new FieldAssignDefinition(
      "PCM1 Filter Cutoff Nuance Sens",
      patch.patchPCMTone1Offset.nuanceCutoffSens
    ),
    new FieldAssignDefinition(
      "PCM1 Filter Cutoff Velo Curve",
      patch.patchPCMTone1Offset.tvfCutoffVelocityCurve
    ),
    new FieldAssignDefinition(
      "PCM1 Filter Cutoff Keyfollow",
      patch.patchPCMTone1Offset.tvfCutoffKeyfollowOffset
    ),
    new FieldAssignDefinition(
      "PCM1 TVF TVF Env Depth",
      patch.patchPCMTone1Offset.tvfEnvDepthOffset
    ),
    new FieldAssignDefinition(
      "PCM1 TVF TVF Attack Time",
      patch.patchPCMTone1Offset.tvfEnvTime1Offset
    ),
    new FieldAssignDefinition(
      "PCM1 TVF TVF Decay Time",
      patch.patchPCMTone1Offset.tvfEnvTime2Offset
    ),
    new FieldAssignDefinition(
      "PCM1 TVF TVF Sustain level",
      patch.patchPCMTone1Offset.tvfEnvLevel3Offset
    ),
    new FieldAssignDefinition(
      "PCM1 TVF TVF Release Time",
      patch.patchPCMTone1Offset.tvfEnvTime4Offset
    ),
    new FieldAssignDefinition(
      "PCM1 TVF TVF Attack Vel Sens",
      patch.patchPCMTone1Offset.tvfEnvTime1VelocitySensOffset
    ),
    new FieldAssignDefinition(
      "PCM1 TVF TVF Attack Nuance Sens",
      patch.patchPCMTone1Offset.tvfEnvTime1NuanceSensOffset
    ),
    new FieldAssignDefinition(
      "PCM1 TVA TVA Attack Time",
      patch.patchPCMTone1Offset.tvaEnvTime1Offset
    ),
    new FieldAssignDefinition(
      "PCM1 TVA TVA Decay Time",
      patch.patchPCMTone1Offset.tvaEnvTime2Offset
    ),
    new FieldAssignDefinition(
      "PCM1 TVA  TVA Sustain Level",
      patch.patchPCMTone1Offset.tvaEnvLevel3Offset
    ),
    new FieldAssignDefinition(
      "PCM1 TVA  TVA Release Time",
      patch.patchPCMTone1Offset.tvaEnvTime4Offset
    ),
    new FieldAssignDefinition(
      "PCM1 TVA TVA Attack Vel Sens",
      patch.patchPCMTone1Offset.tvaEnvTime1VelocitySensOffset
    ),
    new FieldAssignDefinition(
      "PCM1 TVA TVA Attack Nuance Sens",
      patch.patchPCMTone1Offset.tvaEnvTime1NuanceSensOffset
    ),
    new FieldAssignDefinition(
      "PCM1 TVA Level Nuance Sens",
      patch.patchPCMTone1Offset.nuanceLevelSens
    ),
    new FieldAssignDefinition(
      "PCM1 TVA Release Mode",
      patch.patchPCMTone1.releaseMode
    ),
    new FieldAssignDefinition(
      "PCM1 Pitch ENV Pitch Env Vel Sens",
      patch.patchPCMTone1Offset.pitchEnvVelocitySensOffset
    ),
    new FieldAssignDefinition(
      "PCM1 Pitch ENV Pitch Env Depth",
      patch.patchPCMTone1Offset.pitchEnvOffset
    ),
    new FieldAssignDefinition(
      "PCM1 Pitch ENV Attack Time",
      patch.patchPCMTone1Offset.pitchEnvTime1Offset
    ),
    new FieldAssignDefinition(
      "PCM1 Pitch ENV Pitch Decay Time",
      patch.patchPCMTone1Offset.pitchEnvTime2Offset
    ),
    new FieldAssignDefinition(
      "PCM1 LFO1 LFO1 Rate",
      patch.patchPCMTone1Offset.lfo1Rate
    ),
    new FieldAssignDefinition(
      "PCM1 LFO1 LFO1 Pitch Depth",
      patch.patchPCMTone1Offset.lfo1PitchDepthOffset
    ),
    new FieldAssignDefinition(
      "PCM1 LFO1 LFO1 TVF Depth",
      patch.patchPCMTone1Offset.lfo1TVFDepthOffset
    ),
    new FieldAssignDefinition(
      "PCM1 LFO1 LFO1 TVA Depth",
      patch.patchPCMTone1Offset.lfo1TVADepthOffset
    ),
    new FieldAssignDefinition(
      "PCM1 LFO1 LFO1 Pan Depth",
      patch.patchPCMTone1Offset.lfo1PanDepthOffset
    ),
    new FieldAssignDefinition(
      "PCM1 LFO2 LFO2 Rate",
      patch.patchPCMTone1Offset.lfo2Rate
    ),
    new FieldAssignDefinition(
      "PCM1 LFO2 LFO2 Pitch Depth",
      patch.patchPCMTone1Offset.lfo2PitchDepthOffset
    ),
    new FieldAssignDefinition(
      "PCM1 LFO2 LFO2 TVF Depth",
      patch.patchPCMTone1Offset.lfo2TVFDepthOffset
    ),
    new FieldAssignDefinition(
      "PCM1 LFO2 LFO2 TVA Depth",
      patch.patchPCMTone1Offset.lfo2TVADepthOffset
    ),
    new FieldAssignDefinition(
      "PCM1 LFO2 LFO2 Pan Depth",
      patch.patchPCMTone1Offset.lfo2PanDepthOffset
    ),
    new FieldAssignDefinition(
      "PCM1 Line Select",
      patch.patchPCMTone1.partOutputMFXSelect
    ),
    // TODO: How to handle assign targets that aren't patch fields?
    // (Assuming that's what this is. Ask gumtown)
    new VirtualFieldAssignDefinition("PCM1 Tone1 Bend"),

    new FieldAssignDefinition(
      "PCM2 Tone Switch",
      patch.patchPCMTone2.muteSwitch
    ),
    new FieldAssignDefinition(
      "PCM2 Tone Number",
      patch.patchPCMTone2.toneSelect
    ),
    new FieldAssignDefinition("PCM2 Tone Level", patch.patchPCMTone2.partLevel),
    new FieldAssignDefinition(
      "PCM2 Tone Octave",
      patch.patchPCMTone2.partOctaveShift
    ),
    new FieldAssignDefinition(
      "PCM2 Tone Chromatic",
      patch.patchPCMTone2.chromatic
    ),
    new FieldAssignDefinition(
      "PCM2 Tone Legato",
      patch.patchPCMTone2.legatoSwitch
    ),
    new FieldAssignDefinition(
      "PCM2 Tone Lev Velo Sens",
      patch.patchPCMTone2Offset.tvaLevelVelocitySensOffset
    ),
    new FieldAssignDefinition(
      "PCM2 Tone Velo Curve Type",
      patch.patchPCMTone2Offset.tvaLevelVelocityCurve
    ),
    new FieldAssignDefinition(
      "PCM2 Tone Nuance Sw",
      patch.patchPCMTone2.nuanceSwitch
    ),
    new FieldAssignDefinition("PCM2 Tone Pan", patch.patchPCMTone2.partPan),
    new FieldAssignDefinition(
      "PCM2 Tone String Lev 1",
      patch.patchPCMTone2.string1Level
    ),
    new FieldAssignDefinition(
      "PCM2 Tone String Lev 2",
      patch.patchPCMTone2.string2Level
    ),
    new FieldAssignDefinition(
      "PCM2 Tone String Lev 3",
      patch.patchPCMTone2.string3Level
    ),
    new FieldAssignDefinition(
      "PCM2 Tone String Lev 4",
      patch.patchPCMTone2.string4Level
    ),
    new FieldAssignDefinition(
      "PCM2 Tone String Lev 5",
      patch.patchPCMTone2.string5Level
    ),
    new FieldAssignDefinition(
      "PCM2 Tone String Lev 6",
      patch.patchPCMTone2.string6Level
    ),
    new FieldAssignDefinition(
      "PCM2 Pitch Pitch shift",
      patch.patchPCMTone2.partCoarseTune
    ),
    new FieldAssignDefinition(
      "PCM2 Pitch Pitch Fine",
      patch.patchPCMTone2.partFineTune
    ),
    new FieldAssignDefinition(
      "PCM2 Pitch Portamento Sw",
      patch.patchPCMTone2.partPortamentoSwitch
    ),
    new FieldAssignDefinition(
      "PCM2 Pitch Portamento Type",
      patch.patchPCMTone2Offset.partPortamentoType
    ),
    new FieldAssignDefinition(
      "PCM2 Pitch Portamento Time",
      patch.patchPCMTone2.portamentoTime
    ),
    new FieldAssignDefinition(
      "PCM2 Filter Filter Type",
      patch.patchPCMTone2Offset.tvfFilterType
    ),
    new FieldAssignDefinition(
      "PCM2 Filter CutOff",
      patch.patchPCMTone2Offset.tvfCutoffFrequencyOffset
    ),
    new FieldAssignDefinition(
      "PCM2 Filter Resonance",
      patch.patchPCMTone2Offset.tvfResonanceOffset
    ),
    new FieldAssignDefinition(
      "PCM2 Filter Cutoff Velo Sens",
      patch.patchPCMTone2Offset.tvfCutoffVelocitySens
    ),
    new FieldAssignDefinition(
      "PCM2 Filter Cutoff Nuance Sens",
      patch.patchPCMTone2Offset.nuanceCutoffSens
    ),
    new FieldAssignDefinition(
      "PCM2 Filter Cutoff Velo Curve",
      patch.patchPCMTone2Offset.tvfCutoffVelocityCurve
    ),
    new FieldAssignDefinition(
      "PCM2 Filter Cutoff Keyfollow",
      patch.patchPCMTone2Offset.tvfCutoffKeyfollowOffset
    ),
    new FieldAssignDefinition(
      "PCM2 TVF TVF Env Depth",
      patch.patchPCMTone2Offset.tvfEnvDepthOffset
    ),
    new FieldAssignDefinition(
      "PCM2 TVF TVF Attack Time",
      patch.patchPCMTone2Offset.tvfEnvTime1Offset
    ),
    new FieldAssignDefinition(
      "PCM2 TVF TVF Decay Time",
      patch.patchPCMTone2Offset.tvfEnvTime2Offset
    ),
    new FieldAssignDefinition(
      "PCM2 TVF TVF Sustain level",
      patch.patchPCMTone2Offset.tvfEnvLevel3Offset
    ),
    new FieldAssignDefinition(
      "PCM2 TVF TVF Release Time",
      patch.patchPCMTone2Offset.tvfEnvTime4Offset
    ),
    new FieldAssignDefinition(
      "PCM2 TVF TVF Attack Vel Sens",
      patch.patchPCMTone2Offset.tvfEnvTime1VelocitySensOffset
    ),
    new FieldAssignDefinition(
      "PCM2 TVF TVF Attack Nuance Sens",
      patch.patchPCMTone2Offset.tvfEnvTime1NuanceSensOffset
    ),
    new FieldAssignDefinition(
      "PCM2 TVA TVA Attack Time",
      patch.patchPCMTone2Offset.tvaEnvTime1Offset
    ),
    new FieldAssignDefinition(
      "PCM2 TVA TVA Decay Time",
      patch.patchPCMTone2Offset.tvaEnvTime2Offset
    ),
    new FieldAssignDefinition(
      "PCM2 TVA  TVA Sustain Level",
      patch.patchPCMTone2Offset.tvaEnvLevel3Offset
    ),
    new FieldAssignDefinition(
      "PCM2 TVA  TVA Release Time",
      patch.patchPCMTone2Offset.tvaEnvTime4Offset
    ),
    new FieldAssignDefinition(
      "PCM2 TVA TVA Attack Vel Sens",
      patch.patchPCMTone2Offset.tvaEnvTime1VelocitySensOffset
    ),
    new FieldAssignDefinition(
      "PCM2 TVA TVA Attack Nuance Sens",
      patch.patchPCMTone2Offset.tvaEnvTime1NuanceSensOffset
    ),
    new FieldAssignDefinition(
      "PCM2 TVA Level Nuance Sens",
      patch.patchPCMTone2Offset.nuanceLevelSens
    ),
    new FieldAssignDefinition(
      "PCM2 TVA Release Mode",
      patch.patchPCMTone2.releaseMode
    ),
    new FieldAssignDefinition(
      "PCM2 Pitch ENV Pitch Env Vel Sens",
      patch.patchPCMTone2Offset.pitchEnvVelocitySensOffset
    ),
    new FieldAssignDefinition(
      "PCM2 Pitch ENV Pitch Env Depth",
      patch.patchPCMTone2Offset.pitchEnvOffset
    ),
    new FieldAssignDefinition(
      "PCM2 Pitch ENV Attack Time",
      patch.patchPCMTone2Offset.pitchEnvTime1Offset
    ),
    new FieldAssignDefinition(
      "PCM2 Pitch ENV Pitch Decay Time",
      patch.patchPCMTone2Offset.pitchEnvTime2Offset
    ),
    new FieldAssignDefinition(
      "PCM2 LFO1 LFO1 Rate",
      patch.patchPCMTone2Offset.lfo1Rate
    ),
    new FieldAssignDefinition(
      "PCM2 LFO1 LFO1 Pitch Depth",
      patch.patchPCMTone2Offset.lfo1PitchDepthOffset
    ),
    new FieldAssignDefinition(
      "PCM2 LFO1 LFO1 TVF Depth",
      patch.patchPCMTone2Offset.lfo1TVFDepthOffset
    ),
    new FieldAssignDefinition(
      "PCM2 LFO1 LFO1 TVA Depth",
      patch.patchPCMTone2Offset.lfo1TVADepthOffset
    ),
    new FieldAssignDefinition(
      "PCM2 LFO1 LFO1 Pan Depth",
      patch.patchPCMTone2Offset.lfo1PanDepthOffset
    ),
    new FieldAssignDefinition(
      "PCM2 LFO2 LFO2 Rate",
      patch.patchPCMTone2Offset.lfo2Rate
    ),
    new FieldAssignDefinition(
      "PCM2 LFO2 LFO2 Pitch Depth",
      patch.patchPCMTone2Offset.lfo2PitchDepthOffset
    ),
    new FieldAssignDefinition(
      "PCM2 LFO2 LFO2 TVF Depth",
      patch.patchPCMTone2Offset.lfo2TVFDepthOffset
    ),
    new FieldAssignDefinition(
      "PCM2 LFO2 LFO2 TVA Depth",
      patch.patchPCMTone2Offset.lfo2TVADepthOffset
    ),
    new FieldAssignDefinition(
      "PCM2 LFO2 LFO2 Pan Depth",
      patch.patchPCMTone2Offset.lfo2PanDepthOffset
    ),
    new FieldAssignDefinition(
      "PCM2 Line Select",
      patch.patchPCMTone2.partOutputMFXSelect
    ),
    // TODO: How to handle assign targets that aren't patch fields?
    // (Assuming that's what this is. Ask gumtown)
    new VirtualFieldAssignDefinition("PCM2 Tone1 Bend"),

    new FieldAssignDefinition(
      "Modeling Tone Switch",
      patch.modelingTone.muteSwitch
    ),
    // TODO: Combine these into one parameter
    guitarBassSelect === "GUITAR"
      ? new MultiFieldAssignDefinition("Modeling Tone Number", [
          patch.modelingTone.toneCategory_guitar,
          patch.modelingTone.toneNumberEGtr_guitar,
          patch.modelingTone.toneNumberAc_guitar,
          patch.modelingTone.toneNumberEBass_guitar,
          patch.modelingTone.toneNumberSynth_guitar,
        ])
      : new MultiFieldAssignDefinition("Modeling Tone Number", [
          patch.modelingTone.toneCategory_bass,
          patch.modelingTone.toneNumberEGtr_bass,
          patch.modelingTone.toneNumberEBass_bass,
          patch.modelingTone.toneNumberSynth_bass,
        ]),
    new FieldAssignDefinition("Modeling Tone Level", patch.modelingTone.level),
    new FieldAssignDefinition(
      "Modeling Tone String 1 Level",
      patch.modelingTone.string1Level
    ),
    new FieldAssignDefinition(
      "Modeling Tone String 2 Level",
      patch.modelingTone.string2Level
    ),
    new FieldAssignDefinition(
      "Modeling Tone String 3 Level",
      patch.modelingTone.string3Level
    ),
    new FieldAssignDefinition(
      "Modeling Tone String 4 Level",
      patch.modelingTone.string4Level
    ),
    new FieldAssignDefinition(
      "Modeling Tone String 5 Level",
      patch.modelingTone.string5Level
    ),
    new FieldAssignDefinition(
      "Modeling Tone String 6 Level",
      patch.modelingTone.string6Level
    ),
    new FieldAssignDefinition(
      "Modeling Pitch Pitch Shift",
      patch.modelingTone.pitchShiftString1
    ),
    new FieldAssignDefinition(
      "Modeling Pitch Pitch Fine",
      patch.modelingTone.pitchShiftFineString1
    ),
    new FieldAssignDefinition(
      "Modeling 12String Switch",
      patch.modelingTone.twelveStrSwitch
    ),
    new FieldAssignDefinition(
      "Modeling 12String Direct Level",
      patch.modelingTone.twelveStrDirectLevel
    ),
    new FieldAssignDefinition(
      "Modeling 12String Shift 1",
      patch.modelingTone.twelveStrShiftString1
    ),
    new FieldAssignDefinition(
      "Modeling 12String Fine 1",
      patch.modelingTone.twelveStrFineString1
    ),
    new FieldAssignDefinition(
      "Modeling 12String Shift 2",
      patch.modelingTone.twelveStrShiftString2
    ),
    new FieldAssignDefinition(
      "Modeling 12String Fine 2",
      patch.modelingTone.twelveStrFineString2
    ),
    new FieldAssignDefinition(
      "Modeling 12String Shift 3",
      patch.modelingTone.twelveStrShiftString3
    ),
    new FieldAssignDefinition(
      "Modeling 12String Fine 3",
      patch.modelingTone.twelveStrFineString3
    ),
    new FieldAssignDefinition(
      "Modeling 12String Shift 4",
      patch.modelingTone.twelveStrShiftString4
    ),
    new FieldAssignDefinition(
      "Modeling 12String Fine 4",
      patch.modelingTone.twelveStrFineString4
    ),
    new FieldAssignDefinition(
      "Modeling 12String Shift 5",
      patch.modelingTone.twelveStrShiftString5
    ),
    new FieldAssignDefinition(
      "Modeling 12String Fine 5",
      patch.modelingTone.twelveStrFineString5
    ),
    new FieldAssignDefinition(
      "Modeling 12String Shift 6",
      patch.modelingTone.twelveStrShiftString6
    ),
    new FieldAssignDefinition(
      "Modeling 12String Fine 6",
      patch.modelingTone.twelveStrFineString6
    ),

    ...(guitarBassSelect === "GUITAR"
      ? [
          new FieldAssignDefinition(
            "Modeling E.GTR Cla-ST,Mod-ST PU Select",
            patch.modelingTone.eGuitarPickupSelect5_guitar
          ),
          new FieldAssignDefinition(
            "Modeling E.GTR HH,TE,LP,P9,RK,335,L4 PU Select",
            patch.modelingTone.eGuitarPickupSelect3_guitar
          ),
          new FieldAssignDefinition(
            "Modeling E.GTR LIPS PU Select",
            patch.modelingTone.eGuitarPickupSelectLips_guitar
          ),
          new FieldAssignDefinition(
            "Modeling E.GTR PU Volume",
            patch.modelingTone.eGuitarVolume_guitar
          ),
          new FieldAssignDefinition(
            "Modeling E.GTR PU Tone",
            patch.modelingTone.eGuitarTone_guitar
          ),

          new FieldAssignDefinition(
            "Modeling Acoustic Steel body Type",
            patch.modelingTone.steelType_guitar
          ),
          new FieldAssignDefinition(
            "Modeling Acoustic Steel body Body",
            patch.modelingTone.steelBody_guitar
          ),
          new FieldAssignDefinition(
            "Modeling Acoustic Steel body Tone",
            patch.modelingTone.steelTone_guitar
          ),
          new FieldAssignDefinition(
            "Modeling Acoustic Nylon body Body",
            patch.modelingTone.nylonBody_guitar
          ),
          new FieldAssignDefinition(
            "Modeling Acoustic Nylon body Attack",
            patch.modelingTone.nylonAttack_guitar
          ),
          new FieldAssignDefinition(
            "Modeling Acoustic Nylon body Tone",
            patch.modelingTone.nylonTone_guitar
          ),

          new FieldAssignDefinition(
            "Modeling Sitar body PU Select",
            patch.modelingTone.sitarPickup_guitar
          ),
          new FieldAssignDefinition(
            "Modeling Sitar body Sens",
            patch.modelingTone.sitarSens_guitar
          ),
          new FieldAssignDefinition(
            "Modeling Sitar body Body",
            patch.modelingTone.sitarBody_guitar
          ),
          new FieldAssignDefinition(
            "Modeling Sitar body Color",
            patch.modelingTone.sitarColor_guitar
          ),
          new FieldAssignDefinition(
            "Modeling Sitar body Decay",
            patch.modelingTone.sitarDecay_guitar
          ),
          new FieldAssignDefinition(
            "Modeling Sitar body Buzz",
            patch.modelingTone.sitarBuzz_guitar
          ),
          new FieldAssignDefinition(
            "Modeling Sitar body Attack Level",
            patch.modelingTone.sitarAttack_guitar
          ),
          new FieldAssignDefinition(
            "Modeling Sitar body Tone",
            patch.modelingTone.sitarTone_guitar
          ),

          new FieldAssignDefinition(
            "Modeling Banjo body Attack",
            patch.modelingTone.banjoAttack_guitar
          ),
          new FieldAssignDefinition(
            "Modeling Banjo body Reso",
            patch.modelingTone.banjoReso_guitar
          ),
          new FieldAssignDefinition(
            "Modeling Banjo body Tone",
            patch.modelingTone.banjoTone_guitar
          ),

          new FieldAssignDefinition(
            "Modeling Resonator body Sustain",
            patch.modelingTone.resoSustain_guitar
          ),
          new FieldAssignDefinition(
            "Modeling Resonator body Resonance",
            patch.modelingTone.resoResonance_guitar
          ),
          new FieldAssignDefinition(
            "Modeling Resonator body Tone",
            patch.modelingTone.resoTone_guitar
          ),

          new FieldAssignDefinition(
            "Modeling E.Bass Jazz PU Volume Rear",
            patch.modelingTone.eBassRearVolume_guitar
          ),
          new FieldAssignDefinition(
            "Modeling E.Bass Jazz PU Volume Front",
            patch.modelingTone.eBassFrontVolume_guitar
          ),
          new FieldAssignDefinition(
            "Modeling E.Bass PU Volume",
            patch.modelingTone.eBassVolume_guitar
          ),
          new FieldAssignDefinition(
            "Modeling E.Bass PU Tone",
            patch.modelingTone.eBassTone_guitar
          ),

          new FieldAssignDefinition(
            "Modeling SYNTH Analog Tone Mode",
            patch.modelingTone.gr300Mode_guitar
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Analog Tone Comp",
            patch.modelingTone.gr300Comp_guitar
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Analog Tone Filter Cutoff",
            patch.modelingTone.gr300Cutoff_guitar
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Analog Tone Filter Reso",
            patch.modelingTone.gr300Resonance_guitar
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Analog ENV MOD Sw",
            patch.modelingTone.gr300EnvModSwitch_guitar
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Analog ENV MOD Sens",
            patch.modelingTone.gr300EnvModSens_guitar
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Analog ENV MOD Attack",
            patch.modelingTone.gr300EnvModAttack_guitar
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Analog Pitch Sw",
            patch.modelingTone.gr300PitchSwitch_guitar
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Analog Pitch A",
            patch.modelingTone.gr300PitchA_guitar
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Analog Pitch A Fine",
            patch.modelingTone.gr300PitchAFine_guitar
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Analog Pitch B",
            patch.modelingTone.gr300PitchB_guitar
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Analog Pitch B Fine",
            patch.modelingTone.gr300PitchBFine_guitar
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Analog Pitch Duet",
            patch.modelingTone.gr300PitchDuet_guitar
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Analog Pitch Sweep Sw",
            patch.modelingTone.gr300SweepSwitch_guitar
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Analog Pitch Sweep Rise",
            patch.modelingTone.gr300SweepRise_guitar
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Analog Pitch Sweep Fall",
            patch.modelingTone.gr300SweepFall_guitar
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Analog Vibrato Sw",
            patch.modelingTone.gr300VibratoSwitch_guitar
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Analog Vibrato Rate",
            patch.modelingTone.gr300VibratoRate_guitar
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Analog Vibrato Depth",
            patch.modelingTone.gr300VibratoDepth_guitar
          ),

          new FieldAssignDefinition(
            "Modeling SYNTH Wave Synth Type",
            patch.modelingTone.waveSynthType_guitar
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Wave Synth Color",
            patch.modelingTone.waveSynthColor_guitar
          ),

          new FieldAssignDefinition(
            "Modeling SYNTH Filter Bass Filter Cutoff",
            patch.modelingTone.filterBassCutoff_guitar
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Filter Bass Filter Reso",
            patch.modelingTone.filterBassResonance_guitar
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Filter Bass Filter Decay",
            patch.modelingTone.filterBassFilterDecay_guitar
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Filter Bass Touch Sens",
            patch.modelingTone.filterBassTouchSens_guitar
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Filter Bass Color",
            patch.modelingTone.filterBassColor_guitar
          ),

          new FieldAssignDefinition(
            "Modeling SYNTH Crystal Attack Length",
            patch.modelingTone.crystalAttackLength_guitar
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Crystal MOD Tune",
            patch.modelingTone.crystalModTune_guitar
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Crystal MOD Depth",
            patch.modelingTone.crystalModDepth_guitar
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Crystal  Attack Level",
            patch.modelingTone.crystalAttackLevel_guitar
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Crystal Body Level",
            patch.modelingTone.crystalBody_guitar
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Crystal Sustain",
            patch.modelingTone.crystalSustain_guitar
          ),

          new FieldAssignDefinition(
            "Modeling SYNTH Organ Feet 16",
            patch.modelingTone.organFeet16_guitar
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Organ Feet 8",
            patch.modelingTone.organFeet8_guitar
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Organ Feet 4",
            patch.modelingTone.organFeet4_guitar
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Organ Sustain",
            patch.modelingTone.organSustain_guitar
          ),

          new FieldAssignDefinition(
            "Modeling SYNTH Brass Filter Cutoff",
            patch.modelingTone.brassCutoff_guitar
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Brass Filter Reso",
            patch.modelingTone.brassResonance_guitar
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Brass Touch Sens",
            patch.modelingTone.brassTouchSens_guitar
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Brass Sustain",
            patch.modelingTone.brassSustain_guitar
          ),
        ]
      : [
          new FieldAssignDefinition(
            "Modeling E.Bass PU Volume",
            patch.modelingTone.eBassVolume_bass
          ),
          new FieldAssignDefinition(
            "Modeling E.Bass PU Rear Volume",
            patch.modelingTone.eBassRearVolume_bass
          ),
          new FieldAssignDefinition(
            "Modeling E.Bass PU Front Volume",
            patch.modelingTone.eBassFrontVolume_bass
          ),
          new FieldAssignDefinition(
            "Modeling E.Bass PU Tone",
            patch.modelingTone.eBassTone_bass
          ),
          new FieldAssignDefinition(
            "Modeling E.Bass M-Man PU Treble",
            patch.modelingTone.eBassTreble_bass
          ),
          new FieldAssignDefinition(
            "Modeling E.Bass M-Man PU Bass",
            patch.modelingTone.eBassBass_bass
          ),
          new FieldAssignDefinition(
            "Modeling E.Bass Rick PU Rear Tone",
            patch.modelingTone.eBassRearTone_bass
          ),
          new FieldAssignDefinition(
            "Modeling E.Bass Rick PU Front Tone",
            patch.modelingTone.eBassFrontTone_bass
          ),
          new FieldAssignDefinition(
            "Modeling E.Bass Rick PU Select",
            patch.modelingTone.eBassPickupSelect_bass
          ),
          new FieldAssignDefinition(
            "Modeling E.Bass Active PU Treble",
            patch.modelingTone.eBassActiveTreble_bass
          ),
          new FieldAssignDefinition(
            "Modeling E.Bass Active PU Bass",
            patch.modelingTone.eBassActiveBass_bass
          ),
          new FieldAssignDefinition(
            "Modeling E.Bass Violin PU Treble on",
            patch.modelingTone.eBassTrebleSwitch_bass
          ),
          new FieldAssignDefinition(
            "Modeling E.Bass Violin PU Bass on",
            patch.modelingTone.eBassBassSwitch_bass
          ),
          new FieldAssignDefinition(
            "Modeling E.Bass Violin PU Rhythm/Solo",
            patch.modelingTone.eBassRhythmSoloSwitch_bass
          ),

          new FieldAssignDefinition(
            "Modeling SYNTH Analog Tone Mode",
            patch.modelingTone.gr300Mode_bass
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Analog Tone Comp",
            patch.modelingTone.gr300Comp_bass
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Analog Tone Filter Cutoff",
            patch.modelingTone.gr300Cutoff_bass
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Analog Tone Filter Reso",
            patch.modelingTone.gr300Resonance_bass
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Analog ENV MOD Sw",
            patch.modelingTone.gr300EnvModSwitch_bass
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Analog ENV MOD Sens",
            patch.modelingTone.gr300EnvModSens_bass
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Analog ENV MOD Attack",
            patch.modelingTone.gr300EnvModAttack_bass
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Analog Pitch Sw",
            patch.modelingTone.gr300PitchSwitch_bass
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Analog Pitch A",
            patch.modelingTone.gr300PitchA_bass
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Analog Pitch A Fine",
            patch.modelingTone.gr300PitchAFine_bass
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Analog Pitch B",
            patch.modelingTone.gr300PitchB_bass
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Analog Pitch B Fine",
            patch.modelingTone.gr300PitchBFine_bass
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Analog Pitch Duet",
            patch.modelingTone.gr300PitchDuet_bass
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Analog Pitch Sweep Sw",
            patch.modelingTone.gr300SweepSwitch_bass
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Analog Pitch Sweep Rise",
            patch.modelingTone.gr300SweepRise_bass
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Analog Pitch Sweep Fall",
            patch.modelingTone.gr300SweepFall_bass
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Analog Vibrato Sw",
            patch.modelingTone.gr300VibratoSwitch_bass
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Analog Vibrato Rate",
            patch.modelingTone.gr300VibratoRate_bass
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Analog Vibrato Depth",
            patch.modelingTone.gr300VibratoDepth_bass
          ),

          new FieldAssignDefinition(
            "Modeling SYNTH Wave Synth Type",
            patch.modelingTone.waveSynthType_bass
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Wave Synth Color",
            patch.modelingTone.waveSynthColor_bass
          ),

          new FieldAssignDefinition(
            "Modeling SYNTH Filter Bass Filter Cutoff",
            patch.modelingTone.filterBassCutoff_bass
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Filter Bass Filter Reso",
            patch.modelingTone.filterBassResonance_bass
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Filter Bass Filter Decay",
            patch.modelingTone.filterBassFilterDecay_bass
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Filter Bass Touch Sens",
            patch.modelingTone.filterBassTouchSens_bass
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Filter Bass Color",
            patch.modelingTone.filterBassColor_bass
          ),

          new FieldAssignDefinition(
            "Modeling SYNTH Crystal Attack Length",
            patch.modelingTone.crystalAttackLength_bass
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Crystal MOD Tune",
            patch.modelingTone.crystalModTune_bass
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Crystal MOD Depth",
            patch.modelingTone.crystalModDepth_bass
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Crystal  Attack Level",
            patch.modelingTone.crystalAttackLevel_bass
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Crystal Body Level",
            patch.modelingTone.crystalBody_bass
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Crystal Sustain",
            patch.modelingTone.crystalSustain_bass
          ),

          new FieldAssignDefinition(
            "Modeling SYNTH Organ Feet 16",
            patch.modelingTone.organFeet16_bass
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Organ Feet 8",
            patch.modelingTone.organFeet8_bass
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Organ Feet 4",
            patch.modelingTone.organFeet4_bass
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Organ Sustain",
            patch.modelingTone.organSustain_bass
          ),

          new FieldAssignDefinition(
            "Modeling SYNTH Brass Filter Cutoff",
            patch.modelingTone.brassCutoff_bass
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Brass Filter Reso",
            patch.modelingTone.brassResonance_bass
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Brass Touch Sens",
            patch.modelingTone.brassTouchSens_bass
          ),
          new FieldAssignDefinition(
            "Modeling SYNTH Brass Sustain",
            patch.modelingTone.brassSustain_bass
          ),
        ]),

    new FieldAssignDefinition(
      "Modeling Line Select",
      patch.common.lineSelectModel
    ),

    // TODO: How to handle assign targets that aren't patch fields?
    // (Assuming that's what this is. Ask gumtown)
    new VirtualFieldAssignDefinition("Modeling Tone Bend"),

    new FieldAssignDefinition("AMP Switch", patch.ampModNs.ampSwitch),
    new FieldAssignDefinition("AMP Gain", patch.ampModNs.ampGain),
    new FieldAssignDefinition("AMP Level", patch.ampModNs.ampLevel),
    new FieldAssignDefinition("AMP Gain Switch", patch.ampModNs.ampGainSwitch),
    new FieldAssignDefinition("AMP SOLO Switch", patch.ampModNs.ampSoloSwitch),
    new FieldAssignDefinition("AMP SOLO Level", patch.ampModNs.ampSoloLevel),
    new FieldAssignDefinition("AMP Tone Bass", patch.ampModNs.ampBass),
    new FieldAssignDefinition("AMP Tone Middle", patch.ampModNs.ampMiddle),
    new FieldAssignDefinition("AMP Tone Treble", patch.ampModNs.ampTreble),
    new FieldAssignDefinition("AMP Tone Presence", patch.ampModNs.ampPresence),
    new FieldAssignDefinition("AMP Tone Bright", patch.ampModNs.ampBright),
    new FieldAssignDefinition("AMP Speaker Type", patch.ampModNs.ampSpType),
    new FieldAssignDefinition("AMP Spkr Mic Type", patch.ampModNs.ampMicType),
    new FieldAssignDefinition(
      "AMP Spkr Mic Distance",
      patch.ampModNs.ampMicDistance
    ),
    new FieldAssignDefinition(
      "AMP Spkr Mic Position",
      patch.ampModNs.ampMicPosition
    ),
    new FieldAssignDefinition("AMP Spkr Mic Level", patch.ampModNs.ampMicLevel),

    new FieldAssignDefinition("MOD Effect Switch", patch.ampModNs.modSwitch),
    new FieldAssignDefinition("MOD Pan", patch.ampModNs.modPan),

    new FieldAssignDefinition("MOD OD/DS Type", patch.ampModNs.odDsType),
    new FieldAssignDefinition("MOD OD/DS Drive", patch.ampModNs.odDsDrive),
    new FieldAssignDefinition("MOD OD/DS Tone", patch.ampModNs.odDsTone),
    new FieldAssignDefinition("MOD OD/DS Level", patch.ampModNs.odDsLevel),

    new FieldAssignDefinition("MOD WAH Mode", patch.ampModNs.wahMode),
    new FieldAssignDefinition("MOD WAH Type", patch.ampModNs.wahType),
    new FieldAssignDefinition(
      "MOD WAH Pedal Position",
      patch.ampModNs.wahPedalPosition
    ),
    new FieldAssignDefinition("MOD WAH Sense", patch.ampModNs.wahSens),
    new FieldAssignDefinition("MOD WAH Frequency", patch.ampModNs.wahFreq),
    new FieldAssignDefinition("MOD WAH Peak", patch.ampModNs.wahPeak),
    new FieldAssignDefinition("MOD WAH Level", patch.ampModNs.wahLevel),

    new FieldAssignDefinition("MOD COMP Sustain", patch.ampModNs.compSustain),
    new FieldAssignDefinition("MOD COMP Attack", patch.ampModNs.compAttack),
    new FieldAssignDefinition("MOD COMP Level", patch.ampModNs.compLevel),

    new FieldAssignDefinition(
      "MOD LIMITER Threshold",
      patch.ampModNs.limiterThreshold
    ),
    new FieldAssignDefinition(
      "MOD LIMITER Release",
      patch.ampModNs.limiterRelease
    ),
    new FieldAssignDefinition("MOD LIMITER Level", patch.ampModNs.limiterLevel),

    new FieldAssignDefinition(
      "MOD OCTAVE Effect",
      patch.ampModNs.octaveOctLevel
    ),
    new FieldAssignDefinition(
      "MOD OCTAVE Direct",
      patch.ampModNs.octaveDryLevel
    ),

    new FieldAssignDefinition("MOD PHASER Type", patch.ampModNs.phaserType),
    new FieldAssignDefinition("MOD PHASER Rate", patch.ampModNs.phaserRate),
    new FieldAssignDefinition("MOD PHASER Depth", patch.ampModNs.phaserDepth),
    new FieldAssignDefinition(
      "MOD PHASER Resonance",
      patch.ampModNs.phaserResonance
    ),
    new FieldAssignDefinition("MOD PHASER Level", patch.ampModNs.phaserLevel),

    new FieldAssignDefinition("MOD FLANGER Rate", patch.ampModNs.flangerRate),
    new FieldAssignDefinition("MOD FLANGER Depth", patch.ampModNs.flangerDepth),
    new FieldAssignDefinition(
      "MOD FLANGER Manual",
      patch.ampModNs.flangerManual
    ),
    new FieldAssignDefinition(
      "MOD FLANGER Resonance",
      patch.ampModNs.flangerResonance
    ),
    new FieldAssignDefinition("MOD FLANGER Level", patch.ampModNs.flangerLevel),

    new FieldAssignDefinition("MOD TREMOLO Rate", patch.ampModNs.tremoloRate),
    new FieldAssignDefinition("MOD TREMOLO Depth", patch.ampModNs.tremoloDepth),
    new FieldAssignDefinition(
      "MOD TREMOLO Wave Shape",
      patch.ampModNs.tremoloWaveShape
    ),
    new FieldAssignDefinition("MOD TREMOLO Level", patch.ampModNs.tremoloLevel),

    new FieldAssignDefinition(
      "MOD ROTARY Rate Slow",
      patch.ampModNs.rotaryRateSlow
    ),
    new FieldAssignDefinition(
      "MOD ROTARY Rate Fast",
      patch.ampModNs.rotaryRateFast
    ),
    new FieldAssignDefinition("MOD ROTARY Depth", patch.ampModNs.rotaryDepth),
    new FieldAssignDefinition(
      "MOD ROTARY Speed Select",
      patch.ampModNs.rotarySelect
    ),
    new FieldAssignDefinition("MOD ROTARY Level", patch.ampModNs.rotaryLevel),

    new FieldAssignDefinition("MOD UNI-V Rate", patch.ampModNs.uniVRate),
    new FieldAssignDefinition("MOD UNI-V Depth", patch.ampModNs.uniVDepth),
    new FieldAssignDefinition("MOD UNI-V Level", patch.ampModNs.uniVLevel),

    new FieldAssignDefinition("MOD PAN Rate", patch.ampModNs.panRate),
    new FieldAssignDefinition("MOD PAN Depth", patch.ampModNs.panDepth),
    new FieldAssignDefinition(
      "MOD PAN Wave Shape",
      patch.ampModNs.panWaveShape
    ),
    new FieldAssignDefinition("MOD PAN Level", patch.ampModNs.panLevel),

    new FieldAssignDefinition("MOD DELAY Type", patch.ampModNs.delayType),
    new FieldAssignDefinition("MOD DELAY Time", patch.ampModNs.delayTime),
    new FieldAssignDefinition(
      "MOD DELAY Feedback",
      patch.ampModNs.delayFeedback
    ),
    new FieldAssignDefinition(
      "MOD DELAY Effect level",
      patch.ampModNs.delayEffectLevel
    ),

    new FieldAssignDefinition("MOD CHORUS Type", patch.ampModNs.chorusType),
    new FieldAssignDefinition("MOD CHORUS Rate", patch.ampModNs.chorusRate),
    new FieldAssignDefinition("MOD CHORUS Depth", patch.ampModNs.chorusDepth),
    new FieldAssignDefinition(
      "MOD CHORUS Effect Level",
      patch.ampModNs.chorusEffectLevel
    ),

    new FieldAssignDefinition("MOD EQ Low Cut", patch.ampModNs.eqLowCutoffFreq),
    new FieldAssignDefinition("MOD EQ Low Gain", patch.ampModNs.eqLowGain),
    new FieldAssignDefinition(
      "MOD EQ Low-Mid Frequency",
      patch.ampModNs.eqLowMidCutoffFreq
    ),
    new FieldAssignDefinition("MOD EQ Low-Mid Q", patch.ampModNs.eqLowMidQ),
    new FieldAssignDefinition(
      "MOD EQ Low-Mid Gain",
      patch.ampModNs.eqLowMidGain
    ),
    new FieldAssignDefinition(
      "MOD EQ High-Mid Frequency",
      patch.ampModNs.eqHighMidCutoffFreq
    ),
    new FieldAssignDefinition("MOD EQ High-Mid Q", patch.ampModNs.eqHighMidQ),
    new FieldAssignDefinition(
      "MOD EQ High-Mid Gain",
      patch.ampModNs.eqHighMidGain
    ),
    new FieldAssignDefinition("MOD EQ High Gain", patch.ampModNs.eqHighGain),
    new FieldAssignDefinition(
      "MOD EQ High Cut",
      patch.ampModNs.eqHighCutoffFreq
    ),
    new FieldAssignDefinition("MOD EQ Level", patch.ampModNs.eqLevel),

    new FieldAssignDefinition("MOD NS Switch", patch.ampModNs.nsSwitch),
    new FieldAssignDefinition("MOD NS Threshold", patch.ampModNs.nsThreshold),
    new FieldAssignDefinition("MOD NS Release", patch.ampModNs.nsReleaseTime),

    new FieldAssignDefinition("MFX Effect Switch", patch.mfx.mfxSwitch),
    new FieldAssignDefinition("MFX Pan", patch.mfx.mfxPan),

    new FieldAssignDefinition("MFX EQ Low Frequency", patch.mfx.eqLowFreq),
    new FieldAssignDefinition("MFX EQ Low Gain", patch.mfx.eqLowGain),
    new FieldAssignDefinition("MFX EQ Mid 1 Frequency", patch.mfx.eqMid1Freq),
    new FieldAssignDefinition("MFX EQ Mid 1 Gain", patch.mfx.eqMid1Gain),
    new FieldAssignDefinition("MFX EQ Mid 1 Q", patch.mfx.eqMid1Q),
    new FieldAssignDefinition("MFX EQ Mid 2 Frequency", patch.mfx.eqMid2Freq),
    new FieldAssignDefinition("MFX EQ Mid 2 Gain", patch.mfx.eqMid2Gain),
    new FieldAssignDefinition("MFX EQ Mid 2 Q", patch.mfx.eqMid2Q),
    new FieldAssignDefinition("MFX EQ High Frequency", patch.mfx.eqHighFreq),
    new FieldAssignDefinition("MFX EQ High Gain", patch.mfx.eqHighGain),
    new FieldAssignDefinition("MFX EQ Level", patch.mfx.eqLevel),

    new FieldAssignDefinition(
      "MFX FILTER Type",
      patch.mfx.superFilterFilterType
    ),
    new FieldAssignDefinition(
      "MFX FILTER Slope",
      patch.mfx.superFilterFilterSlope
    ),
    new FieldAssignDefinition(
      "MFX FILTER Cutoff",
      patch.mfx.superFilterFilterCutoff
    ),
    new FieldAssignDefinition(
      "MFX FILTER Resonance",
      patch.mfx.superFilterFilterResonance
    ),
    new FieldAssignDefinition(
      "MFX FILTER Gain",
      patch.mfx.superFilterFilterGain
    ),
    new FieldAssignDefinition(
      "MFX FILTER Modulation Sw",
      patch.mfx.superFilterModulationSw
    ),
    new FieldAssignDefinition(
      "MFX FILTER Modulation Wave",
      patch.mfx.superFilterModulationWave
    ),
    new FieldAssignDefinition("MFX FILTER Rate", patch.mfx.superFilterRate),
    new FieldAssignDefinition("MFX FILTER Depth", patch.mfx.superFilterDepth),
    new FieldAssignDefinition("MFX FILTER Attack", patch.mfx.superFilterAttack),
    new FieldAssignDefinition("MFX FILTER Level", patch.mfx.superFilterLevel),

    new FieldAssignDefinition("MFX PHASER Mode", patch.mfx.phaserMode),
    new FieldAssignDefinition("MFX PHASER Manual", patch.mfx.phaserManual),
    new FieldAssignDefinition("MFX PHASER Rate", patch.mfx.phaserRate),
    new FieldAssignDefinition("MFX PHASER Depth", patch.mfx.phaserDepth),
    new FieldAssignDefinition("MFX PHASER Polarity", patch.mfx.phaserPolarity),
    new FieldAssignDefinition(
      "MFX PHASER Resonance",
      patch.mfx.phaserResonance
    ),
    new FieldAssignDefinition(
      "MFX PHASER Cross Feedback",
      patch.mfx.phaserCrossFeedback
    ),
    new FieldAssignDefinition("MFX PHASER Mix", patch.mfx.phaserMix),
    new FieldAssignDefinition("MFX PHASER Low Gain", patch.mfx.phaserLowGain),
    new FieldAssignDefinition("MFX PHASER High Gain", patch.mfx.phaserHighGain),
    new FieldAssignDefinition("MFX PHASER Level", patch.mfx.phaserLevel),

    new FieldAssignDefinition("MFX STEP PHASER Mode", patch.mfx.stepPhaserMode),
    new FieldAssignDefinition(
      "MFX STEP PHASER Manual",
      patch.mfx.stepPhaserManual
    ),
    new FieldAssignDefinition("MFX STEP PHASER Rate", patch.mfx.stepPhaserRate),
    new FieldAssignDefinition(
      "MFX STEP PHASER Depth",
      patch.mfx.stepPhaserDepth
    ),
    new FieldAssignDefinition(
      "MFX STEP PHASER Polarity",
      patch.mfx.stepPhaserPolarity
    ),
    new FieldAssignDefinition(
      "MFX STEP PHASER Resonance",
      patch.mfx.stepPhaserResonance
    ),
    new FieldAssignDefinition(
      "MFX STEP PHASER Cross Feedback",
      patch.mfx.stepPhaserCrossFeedback
    ),
    new FieldAssignDefinition(
      "MFX STEP PHASER Step rate",
      patch.mfx.stepPhaserStepRate
    ),
    new FieldAssignDefinition("MFX STEP PHASER Mix", patch.mfx.stepPhaserMix),
    new FieldAssignDefinition(
      "MFX STEP PHASER Low Gain",
      patch.mfx.stepPhaserLowGain
    ),
    new FieldAssignDefinition(
      "MFX STEP PHASER High Gain",
      patch.mfx.stepPhaserHighGain
    ),
    new FieldAssignDefinition(
      "MFX STEP PHASER Level",
      patch.mfx.stepPhaserLevel
    ),

    new FieldAssignDefinition(
      "MFX RING MOD Frequency",
      patch.mfx.ringModulatorFrequency
    ),
    new FieldAssignDefinition(
      "MFX RING MOD Sense",
      patch.mfx.ringModulatorSens
    ),
    new FieldAssignDefinition(
      "MFX RING MOD Polarity",
      patch.mfx.ringModulatorPolarity
    ),
    new FieldAssignDefinition(
      "MFX RING MOD Low Gain",
      patch.mfx.ringModulatorLowGain
    ),
    new FieldAssignDefinition(
      "MFX RING MOD High Gain",
      patch.mfx.ringModulatorHighGain
    ),
    new FieldAssignDefinition(
      "MFX RING MOD Balance",
      patch.mfx.ringModulatorBalance
    ),
    new FieldAssignDefinition(
      "MFX RING MOD Level",
      patch.mfx.ringModulatorLevel
    ),

    new FieldAssignDefinition("MFX TREMOLO Mod Wave", patch.mfx.tremoloModWave),
    new FieldAssignDefinition("MFX TREMOLO Rate", patch.mfx.tremoloRate),
    new FieldAssignDefinition("MFX TREMOLO Depth", patch.mfx.tremoloDepth),
    new FieldAssignDefinition("MFX TREMOLO Low Gain", patch.mfx.tremoloLowGain),
    new FieldAssignDefinition(
      "MFX TREMOLO High Gain",
      patch.mfx.tremoloHighGain
    ),
    new FieldAssignDefinition("MFX TREMOLO Level", patch.mfx.tremoloLevel),

    new FieldAssignDefinition(
      "MFX AUTO PAN Mod Wave",
      patch.mfx.autoPanModWave
    ),
    new FieldAssignDefinition("MFX AUTO PAN Rate", patch.mfx.autoPanRate),
    new FieldAssignDefinition("MFX AUTO PAN Depth", patch.mfx.autoPanDepth),
    new FieldAssignDefinition(
      "MFX AUTO PAN Low Gain",
      patch.mfx.autoPanLowGain
    ),
    new FieldAssignDefinition(
      "MFX AUTO PAN High Gain",
      patch.mfx.autoPanHighGain
    ),
    new FieldAssignDefinition("MFX AUTO PAN Level", patch.mfx.autoPanLevel),

    new FieldAssignDefinition("MFX SLICER Pattern", patch.mfx.slicerPattern),
    new FieldAssignDefinition("MFX SLICER SLICER Rate", patch.mfx.slicerRate),
    new FieldAssignDefinition("MFX SLICER Attack", patch.mfx.slicerAttack),
    new FieldAssignDefinition(
      "MFX SLICER Input Sync Sw",
      patch.mfx.slicerInputSyncSw
    ),
    new FieldAssignDefinition(
      "MFX SLICER Input Sync Threshold",
      patch.mfx.slicerInputSyncThreshold
    ),
    new FieldAssignDefinition("MFX SLICER Level", patch.mfx.slicerLevel),

    new FieldAssignDefinition("MFX VK ROTARY Speed", patch.mfx.vkRotarySpeed),
    new FieldAssignDefinition("MFX VK ROTARY Brake", patch.mfx.vkRotaryBrake),
    new FieldAssignDefinition(
      "MFX VK ROTARY Woofer Slow Speed",
      patch.mfx.vkRotaryWooferSlowSpeed
    ),
    new FieldAssignDefinition(
      "MFX VK ROTARY Woofer Fast Speed",
      patch.mfx.vkRotaryWooferFastSpeed
    ),
    new FieldAssignDefinition(
      "MFX VK ROTARY Woofer Trans Up",
      patch.mfx.vkRotaryWooferTransUp
    ),
    new FieldAssignDefinition(
      "MFX VK ROTARY Woofer Trans Down",
      patch.mfx.vkRotaryWooferTransDown
    ),
    new FieldAssignDefinition(
      "MFX VK ROTARY Woofer Level",
      patch.mfx.vkRotaryWooferLevel
    ),
    new FieldAssignDefinition(
      "MFX VK ROTARY Tweeter Slow Speed",
      patch.mfx.vkRotaryTweeterSlowSpeed
    ),
    new FieldAssignDefinition(
      "MFX VK ROTARY Tweeter Fast Speed",
      patch.mfx.vkRotaryTweeterFastSpeed
    ),
    new FieldAssignDefinition(
      "MFX VK ROTARY Tweeter Trans Up",
      patch.mfx.vkRotaryTweeterTransUp
    ),
    new FieldAssignDefinition(
      "MFX VK ROTARY Tweeter Trans Down",
      patch.mfx.vkRotaryTweeterTransDown
    ),
    new FieldAssignDefinition(
      "MFX VK ROTARY Tweeter Level",
      patch.mfx.vkRotaryTweeterLevel
    ),
    new FieldAssignDefinition("MFX VK ROTARY Spread", patch.mfx.vkRotarySpread),
    new FieldAssignDefinition(
      "MFX VK ROTARY Low Gain",
      patch.mfx.vkRotaryLowGain
    ),
    new FieldAssignDefinition(
      "MFX VK ROTARY High Gain",
      patch.mfx.vkRotaryHighGain
    ),
    new FieldAssignDefinition("MFX VK ROTARY Level", patch.mfx.vkRotaryLevel),

    new FieldAssignDefinition(
      "MFX HEXA-CHORUS Pre Delay",
      patch.mfx.hexaChorusPreDelay
    ),
    new FieldAssignDefinition("MFX HEXA-CHORUS Rate", patch.mfx.hexaChorusRate),
    new FieldAssignDefinition(
      "MFX HEXA-CHORUS Depth",
      patch.mfx.hexaChorusDepth
    ),
    new FieldAssignDefinition(
      "MFX HEXA-CHORUS Pre Dly Deviation",
      patch.mfx.hexaChorusPreDelayDeviation
    ),
    new FieldAssignDefinition(
      "MFX HEXA-CHORUS Depth Deviation",
      patch.mfx.hexaChorusDepthDeviation
    ),
    new FieldAssignDefinition(
      "MFX HEXA-CHORUS Pan Deviation",
      patch.mfx.hexaChorusPanDeviation
    ),
    new FieldAssignDefinition(
      "MFX HEXA-CHORUS Balance",
      patch.mfx.hexaChorusBalance
    ),
    new FieldAssignDefinition(
      "MFX HEXA-CHORUS Level",
      patch.mfx.hexaChorusLevel
    ),

    new FieldAssignDefinition(
      "MFX SPACE-D Pre Delay",
      patch.mfx.spaceDPreDelay
    ),
    new FieldAssignDefinition("MFX SPACE-D Rate", patch.mfx.spaceDRate),
    new FieldAssignDefinition("MFX SPACE-D Depth", patch.mfx.spaceDDepth),
    new FieldAssignDefinition("MFX SPACE-D Phase", patch.mfx.spaceDPhase),
    new FieldAssignDefinition("MFX SPACE-D Low Gain", patch.mfx.spaceDLowGain),
    new FieldAssignDefinition(
      "MFX SPACE-D High Gain",
      patch.mfx.spaceDHighGain
    ),
    new FieldAssignDefinition("MFX SPACE-D Balance", patch.mfx.spaceDBalance),
    new FieldAssignDefinition("MFX SPACE-D Level", patch.mfx.spaceDLevel),

    new FieldAssignDefinition(
      "MFX FLANGER Filter Type",
      patch.mfx.flangerFilterType
    ),
    new FieldAssignDefinition(
      "MFX FLANGER Cutoff Frequency",
      patch.mfx.flangerCutoffFreq
    ),
    new FieldAssignDefinition(
      "MFX FLANGER Pre Delay",
      patch.mfx.flangerPreDelay
    ),
    new FieldAssignDefinition("MFX FLANGER Rate", patch.mfx.flangerRate),
    new FieldAssignDefinition("MFX FLANGER Depth", patch.mfx.flangerDepth),
    new FieldAssignDefinition("MFX FLANGER Phase", patch.mfx.flangerPhase),
    new FieldAssignDefinition(
      "MFX FLANGER Feedback",
      patch.mfx.flangerFeedback
    ),
    new FieldAssignDefinition("MFX FLANGER Low Gain", patch.mfx.flangerLowGain),
    new FieldAssignDefinition(
      "MFX FLANGER High Gain",
      patch.mfx.flangerHighGain
    ),
    new FieldAssignDefinition("MFX FLANGER Balance", patch.mfx.flangerBalance),
    new FieldAssignDefinition("MFX FLANGER Level", patch.mfx.flangerLevel),

    new FieldAssignDefinition(
      "MFX STEP-FLANGER Filter Type",
      patch.mfx.stepFlangerFilterType
    ),
    new FieldAssignDefinition(
      "MFX STEP-FLANGER Cutoff Frequency",
      patch.mfx.stepFlangerCutoffFreq
    ),
    new FieldAssignDefinition(
      "MFX STEP-FLANGER Pre Delay",
      patch.mfx.stepFlangerPreDelay
    ),
    new FieldAssignDefinition(
      "MFX STEP-FLANGER Rate",
      patch.mfx.stepFlangerRate
    ),
    new FieldAssignDefinition(
      "MFX STEP-FLANGER Depth",
      patch.mfx.stepFlangerDepth
    ),
    new FieldAssignDefinition(
      "MFX STEP-FLANGER Phase",
      patch.mfx.stepFlangerPhase
    ),
    new FieldAssignDefinition(
      "MFX STEP-FLANGER Feedback",
      patch.mfx.stepFlangerFeedback
    ),
    new FieldAssignDefinition(
      "MFX STEP-FLANGER Step Rate",
      patch.mfx.stepFlangerStepRate
    ),
    new FieldAssignDefinition(
      "MFX STEP-FLANGER Low Gain",
      patch.mfx.stepFlangerLowGain
    ),
    new FieldAssignDefinition(
      "MFX STEP-FLANGER High Gain",
      patch.mfx.stepFlangerHighGain
    ),
    new FieldAssignDefinition(
      "MFX STEP-FLANGER Balance",
      patch.mfx.stepFlangerBalance
    ),
    new FieldAssignDefinition(
      "MFX STEP-FLANGER Level",
      patch.mfx.stepFlangerLevel
    ),

    new FieldAssignDefinition(
      "MFX AMP-SIM PreAmp Sw",
      patch.mfx.gtrAmpSimPreAmpSw
    ),
    new FieldAssignDefinition(
      "MFX AMP-SIM PreAmp Type",
      patch.mfx.gtrAmpSimPreAmpType
    ),
    new FieldAssignDefinition(
      "MFX AMP-SIM PreAmp Volume",
      patch.mfx.gtrAmpSimPreAmpVolume
    ),
    new FieldAssignDefinition(
      "MFX AMP-SIM PreAmp Master",
      patch.mfx.gtrAmpSimPreAmpMaster
    ),
    new FieldAssignDefinition(
      "MFX AMP-SIM PreAmp Gain",
      patch.mfx.gtrAmpSimPreAmpGain
    ),
    new FieldAssignDefinition(
      "MFX AMP-SIM PreAmp Bass",
      patch.mfx.gtrAmpSimPreAmpBass
    ),
    new FieldAssignDefinition(
      "MFX AMP-SIM PreAmp Middle",
      patch.mfx.gtrAmpSimPreAmpMiddle
    ),
    new FieldAssignDefinition(
      "MFX AMP-SIM PreAmp Treble",
      patch.mfx.gtrAmpSimPreAmpTreble
    ),
    new FieldAssignDefinition(
      "MFX AMP-SIM PreAmp Presence",
      patch.mfx.gtrAmpSimPreAmpPresence
    ),
    new FieldAssignDefinition(
      "MFX AMP-SIM PreAmp Bright",
      patch.mfx.gtrAmpSimPreAmpBright
    ),
    new FieldAssignDefinition(
      "MFX AMP-SIM Speaker Sw",
      patch.mfx.gtrAmpSimSpeakerSw
    ),
    new FieldAssignDefinition(
      "MFX AMP-SIM Speaker Type",
      patch.mfx.gtrAmpSimSpeakerType
    ),
    new FieldAssignDefinition(
      "MFX AMP-SIM Speaker Mic Setting",
      patch.mfx.gtrAmpSimMicSetting
    ),
    new FieldAssignDefinition(
      "MFX AMP-SIM Speaker Mic Level",
      patch.mfx.gtrAmpSimMicLevel
    ),
    new FieldAssignDefinition(
      "MFX AMP-SIM Speaker Direct Level",
      patch.mfx.gtrAmpSimDirectLevel
    ),
    new FieldAssignDefinition("MFX AMP-SIM Pan", patch.mfx.gtrAmpSimPan),
    new FieldAssignDefinition("MFX AMP-SIM Level", patch.mfx.gtrAmpSimLevel),

    new FieldAssignDefinition(
      "MFX COMPRESSOR Attack",
      patch.mfx.compressorAttack
    ),
    new FieldAssignDefinition(
      "MFX COMPRESSOR Threshold",
      patch.mfx.compressorThreshold
    ),
    new FieldAssignDefinition(
      "MFX COMPRESSOR Post Gain",
      patch.mfx.compressorPostGain
    ),
    new FieldAssignDefinition(
      "MFX COMPRESSOR Low Gain",
      patch.mfx.compressorLowGain
    ),
    new FieldAssignDefinition(
      "MFX COMPRESSOR High Gain",
      patch.mfx.compressorHighGain
    ),
    new FieldAssignDefinition(
      "MFX COMPRESSOR Level",
      patch.mfx.compressorLevel
    ),

    new FieldAssignDefinition("MFX LIMITER Release", patch.mfx.limiterRelease),
    new FieldAssignDefinition(
      "MFX LIMITER Threshold",
      patch.mfx.limiterThreshold
    ),
    new FieldAssignDefinition("MFX LIMITER Ratio", patch.mfx.limiterRatio),
    new FieldAssignDefinition(
      "MFX LIMITER Post Gain",
      patch.mfx.limiterPostGain
    ),
    new FieldAssignDefinition("MFX LIMITER Low Gain", patch.mfx.limiterLowGain),
    new FieldAssignDefinition(
      "MFX LIMITER High Gain",
      patch.mfx.limiterHighGain
    ),
    new FieldAssignDefinition("MFX LIMITER Level", patch.mfx.limiterLevel),

    // TODO: Figure out the relationship between this and the tempo-based field(s).
    // On the GR-55 it looks like only the time-based field is assignable.
    // TODO: The field's representation differs from the assign min/max field's apparent representation.
    new FieldAssignDefinition(
      "MFX 3TAP DELAY Delay Left",
      patch.mfx.threeTapDelayDelayLeft
    ),
    new FieldAssignDefinition(
      "MFX 3TAP DELAY Delay Right",
      patch.mfx.threeTapDelayDelayRight
    ),
    new FieldAssignDefinition(
      "MFX 3TAP DELAY Delay Center",
      patch.mfx.threeTapDelayDelayCenter
    ),
    new FieldAssignDefinition(
      "MFX 3TAP DELAY Center Feedback",
      patch.mfx.threeTapDelayCenterFeedback
    ),
    new FieldAssignDefinition(
      "MFX 3TAP DELAY HF Damp",
      patch.mfx.threeTapDelayHFDamp
    ),
    new FieldAssignDefinition(
      "MFX 3TAP DELAY Left Level",
      patch.mfx.threeTapDelayLeftLevel
    ),
    new FieldAssignDefinition(
      "MFX 3TAP DELAY Right Level",
      patch.mfx.threeTapDelayRightLevel
    ),
    new FieldAssignDefinition(
      "MFX 3TAP DELAY Center Level",
      patch.mfx.threeTapDelayCenterLevel
    ),
    new FieldAssignDefinition(
      "MFX 3TAP DELAY Low Gain",
      patch.mfx.threeTapDelayLowGain
    ),
    new FieldAssignDefinition(
      "MFX 3TAP DELAY High Gain",
      patch.mfx.threeTapDelayHighGain
    ),
    new FieldAssignDefinition(
      "MFX 3TAP DELAY Balance",
      patch.mfx.threeTapDelayBalance
    ),
    new FieldAssignDefinition(
      "MFX 3TAP DELAY Level",
      patch.mfx.threeTapDelayLevel
    ),

    // TODO: Figure out the relationship between this and the tempo-based field(s).
    // On the GR-55 it looks like only the time-based field is assignable.
    // TODO: The field's representation differs from the assign min/max field's apparent representation.
    new FieldAssignDefinition(
      "MFX TIME DELAY Delay Time",
      patch.mfx.timeCtrlDelayDelayTime
    ),
    new FieldAssignDefinition(
      "MFX TIME DELAY Acceleration",
      patch.mfx.timeCtrlDelayAcceleration
    ),
    new FieldAssignDefinition(
      "MFX TIME DELAY Feedback",
      patch.mfx.timeCtrlDelayFeedback
    ),
    new FieldAssignDefinition(
      "MFX TIME DELAY HF Damp",
      patch.mfx.timeCtrlDelayHFDamp
    ),
    new FieldAssignDefinition(
      "MFX TIME DELAY Low Gain",
      patch.mfx.timeCtrlDelayLowGain
    ),
    new FieldAssignDefinition(
      "MFX TIME DELAY High Gain",
      patch.mfx.timeCtrlDelayHighGain
    ),
    new FieldAssignDefinition(
      "MFX TIME DELAY Balance",
      patch.mfx.timeCtrlDelayBalance
    ),
    new FieldAssignDefinition(
      "MFX TIME DELAY Level",
      patch.mfx.timeCtrlDelayLevel
    ),

    new FieldAssignDefinition(
      "MFX LOFI COMP Pre Filter Type",
      patch.mfx.lofiCompressPreFilterType
    ),
    new FieldAssignDefinition(
      "MFX LOFI COMP LoFi Type",
      patch.mfx.lofiCompressLoFiType
    ),
    new FieldAssignDefinition(
      "MFX LOFI COMP Post Filter Type",
      patch.mfx.lofiCompressPostFilterType
    ),
    new FieldAssignDefinition(
      "MFX LOFI COMP Post Filter Cutoff",
      patch.mfx.lofiCompressPostFilterCutoff
    ),
    new FieldAssignDefinition(
      "MFX LOFI COMP Low Gain",
      patch.mfx.lofiCompressLowGain
    ),
    new FieldAssignDefinition(
      "MFX LOFI COMP High Gain",
      patch.mfx.lofiCompressHighGain
    ),
    new FieldAssignDefinition(
      "MFX LOFI COMP Balance",
      patch.mfx.lofiCompressBalance
    ),
    new FieldAssignDefinition(
      "MFX LOFI COMP Level",
      patch.mfx.lofiCompressLevel
    ),

    new FieldAssignDefinition(
      "MFX PITCH-SHIFTER Coarse",
      patch.mfx.pitchShifterCoarse
    ),
    new FieldAssignDefinition(
      "MFX PITCH-SHIFTER Fine",
      patch.mfx.pitchShifterFine
    ),
    // TODO: Figure out the relationship between this and the tempo-based field(s).
    // On the GR-55 it looks like only the time-based field is assignable.
    // TODO: The field's representation differs from the assign min/max field's apparent representation.
    new FieldAssignDefinition(
      "MFX PITCH-SHIFTER Delay Time",
      patch.mfx.pitchShifterDelayTime
    ),
    new FieldAssignDefinition(
      "MFX PITCH-SHIFTER Feedback",
      patch.mfx.pitchShifterFeedback
    ),
    new FieldAssignDefinition(
      "MFX PITCH-SHIFTER Low Gain",
      patch.mfx.pitchShifterLowGain
    ),
    new FieldAssignDefinition(
      "MFX PITCH-SHIFTER High Gain",
      patch.mfx.pitchShifterHighGain
    ),
    new FieldAssignDefinition(
      "MFX PITCH-SHIFTER Balance",
      patch.mfx.pitchShifterBalance
    ),
    new FieldAssignDefinition(
      "MFX PITCH-SHIFTER Level",
      patch.mfx.pitchShifterLevel
    ),

    new FieldAssignDefinition(
      "DELAY Effect Switch",
      patch.sendsAndEq.delaySwitch
    ),
    new FieldAssignDefinition("DELAY Type", patch.sendsAndEq.delayType),
    new FieldAssignDefinition("DELAY Time", patch.sendsAndEq.delayTime),
    new FieldAssignDefinition("DELAY Feedback", patch.sendsAndEq.delayFeedback),
    new FieldAssignDefinition(
      "DELAY Effect Level",
      patch.sendsAndEq.delayEffectLevel
    ),
    new FieldAssignDefinition("DELAY MFX Send", patch.mfx.mfxDelaySendLevel),
    new FieldAssignDefinition(
      "DELAY MOD Send",
      patch.ampModNs.modDelaySendLevel
    ),
    new FieldAssignDefinition(
      "DELAY BYPASS Send",
      patch.common.bypassDelaySendLevel
    ),

    new FieldAssignDefinition(
      "REVERB Effect Switch",
      patch.sendsAndEq.reverbSwitch
    ),
    new FieldAssignDefinition("REVERB Type", patch.sendsAndEq.reverbTime),
    new FieldAssignDefinition("REVERB Time", patch.sendsAndEq.reverbTime),
    new FieldAssignDefinition(
      "REVERB High Cut",
      patch.sendsAndEq.reverbHighCut
    ),
    new FieldAssignDefinition(
      "REVERB Effect Level",
      patch.sendsAndEq.reverbEffectLevel
    ),
    new FieldAssignDefinition("REVERB MFX Send", patch.mfx.mfxReverbSendLevel),
    new FieldAssignDefinition(
      "REVERB MOD Send",
      patch.ampModNs.modReverbSendLevel
    ),
    new FieldAssignDefinition(
      "REVERB BYPASS Send",
      patch.common.bypassReverbSendLevel
    ),

    new FieldAssignDefinition(
      "CHORUS Effect Switch",
      patch.sendsAndEq.chorusSwitch
    ),
    new FieldAssignDefinition("CHORUS Type", patch.sendsAndEq.chorusType),
    new FieldAssignDefinition("CHORUS Rate", patch.sendsAndEq.chorusRate),
    new FieldAssignDefinition("CHORUS Depth", patch.sendsAndEq.chorusDepth),
    new FieldAssignDefinition(
      "CHORUS Effect Level",
      patch.sendsAndEq.chorusEffectLevel
    ),
    new FieldAssignDefinition("CHORUS MFX Send", patch.mfx.mfxChorusSendLevel),
    new FieldAssignDefinition(
      "CHORUS MOD Send",
      patch.ampModNs.modChorusSendLevel
    ),
    new FieldAssignDefinition(
      "CHORUS BYPASS Send",
      patch.common.bypassChorusSendLevel
    ),

    new FieldAssignDefinition("EQ Effect Switch", patch.sendsAndEq.eqSwitch),
    new FieldAssignDefinition("EQ Low Cut", patch.sendsAndEq.eqLowCutoffFreq),
    new FieldAssignDefinition("EQ Low Gain", patch.sendsAndEq.eqLowGain),
    new FieldAssignDefinition(
      "EQ Low-Mid Frequency",
      patch.sendsAndEq.eqLowMidCutoffFreq
    ),
    new FieldAssignDefinition("EQ Low-Mid Q", patch.sendsAndEq.eqLowMidQ),
    new FieldAssignDefinition("EQ Low-Mid Gain", patch.sendsAndEq.eqLowMidGain),
    new FieldAssignDefinition(
      "EQ High-Mid Frequency",
      patch.sendsAndEq.eqHighMidCutoffFreq
    ),
    new FieldAssignDefinition("EQ High-Mid Q", patch.sendsAndEq.eqHighMidQ),
    new FieldAssignDefinition(
      "EQ High-Mid Gain",
      patch.sendsAndEq.eqHighMidGain
    ),
    new FieldAssignDefinition("EQ High Gain", patch.sendsAndEq.eqHighGain),
    new FieldAssignDefinition("EQ High Cut", patch.sendsAndEq.eqHighCutoffFreq),
    new FieldAssignDefinition("EQ Level", patch.sendsAndEq.eqLevel),
    new FieldAssignDefinition("EQ Character", patch.sendsAndEq.ezCharacter),

    new FieldAssignDefinition(
      "NORMAL PICKUP Level",
      patch.common.normalPuLevel
    ),
    new FieldAssignDefinition(
      "NORMAL PICKUP Line Select",
      patch.common.lineSelectNormalPU
    ),
    new FieldAssignDefinition(
      "ALTERNATE TUNING Switch",
      patch.common.altTuneSwitch
    ),
    new FieldAssignDefinition("PATCH TEMPO", patch.common.patchTempo),
    new FieldAssignDefinition(
      "GUITAR OUT SOURCE",
      patch.common.guitarOutSource
    ),
    new FieldAssignDefinition("PATCH LEVEL", patch.common.patchLevel),
  ]);
}

// TODO: Build reverse index from the above, and use it for quick navigation, showing which fields are assigned, etc.

import {
  AsciiStringField,
  booleanField,
  BooleanField,
  C127Field,
  C63Field,
  C63OffField,
  C64Field,
  enumField,
  FieldDefinition,
  getAddresses,
  ReservedField,
  StructDefinition,
  UByteField,
  USplit12Field,
  USplit8Field,
  UWordField,
} from "./RolandAddressMap";
import { pack7 } from "./RolandSysExProtocol";

// TODO: Fully implement rate field types
// 0-100, and then 13 tempo-relative labelled values
const rate113Field = new UByteField(0, 113);
// 0-127, then 22 tempo-relative labelled values, then TONE
const toneRate150Field = new USplit8Field(0, 150);

// TODO: Fully implement time field type
// 0-3400, and then 13 tempo-relative labelled values
const time3413Field = new USplit12Field(0, 3413);

const gain20dBField = new UByteField(-20, 20, {
  encodedOffset: 20,
  format(value) {
    return `${value > 0 ? "+" : ""}${value} dB`;
  },
});
const gain15dBField = new UByteField(-15, 15, {
  encodedOffset: 15,
  format(value) {
    return `${value > 0 ? "+" : ""}${value} dB`;
  },
});
const positiveGain18dbField = new UByteField(0, 18, {
  format(value) {
    return `${value > 0 ? "+" : ""}${value} dB`;
  },
});
const q16Field = enumField(["0.5", "1", "2", "4", "8", "16"] as const);
const q8Field = enumField(["0.5", "1.0", "2.0", "4.0", "8.0"] as const);

const freq10000Field = enumField([
  "20",
  "25",
  "31.5",
  "40",
  "50",
  "63",
  "80",
  "100",
  "125",
  "160",
  "200",
  "250",
  "315",
  "400",
  "500",
  "630",
  "800",
  "1000",
  "1250",
  "1600",
  "2000",
  "2500",
  "3150",
  "4000",
  "5000",
  "6300",
  "8000",
  "10000",
] as const);

const freq11000FlatField = enumField([
  "700",
  "1000",
  "1400",
  "2000",
  "3000",
  "4000",
  "6000",
  "8000",
  "11000",
  "FLAT",
] as const);

const freq8000Field = enumField([
  "200",
  "250",
  "315",
  "400",
  "500",
  "630",
  "800",
  "1000",
  "1250",
  "1600",
  "2000",
  "2500",
  "3150",
  "4000",
  "5000",
  "6300",
  "8000",
] as const);

const freq8000BypassField = enumField([
  "200",
  "250",
  "315",
  "400",
  "500",
  "630",
  "800",
  "1000",
  "1250",
  "1600",
  "2000",
  "2500",
  "3150",
  "4000",
  "5000",
  "6300",
  "8000",
  "BYPASS",
] as const);

const freqFlat800Field = enumField([
  "FLAT",
  "55",
  "110",
  "165",
  "200",
  "280",
  "340",
  "400",
  "500",
  "630",
  "800",
] as const);

const mfx2600msecField = new USplit12Field(1, 2600, {
  format(value) {
    return `${value} ms`;
  },
});

const mfx1300msecField = new USplit12Field(1, 1300, {
  format(value) {
    return `${value} ms`;
  },
});

const c64PanField = new C64Field({
  format(value) {
    if (value === 0) {
      return "CENTER";
    } else if (value < 0) {
      return `L${-value}`;
    } else {
      return `R${value}`;
    }
  },
});

const pan100Field = new UByteField(0, 100, {
  format(value) {
    if (value === 50) {
      return "CENTER";
    } else if (value < 50) {
      return `L${50 - value}`;
    } else {
      return `${value - 50}R`;
    }
  },
});

const mfxRateNoteField = enumField([
  "WHL",
  "2THd",
  "WHL3",
  "2TH",
  "4THd",
  "2TH3",
  "4TH",
  "8THd",
  "4TH3",
  "8TH",
  "16THd",
  "8TH3",
  "16TH",
] as const);

const mfxDelayNoteField = enumField([
  "16TH",
  "8TH3",
  "16THd",
  "8TH",
  "4TH3",
  "8THd",
  "4TH",
  "2TH3",
  "4THd",
  "2TH",
  "WHL3",
  "2THd",
  "WHL",
] as const);

const mfxPhaseField = new UByteField(0, 180, {
  decodedFactor: 2,
  format(value) {
    return `${value}°`;
  },
});

const mfxFilterTypeField = enumField(["OFF", "LPF", "HPF"] as const);

const invertedMuteField = new BooleanField("UNMUTE", "MUTE", {
  invertedForDisplay: true,
});

const velocityCurveField = // TODO: Graphical representation, maybe name each curve?
  enumField(["FIX", "1", "2", "3", "4", "5", "6", "7", "TONE"] as const);

const c200Field = new UByteField(-200, 200, {
  encodedOffset: 64,
  decodedFactor: 10,
});

const feedback98Field = new UByteField(-98, 98, {
  encodedOffset: 49,
  decodedFactor: 2,
  format(value) {
    return `${value > 0 ? "+" : ""}${value}%`;
  },
});

const dryWet100Field = new UByteField(0, 100, {
  format(value) {
    return `D${100 - value}:W${value}`;
  },
});

const mfxModWaveField = enumField([
  "TRI",
  "SQR",
  "SIN",
  "SAW1",
  "SAW2",
] as const);

const mfxPreDelayField = new UByteField(0, 125, {
  format(value) {
    if (value <= 50) {
      return String(value / 10) + " ms";
    }
    if (value <= 60) {
      return String(5 + (value - 50) * 0.5) + " ms";
    }
    if (value <= 100) {
      return String(value - 50) + " ms";
    }
    return String(50 + (value - 100) * 2) + " ms";
  },
});

const toneLineSelectField = enumField(["BYPS", "AMP", "MFX"] as const);

const waveSynthTypeField = enumField(["SAW", "SQU"] as const);

export const PatchModelingToneStruct = {
  toneCategory_guitar: new FieldDefinition(
    pack7(0x0000),
    "Tone Category (GK mode:Guitar)",
    enumField(["E.GTR", "AC", "E.BASS", "SYNTH"] as const)
  ),
  toneNumberEGtr_guitar: new FieldDefinition(
    pack7(0x0001),
    "Tone Number:E.GTR (GK mode:Guitar)",
    enumField([
      "CLA-ST",
      "MOD-ST",
      "H&H-ST",
      "TE",
      "LP",
      "P-90",
      "LIPS",
      "RICK",
      "335",
      "L4",
    ] as const)
  ),
  toneNumberAc_guitar: new FieldDefinition(
    pack7(0x0002),
    "Tone Number:AC (GK mode:Guitar)",
    enumField(["STEEL", "NYLON", "SITAR", "BANJO", "RESO"] as const)
  ),
  toneNumberEBass_guitar: new FieldDefinition(
    pack7(0x0003),
    "Tone Number:E.BASS (GK mode:Guitar)",
    enumField(["JB", "PB"] as const)
  ),
  toneNumberSynth_guitar: new FieldDefinition(
    pack7(0x0004),
    "Tone Number:SYNTH (GK mode:Guitar)",
    enumField([
      "ANALOG GR",
      "WAVE SYNTH",
      "FILTER BASS",
      "CRYSTAL",
      "ORGAN",
      "BRASS",
    ] as const)
  ),
  toneCategory_bass: new FieldDefinition(
    pack7(0x0005),
    "Tone Category (GK mode:Bass)",
    enumField(["E.BASS", "SYNTH", "E.GTR"] as const)
  ),
  toneNumberEBass_bass: new FieldDefinition(
    pack7(0x0006),
    "Tone Number:E.BASS (GK mode:Bass)",
    enumField([
      "VINT JB",
      "JB",
      "VINT PB",
      "PB",
      "M-MAN",
      "RICK",
      "T-BIRD",
      "ACTIVE",
      "VIOLIN",
    ] as const)
  ),
  toneNumberEGtr_bass: new FieldDefinition(
    pack7(0x0007),
    "Tone Number:E.GTR (GK mode:Bass)",
    enumField(["ST", "LP"] as const)
  ),
  toneNumberSynth_bass: new FieldDefinition(
    pack7(0x0008),
    "Tone Number:SYNTH (GK mode:Guitar)",
    enumField([
      "ANALOG GR",
      "WAVE SYNTH",
      "FILTER BASS",
      "CRYSTAL",
      "ORGAN",
      "BRASS",
    ] as const)
  ),
  level: new FieldDefinition(pack7(0x0009), "Level", new UByteField(0, 100)),
  muteSwitch: new FieldDefinition(
    pack7(0x000a),
    "Mute Switch",
    invertedMuteField
  ),
  string1Level: new FieldDefinition(
    pack7(0x000b),
    "String 1 Level",
    new UByteField(0, 100)
  ),
  string2Level: new FieldDefinition(
    pack7(0x000c),
    "String 2 Level",
    new UByteField(0, 100)
  ),
  string3Level: new FieldDefinition(
    pack7(0x000d),
    "String 3 Level",
    new UByteField(0, 100)
  ),
  string4Level: new FieldDefinition(
    pack7(0x000e),
    "String 4 Level",
    new UByteField(0, 100)
  ),
  string5Level: new FieldDefinition(
    pack7(0x000f),
    "String 5 Level",
    new UByteField(0, 100)
  ),
  string6Level: new FieldDefinition(
    pack7(0x0010),
    "String 6 Level",
    new UByteField(0, 100)
  ),
  pitchShiftString1: new FieldDefinition(
    pack7(0x0011),
    "Pitch Shift String1",
    new UByteField(-24, 24, { encodedOffset: 24 })
  ),
  pitchShiftFineString1: new FieldDefinition(
    pack7(0x0012),
    "Pitch Shift Fine String1",
    new UByteField(-50, 50, { encodedOffset: 50 })
  ),
  // TODO: Ask gumtown: are strings 2-6 unused? Looks like GR-55Floorboard doesn't use them
  // and uses pitchShiftString1 as a global pitch shift.
  pitchShiftString2: new FieldDefinition(
    pack7(0x0013),
    "Pitch Shift String2",
    new UByteField(-24, 24, { encodedOffset: 24 })
  ),
  pitchShiftFineString2: new FieldDefinition(
    pack7(0x0014),
    "Pitch Shift Fine String2",
    new UByteField(-50, 50, { encodedOffset: 50 })
  ),
  pitchShiftString3: new FieldDefinition(
    pack7(0x0015),
    "Pitch Shift String3",
    new UByteField(-24, 24, { encodedOffset: 24 })
  ),
  pitchShiftFineString3: new FieldDefinition(
    pack7(0x0016),
    "Pitch Shift Fine String3",
    new UByteField(-50, 50, { encodedOffset: 50 })
  ),
  pitchShiftString4: new FieldDefinition(
    pack7(0x0017),
    "Pitch Shift String4",
    new UByteField(-24, 24, { encodedOffset: 24 })
  ),
  pitchShiftFineString4: new FieldDefinition(
    pack7(0x0018),
    "Pitch Shift Fine String4",
    new UByteField(-50, 50, { encodedOffset: 50 })
  ),
  pitchShiftString5: new FieldDefinition(
    pack7(0x0019),
    "Pitch Shift String5",
    new UByteField(-24, 24, { encodedOffset: 24 })
  ),
  pitchShiftFineString5: new FieldDefinition(
    pack7(0x001a),
    "Pitch Shift Fine String5",
    new UByteField(-50, 50, { encodedOffset: 50 })
  ),
  pitchShiftString6: new FieldDefinition(
    pack7(0x001b),
    "Pitch Shift String6",
    new UByteField(-24, 24, { encodedOffset: 24 })
  ),
  pitchShiftFineString6: new FieldDefinition(
    pack7(0x001c),
    "Pitch Shift Fine String6",
    new UByteField(-50, 50, { encodedOffset: 50 })
  ),
  twelveStrSwitch: new FieldDefinition(
    pack7(0x001d),
    "12-STR Switch",
    booleanField
  ),
  twelveStrDirectLevel: new FieldDefinition(
    pack7(0x001e),
    "12-STR Direct Level",
    new UByteField(0, 100)
  ),

  twelveStrShiftString1: new FieldDefinition(
    pack7(0x001f),
    "12-STR Shift String1",
    new UByteField(-24, 24, { encodedOffset: 24 })
  ),
  twelveStrFineString1: new FieldDefinition(
    pack7(0x0020),
    "12-STR Fine String1",
    new UByteField(-50, 50, { encodedOffset: 50 })
  ),
  twelveStrShiftString2: new FieldDefinition(
    pack7(0x0021),
    "12-STR Shift String2",
    new UByteField(-24, 24, { encodedOffset: 24 })
  ),
  twelveStrFineString2: new FieldDefinition(
    pack7(0x0022),
    "12-STR Fine String2",
    new UByteField(-50, 50, { encodedOffset: 50 })
  ),
  twelveStrShiftString3: new FieldDefinition(
    pack7(0x0023),
    "12-STR Shift String3",
    new UByteField(-24, 24, { encodedOffset: 24 })
  ),
  twelveStrFineString3: new FieldDefinition(
    pack7(0x0024),
    "12-STR Fine String3",
    new UByteField(-50, 50, { encodedOffset: 50 })
  ),
  twelveStrShiftString4: new FieldDefinition(
    pack7(0x0025),
    "12-STR Shift String4",
    new UByteField(-24, 24, { encodedOffset: 24 })
  ),
  twelveStrFineString4: new FieldDefinition(
    pack7(0x0026),
    "12-STR Fine String4",
    new UByteField(-50, 50, { encodedOffset: 50 })
  ),
  twelveStrShiftString5: new FieldDefinition(
    pack7(0x0027),
    "12-STR Shift String5",
    new UByteField(-24, 24, { encodedOffset: 24 })
  ),
  twelveStrFineString5: new FieldDefinition(
    pack7(0x0028),
    "12-STR Fine String5",
    new UByteField(-50, 50, { encodedOffset: 50 })
  ),
  twelveStrShiftString6: new FieldDefinition(
    pack7(0x0029),
    "12-STR Shift String6",
    new UByteField(-24, 24, { encodedOffset: 24 })
  ),
  twelveStrFineString6: new FieldDefinition(
    pack7(0x002a),
    "12-STR Fine String6",
    new UByteField(-50, 50, { encodedOffset: 50 })
  ),
  nsSwitch: new FieldDefinition(pack7(0x002b), "NS Switch", booleanField),
  nsThreshold: new FieldDefinition(
    pack7(0x002c),
    "NS Threshold",
    new UByteField(0, 100)
  ),
  nsRelease: new FieldDefinition(
    pack7(0x002d),
    "NS Release",
    new UByteField(0, 100)
  ),
  eGuitarPickupSelect3_guitar: new FieldDefinition(
    pack7(0x002e),
    "E. Guitar Pickup Select 3 (GK mode:Guitar)",
    enumField(["REAR", "R+F", "FRONT"] as const)
  ),
  eGuitarPickupSelect5_guitar: new FieldDefinition(
    pack7(0x002f),
    "E. Guitar Pickup Select 5 (GK mode:Guitar)",
    enumField(["REAR", "R+C", "R+F", "C+F", "FRONT"] as const)
  ),
  eGuitarPickupSelectLips_guitar: new FieldDefinition(
    pack7(0x0030),
    "E. Guitar Pickup Select LIPS (GK mode:Guitar)",
    enumField(["REAR", "R+C", "CENTER", "C+F", "FRONT", "ALL"] as const)
  ),
  eGuitarVolume_guitar: new FieldDefinition(
    pack7(0x0031),
    "E. Guitar Volume (GK mode:Guitar)",
    new UByteField(0, 100)
  ),
  eGuitarTone_guitar: new FieldDefinition(
    pack7(0x0032),
    "E. Guitar Tone (GK mode:Guitar)",
    new UByteField(0, 100)
  ),
  steelType_guitar: new FieldDefinition(
    pack7(0x0033),
    "Steel Type (GK mode:Guitar)",
    enumField(["MA28", "TRP-0", "GB45", "GB SML", "GLD40"] as const)
  ),
  steelBody_guitar: new FieldDefinition(
    pack7(0x0034),
    "Steel Body (GK mode:Guitar)",
    new UByteField(0, 100)
  ),
  steelTone_guitar: new FieldDefinition(
    pack7(0x0035),
    "Steel Tone (GK mode:Guitar)",
    new UByteField(-50, 50, { encodedOffset: 50 })
  ),
  nylonBody_guitar: new FieldDefinition(
    pack7(0x0036),
    "Nylon Body (GK mode:Guitar)",
    new UByteField(0, 100)
  ),
  nylonAttack_guitar: new FieldDefinition(
    pack7(0x0037),
    "Nylon Attack (GK mode:Guitar)",
    new UByteField(0, 100)
  ),
  nylonTone_guitar: new FieldDefinition(
    pack7(0x0038),
    "Nylon Tone (GK mode:Guitar)",
    new UByteField(-50, 50, { encodedOffset: 50 })
  ),
  sitarPickup_guitar: new FieldDefinition(
    pack7(0x0039),
    "Sitar Pickup (GK mode:Guitar)",
    enumField(["FRONT", "R+F", "REAR", "PIEZO"] as const)
  ),
  sitarSens_guitar: new FieldDefinition(
    pack7(0x003a),
    "Sitar Sens (GK mode:Guitar)",
    new UByteField(0, 100)
  ),
  sitarBody_guitar: new FieldDefinition(
    pack7(0x003b),
    "Sitar Body (GK mode:Guitar)",
    new UByteField(0, 100)
  ),
  sitarColor_guitar: new FieldDefinition(
    pack7(0x003c),
    "Sitar Color (GK mode:Guitar)",
    new UByteField(0, 100)
  ),
  sitarDecay_guitar: new FieldDefinition(
    pack7(0x003d),
    "Sitar Decay (GK mode:Guitar)",
    new UByteField(0, 100)
  ),
  sitarBuzz_guitar: new FieldDefinition(
    pack7(0x003e),
    "Sitar Buzz (GK mode:Guitar)",
    new UByteField(0, 100)
  ),
  sitarAttack_guitar: new FieldDefinition(
    pack7(0x003f),
    "Sitar Attack (GK mode:Guitar)",
    new UByteField(0, 100)
  ),
  sitarTone_guitar: new FieldDefinition(
    pack7(0x0040),
    "Sitar Tone (GK mode:Guitar)",
    new UByteField(-50, 50, { encodedOffset: 50 })
  ),
  banjoAttack_guitar: new FieldDefinition(
    pack7(0x0041),
    "Banjo Attack (GK mode:Guitar)",
    new UByteField(0, 100)
  ),
  banjoReso_guitar: new FieldDefinition(
    pack7(0x0042),
    "Banjo Reso (GK mode:Guitar)",
    new UByteField(0, 100)
  ),
  banjoTone_guitar: new FieldDefinition(
    pack7(0x0043),
    "Banjo Tone (GK mode:Guitar)",
    new UByteField(-50, 50, { encodedOffset: 50 })
  ),
  resoSustain_guitar: new FieldDefinition(
    pack7(0x0044),
    "Reso Sustain (GK mode:Guitar)",
    new UByteField(0, 100)
  ),
  resoResonance_guitar: new FieldDefinition(
    pack7(0x0045),
    "Reso Resonance (GK mode:Guitar)",
    new UByteField(0, 100)
  ),
  resoTone_guitar: new FieldDefinition(
    pack7(0x0046),
    "Reso Tone (GK mode:Guitar)",
    new UByteField(-50, 50, { encodedOffset: 50 })
  ),
  eBassRearVolume_guitar: new FieldDefinition(
    pack7(0x0047),
    "E. Bass Rear Volume (GK mode:Guitar)",
    new UByteField(0, 100)
  ),
  eBassFrontVolume_guitar: new FieldDefinition(
    pack7(0x0048),
    "E. Bass Front Volume (GK mode:Guitar)",
    new UByteField(0, 100)
  ),
  eBassVolume_guitar: new FieldDefinition(
    pack7(0x0049),
    "E. Bass Volume (GK mode:Guitar)",
    new UByteField(0, 100)
  ),
  eBassTone_guitar: new FieldDefinition(
    pack7(0x004a),
    "E. Bass Tone (GK mode:Guitar)",
    new UByteField(0, 100)
  ),
  gr300Mode_guitar: new FieldDefinition(
    pack7(0x004b),
    "GR-300 Mode (GK mode:Guitar)",
    enumField(["VCO", "V+D", "DIST"] as const)
  ),
  gr300Comp_guitar: new FieldDefinition(
    pack7(0x004c),
    "GR-300 Comp (GK mode:Guitar)",
    booleanField
  ),
  gr300Cutoff_guitar: new FieldDefinition(
    pack7(0x004d),
    "GR-300 Cutoff (GK mode:Guitar)",
    new UByteField(0, 100)
  ),
  gr300Resonance_guitar: new FieldDefinition(
    pack7(0x004e),
    "GR-300 Resonance (GK mode:Guitar)",
    new UByteField(0, 100)
  ),
  gr300EnvModSwitch_guitar: new FieldDefinition(
    pack7(0x004f),
    "GR-300 Env Mod Switch (GK mode:Guitar)",
    enumField(["OFF", "ON", "INV"] as const)
  ),
  gr300EnvModSens_guitar: new FieldDefinition(
    pack7(0x0050),
    "GR-300 Env Mod Sens (GK mode:Guitar)",
    new UByteField(0, 100)
  ),
  gr300EnvModAttack_guitar: new FieldDefinition(
    pack7(0x0051),
    "GR-300 Env Mod Attack (GK mode:Guitar)",
    new UByteField(0, 100)
  ),
  gr300PitchSwitch_guitar: new FieldDefinition(
    pack7(0x0052),
    "GR-300 Pitch Switch (GK mode:Guitar)",
    enumField(["OFF", "A", "B"] as const)
  ),
  gr300PitchA_guitar: new FieldDefinition(
    pack7(0x0053),
    "GR-300 Pitch A (GK mode:Guitar)",
    new UByteField(-12, 12, { encodedOffset: 12 })
  ),
  gr300PitchAFine_guitar: new FieldDefinition(
    pack7(0x0054),
    "GR-300 Pitch A Fine (GK mode:Guitar)",
    new UByteField(-50, 50, { encodedOffset: 50 })
  ),
  gr300PitchB_guitar: new FieldDefinition(
    pack7(0x0055),
    "GR-300 Pitch B (GK mode:Guitar)",
    new UByteField(-12, 12, { encodedOffset: 12 })
  ),
  gr300PitchBFine_guitar: new FieldDefinition(
    pack7(0x0056),
    "GR-300 Pitch B Fine (GK mode:Guitar)",
    new UByteField(-50, 50, { encodedOffset: 50 })
  ),
  gr300PitchDuet_guitar: new FieldDefinition(
    pack7(0x0057),
    "GR-300 Pitch Duet (GK mode:Guitar)",
    booleanField
  ),
  gr300SweepSwitch_guitar: new FieldDefinition(
    pack7(0x0058),
    "GR-300 Sweep Switch (GK mode:Guitar)",
    booleanField
  ),
  gr300SweepRise_guitar: new FieldDefinition(
    pack7(0x0059),
    "GR-300 Sweep Rise (GK mode:Guitar)",
    new UByteField(0, 100)
  ),
  gr300SweepFall_guitar: new FieldDefinition(
    pack7(0x005a),
    "GR-300 Sweep Fall (GK mode:Guitar)",
    new UByteField(0, 100)
  ),
  gr300VibratoSwitch_guitar: new FieldDefinition(
    pack7(0x005b),
    "GR-300 Vibrato Switch (GK mode:Guitar)",
    booleanField
  ),
  gr300VibratoRate_guitar: new FieldDefinition(
    pack7(0x005c),
    "GR-300 Vibrato Rate (GK mode:Guitar)",
    new UByteField(0, 100)
  ),
  gr300VibratoDepth_guitar: new FieldDefinition(
    pack7(0x005d),
    "GR-300 Vibrato Depth (GK mode:Guitar)",
    new UByteField(0, 100)
  ),
  waveSynthType_guitar: new FieldDefinition(
    pack7(0x005e),
    "Wave Synth Type (GK mode:Guitar)",
    waveSynthTypeField
  ),
  waveSynthColor_guitar: new FieldDefinition(
    pack7(0x005f),
    "Wave Synth Color (GK mode:Guitar)",
    new UByteField(0, 100)
  ),
  filterBassCutoff_guitar: new FieldDefinition(
    pack7(0x0060),
    "Filter Bass Cutoff (GK mode:Guitar)",
    new UByteField(0, 100)
  ),
  filterBassResonance_guitar: new FieldDefinition(
    pack7(0x0061),
    "Filter Bass Resonance (GK mode:Guitar)",
    new UByteField(0, 100)
  ),
  filterBassFilterDecay_guitar: new FieldDefinition(
    pack7(0x0062),
    "Filter Bass Filter Decay (GK mode:Guitar)",
    new UByteField(0, 100)
  ),
  filterBassTouchSens_guitar: new FieldDefinition(
    pack7(0x0063),
    "Filter Bass Touch Sens (GK mode:Guitar)",
    new UByteField(0, 100)
  ),
  filterBassColor_guitar: new FieldDefinition(
    pack7(0x0064),
    "Filter Bass Color (GK mode:Guitar)",
    new UByteField(0, 100)
  ),
  crystalAttackLength_guitar: new FieldDefinition(
    pack7(0x0065),
    "Crystal Attack Length (GK mode:Guitar)",
    new UByteField(0, 100)
  ),
  crystalModTune_guitar: new FieldDefinition(
    pack7(0x0066),
    "Crystal Mod Tune (GK mode:Guitar)",
    new UByteField(0, 100)
  ),
  crystalModDepth_guitar: new FieldDefinition(
    pack7(0x0067),
    "Crystal Mod Depth (GK mode:Guitar)",
    new UByteField(0, 100)
  ),
  crystalAttackLevel_guitar: new FieldDefinition(
    pack7(0x0068),
    "Crystal Attack Level (GK mode:Guitar)",
    new UByteField(0, 100)
  ),
  crystalBody_guitar: new FieldDefinition(
    pack7(0x0069),
    "Crystal Body (GK mode:Guitar)",
    new UByteField(0, 100)
  ),
  crystalSustain_guitar: new FieldDefinition(
    pack7(0x006a),
    "Crystal Sustain (GK mode:Guitar)",
    new UByteField(0, 100)
  ),
  organFeet16_guitar: new FieldDefinition(
    pack7(0x006b),
    "Organ Feet16 (GK mode:Guitar)",
    new UByteField(0, 100)
  ),
  organFeet8_guitar: new FieldDefinition(
    pack7(0x006c),
    "Organ Feet8 (GK mode:Guitar)",
    new UByteField(0, 100)
  ),
  organFeet4_guitar: new FieldDefinition(
    pack7(0x006d),
    "Organ Feet4 (GK mode:Guitar)",
    new UByteField(0, 100)
  ),
  organSustain_guitar: new FieldDefinition(
    pack7(0x006e),
    "Organ Sustain (GK mode:Guitar)",
    new UByteField(0, 100)
  ),
  brassCutoff_guitar: new FieldDefinition(
    pack7(0x006f),
    "Brass Cutoff (GK mode:Guitar)",
    new UByteField(0, 100)
  ),
  brassResonance_guitar: new FieldDefinition(
    pack7(0x0070),
    "Brass Resonance (GK mode:Guitar)",
    new UByteField(0, 100)
  ),
  brassTouchSens_guitar: new FieldDefinition(
    pack7(0x0071),
    "Brass Touch Sens (GK mode:Guitar)",
    new UByteField(0, 100)
  ),
  brassSustain_guitar: new FieldDefinition(
    pack7(0x0072),
    "Brass Sustain (GK mode:Guitar)",
    new UByteField(0, 100)
  ),
  eGuitarPickupSelect3_bass: new FieldDefinition(
    pack7(0x0110),
    "E.Guitar Pickup Select 3 (GK mode:Bass)",
    enumField(["REAR", "R+F", "FRONT"] as const)
  ),
  eGuitarPickupSelect5_bass: new FieldDefinition(
    pack7(0x0111),
    "E.Guitar Pickup Select 5 (GK mode:Bass)",
    enumField(["REAR", "R+C", "CENTER", "C+F", "FRONT"] as const)
  ),
  eGuitarVolume_bass: new FieldDefinition(
    pack7(0x0112),
    "E.Guitar Volume (GK mode:Bass)",
    new UByteField(0, 100)
  ),
  eGuitarTone_bass: new FieldDefinition(
    pack7(0x0113),
    "E.Guitar Tone (GK mode:Bass)",
    new UByteField(0, 100)
  ),
  eBassRearVolume_bass: new FieldDefinition(
    pack7(0x0114),
    "E.Bass Rear Volume (GK mode:Bass)",
    new UByteField(0, 100)
  ),
  eBassFrontVolume_bass: new FieldDefinition(
    pack7(0x0115),
    "E.Bass Front Volume (GK mode:Bass)",
    new UByteField(0, 100)
  ),
  eBassVolume_bass: new FieldDefinition(
    pack7(0x0116),
    "E.Bass Volume (GK mode:Bass)",
    new UByteField(0, 100)
  ),
  eBassTone_bass: new FieldDefinition(
    pack7(0x0117),
    "E.Bass Tone (GK mode:Bass)",
    new UByteField(0, 100)
  ),
  eBassTreble_bass: new FieldDefinition(
    pack7(0x0118),
    "E.Bass Treble (GK mode:Bass)",
    new UByteField(0, 100)
  ),
  eBassBass_bass: new FieldDefinition(
    pack7(0x0119),
    "E.Bass Bass (GK mode:Bass)",
    new UByteField(0, 100)
  ),
  eBassActiveTreble_bass: new FieldDefinition(
    pack7(0x011a),
    "E.Bass Active Treble (GK mode:Bass)",
    new UByteField(0, 100)
  ),
  eBassActiveBass_bass: new FieldDefinition(
    pack7(0x011b),
    "E.Bass Active Bass (GK mode:Bass)",
    new UByteField(0, 100)
  ),
  eBassRearTone_bass: new FieldDefinition(
    pack7(0x011c),
    "E.Bass Rear Tone (GK mode:Bass)",
    new UByteField(0, 100)
  ),
  eBassFrontTone_bass: new FieldDefinition(
    pack7(0x011d),
    "E.Bass Front Tone (GK mode:Bass)",
    new UByteField(0, 100)
  ),
  eBassPickupSelect_bass: new FieldDefinition(
    pack7(0x011e),
    "E.Bass Pickup Select (GK mode:Bass)",
    enumField(["REAR", "R+F", "FRONT"] as const)
  ),
  eBassTrebleSwitch_bass: new FieldDefinition(
    pack7(0x011f),
    "E.Bass Treble Switch (GK mode:Bass)",
    booleanField
  ),
  eBassBassSwitch_bass: new FieldDefinition(
    pack7(0x0120),
    "E.Bass Bass Switch (GK mode:Bass)",
    booleanField
  ),
  eBassRhythmSoloSwitch_bass: new FieldDefinition(
    pack7(0x0121),
    "E.Bass Rhythm/Solo Switch (GK mode:Bass)",
    new BooleanField("RHYTHM", "SOLO")
  ),

  gr300Mode_bass: new FieldDefinition(
    pack7(0x0122),
    "GR-300 Mode (GK mode:Bass)",
    enumField(["VCO", "V+D", "DIST"] as const)
  ),
  gr300Comp_bass: new FieldDefinition(
    pack7(0x0123),
    "GR-300 Comp (GK mode:Bass)",
    booleanField
  ),
  gr300Cutoff_bass: new FieldDefinition(
    pack7(0x0124),
    "GR-300 Cutoff (GK mode:Bass)",
    new UByteField(0, 100)
  ),
  gr300Resonance_bass: new FieldDefinition(
    pack7(0x0125),
    "GR-300 Resonance (GK mode:Bass)",
    new UByteField(0, 100)
  ),
  gr300EnvModSwitch_bass: new FieldDefinition(
    pack7(0x0126),
    "GR-300 Env Mod Switch (GK mode:Bass)",
    enumField(["OFF", "ON", "INV"] as const)
  ),
  gr300EnvModSens_bass: new FieldDefinition(
    pack7(0x0127),
    "GR-300 Env Mod Sens (GK mode:Bass)",
    new UByteField(0, 100)
  ),
  gr300EnvModAttack_bass: new FieldDefinition(
    pack7(0x0128),
    "GR-300 Env Mod Attack (GK mode:Bass)",
    new UByteField(0, 100)
  ),
  gr300PitchSwitch_bass: new FieldDefinition(
    pack7(0x0129),
    "GR-300 Pitch Switch (GK mode:Bass)",
    enumField(["OFF", "A", "B"] as const)
  ),
  gr300PitchA_bass: new FieldDefinition(
    pack7(0x012a),
    "GR-300 Pitch A (GK mode:Bass)",
    new UByteField(-12, 12, { encodedOffset: 12 })
  ),
  gr300PitchAFine_bass: new FieldDefinition(
    pack7(0x012b),
    "GR-300 Pitch A Fine (GK mode:Bass)",
    new UByteField(-50, 50, { encodedOffset: 50 })
  ),
  gr300PitchB_bass: new FieldDefinition(
    pack7(0x012c),
    "GR-300 Pitch B (GK mode:Bass)",
    new UByteField(-12, 12, { encodedOffset: 12 })
  ),
  gr300PitchBFine_bass: new FieldDefinition(
    pack7(0x012d),
    "GR-300 Pitch B Fine (GK mode:Bass)",
    new UByteField(-50, 50, { encodedOffset: 50 })
  ),
  gr300PitchDuet_bass: new FieldDefinition(
    pack7(0x012e),
    "GR-300 Pitch Duet (GK mode:Bass)",
    booleanField
  ),
  gr300SweepSwitch_bass: new FieldDefinition(
    pack7(0x012f),
    "GR-300 Sweep Switch (GK mode:Bass)",
    booleanField
  ),
  gr300SweepRise_bass: new FieldDefinition(
    pack7(0x0130),
    "GR-300 Sweep Rise (GK mode:Bass)",
    new UByteField(0, 100)
  ),
  gr300SweepFall_bass: new FieldDefinition(
    pack7(0x0131),
    "GR-300 Sweep Fall (GK mode:Bass)",
    new UByteField(0, 100)
  ),
  gr300VibratoSwitch_bass: new FieldDefinition(
    pack7(0x0132),
    "GR-300 Vibrato Switch (GK mode:Bass)",
    booleanField
  ),
  gr300VibratoRate_bass: new FieldDefinition(
    pack7(0x0133),
    "GR-300 Vibrato Rate (GK mode:Bass)",
    new UByteField(0, 100)
  ),
  gr300VibratoDepth_bass: new FieldDefinition(
    pack7(0x0134),
    "GR-300 Vibrato Depth (GK mode:Bass)",
    new UByteField(0, 100)
  ),
  waveSynthType_bass: new FieldDefinition(
    pack7(0x0135),
    "Wave Synth Type (GK mode:Bass)",
    waveSynthTypeField
  ),
  waveSynthColor_bass: new FieldDefinition(
    pack7(0x0136),
    "Wave Synth Color (GK mode:Bass)",
    new UByteField(0, 100)
  ),
  filterBassCutoff_bass: new FieldDefinition(
    pack7(0x0137),
    "Filter Bass Cutoff (GK mode:Bass)",
    new UByteField(0, 100)
  ),
  filterBassResonance_bass: new FieldDefinition(
    pack7(0x0138),
    "Filter Bass Resonance (GK mode:Bass)",
    new UByteField(0, 100)
  ),
  filterBassFilterDecay_bass: new FieldDefinition(
    pack7(0x0139),
    "Filter Bass Filter Decay (GK mode:Bass)",
    new UByteField(0, 100)
  ),
  filterBassTouchSens_bass: new FieldDefinition(
    pack7(0x013a),
    "Filter Bass Touch Sens (GK mode:Bass)",
    new UByteField(0, 100)
  ),
  filterBassColor_bass: new FieldDefinition(
    pack7(0x013b),
    "Filter Bass Color (GK mode:Bass)",
    new UByteField(0, 100)
  ),
  crystalAttackLength_bass: new FieldDefinition(
    pack7(0x013c),
    "Crystal Attack Length (GK mode:Bass)",
    new UByteField(0, 100)
  ),
  crystalModTune_bass: new FieldDefinition(
    pack7(0x013d),
    "Crystal Mod Tune (GK mode:Bass)",
    new UByteField(0, 100)
  ),
  crystalModDepth_bass: new FieldDefinition(
    pack7(0x013e),
    "Crystal Mod Depth (GK mode:Bass)",
    new UByteField(0, 100)
  ),
  crystalAttackLevel_bass: new FieldDefinition(
    pack7(0x013f),
    "Crystal Attack Level (GK mode:Bass)",
    new UByteField(0, 100)
  ),
  crystalBody_bass: new FieldDefinition(
    pack7(0x0140),
    "Crystal Body (GK mode:Bass)",
    new UByteField(0, 100)
  ),
  crystalSustain_bass: new FieldDefinition(
    pack7(0x0141),
    "Crystal Sustain (GK mode:Bass)",
    new UByteField(0, 100)
  ),
  organFeet16_bass: new FieldDefinition(
    pack7(0x0142),
    "Organ Feet16 (GK mode:Bass)",
    new UByteField(0, 100)
  ),
  organFeet8_bass: new FieldDefinition(
    pack7(0x0143),
    "Organ Feet8 (GK mode:Bass)",
    new UByteField(0, 100)
  ),
  organFeet4_bass: new FieldDefinition(
    pack7(0x0144),
    "Organ Feet4 (GK mode:Bass)",
    new UByteField(0, 100)
  ),
  organSustain_bass: new FieldDefinition(
    pack7(0x0145),
    "Organ Sustain (GK mode:Bass)",
    new UByteField(0, 100)
  ),
  brassCutoff_bass: new FieldDefinition(
    pack7(0x0146),
    "Brass Cutoff (GK mode:Bass)",
    new UByteField(0, 100)
  ),
  brassResonance_bass: new FieldDefinition(
    pack7(0x0147),
    "Brass Resonance (GK mode:Bass)",
    new UByteField(0, 100)
  ),
  brassTouchSens_bass: new FieldDefinition(
    pack7(0x0148),
    "Brass Touch Sens (GK mode:Bass)",
    new UByteField(0, 100)
  ),
  brassSustain_bass: new FieldDefinition(
    pack7(0x0149),
    "Brass Sustain (GK mode:Bass)",
    new UByteField(0, 100)
  ),
};

export const PatchPCMToneStruct = {
  toneBankSelectMSB: new FieldDefinition(
    pack7(0x0000),
    "Tone Bank Select MSB (CC #0)",
    // Doesn't seem like there's ever a reason to write to this field
    new ReservedField()
  ),
  toneSelect: new FieldDefinition(
    pack7(0x0001),
    "Tone Select",
    // TODO: Encode and render categories (source here: https://www.vguitarforums.com/smf/index.php?topic=3060.0)
    enumField(
      [
        "St.Piano 1",
        "St.Piano 2",
        "St.Piano 3",
        "St.Piano 4",
        "St.Piano 5",
        "Brite Piano",
        "Stage Piano",
        "Honky Tonk",
        "LoFi Piano",
        "Piano 1",
        "Piano 1 w",
        "European Pf",
        "Piano 2",
        "Piano 2 w",
        "Honky-tonk",
        "Honky-tonk w",
        "Pop Piano 1",
        "Pop Piano 2",
        "Pop Piano 3",
        "Piano 3",
        "Piano 3 w",
        "Stage EP 1",
        "Stage EP 2",
        "Stage EP Trm",
        "Tremolo EP 1",
        "E. Piano 1",
        "E. Piano 2",
        "E. Piano 3",
        "E. Piano 4",
        "E. Piano 5",
        "E. Piano 6",
        "Dyno EP",
        "Dyno EP Trm",
        "Tremolo EP 2",
        "Back2the60s",
        "Tine EP",
        "SA EP 1",
        "SA EP 2",
        "Psy EP",
        "Wurly EP",
        "Wurly EP Trm",
        "Curly Wurly",
        "Super Wurly",
        "E. Piano 7",
        "St. Soft EP",
        "Wurly",
        "EP Legend 1",
        "EP Belle",
        "80's EP",
        "FM EP 1",
        "FM EP 2",
        "Sinus EP",
        "Spirit Tines",
        "EP Legend 2",
        "E. Piano 8",
        "Detuned EP",
        "St. FM EP",
        "EP Legend 3",
        "EP Phase",
        "Rock Organ 1",
        "Rock Organ 2",
        "Rock Organ 3",
        "Rock Organ 4",
        "Rock Organ 5",
        "RotaryOrgan1",
        "RotaryOrgan2",
        "Perc.Organ 1",
        "Perc.Organ 2",
        "Perc.Organ 3",
        "E.Organ 1",
        "E.Organ 2",
        "E.Organ 3",
        "E.Organ 4",
        "E.Organ 5",
        "E.Organ 6",
        "E.Organ 7",
        "70's E.Org 1",
        "70's E.Org 2",
        "Ana Organ 1",
        "Ana Organ 2",
        "Ana Organ 3",
        "Ana Organ 4",
        "Ana Organ 5",
        "Organ 1",
        "Trem. Organ",
        "60's Organ",
        "70's E.Organ",
        "Organ 2",
        "Chorus Organ",
        "Perc.Organ 4",
        "Organ 3",
        "Grand Pipes",
        "Church Org 1",
        "Church Org 2",
        "Church Org 3",
        "Puff Organ",
        "Reed Organ",
        "Harpsichord1",
        "Harpsichord2",
        "Coupled Hps",
        "Harpsi w",
        "Harpsi o",
        "Clav 1",
        "Pulse Clav 1",
        "Sweepin Clav 1",
        "Analog Clav",
        "Biting Clav",
        "Pulse Clv St",
        "Clav 2",
        "Pulse Clav 2",
        "Celesta",
        "AccordionIt2",
        "Musette",
        "Vodkakordion",
        "Accordion Fr",
        "Accordion It",
        "Bandoneon",
        "Harmonica 1",
        "Harmonica 2",
        "FM Sparkles",
        "Fm Syn Bell",
        "FM Heaven",
        "Dreaming Bel",
        "Analog Bell",
        "Music Box 1",
        "Music Bells",
        "Kalimbells",
        "Bell 1",
        "Bell 2",
        "Icy Keys",
        "Carillon 1",
        "Tower Bell",
        "Tubularbell2",
        "Bell Ring",
        "Music Box 2",
        "TubularBells",
        "Church Bell",
        "Carillon 2",
        "Crystal",
        "Tinkle Bell",
        "Toy Box",
        "Vibraphone 1",
        "VibraphoneTr",
        "Tremolo Vib",
        "Marimba 1",
        "Marimba 2",
        "Steel Drums 1",
        "Xylophone 1",
        "Xylophone 2",
        "Ethno Keys",
        "Soft StlDrm",
        "Jazz Vib",
        "BsMarimba 1",
        "BsMarimba 2",
        "Sine Mallet",
        "Glockenspeil",
        "Vibraphone 2",
        "Vibraphone w",
        // NOTE: Listed as "Marimba 2" which is a duplicate
        "Marimba 2*",
        "Marimba w",
        "Xylophone 3",
        "SteelDrums 2",
        "Nylon Gtr 1",
        "Nylon Gtr 2",
        "Nylon Gtr 3",
        "Nylon Gtr 4",
        "Wet Nyln Gtr",
        "Ukulele 1",
        "Folk Gtr 1",
        "Folk Gtr 2",
        "Folk Gtr 3",
        "Latin Gtr",
        "Nylon Gtr 5",
        "Ukulele 2",
        "Nylon Gtr 5o",
        "Nylon Gtr 6",
        "Steel-str.Gt",
        "12-str. Gtr",
        "Steel + Body",
        "Gt FretNoise",
        "Clean Gtr 1",
        "Clean Gtr 2",
        "Clean Gtr 3",
        "JazzGuitar 1",
        "Pick E.Gtr",
        "FunkGuitar 1",
        "Wet E.Gtr",
        "PedalSteel 1",
        "JazzGuitar 2",
        "PedalSteel 2",
        "Clean Guitar",
        "Chorus Gtr",
        "Mid Tone Gtr",
        "Muted Guitar",
        "Funk Pop",
        "FunkGuitar 2",
        "Jazz Man",
        "Gt Cut Noise",
        "OverdriveGt1",
        "Dist Gtr 1",
        "Dist Gtr 2",
        "Dist Gtr 3",
        "OverdriveGtr2",
        "Guitar Pinch",
        "DistortionGt",
        "Gt Feedback1",
        "Dist Rtm Gtr",
        "Gt Harmonics",
        "Gt Feedback2",
        "AcousticBs 1",
        "AcousticBs 2",
        "AcousticBs 3",
        "String Slap",
        "FingeredBs 1",
        "FingeredBs 2",
        "FingeredBs 3",
        "Pick Bass",
        "FretlessBs 1",
        "FretlessBs 2",
        "Finger Slap2",
        "Return2Base!",
        "FingeredBs 4",
        "Finger Slap",
        "Picked Bass",
        "FretlessBs 3",
        "Slap Bass 1",
        "Slap Bass 2",
        "MG Bass 1",
        "MG Bass 2",
        "MG Bass 3",
        "Modular Bs 1",
        "Modular Bs 2",
        "PWM Bass 1",
        "PWM Bass 2",
        "Big Mini",
        "Fat Analog",
        "Spike Bass",
        "SH Bass",
        "Intrusive BS",
        "Synth Bass 1",
        "Synth Bass 2",
        "Synth Bass 3",
        "Synth Bass 4",
        "Synth Bass 5",
        "Synth Bass 6",
        "Synth Bass 7",
        "Synth Bass 8",
        "Synth Bass 9",
        "Synth Bass10",
        "Synth Bass11",
        "Synth Bass12",
        "Reso Bass 1",
        "Reso Bass 2",
        "Reso Bass 3",
        "Reso Bass 4",
        "Reso Bass 5",
        "Reso Bass 6",
        "Reso Bass 7",
        "Reso Bass 8",
        "Acid Bass 1",
        // NOTE: Listed as "Reso Bass 2" which is a duplicate
        "Reso Bass 2*",
        // NOTE: Listed as "Reso Bass 3" which is a duplicate
        "Reso Bass 3*",
        "Alpha Bass 1",
        "TB Bass 1",
        "TB Bass 2",
        "Alpha Bass 2",
        "Alpha ResoBs",
        "Nu Saw Bass",
        "Nu RnB SawBs",
        "Storm Bass",
        "Detuned Bass",
        "Gashed Bass",
        "Hi-Energy Bs",
        "Pedal Bass 1",
        "Monster Bass",
        "JunoSqr Bs 1",
        "JunoSqr Bs 2",
        "101 Bass",
        "106 Bass 1",
        "106 Bass 2",
        "Compu Bass 1",
        "Compu Bass 2",
        "Triangle Bs",
        "Muffled Bass",
        "Garage Bass",
        "TransistorBs",
        "Fazee Bass",
        "TB Bass 3",
        "TB Bass 4",
        "Acid Bass 4",
        "Acid Bass 5",
        "Acid Bass 6",
        "Brite Bass",
        "Pedal Bass 2",
        "Saw Bass",
        "Reso Bass 9",
        "Reso Bass 10",
        "Sub Bass",
        "Ramp Bass",
        "Fat Bass 1",
        "Fat Bass 2",
        "Fat Bass 3",
        "Flat Bass",
        "Electro Rubb",
        "80s Bass",
        "Synth Bass13",
        "SynthBass101",
        "Acid Bass 7",
        "Clav Bass",
        "Hammer Bass",
        "Synth Bass14",
        "SynSlap Bass",
        "Rubber Bass",
        "Attack Pulse",
        "Santur 1",
        "Santur 2",
        "Aerial Harp",
        "LostParadise",
        "Sitar 1",
        "Indian Frtls",
        "Sitar Pad",
        "Santur 3",
        "Mandolin",
        "Harp",
        "Yang Qin",
        "Sitar 2",
        "Sitar 3",
        "Banjo",
        "Shamisen",
        "Koto",
        "Taisho Koto",
        "Kalimba",
        "Violin 1",
        "Bright Vln",
        "Bright VC",
        "Violin 2",
        "Slow Violin",
        "Viola",
        "Cello",
        "Contrabass",
        "Fiddle",
        "Mood Strings",
        "Strings 1",
        "Strings 2",
        "Strings 3",
        "Strings 4",
        "Stage Str 1",
        "Stage Str 2",
        "Pop Str",
        "Marc. Str",
        "StringsStacc",
        "Pizz 1",
        "Pizz 2",
        "TapeStrings1",
        "TapeStrings2",
        "Hybrid Str",
        "Strings 5",
        "Hall Strings",
        "Tremolo Str",
        "PizzicatoStr",
        "Strings 6",
        "Oct Strings",
        "Slow Strings",
        "Orc. Unison 1",
        "Orc. Unison 2",
        "Full Orc",
        "Orchestra",
        "Trumpet 1",
        "Fr. Horn",
        "Trumpet 2",
        "Dark Trumpet",
        "Trombone 1",
        "Trombone 2",
        "Bright Tb",
        "Tuba",
        "MuteTrumpet1",
        "MuteTrumpet2",
        "French Horn",
        "Brass 1",
        "Brass 2",
        "Brass 3",
        "Brass 4",
        "F. Horn Sect",
        "Brass 5",
        "Brass 6",
        "Bassoon 1",
        "Oboe",
        "English Horn",
        "Bassoon 2",
        "Clarinet",
        "Bagpipe",
        "Shanai",
        "Flute 1",
        "Pan Flute 1",
        "Pan Pipes 1",
        "Shakuhachi 1",
        "Pan Pipes 2",
        "Piccolo",
        "Flute 2",
        "Pan Flute 2",
        "Bottle Blow",
        "Shakuhachi 2",
        "Breath Noise",
        "F1.Key Click",
        "Soprano Sax1",
        "BreathyTenor",
        "Tenor Sax 1",
        "Soprano Sax2",
        "Alto Sax",
        "Tenor Sax 2",
        "Baritone Sax",
        "Ocarina 1",
        "Recorder",
        "Whistle",
        "Ocarina 2",
        "Dreamvox 1",
        "Dreamvox 2",
        "Choir Pad",
        "Angels Choir",
        "Aerial Choir",
        "Doo Pad",
        "Humming 1",
        "Humming 2",
        "Gospel Hum",
        "Vox Pad 1",
        "Vox Pad 2",
        "80s Vox",
        "SynVox 1",
        "SynVox 2",
        "Mini Vox",
        "Chipmunk",
        "Sample Opera",
        "Sad Ceremony",
        "5th Voice",
        "Sop Vox",
        "Choir Aahs",
        "Chorus Aahs",
        "Voice Oohs",
        "Humming 3",
        "SynVox 3",
        "Analog Voice",
        "Space Voice",
        "Itopia",
        "Jazz Scat 1",
        "Jazz Scat 2",
        "Saw Lead 1",
        "Saw Lead 2",
        "Saw Lead 3",
        "Saw Lead 4",
        "Saw Lead 5",
        "Saw Lead 6",
        "Saw Lead 7",
        "Saw Lead 8",
        "Saw Lead 9",
        "GR300 Lead 1",
        "GR300 Lead 2",
        "Classic GR",
        "Bright GR",
        "Fat GR Lead",
        "MODified Ld",
        "Syn Lead 1",
        "Syn Lead 2",
        "Syn Lead 3",
        "Syn Lead 4",
        "Syn Lead 5",
        "Syn Lead 6",
        "Syn Lead 7",
        "Pro Fat Ld 1",
        "JupiterLead1",
        "JupiterLead2",
        "Porta Lead",
        "Classic Lead",
        "On Air",
        "Pro Fat Ld 2",
        "Wormy Lead",
        "Waspy Lead",
        "Brite ResoLd",
        "Brass Lead",
        "Legato Tkno",
        "Follow Me",
        "Octa Juice",
        "Juicy Jupe",
        "Octa Saw",
        "Vintager 1",
        "Vintager 2",
        "Sync Lead",
        "Octa Sync",
        "Leading Sync",
        "A Leader",
        "Hot Coffee",
        "Hot Sync",
        "Syncro Lead",
        "Space Solo",
        "Squareheads",
        "Mod Lead",
        "Alpha Spit",
        "Air Lead",
        "Pulstar Lead",
        "Therasaw",
        "Warmy Lead",
        "ResoSawLead",
        "Soft Reso Ld",
        "Reso Lead 1",
        "Reso Lead 2",
        "Reso Lead 3",
        "Reso Lead 4",
        "Reso Lead 5",
        "Juicy Lead",
        "DC Triangle",
        "Soft Lead 1",
        "Soft Lead 2",
        "Soft Lead 3",
        "Soft Lead 4",
        "Soft Lead 5",
        "Soft Lead 6",
        "Soft Lead 7",
        "Soft Lead 8",
        "Soft Lead 9",
        "Soft Lead 10",
        "Tri Lead",
        "Pulse Lead 1",
        "Pulse Lead 2",
        "Simple Tri",
        "Simple Sine",
        "Whistle Ld 1",
        "Whistle Ld 2",
        "Square Pipe",
        "CosmicDrops1",
        "Spooky Lead",
        "Pure Lead",
        "303 NRG",
        "Round SQR",
        "Brite SQR",
        "Square SAW",
        "Simple SQR",
        "Sqr Lead",
        "Atk Lead",
        "Octa Square",
        "CS Lead",
        "Mini Growl",
        "Hoover Again",
        "Tranceformer",
        "Juno SQR",
        "Pulse Lead 3",
        "Pulse Lead 4",
        "Ramp Lead 1",
        "Ramp Lead 2",
        "Saw Lead 10",
        "Sine Lead 1",
        "Sine Lead 2",
        "Dance Saws1",
        "Resoform",
        "Dance Saws2",
        "Square Wave",
        "MG Square",
        "2600 Sine",
        "Saw Wave",
        "OB2 Saw",
        "Doctor Solo",
        "Natural Lead",
        "Syn. Calliope",
        "Chiffer Lead",
        "Charang",
        "Wire Lead",
        "Solo Vox",
        "5th Saw Wave",
        "Bass & Lead",
        "Delayed Lead",
        "80s Brass 1",
        "80s Brass 2",
        "80s Brass 3",
        "80s Brass 4",
        "80s Brass 5",
        "80s Brass 6",
        "80s Brass 7",
        "80s Brass 8",
        "Soft SynBrs1",
        "Warm SynBrs",
        "Brite SynBrs",
        "Express Brs",
        "EuroExpress1",
        "JP Brass 1",
        "Juno Brass",
        "Ox Brass",
        "Reso Brass",
        "Wide SynBrs",
        "Soft SynBrs2",
        "JP Brass 2",
        "106 Brass",
        "Octa Brass",
        "Poly Brass 1",
        "Dual Saw Brs",
        "Jump Poly",
        "Reso Key 1",
        "EuroExpress2",
        "Ox Synth",
        "VintageBrs 1",
        "VintageBrs 2",
        "VintageBrs 3",
        "VintageBrs 4",
        "Poly Brass 2",
        "Synth Brass1",
        "JP Brass",
        "Oct SynBrass",
        "Jump Brass",
        "Synth Brass2",
        "SynBrass sfz",
        "Velo Brass",
        "Heaven Pad 1",
        "Heaven Pad 2",
        "Dreamheaven",
        "Oct Heaven",
        "Soft Pad 1",
        "Soft Pad 2",
        "Soft Pad 3",
        "Soft Pad 4",
        "Soft Pad 5",
        "Soft Pad 6",
        "Soft Pad 7",
        "Soft Pad 8",
        "Soft Pad 9",
        "Soft Pad 10",
        "VintageStr 1",
        "VintageStr 2",
        "VintageStr 3",
        "VintageStr 4",
        "VintageStr 5",
        "VintageStr 6",
        "VintageStr 7",
        "JX Strings",
        "JP Strings 1",
        "JP Strings 2",
        "106 Strings",
        "PWM Str 1",
        "PWM Str 2",
        "Fading Str",
        "ParadisePad",
        "80s Strings",
        "Stringship",
        "Airy Pad",
        "Neo RS-202",
        "Sawtooth Str",
        "Pulse Pad",
        "Hollow Pad 1",
        "WarmHeaven 1",
        "WarmHeaven 2 ",
        "Heaven Pad 3",
        "Heaven Pad 4 ",
        "FineWinePad1",
        "FineWinePad2",
        "5th Pad 1",
        "5th Pad 2",
        "Nu Epic Pad",
        "Angelis Pad",
        "TrnsSweepPad",
        "Giant Sweep",
        "Voyager",
        "Digital Pad",
        "NuSoundtrack",
        "Xadecimal",
        "Strobe Pad",
        "BUBBLE 2",
        "BUBBLE 3",
        "Soft PWM Pad",
        "Org Pad",
        "Hollow Pad 2",
        "SavannaPad 1",
        "SavannaPad 2",
        "SavannaPad 3",
        "PWM Str 3",
        "PWM Pad 2",
        "Str Machine",
        "Reso Pad",
        "BPF Pad",
        "Sweep Pad 2",
        "Sweep Pad 3 ",
        "Sweep Pad 4",
        "Scoop Pad 1",
        "Scoop Pad 2",
        "Brite Wine",
        "Wine Pad",
        "Syn. Strings1",
        "Syn. Strings3",
        "Syn. Strings2",
        "Warm Pad",
        "Sine Pad",
        "Bowed Glass",
        "Metal Pad",
        "Halo Pad",
        "Sweep Pad",
        "Soundtrack",
        "Star Theme",
        "D50 Fantasy",
        "D50 Bell",
        "Dreambell",
        "Dreaming Box",
        "Air Key 1",
        "Sweet Keys",
        "Soft Bell",
        "Air Key 2",
        "Stacc Heaven",
        "DigitalDream",
        "Analog Dream",
        "Harp Pad",
        "Org Bell",
        "Fantasia",
        "Ice Rain",
        "Atmosphere",
        "Brightness",
        "Dream Trance",
        "Dream Saws",
        "Dream Pulse",
        "Trance Synth",
        "Trancy",
        "Trance Keys",
        "Trance Saws",
        "Auto Trance1",
        "Super Saws 1",
        "Analog Saws",
        "Uni-G",
        "Digitaless",
        "Bustranza",
        "Super Saws 2",
        "Poly Synth 1",
        "Poly Synth 2",
        "Poly Synth 3",
        "Poly Synth 4",
        "Poly Synth 5",
        "Poly Synth 6",
        "Juno Saw Key",
        "Saw Key 1",
        "Saw Key 2",
        "Waspy Synth",
        "Vintage Key",
        "Ju-D Fifths",
        "Reso Key 2",
        "Fat Synth",
        "DOC Stack",
        "2 Saws",
        "Hi Saw Band",
        "Brite Synth",
        "PWM Pad 1",
        "RAVtune",
        "Heaven Key",
        "Pipe Key",
        "Shroomy",
        "AnalogDays 1",
        "Sync Key",
        "Detune Ramp",
        "Reso Saw",
        "EuroExpress3",
        "Sweep Saw",
        "Poly Synth 7",
        "Syn Mallet",
        "Enigmatic",
        "Planetz",
        "Shimmer Pad",
        "Sci-Fi",
        "ResoSweep Dn",
        "Jet Noise",
        "Brandish",
        "909 Fx",
        "Zap",
        "Polysweep Nz",
        "Passing By",
        "Lazer Points",
        "CosmicDrops2",
        "Crystal Fx",
        "Crystal Ice",
        "Mad Noise",
        "Robot Sci-Fi",
        "Computer 1",
        "Computer 2",
        "S&H Noise",
        "S&H Ramp",
        "S&H PWM",
        "S&H Saw 1",
        "S&H Saw 2",
        "Electrostar",
        "Alpha Said",
        "FX Ramp",
        "Bubble 1",
        "Goblin",
        "Echo Drops",
        "Echo Bell",
        "Analog Seq",
        "Seq Pop",
        "Periscope",
        "Major 7",
        "Juno-D Maj7",
        "Sweet House",
        "Detune Saws",
        "Melodic Drum",
        "Detune Seq",
        "SequencedSaw",
        "Echo Pan",
        "PanninFormnt",
        "Fairy's Song",
        "Atmospherics",
        "StrobeBell 1",
        "StrobeBell 2",
        "Flying Pad 1",
        "Flying Pad 2",
        "Flying Pad 3",
        "Flying Pad 4",
        "Flying Pad 5",
        "Sine Magic",
        "Pulsatron",
        "Motion Bass",
        "Trance Splt",
        "Rhythmic 5th",
        "Rhythmic 1",
        "Rhythmic 2",
        "Mega Sync 1",
        "StrobeBell 3",
        "Strobe 1",
        "Strobe 2",
        "Strobe 3",
        "Strobe 4",
        "LFO Saw",
        "Keep Going",
        "Keep Running",
        "Electrons",
        "BriskVortex",
        "LFO Vox",
        "Pulsasaw",
        "Arposphere",
        "Mega Sync 2",
        "Compusonic 1",
        "Compusonic 2",
        "Compusonic 3",
        "Compusonic 4",
        "Compusonic 5",
        "AnalogDays 2",
        "Groove 007",
        "Juno Pop",
        "Auto Trance2",
        "In Da Groove",
        "80s Beat",
        "Cheezy Movie",
        "Mod Chord",
        "Housechord",
        "OrchestraHit",
        "Bass Hit",
        "6th Hit",
        "Euro Hit",
        "Scratch 1",
        "Seashore",
        "Rain",
        "Thunder",
        "Wind",
        "Stream",
        "Bubble",
        "Bird 1",
        "Dog",
        "Horse Gallop",
        "Bird 2",
        "Telephone 1",
        "Telephone 2",
        "DoorCreaking",
        "Door",
        "Scratch 2",
        "Wind Chimes",
        "Helicopter",
        "Car Engine",
        "Car Stop",
        "Car Pass",
        "Car Crash",
        "Siren",
        "Train",
        "Jetplane",
        "Starship",
        "Burst Noise",
        "Applause",
        "Laughing",
        "Screaming",
        "Punch",
        "Heart Beat",
        "Footsteps",
        "Gun Shot",
        "Machine Gun",
        "Laser Gun",
        "Explosion",
        "Ride Cymbal",
        "Timpani",
        "Agogo",
        "Woodblock",
        "Castanets",
        "Taiko",
        "Concert BD",
        "Melo. Tom 1",
        "Melo. Tom 2",
        "Synth Drum",
        "808 Tom",
        "Elec Perc",
        "Reverse Cymb",
        "Standard 1",
        "Standard 2",
        "Standard 3",
        "Rock Kit",
        "Jazz Kit",
        "Brush Kit",
        "Machine Kit",
        "R&B T-Analog",
        "R&B Mini Kit",
        "HipHop Kit",
        "R&B Kit",
        "Dance Kit 1",
        "Dance Kit 2",
        "Dance Kit 3",
      ],
      new UWordField(0, 909)
    )
  ),
  // toneBankSelectLSB: new FieldDefinition(
  //   pack7(0x0001),
  //   "Tone Bank Select LSB (CC #32)",
  //   new UByteField(0, 127)
  // ),
  // toneProgramNumber: new FieldDefinition(
  //   pack7(0x0002),
  //   "Tone Program Number (PC)",
  //   new UByteField(0, 127)
  // ),
  muteSwitch: new FieldDefinition(
    pack7(0x0003),
    "Mute Switch",
    invertedMuteField
  ),
  partLevel: new FieldDefinition(pack7(0x0004), "Part Level", new C127Field()),
  partOctaveShift: new FieldDefinition(
    pack7(0x0005),
    "Part Octave Shift",
    new UByteField(-3, 3, { encodedOffset: 64 })
  ),
  chromatic: new FieldDefinition(pack7(0x0006), "Chromatic", booleanField),
  legatoSwitch: new FieldDefinition(
    pack7(0x0007),
    "Legato Switch",
    booleanField
  ),
  nuanceSwitch: new FieldDefinition(
    pack7(0x0008),
    "Nuance Switch",
    booleanField
  ),
  partPan: new FieldDefinition(pack7(0x0009), "Part Pan", c64PanField),
  partCoarseTune: new FieldDefinition(
    pack7(0x000a),
    "Part Coarse Tune",
    new UByteField(-24, 24, { encodedOffset: 64 })
  ),
  partFineTune: new FieldDefinition(
    pack7(0x000b),
    "Part Fine Tune",
    new UByteField(-50, 50, { encodedOffset: 64 })
  ),
  partPortamentoSwitch: new FieldDefinition(
    pack7(0x000c),
    "Part Portamento Switch",
    enumField(["OFF", "ON", "TONE"] as const)
  ),
  portamentoTime: new FieldDefinition(
    pack7(0x000d),
    "Portamento Time",
    new C127Field(new USplit8Field(0, 127))
  ),
  releaseMode: new FieldDefinition(
    pack7(0x000f),
    "Release Mode",
    // TODO: Nicer presentation
    enumField(["1", "2"] as const)
  ),
  string1Level: new FieldDefinition(
    pack7(0x0010),
    "String 1 Level",
    new C127Field()
  ),
  string2Level: new FieldDefinition(
    pack7(0x0011),
    "String 2 Level",
    new C127Field()
  ),
  string3Level: new FieldDefinition(
    pack7(0x0012),
    "String 3 Level",
    new C127Field()
  ),
  string4Level: new FieldDefinition(
    pack7(0x0013),
    "String 4 Level",
    new C127Field()
  ),
  string5Level: new FieldDefinition(
    pack7(0x0014),
    "String 5 Level",
    new C127Field()
  ),
  string6Level: new FieldDefinition(
    pack7(0x0015),
    "String 6 Level",
    new C127Field()
  ),
  partOutputMFXSelect: new FieldDefinition(
    pack7(0x0016),
    "Part Output MFX Select",
    toneLineSelectField
  ),
};

export const PatchPCMToneOffsetStruct = {
  tvfFilterType: new FieldDefinition(
    pack7(0x0000),
    "TVF Filter Type",
    enumField([
      "OFF",
      "LPF",
      "BPF",
      "HPF",
      "PKG",
      "LPF2",
      "LPF3",
      "TONE",
    ] as const)
  ),
  tvfCutoffFrequencyOffset: new FieldDefinition(
    pack7(0x0001),
    "TVF Cutoff Frequency Offset",
    new C63Field()
  ),
  tvfResonanceOffset: new FieldDefinition(
    pack7(0x0002),
    "TVF Resonance Offset",
    new C64Field()
  ),
  tvfCutoffVelocitySens: new FieldDefinition(
    pack7(0x0003),
    "TVF Cutoff Velocity Sens",
    new C64Field()
  ),
  tvfCutoffVelocityCurve: new FieldDefinition(
    pack7(0x0004),
    "TVF Cutoff Velocity Curve",
    velocityCurveField
  ),
  tvfCutoffKeyfollowOffset: new FieldDefinition(
    pack7(0x0005),
    "TVF Cutoff Keyfollow Offset",
    c200Field
  ),
  nuanceCutoffSens: new FieldDefinition(
    pack7(0x0006),
    "Nuance Cutoff Sens",
    new C63Field()
  ),
  tvfEnvDepthOffset: new FieldDefinition(
    pack7(0x0007),
    "TVF Env Depth Offset",
    new C63Field()
  ),
  tvfEnvTime1Offset: new FieldDefinition(
    pack7(0x0008),
    "TVF Env Time 1 Offset",
    new C64Field()
  ),
  tvfEnvTime2Offset: new FieldDefinition(
    pack7(0x0009),
    "TVF Env Time 2 Offset",
    new C64Field()
  ),
  tvfEnvLevel3Offset: new FieldDefinition(
    pack7(0x000a),
    "TVF Env Level 3 Offset",
    new C64Field()
  ),
  tvfEnvTime4Offset: new FieldDefinition(
    pack7(0x000b),
    "TVF Env Time 4 Offset",
    new C64Field()
  ),
  tvfEnvTime1VelocitySensOffset: new FieldDefinition(
    pack7(0x000c),
    "TVF Env Time 1 Velocity Sens Offset",
    new C63Field()
  ),
  tvfEnvTime1NuanceSensOffset: new FieldDefinition(
    pack7(0x000d),
    "TVF Env Time 1 Nuance Sens Offset",
    new C63Field()
  ),
  tvaLevelVelocitySensOffset: new FieldDefinition(
    pack7(0x000e),
    "TVA Level Velocity Sens Offset",
    new C63Field()
  ),
  tvaLevelVelocityCurve: new FieldDefinition(
    pack7(0x000f),
    "TVA Level Velocity Curve",
    velocityCurveField
  ),
  tvaEnvTime1Offset: new FieldDefinition(
    pack7(0x0010),
    "TVA Env Time 1 Offset",
    new C64Field()
  ),
  tvaEnvTime2Offset: new FieldDefinition(
    pack7(0x0011),
    "TVA Env Time 2 Offset",
    new C64Field()
  ),
  tvaEnvLevel3Offset: new FieldDefinition(
    pack7(0x0012),
    "TVA Env Level 3 Offset",
    new C64Field()
  ),
  tvaEnvTime4Offset: new FieldDefinition(
    pack7(0x0013),
    "TVA Env Time 4 Offset",
    new C64Field()
  ),
  tvaEnvTime1VelocitySensOffset: new FieldDefinition(
    pack7(0x0014),
    "TVA Env Time 1 Velocity Sens Offset",
    new C63Field()
  ),
  tvaEnvTime1NuanceSensOffset: new FieldDefinition(
    pack7(0x0015),
    "TVA Env Time 1 Nuance Sens Offset",
    new C63Field()
  ),
  nuanceLevelSens: new FieldDefinition(
    pack7(0x0016),
    "Nuance Level Sens",
    new C63Field()
  ),
  pitchEnvVelocitySensOffset: new FieldDefinition(
    pack7(0x0017),
    "Pitch Env Velocity Sens Offset",
    new C64Field()
  ),
  pitchEnvOffset: new FieldDefinition(
    pack7(0x0018),
    "Pitch Env Offset",
    new UByteField(-12, 12, { encodedOffset: 64 })
  ),
  pitchEnvTime1Offset: new FieldDefinition(
    pack7(0x0019),
    "Pitch Env Time 1 Offset",
    new C64Field()
  ),
  pitchEnvTime2Offset: new FieldDefinition(
    pack7(0x001a),
    "Pitch Env Time 2 Offset",
    new C64Field()
  ),
  partPortamentoType: new FieldDefinition(
    pack7(0x001b),
    "Part Portamento Type",
    enumField(["RATE", "TIME"] as const)
  ),
  lfo1Rate: new FieldDefinition(pack7(0x001c), "LFO1 Rate", toneRate150Field),
  lfo1PitchDepthOffset: new FieldDefinition(
    pack7(0x001e),
    "LFO1 Pitch Depth Offset",
    new C63OffField()
  ),
  lfo1TVFDepthOffset: new FieldDefinition(
    pack7(0x001f),
    "LFO1 TVF Depth Offset",
    new C63OffField()
  ),
  lfo1TVADepthOffset: new FieldDefinition(
    pack7(0x0020),
    "LFO1 TVA Depth Offset",
    new C63OffField()
  ),
  lfo1PanDepthOffset: new FieldDefinition(
    pack7(0x0021),
    "LFO1 Pan Depth Offset",
    new C63OffField()
  ),
  lfo2Rate: new FieldDefinition(pack7(0x0022), "LFO2 Rate", toneRate150Field),
  lfo2PitchDepthOffset: new FieldDefinition(
    pack7(0x0024),
    "LFO2 Pitch Depth Offset",
    new C63OffField()
  ),
  lfo2TVFDepthOffset: new FieldDefinition(
    pack7(0x0025),
    "LFO2 TVF Depth Offset",
    new C63OffField()
  ),
  lfo2TVADepthOffset: new FieldDefinition(
    pack7(0x0026),
    "LFO2 TVA Depth Offset",
    new C63OffField()
  ),
  lfo2PanDepthOffset: new FieldDefinition(
    pack7(0x0027),
    "LFO2 Pan Depth Offset",
    new C63OffField()
  ),
};

const PatchAssignStruct = {
  switch: new FieldDefinition(
    pack7(0x010c - 0x010c),
    "ASSIGN Switch",
    booleanField
  ),
  target: new FieldDefinition(
    pack7(0x010d - 0x010c),
    "ASSIGN Target",
    // TODO: enumerate targets and link to fields
    new USplit12Field(0, 1024)
  ),
  targetMin: new FieldDefinition(
    pack7(0x0110 - 0x010c),
    "ASSIGN Target Min",
    new USplit12Field(-1024, 1023, { encodedOffset: 1024 })
  ),
  targetMax: new FieldDefinition(
    pack7(0x0113 - 0x010c),
    "ASSIGN Target Max",
    new USplit12Field(-1024, 1023, { encodedOffset: 1024 })
  ),
  source: new FieldDefinition(
    pack7(0x0116 - 0x010c),
    "ASSIGN Source",
    enumField([
      "CTL",
      "EXP PEDAL OFF",
      "EXP PEDAL ON",
      "EXP PEDAL SW",
      "INT PDL",
      "WAVE PDL",
      "GK S1",
      "GK S2",
      "GK VOL",
      "CC1",
      "CC2",
      "CC3",
      "CC4",
      "CC5",
      "CC6",
      "CC7",
      "CC8",
      "CC9",
      "CC10",
      "CC11",
      "CC12",
      "CC13",
      "CC14",
      "CC15",
      "CC16",
      "CC17",
      "CC18",
      "CC19",
      "CC20",
      "CC21",
      "CC22",
      "CC23",
      "CC24",
      "CC25",
      "CC26",
      "CC27",
      "CC28",
      "CC29",
      "CC30",
      "CC31",
      "CC64",
      "CC65",
      "CC66",
      "CC67",
      "CC68",
      "CC69",
      "CC70",
      "CC71",
      "CC72",
      "CC73",
      "CC74",
      "CC75",
      "CC76",
      "CC77",
      "CC78",
      "CC79",
      "CC80",
      "CC81",
      "CC82",
      "CC83",
      "CC84",
      "CC85",
      "CC86",
      "CC87",
      "CC88",
      "CC89",
      "CC90",
      "CC91",
      "CC92",
      "CC93",
      "CC94",
      "CC95",
    ] as const)
  ),
  sourceMode: new FieldDefinition(
    pack7(0x0117 - 0x010c),
    "ASSIGN Source Mode",
    enumField(["MOMENT", "TOGGLE"] as const)
  ),
  activeRangeLo: new FieldDefinition(
    pack7(0x0118 - 0x010c),
    "ASSIGN Active Range Lo",
    new UByteField(0, 126)
  ),
  activeRangeHi: new FieldDefinition(
    pack7(0x0119 - 0x010c),
    "ASSIGN Active Range Hi",
    new UByteField(1, 127)
  ),
  internalPedalTrigger: new FieldDefinition(
    pack7(0x011a - 0x010c),
    "ASSIGN Internal Pedal Trigger",
    enumField([
      "PATCH CHANGE",
      "CTL",
      "EXP LOW",
      "EXP MID",
      "EXP HIGH",
      "EXP ON LOW",
      "EXP ON MID",
      "EXP ON HIGH",
      "EXP SW",
      "GK S1",
      "GK S2",
    ] as const)
  ),
  internalPedalTime: new FieldDefinition(
    pack7(0x011b - 0x010c),
    "ASSIGN Internal Pedal Time",
    new UByteField(0, 100)
  ),
  internalPedalCurve: new FieldDefinition(
    pack7(0x011c - 0x010c),
    "ASSIGN Internal Pedal Curve",
    // TODO: Icons for curve types
    enumField(["LINEAR", "SLOW RISE", "FAST RISE"] as const)
  ),
  wavePedalRate: new FieldDefinition(
    pack7(0x011d - 0x010c),
    "ASSIGN Wave Pedal Rate",
    rate113Field
  ),
  wavePedalForm: new FieldDefinition(
    pack7(0x011e - 0x010c),
    "ASSIGN Wave Pedal Form",
    enumField(["SAW", "TRI", "SIN"] as const)
  ),
};

export const PatchStruct = {
  common: new StructDefinition(pack7(0x000000), "Common", {
    patchAttribute: new FieldDefinition(
      pack7(0x0000),
      "Patch Attribute",
      new BooleanField("GUITAR", "BASS")
    ),
    patchName: new FieldDefinition(
      pack7(0x0001),
      "Patch Name",
      new AsciiStringField(16)
    ),
    // TODO: Is it worth creating an ArrayDefinition atom type?
    assign1: new StructDefinition(pack7(0x010c), "ASSIGN1", PatchAssignStruct),
    assign2: new StructDefinition(pack7(0x011f), "ASSIGN2", PatchAssignStruct),
    assign3: new StructDefinition(pack7(0x0132), "ASSIGN3", PatchAssignStruct),
    assign4: new StructDefinition(pack7(0x0145), "ASSIGN4", PatchAssignStruct),
    assign5: new StructDefinition(pack7(0x0158), "ASSIGN5", PatchAssignStruct),
    assign6: new StructDefinition(pack7(0x016b), "ASSIGN6", PatchAssignStruct),
    assign7: new StructDefinition(pack7(0x017e), "ASSIGN7", PatchAssignStruct),
    assign8: new StructDefinition(pack7(0x0211), "ASSIGN8", PatchAssignStruct),
    effectStructure: new FieldDefinition(
      pack7(0x022c),
      "EFFECT Structure",
      enumField(["1", "2"] as const)
    ),
    lineSelectModel: new FieldDefinition(
      pack7(0x022d),
      "Line Select Model",
      toneLineSelectField
    ),
    lineSelectNormalPU: new FieldDefinition(
      pack7(0x022e),
      "Line Select Normal PU",
      toneLineSelectField
    ),
    patchLevel: new FieldDefinition(
      pack7(0x0230),
      "Patch Level",
      new USplit8Field(0, 100)
    ),
    normalPuMute: new FieldDefinition(
      pack7(0x0232),
      "Normal PU Mute",
      invertedMuteField
    ),
    normalPuLevel: new FieldDefinition(
      pack7(0x0233),
      "Normal PU Level",
      new UByteField(0, 100)
    ),
    altTuneSwitch: new FieldDefinition(
      pack7(0x0234),
      "Alt Tune Switch",
      booleanField
    ),
    bypassChorusSendLevel: new FieldDefinition(
      pack7(0x023e),
      "BYPASS Chorus Send Level",
      new UByteField(0, 100)
    ),
    bypassDelaySendLevel: new FieldDefinition(
      pack7(0x023f),
      "BYPASS Delay Send Level",
      new UByteField(0, 100)
    ),
    bypassReverbSendLevel: new FieldDefinition(
      pack7(0x0240),
      "BYPASS Reverb Send Level",
      new UByteField(0, 100)
    ),
  }),
  mfx: new StructDefinition(pack7(0x000300), "MFX", {
    mfxChorusSendLevel: new FieldDefinition(
      pack7(0x0000),
      "MFX Chorus Send Level",
      new UByteField(0, 100)
    ),
    mfxDelaySendLevel: new FieldDefinition(
      pack7(0x0001),
      "MFX Delay Send Level",
      new UByteField(0, 100)
    ),
    mfxReverbSendLevel: new FieldDefinition(
      pack7(0x0002),
      "MFX Reverb Send Level",
      new UByteField(0, 100)
    ),
    reserved0003: new FieldDefinition(
      pack7(0x0003),
      "(Reserved)",
      new ReservedField()
    ),
    mfxSwitch: new FieldDefinition(pack7(0x0004), "MFX Switch", booleanField),
    mfxType: new FieldDefinition(
      pack7(0x0005),
      "MFX Type",
      enumField([
        "EQ",
        "SUPER FILTER",
        "PHASER",
        "STEP PHASER",
        "RING MODULATOR",
        "TREMOLO",
        "AUTO PAN",
        "SLICER",
        "VK ROTARY",
        "HEXA-CHORUS",
        "SPACE-D",
        "FLANGER",
        "STEP FLANGER",
        "GUITAR AMP SIM",
        "COMPRESSOR",
        "LIMITER",
        "3TAP PAN DELAY",
        "TIME CTRL DELAY",
        "LOFI COMPRESS",
        "PITCH SHIFTER",
      ] as const)
    ),
    mfxPan: new FieldDefinition(pack7(0x0006), "MFX Pan", pan100Field),
    eqLowFreq: new FieldDefinition(
      pack7(0x0007),
      "EQ Low Freq",
      enumField(["200", "400"] as const)
    ),
    eqLowGain: new FieldDefinition(pack7(0x0008), "EQ Low Gain", gain15dBField),
    eqMid1Freq: new FieldDefinition(
      pack7(0x0009),
      "EQ Mid1 Freq",
      freq8000Field
    ),
    eqMid1Gain: new FieldDefinition(
      pack7(0x000a),
      "EQ Mid1 Gain",
      gain15dBField
    ),
    eqMid1Q: new FieldDefinition(pack7(0x000b), "EQ Mid1 Q", q8Field),
    eqMid2Freq: new FieldDefinition(
      pack7(0x000c),
      "EQ Mid2 Freq",
      freq8000Field
    ),
    eqMid2Gain: new FieldDefinition(
      pack7(0x000d),
      "EQ Mid2 Gain",
      gain15dBField
    ),
    eqMid2Q: new FieldDefinition(pack7(0x000e), "EQ Mid2 Q", q8Field),
    eqHighFreq: new FieldDefinition(
      pack7(0x000f),
      "EQ High Freq",
      enumField(["2000", "4000", "8000"] as const)
    ),
    eqHighGain: new FieldDefinition(
      pack7(0x0010),
      "EQ High Gain",
      gain15dBField
    ),
    eqLevel: new FieldDefinition(pack7(0x0011), "EQ Level", new C127Field()),
    superFilterFilterType: new FieldDefinition(
      pack7(0x0012),
      "SUPER FILTER Filter Type",
      enumField(["LPF", "BPF", "HPF", "NOTCH"] as const)
    ),
    superFilterFilterSlope: new FieldDefinition(
      pack7(0x0013),
      "SUPER FILTER Filter Slope",
      enumField(["-12", "-24", "-36"] as const)
    ),
    superFilterFilterCutoff: new FieldDefinition(
      pack7(0x0014),
      "SUPER FILTER Filter Cutoff",
      new C127Field()
    ),
    superFilterFilterResonance: new FieldDefinition(
      pack7(0x0015),
      "SUPER FILTER Filter Resonance",
      new C127Field()
    ),
    superFilterFilterGain: new FieldDefinition(
      pack7(0x0016),
      "SUPER FILTER Filter Gain",
      new UByteField(0, 12, {
        format(value) {
          return `${value > 0 ? "+" : ""}${value}`;
        },
      })
    ),
    superFilterModulationSw: new FieldDefinition(
      pack7(0x0017),
      "SUPER FILTER Modulation Sw",
      booleanField
    ),
    superFilterModulationWave: new FieldDefinition(
      pack7(0x0018),
      "SUPER FILTER Modulation Wave",
      mfxModWaveField
    ),
    superFilterRateSyncSw: new FieldDefinition(
      pack7(0x0019),
      "SUPER FILTER Rate (sync sw)",
      booleanField
    ),
    superFilterRate: new FieldDefinition(
      pack7(0x001a),
      "SUPER FILTER Rate",
      new UByteField(0, 100)
    ),
    superFilterRateNote: new FieldDefinition(
      pack7(0x001b),
      "SUPER FILTER Rate Note",
      mfxRateNoteField
    ),
    superFilterDepth: new FieldDefinition(
      pack7(0x001c),
      "SUPER FILTER Depth",
      new C127Field()
    ),
    superFilterAttack: new FieldDefinition(
      pack7(0x001d),
      "SUPER FILTER Attack",
      new C127Field()
    ),
    superFilterLevel: new FieldDefinition(
      pack7(0x001e),
      "SUPER FILTER Level",
      new C127Field()
    ),
    phaserMode: new FieldDefinition(
      pack7(0x001f),
      "PHASER Mode",
      enumField(["4-STAGE", "8-STAGE", "12-STAGE"] as const)
    ),
    phaserManual: new FieldDefinition(
      pack7(0x0020),
      "PHASER Manual",
      new C127Field()
    ),
    phaserRateSyncSw: new FieldDefinition(
      pack7(0x0021),
      "PHASER Rate (sync sw)",
      booleanField
    ),
    phaserRate: new FieldDefinition(
      pack7(0x0022),
      "PHASER Rate",
      new UByteField(0, 100)
    ),
    phaserRateNote: new FieldDefinition(
      pack7(0x0023),
      "PHASER Rate Note",
      mfxRateNoteField
    ),
    phaserDepth: new FieldDefinition(
      pack7(0x0024),
      "PHASER Depth",
      new C127Field()
    ),
    phaserPolarity: new FieldDefinition(
      pack7(0x0025),
      "PHASER Polarity",
      new BooleanField("INVERSE", "SYNCHRO")
    ),
    phaserResonance: new FieldDefinition(
      pack7(0x0026),
      "PHASER Resonance",
      new C127Field()
    ),
    phaserCrossFeedback: new FieldDefinition(
      pack7(0x0027),
      "PHASER Cross Feedback",
      feedback98Field
    ),
    phaserMix: new FieldDefinition(
      pack7(0x0028),
      "PHASER Mix",
      new C127Field()
    ),
    phaserLowGain: new FieldDefinition(
      pack7(0x0029),
      "PHASER Low Gain",
      gain15dBField
    ),
    phaserHighGain: new FieldDefinition(
      pack7(0x002a),
      "PHASER High Gain",
      gain15dBField
    ),
    phaserLevel: new FieldDefinition(
      pack7(0x002b),
      "PHASER Level",
      new C127Field()
    ),
    stepPhaserMode: new FieldDefinition(
      pack7(0x002c),
      "STEP PHASER Mode",
      enumField(["4-STAGE", "8-STAGE", "12-STAGE"] as const)
    ),
    stepPhaserManual: new FieldDefinition(
      pack7(0x002d),
      "STEP PHASER Manual",
      new C127Field()
    ),
    stepPhaserRateSyncSw: new FieldDefinition(
      pack7(0x002e),
      "STEP PHASER Rate (sync sw)",
      booleanField
    ),
    stepPhaserRate: new FieldDefinition(
      pack7(0x002f),
      "STEP PHASER Rate",
      new UByteField(0, 100)
    ),
    stepPhaserRateNote: new FieldDefinition(
      pack7(0x0030),
      "STEP PHASER Rate Note",
      mfxRateNoteField
    ),
    stepPhaserDepth: new FieldDefinition(
      pack7(0x0031),
      "STEP PHASER Depth",
      new C127Field()
    ),
    stepPhaserPolarity: new FieldDefinition(
      pack7(0x0032),
      "STEP PHASER Polarity",
      new BooleanField("INVERSE", "SYNCHRO")
    ),
    stepPhaserResonance: new FieldDefinition(
      pack7(0x0033),
      "STEP PHASER Resonance",
      new C127Field()
    ),
    stepPhaserCrossFeedback: new FieldDefinition(
      pack7(0x0034),
      "STEP PHASER Cross Feedback",
      feedback98Field
    ),
    stepPhaserStepRateSyncSw: new FieldDefinition(
      pack7(0x0035),
      "STEP PHASER Step Rate (sync sw)",
      booleanField
    ),
    stepPhaserStepRate: new FieldDefinition(
      pack7(0x0036),
      "STEP PHASER Step Rate",
      new UByteField(0, 100)
    ),
    stepPhaserStepRateNote: new FieldDefinition(
      pack7(0x0037),
      "STEP PHASER Step Rate Note",
      mfxRateNoteField
    ),
    stepPhaserMix: new FieldDefinition(
      pack7(0x0038),
      "STEP PHASER Mix",
      new C127Field()
    ),
    stepPhaserLowGain: new FieldDefinition(
      pack7(0x0039),
      "STEP PHASER Low Gain",
      gain15dBField
    ),
    stepPhaserHighGain: new FieldDefinition(
      pack7(0x003a),
      "STEP PHASER High Gain",
      gain15dBField
    ),
    stepPhaserLevel: new FieldDefinition(
      pack7(0x003b),
      "STEP PHASER Level",
      new C127Field()
    ),
    ringModulatorFrequency: new FieldDefinition(
      pack7(0x003c),
      "RING MODULATOR Frequency",
      new UByteField(0, 127)
    ),
    ringModulatorSens: new FieldDefinition(
      pack7(0x003d),
      "RING MODULATOR Sens",
      new UByteField(0, 127)
    ),
    ringModulatorPolarity: new FieldDefinition(
      pack7(0x003e),
      "RING MODULATOR Polarity",
      new BooleanField("UP", "DOWN")
    ),
    ringModulatorLowGain: new FieldDefinition(
      pack7(0x003f),
      "RING MODULATOR Low Gain",
      gain15dBField
    ),
    ringModulatorHighGain: new FieldDefinition(
      pack7(0x0040),
      "RING MODULATOR High Gain",
      gain15dBField
    ),
    ringModulatorBalance: new FieldDefinition(
      pack7(0x0041),
      "RING MODULATOR Balance",
      dryWet100Field
    ),
    ringModulatorLevel: new FieldDefinition(
      pack7(0x0042),
      "RING MODULATOR Level",
      new C127Field()
    ),
    tremoloModWave: new FieldDefinition(
      pack7(0x0043),
      "TREMOLO Mod Wave",
      mfxModWaveField
    ),
    tremoloRateSyncSw: new FieldDefinition(
      pack7(0x0044),
      "TREMOLO Rate (sync sw)",
      booleanField
    ),
    tremoloRate: new FieldDefinition(
      pack7(0x0045),
      "TREMOLO Rate",
      new UByteField(0, 100)
    ),
    tremoloRateNote: new FieldDefinition(
      pack7(0x0046),
      "TREMOLO Rate Note",
      mfxRateNoteField
    ),
    tremoloDepth: new FieldDefinition(
      pack7(0x0047),
      "TREMOLO Depth",
      new C127Field()
    ),
    tremoloLowGain: new FieldDefinition(
      pack7(0x0048),
      "TREMOLO Low Gain",
      gain15dBField
    ),
    tremoloHighGain: new FieldDefinition(
      pack7(0x0049),
      "TREMOLO High Gain",
      gain15dBField
    ),
    tremoloLevel: new FieldDefinition(
      pack7(0x004a),
      "TREMOLO Level",
      new C127Field()
    ),
    autoPanModWave: new FieldDefinition(
      pack7(0x004b),
      "AUTO PAN Mod Wave",
      mfxModWaveField
    ),
    autoPanRateSyncSw: new FieldDefinition(
      pack7(0x004c),
      "AUTO PAN Rate (sync sw)",
      booleanField
    ),
    autoPanRate: new FieldDefinition(
      pack7(0x004d),
      "AUTO PAN Rate",
      new UByteField(0, 100)
    ),
    autoPanRateNote: new FieldDefinition(
      pack7(0x004e),
      "AUTO PAN Rate Note",
      mfxRateNoteField
    ),
    autoPanDepth: new FieldDefinition(
      pack7(0x004f),
      "AUTO PAN Depth",
      new C127Field()
    ),
    autoPanLowGain: new FieldDefinition(
      pack7(0x0050),
      "AUTO PAN Low Gain",
      gain15dBField
    ),
    autoPanHighGain: new FieldDefinition(
      pack7(0x0051),
      "AUTO PAN High Gain",
      gain15dBField
    ),
    autoPanLevel: new FieldDefinition(
      pack7(0x0052),
      "AUTO PAN Level",
      new C127Field()
    ),
    slicerPattern: new FieldDefinition(
      pack7(0x0053),
      "SLICER Pattern",
      new UByteField(1, 20, {
        encodedOffset: -1,
        format(value) {
          return `P${value.toString().padStart(2, "0")}`;
        },
      })
    ),
    slicerRateSyncSw: new FieldDefinition(
      pack7(0x0054),
      "SLICER Rate (sync sw)",
      booleanField
    ),
    slicerRate: new FieldDefinition(
      pack7(0x0055),
      "SLICER Rate",
      new UByteField(0, 100)
    ),
    slicerRateNote: new FieldDefinition(
      pack7(0x0056),
      "SLICER Rate Note",
      mfxRateNoteField
    ),
    slicerAttack: new FieldDefinition(
      pack7(0x0057),
      "SLICER Attack",
      new C127Field()
    ),
    slicerInputSyncSw: new FieldDefinition(
      pack7(0x0058),
      "SLICER Input Sync Sw",
      booleanField
    ),
    slicerInputSyncThreshold: new FieldDefinition(
      pack7(0x0059),
      "SLICER Input Sync Threshold",
      new C127Field()
    ),
    slicerLevel: new FieldDefinition(
      pack7(0x005a),
      "SLICER Level",
      new C127Field()
    ),
    vkRotarySpeed: new FieldDefinition(
      pack7(0x005b),
      "VK Rotary Speed",
      new BooleanField("SLOW", "FAST")
    ),
    vkRotaryBrake: new FieldDefinition(
      pack7(0x005c),
      "VK Rotary Brake",
      booleanField
    ),
    vkRotaryWooferSlowSpeed: new FieldDefinition(
      pack7(0x005d),
      "VK Rotary Woofer Slow Speed",
      new UByteField(0, 100)
    ),
    vkRotaryWooferFastSpeed: new FieldDefinition(
      pack7(0x005e),
      "VK Rotary Woofer Fast Speed",
      new UByteField(0, 100)
    ),
    vkRotaryWooferTransUp: new FieldDefinition(
      pack7(0x005f),
      "VK Rotary Woofer Trans Up",
      new C127Field()
    ),
    vkRotaryWooferTransDown: new FieldDefinition(
      pack7(0x0060),
      "VK Rotary Woofer Trans Down",
      new C127Field()
    ),
    vkRotaryWooferLevel: new FieldDefinition(
      pack7(0x0061),
      "VK Rotary Woofer Level",
      new C127Field()
    ),
    vkRotaryTweeterSlowSpeed: new FieldDefinition(
      pack7(0x0062),
      "VK Rotary Tweeter Slow Speed",
      new UByteField(0, 100)
    ),
    vkRotaryTweeterFastSpeed: new FieldDefinition(
      pack7(0x0063),
      "VK Rotary Tweeter Fast Speed",
      new UByteField(0, 100)
    ),
    vkRotaryTweeterTransUp: new FieldDefinition(
      pack7(0x0064),
      "VK Rotary Tweeter Trans Up",
      new C127Field()
    ),
    vkRotaryTweeterTransDown: new FieldDefinition(
      pack7(0x0065),
      "VK Rotary Tweeter Trans Down",
      new C127Field()
    ),
    vkRotaryTweeterLevel: new FieldDefinition(
      pack7(0x0066),
      "VK Rotary Tweeter Level",
      new C127Field()
    ),
    vkRotarySpread: new FieldDefinition(
      pack7(0x0067),
      "VK Rotary Spread",
      new UByteField(0, 10)
    ),
    vkRotaryHighGain: new FieldDefinition(
      pack7(0x0068),
      "VK Rotary High Gain",
      gain15dBField
    ),
    vkRotaryLowGain: new FieldDefinition(
      pack7(0x0069),
      "VK Rotary Low Gain",
      gain15dBField
    ),
    vkRotaryLevel: new FieldDefinition(
      pack7(0x006a),
      "VK Rotary Level",
      new C127Field()
    ),
    hexaChorusPreDelay: new FieldDefinition(
      pack7(0x006b),
      "HEXA CHORUS Pre Delay",
      mfxPreDelayField
    ),
    hexaChorusRateSyncSw: new FieldDefinition(
      pack7(0x006c),
      "HEXA CHORUS Rate (sync sw)",
      booleanField
    ),
    hexaChorusRate: new FieldDefinition(
      pack7(0x006d),
      "HEXA CHORUS Rate",
      new UByteField(0, 100)
    ),
    hexaChorusRateNote: new FieldDefinition(
      pack7(0x006e),
      "HEXA CHORUS Rate Note",
      mfxRateNoteField
    ),
    hexaChorusDepth: new FieldDefinition(
      pack7(0x006f),
      "HEXA CHORUS Depth",
      new C127Field()
    ),
    hexaChorusPreDelayDeviation: new FieldDefinition(
      pack7(0x0070),
      "HEXA CHORUS Pre Delay Deviation",
      new UByteField(0, 20)
    ),
    hexaChorusDepthDeviation: new FieldDefinition(
      pack7(0x0071),
      "HEXA CHORUS Depth Deviation",
      new UByteField(-20, 20, { encodedOffset: 20 })
    ),
    hexaChorusPanDeviation: new FieldDefinition(
      pack7(0x0072),
      "HEXA CHORUS Pan Deviation",
      new UByteField(0, 20)
    ),
    hexaChorusBalance: new FieldDefinition(
      pack7(0x0073),
      "HEXA CHORUS Balance",
      dryWet100Field
    ),
    hexaChorusLevel: new FieldDefinition(
      pack7(0x0074),
      "HEXA CHORUS Level",
      new C127Field()
    ),
    spaceDPreDelay: new FieldDefinition(
      pack7(0x0075),
      "SPACE-D Pre Delay",
      mfxPreDelayField
    ),
    spaceDRateSyncSw: new FieldDefinition(
      pack7(0x0076),
      "SPACE-D Rate (sync sw)",
      booleanField
    ),
    spaceDRate: new FieldDefinition(
      pack7(0x0077),
      "SPACE-D Rate",
      new UByteField(0, 100)
    ),
    spaceDRateNote: new FieldDefinition(
      pack7(0x0078),
      "SPACE-D Rate Note",
      mfxRateNoteField
    ),
    spaceDDepth: new FieldDefinition(
      pack7(0x0079),
      "SPACE-D Depth",
      new C127Field()
    ),
    spaceDPhase: new FieldDefinition(
      pack7(0x007a),
      "SPACE-D Phase",
      mfxPhaseField
    ),
    spaceDLowGain: new FieldDefinition(
      pack7(0x007b),
      "SPACE-D Low Gain",
      gain15dBField
    ),
    spaceDHighGain: new FieldDefinition(
      pack7(0x007c),
      "SPACE-D High Gain",
      gain15dBField
    ),
    spaceDBalance: new FieldDefinition(
      pack7(0x007d),
      "SPACE-D Balance",
      dryWet100Field
    ),
    spaceDLevel: new FieldDefinition(
      pack7(0x007e),
      "SPACE-D Level",
      new C127Field()
    ),
    flangerFilterType: new FieldDefinition(
      pack7(0x007f),
      "FLANGER Filter Type",
      mfxFilterTypeField
    ),
    flangerCutoffFreq: new FieldDefinition(
      pack7(0x0100),
      "FLANGER Cutoff Freq",
      freq8000Field
    ),
    flangerPreDelay: new FieldDefinition(
      pack7(0x0101),
      "FLANGER Pre Delay",
      mfxPreDelayField
    ),
    flangerRateSyncSw: new FieldDefinition(
      pack7(0x0102),
      "FLANGER Rate (sync sw)",
      booleanField
    ),
    flangerRate: new FieldDefinition(
      pack7(0x0103),
      "FLANGER Rate",
      new UByteField(0, 100)
    ),
    flangerRateNote: new FieldDefinition(
      pack7(0x0104),
      "FLANGER Rate Note",
      mfxRateNoteField
    ),
    flangerDepth: new FieldDefinition(
      pack7(0x0105),
      "FLANGER Depth",
      new C127Field()
    ),
    flangerPhase: new FieldDefinition(
      pack7(0x0106),
      "FLANGER Phase",
      mfxPhaseField
    ),
    flangerFeedback: new FieldDefinition(
      pack7(0x0107),
      "FLANGER Feedback",
      feedback98Field
    ),
    flangerLowGain: new FieldDefinition(
      pack7(0x0108),
      "FLANGER Low Gain",
      gain15dBField
    ),
    flangerHighGain: new FieldDefinition(
      pack7(0x0109),
      "FLANGER High Gain",
      gain15dBField
    ),
    flangerBalance: new FieldDefinition(
      pack7(0x010a),
      "FLANGER Balance",
      dryWet100Field
    ),
    flangerLevel: new FieldDefinition(
      pack7(0x010b),
      "FLANGER Level",
      new C127Field()
    ),
    stepFlangerFilterType: new FieldDefinition(
      pack7(0x010c),
      "STEP FLANGER Filter Type",
      mfxFilterTypeField
    ),
    stepFlangerCutoffFreq: new FieldDefinition(
      pack7(0x010d),
      "STEP FLANGER Cutoff Freq",
      freq8000Field
    ),
    stepFlangerPreDelay: new FieldDefinition(
      pack7(0x010e),
      "STEP FLANGER Pre Delay",
      mfxPreDelayField
    ),
    stepFlangerRateSyncSw: new FieldDefinition(
      pack7(0x010f),
      "STEP FLANGER Rate (sync sw)",
      booleanField
    ),
    stepFlangerRate: new FieldDefinition(
      pack7(0x0110),
      "STEP FLANGER Rate",
      new UByteField(0, 100)
    ),
    stepFlangerRateNote: new FieldDefinition(
      pack7(0x0111),
      "STEP FLANGER Rate Note",
      mfxRateNoteField
    ),
    stepFlangerDepth: new FieldDefinition(
      pack7(0x0112),
      "STEP FLANGER Depth",
      new C127Field()
    ),
    stepFlangerPhase: new FieldDefinition(
      pack7(0x0113),
      "STEP FLANGER Phase",
      mfxPhaseField
    ),
    stepFlangerFeedback: new FieldDefinition(
      pack7(0x0114),
      "STEP FLANGER Feedback",
      feedback98Field
    ),
    stepFlangerStepRateSyncSw: new FieldDefinition(
      pack7(0x0115),
      "STEP FLANGER Step Rate (sync sw)",
      booleanField
    ),
    stepFlangerStepRate: new FieldDefinition(
      pack7(0x0116),
      "STEP FLANGER Step Rate",
      new UByteField(0, 100)
    ),
    stepFlangerStepRateNote: new FieldDefinition(
      pack7(0x0117),
      "STEP FLANGER Step Rate Note",
      mfxRateNoteField
    ),
    stepFlangerLowGain: new FieldDefinition(
      pack7(0x0118),
      "STEP FLANGER Low Gain",
      gain15dBField
    ),
    stepFlangerHighGain: new FieldDefinition(
      pack7(0x0119),
      "STEP FLANGER High Gain",
      gain15dBField
    ),
    stepFlangerBalance: new FieldDefinition(
      pack7(0x011a),
      "STEP FLANGER Balance",
      dryWet100Field
    ),
    stepFlangerLevel: new FieldDefinition(
      pack7(0x011b),
      "STEP FLANGER Level",
      new C127Field()
    ),
    gtrAmpSimPreAmpSw: new FieldDefinition(
      pack7(0x011c),
      "GTR AMP SIM Pre Amp Sw",
      booleanField
    ),
    gtrAmpSimPreAmpType: new FieldDefinition(
      pack7(0x011d),
      "GTR AMP SIM Pre Amp Type",
      enumField([
        "JC-120",
        "CLEAN TWIN",
        "MATCH DRIVE",
        "BG LEAD",
        "MS1959I",
        "MS1959II",
        "MS1959I+II",
        "SLDN LEAD",
        "METAL 5150",
        "METAL LEAD",
        "OD-1",
        "OD-2 TURBO",
        "DISTORTION",
        "FUZZ",
      ] as const)
    ),
    gtrAmpSimPreAmpVolume: new FieldDefinition(
      pack7(0x011e),
      "GTR AMP SIM Pre Amp Volume",
      new C127Field()
    ),
    gtrAmpSimPreAmpMaster: new FieldDefinition(
      pack7(0x011f),
      "GTR AMP SIM Pre Amp Master",
      new C127Field()
    ),
    gtrAmpSimPreAmpGain: new FieldDefinition(
      pack7(0x0120),
      "GTR AMP SIM Pre Amp Gain",
      enumField(["LOW", "MIDDLE", "HIGH"] as const)
    ),
    gtrAmpSimPreAmpBass: new FieldDefinition(
      pack7(0x0121),
      "GTR AMP SIM Pre Amp Bass",
      new C127Field()
    ),
    gtrAmpSimPreAmpMiddle: new FieldDefinition(
      pack7(0x0122),
      "GTR AMP SIM Pre Amp Middle",
      new C127Field()
    ),
    gtrAmpSimPreAmpTreble: new FieldDefinition(
      pack7(0x0123),
      "GTR AMP SIM Pre Amp Treble",
      new C127Field()
    ),
    gtrAmpSimPreAmpPresence: new FieldDefinition(
      pack7(0x0124),
      "GTR AMP SIM Pre Amp Presence",
      // TODO: Figure out meaning of "0 - 127 (Match Drive -127 - 0)" in MIDI implementation chart
      new C127Field()
    ),
    gtrAmpSimPreAmpBright: new FieldDefinition(
      pack7(0x0125),
      "GTR AMP SIM Pre Amp Bright",
      booleanField
    ),
    gtrAmpSimSpeakerSw: new FieldDefinition(
      pack7(0x0126),
      "GTR AMP SIM Speaker Sw",
      booleanField
    ),
    gtrAmpSimSpeakerType: new FieldDefinition(
      pack7(0x0127),
      "GTR AMP SIM Speaker Type",
      enumField([
        "SMALL 1",
        "SMALL 2",
        "MIDDLE",
        "JC-120",
        "BUILT-IN 1",
        "BUILT-IN 2",
        "BUILT-IN 3",
        "BUILT-IN 4",
        "BUILT-IN 5",
        "BG STACK 1",
        "BG STACK 2",
        "MS STACK 1",
        "MS STACK 2",
        "METAL STACK",
        "2-STACK",
        "3-STACK",
      ] as const)
    ),
    gtrAmpSimMicSetting: new FieldDefinition(
      pack7(0x0128),
      "GTR AMP SIM Mic Setting",
      enumField(["1", "2", "3"] as const)
    ),
    gtrAmpSimMicLevel: new FieldDefinition(
      pack7(0x0129),
      "GTR AMP SIM Mic Level",
      new C127Field()
    ),
    gtrAmpSimDirectLevel: new FieldDefinition(
      pack7(0x012a),
      "GTR AMP SIM Direct Level",
      new C127Field()
    ),
    gtrAmpSimPan: new FieldDefinition(
      pack7(0x012b),
      "GTR AMP SIM Pan",
      c64PanField
    ),
    gtrAmpSimLevel: new FieldDefinition(
      pack7(0x012c),
      "GTR AMP SIM Level",
      new C127Field()
    ),
    compressorAttack: new FieldDefinition(
      pack7(0x012d),
      "COMPRESSOR Attack",
      new C127Field()
    ),
    compressorThreshold: new FieldDefinition(
      pack7(0x012e),
      "COMPRESSOR Threshold",
      new C127Field()
    ),
    compressorPostGain: new FieldDefinition(
      pack7(0x012f),
      "COMPRESSOR Post Gain",
      positiveGain18dbField
    ),
    compressorLowGain: new FieldDefinition(
      pack7(0x0130),
      "COMPRESSOR Low Gain",
      gain15dBField
    ),
    compressorHighGain: new FieldDefinition(
      pack7(0x0131),
      "COMPRESSOR High Gain",
      gain15dBField
    ),
    compressorLevel: new FieldDefinition(
      pack7(0x0132),
      "COMPRESSOR Level",
      new C127Field()
    ),
    limiterRelease: new FieldDefinition(
      pack7(0x0133),
      "LIMITER Release",
      new C127Field()
    ),
    limiterThreshold: new FieldDefinition(
      pack7(0x0134),
      "LIMITER Threshold",
      new C127Field()
    ),
    limiterRatio: new FieldDefinition(
      pack7(0x0135),
      "LIMITER Ratio",
      enumField(["1.5:1", "2:1", "4:1", "100:1"] as const)
    ),
    limiterPostGain: new FieldDefinition(
      pack7(0x0136),
      "LIMITER Post Gain",
      positiveGain18dbField
    ),
    limiterLowGain: new FieldDefinition(
      pack7(0x0137),
      "LIMITER Low Gain",
      gain15dBField
    ),
    limiterHighGain: new FieldDefinition(
      pack7(0x0138),
      "LIMITER High Gain",
      gain15dBField
    ),
    limiterLevel: new FieldDefinition(
      pack7(0x0139),
      "LIMITER Level",
      new C127Field()
    ),
    threeTapDelayDelayLeftSyncSw: new FieldDefinition(
      pack7(0x013a),
      "3TAP DELAY Delay Left Sync Sw",
      booleanField
    ),
    threeTapDelayDelayLeft: new FieldDefinition(
      pack7(0x013b),
      "3TAP DELAY Delay Left",
      mfx2600msecField
    ),
    threeTapDelayDelayLeftNote: new FieldDefinition(
      pack7(0x013e),
      "3TAP DELAY Delay Left Note",
      mfxDelayNoteField
    ),
    threeTapDelayDelayRightSyncSw: new FieldDefinition(
      pack7(0x013f),
      "3TAP DELAY Delay Right Sync Sw",
      booleanField
    ),
    threeTapDelayDelayRight: new FieldDefinition(
      pack7(0x0140),
      "3TAP DELAY Delay Right",
      mfx2600msecField
    ),
    threeTapDelayDelayRightNote: new FieldDefinition(
      pack7(0x0143),
      "3TAP DELAY Delay Right Note",
      mfxDelayNoteField
    ),
    threeTapDelayDelayCenterSyncSw: new FieldDefinition(
      pack7(0x0144),
      "3TAP DELAY Delay Center Sync Sw",
      booleanField
    ),
    threeTapDelayDelayCenter: new FieldDefinition(
      pack7(0x0145),
      "3TAP DELAY Delay Center",
      mfx2600msecField
    ),
    threeTapDelayDelayCenterNote: new FieldDefinition(
      pack7(0x0148),
      "3TAP DELAY Delay Center Note",
      mfxDelayNoteField
    ),
    threeTapDelayCenterFeedback: new FieldDefinition(
      pack7(0x0149),
      "3TAP DELAY Center Feedback",
      feedback98Field
    ),
    threeTapDelayHFDamp: new FieldDefinition(
      pack7(0x014a),
      "3TAP DELAY HF Damp",
      freq8000BypassField
    ),
    threeTapDelayLeftLevel: new FieldDefinition(
      pack7(0x014b),
      "3TAP DELAY Left Level",
      new C127Field()
    ),
    threeTapDelayRightLevel: new FieldDefinition(
      pack7(0x014c),
      "3TAP DELAY Right Level",
      new C127Field()
    ),
    threeTapDelayCenterLevel: new FieldDefinition(
      pack7(0x014d),
      "3TAP DELAY Center Level",
      new C127Field()
    ),
    threeTapDelayLowGain: new FieldDefinition(
      pack7(0x014e),
      "3TAP DELAY Low Gain",
      gain15dBField
    ),
    threeTapDelayHighGain: new FieldDefinition(
      pack7(0x014f),
      "3TAP DELAY High Gain",
      gain15dBField
    ),
    threeTapDelayBalance: new FieldDefinition(
      pack7(0x0150),
      "3TAP DELAY Balance",
      dryWet100Field
    ),
    threeTapDelayLevel: new FieldDefinition(
      pack7(0x0151),
      "3TAP DELAY Level",
      new C127Field()
    ),
    timeCtrlDelayDelayTimeSyncSw: new FieldDefinition(
      pack7(0x0152),
      "TIME CTRL DELAY Delay Time Sync Sw",
      booleanField
    ),
    timeCtrlDelayDelayTime: new FieldDefinition(
      pack7(0x0153),
      "TIME CTRL DELAY Delay Time",
      mfx1300msecField
    ),
    timeCtrlDelayDelayTimeNote: new FieldDefinition(
      pack7(0x0156),
      "TIME CTRL DELAY Delay Time Note",
      mfxDelayNoteField
    ),
    timeCtrlDelayAcceleration: new FieldDefinition(
      pack7(0x0157),
      "TIME CTRL DELAY Acceleration",
      new UByteField(0, 15)
    ),
    timeCtrlDelayFeedback: new FieldDefinition(
      pack7(0x0158),
      "TIME CTRL DELAY Feedback",
      feedback98Field
    ),
    timeCtrlDelayHFDamp: new FieldDefinition(
      pack7(0x0159),
      "TIME CTRL DELAY HF Damp",
      freq8000BypassField
    ),
    timeCtrlDelayLowGain: new FieldDefinition(
      pack7(0x015a),
      "TIME CTRL DELAY Low Gain",
      gain15dBField
    ),
    timeCtrlDelayHighGain: new FieldDefinition(
      pack7(0x015b),
      "TIME CTRL DELAY High Gain",
      gain15dBField
    ),
    timeCtrlDelayBalance: new FieldDefinition(
      pack7(0x015c),
      "TIME CTRL DELAY Balance",
      dryWet100Field
    ),
    timeCtrlDelayLevel: new FieldDefinition(
      pack7(0x015d),
      "TIME CTRL DELAY Level",
      new C127Field()
    ),
    lofiCompressPreFilterType: new FieldDefinition(
      pack7(0x015e),
      "LOFI COMPRESS Pre Filter Type",
      new UByteField(1, 6, { encodedOffset: -1 })
    ),
    lofiCompressLoFiType: new FieldDefinition(
      pack7(0x015f),
      "LOFI COMPRESS LoFi Type",
      new UByteField(1, 9, { encodedOffset: -1 })
    ),
    lofiCompressPostFilterType: new FieldDefinition(
      pack7(0x0160),
      "LOFI COMPRESS Post Filter Type",
      enumField(["OFF", "LPF", "HPF"] as const)
    ),
    lofiCompressPostFilterCutoff: new FieldDefinition(
      pack7(0x0161),
      "LOFI COMPRESS Post Filter Cutoff",
      freq8000Field
    ),
    lofiCompressLowGain: new FieldDefinition(
      pack7(0x0162),
      "LOFI COMPRESS Low Gain",
      gain15dBField
    ),
    lofiCompressHighGain: new FieldDefinition(
      pack7(0x0163),
      "LOFI COMPRESS High Gain",
      gain15dBField
    ),
    lofiCompressBalance: new FieldDefinition(
      pack7(0x0164),
      "LOFI COMPRESS Balance",
      dryWet100Field
    ),
    lofiCompressLevel: new FieldDefinition(
      pack7(0x0165),
      "LOFI COMPRESS Level",
      new C127Field()
    ),
    pitchShifterCoarse: new FieldDefinition(
      pack7(0x0166),
      "PITCH SHIFTER Coarse",
      new UByteField(-24, 12, { encodedOffset: 12 })
    ),
    pitchShifterFine: new FieldDefinition(
      pack7(0x0167),
      "PITCH SHIFTER Fine",
      new UByteField(-100, 100, {
        encodedOffset: 50,
        decodedFactor: 2,
      })
    ),
    pitchShifterDelayTimeSyncSw: new FieldDefinition(
      pack7(0x0168),
      "PITCH SHIFTER Delay Time Sync Sw",
      booleanField
    ),
    pitchShifterDelayTime: new FieldDefinition(
      pack7(0x0169),
      "PITCH SHIFTER Delay Time",
      mfx1300msecField
    ),
    pitchShifterDelayTimeNote: new FieldDefinition(
      pack7(0x016c),
      "PITCH SHIFTER Delay Time Note",
      mfxDelayNoteField
    ),
    pitchShifterFeedback: new FieldDefinition(
      pack7(0x016d),
      "PITCH SHIFTER Feedback",
      feedback98Field
    ),
    pitchShifterLowGain: new FieldDefinition(
      pack7(0x016e),
      "PITCH SHIFTER Low Gain",
      gain15dBField
    ),
    pitchShifterHighGain: new FieldDefinition(
      pack7(0x016f),
      "PITCH SHIFTER High Gain",
      gain15dBField
    ),
    pitchShifterBalance: new FieldDefinition(
      pack7(0x0170),
      "PITCH SHIFTER Balance",
      dryWet100Field
    ),
    pitchShifterLevel: new FieldDefinition(
      pack7(0x0171),
      "PITCH SHIFTER Level",
      new C127Field()
    ),
  }),
  sendsAndEq: new StructDefinition(pack7(0x000600), "CHO/DLY/EQ/CHR", {
    chorusSwitch: new FieldDefinition(
      pack7(0x0000),
      "Chorus Switch",
      booleanField
    ),
    chorusType: new FieldDefinition(
      pack7(0x0001),
      "Chorus Type",
      enumField(["MONO", "STEREO", "MONO MILD", "STEREO MILD"] as const)
    ),
    chorusRate: new FieldDefinition(pack7(0x0002), "Chorus Rate", rate113Field),
    chorusDepth: new FieldDefinition(
      pack7(0x0003),
      "Chorus Depth",
      new UByteField(0, 100)
    ),
    chorusEffectLevel: new FieldDefinition(
      pack7(0x0004),
      "Chorus Effect Level",
      new UByteField(0, 100)
    ),
    delaySwitch: new FieldDefinition(
      pack7(0x0005),
      "Delay Switch",
      booleanField
    ),
    delayType: new FieldDefinition(
      pack7(0x0006),
      "Delay Type",
      enumField([
        "SINGLE",
        "PAN",
        "REVERSE",
        "ANALOG",
        "TAPE",
        "MODULATE",
        "HICUT",
      ] as const)
    ),
    delayTime: new FieldDefinition(pack7(0x0007), "Delay Time", time3413Field),
    delayFeedback: new FieldDefinition(
      pack7(0x000a),
      "Delay Feedback",
      new UByteField(0, 100)
    ),
    delayEffectLevel: new FieldDefinition(
      pack7(0x000b),
      "Delay Effect Level",
      new UByteField(0, 120)
    ),
    reverbSwitch: new FieldDefinition(
      pack7(0x000c),
      "Reverb Switch",
      booleanField
    ),
    reverbType: new FieldDefinition(
      pack7(0x000d),
      "Reverb Type",
      enumField(["AMBIENCE", "ROOM", "HALL1", "HALL2", "PLATE"] as const)
    ),
    reverbTime: new FieldDefinition(
      pack7(0x000e),
      "Reverb Time",
      new UByteField(0.1, 10.0, {
        decodedFactor: 0.1,
        encodedOffset: -1,
        format(value: number) {
          return value.toFixed(1) + " s";
        },
      })
    ),
    reverbHighCut: new FieldDefinition(
      pack7(0x000f),
      "Reverb High Cut",
      freq11000FlatField
    ),
    reverbEffectLevel: new FieldDefinition(
      pack7(0x0010),
      "Reverb Effect Level",
      new UByteField(0, 100)
    ),
    eqSwitch: new FieldDefinition(pack7(0x0011), "EQ Switch", booleanField),
    eqLowCutoffFreq: new FieldDefinition(
      pack7(0x0012),
      "EQ Low Cutoff Freq",
      freqFlat800Field
    ),
    eqLowGain: new FieldDefinition(pack7(0x0013), "EQ Low Gain", gain20dBField),
    eqLowMidCutoffFreq: new FieldDefinition(
      pack7(0x0014),
      "EQ Low Mid Cutoff Freq",
      freq10000Field
    ),
    eqLowMidQ: new FieldDefinition(pack7(0x0015), "EQ Low Mid Q", q16Field),
    eqLowMidGain: new FieldDefinition(
      pack7(0x0016),
      "EQ Low Mid Gain",
      gain20dBField
    ),
    eqHighMidCutoffFreq: new FieldDefinition(
      pack7(0x0017),
      "EQ High Mid Cutoff Freq",
      freq10000Field
    ),
    eqHighMidQ: new FieldDefinition(pack7(0x0018), "EQ High Mid Q", q16Field),
    eqHighMidGain: new FieldDefinition(
      pack7(0x0019),
      "EQ High Mid Gain",
      gain20dBField
    ),
    eqHighCutoffFreq: new FieldDefinition(
      pack7(0x001a),
      "EQ High Cutoff Freq",
      freq11000FlatField
    ),
    eqHighGain: new FieldDefinition(
      pack7(0x001b),
      "EQ High Gain",
      gain20dBField
    ),
    eqLevel: new FieldDefinition(pack7(0x001c), "EQ Level", gain20dBField),
    ezCharacter: new FieldDefinition(
      pack7(0x001d),
      "EZ Character",
      new UByteField(-3, 3, { encodedOffset: 3 })
    ),
  }),
  ampModNs: new StructDefinition(pack7(0x000700), "Amp/Mod/NS", {
    ampSwitch: new FieldDefinition(pack7(0x0000), "Amp Switch", booleanField),
    ampType: new FieldDefinition(
      pack7(0x0001),
      "Amp Type",
      enumField([
        "BOSS CLEAN",
        "JC-120",
        "JAZZ COMBO",
        "FULL RANGE",
        "CLEAN TWIN",
        "PRO CRUNCH",
        "TWEED",
        "DELUX CRUNCH",
        "BOSS CRUNCH",
        "BLUES",
        "WILD CRUNCH",
        "STACK CRUNCH",
        "VO DRIVE",
        "VO LEAD",
        "VO CLEAN",
        "MATCH DRIVE",
        "FAT MATCH",
        "MATCH LEAD",
        "BG LEAD",
        "BG DRIVE",
        "BG RHYTHM",
        "MS 1959 I",
        "MS 1959 I+II",
        "MS HIGAIN",
        "MS SCOOP",
        "R-FIER VINTAGE",
        "R-FIER MODERN",
        "R-FIER CLEAN",
        "T-AMP LEAD",
        "T-AMP CRUNCH",
        "T-AMP CLEAN",
        "BOSS DRIVE",
        "SLDN",
        "LEAD STACK",
        "HEAVY LEAD",
        "BOSS METAL",
        "5150 DRIVE",
        "METAL LEAD",
        "EDGE LEAD",
        "BASS CLEAN",
        "BASS CRUNCH",
        "BASS HIGAIN",
      ] as const)
    ),
    ampGain: new FieldDefinition(
      pack7(0x0002),
      "Amp Gain",
      new UByteField(0, 120)
    ),
    ampLevel: new FieldDefinition(
      pack7(0x0003),
      "Amp Level",
      new UByteField(0, 120)
    ),
    ampGainSwitch: new FieldDefinition(
      pack7(0x0004),
      "Amp Gain Switch",
      enumField(["LOW", "MID", "HIGH"] as const)
    ),
    ampSoloSwitch: new FieldDefinition(
      pack7(0x0005),
      "Amp Solo Switch",
      booleanField
    ),
    ampSoloLevel: new FieldDefinition(
      pack7(0x0006),
      "Amp Solo Level",
      new UByteField(0, 100)
    ),
    ampBass: new FieldDefinition(
      pack7(0x0007),
      "Amp Bass",
      new UByteField(0, 100)
    ),
    ampMiddle: new FieldDefinition(
      pack7(0x0008),
      "Amp Middle",
      new UByteField(0, 100)
    ),
    ampTreble: new FieldDefinition(
      pack7(0x0009),
      "Amp Treble",
      new UByteField(0, 100)
    ),
    ampPresence: new FieldDefinition(
      pack7(0x000a),
      "Amp Presence",
      new UByteField(0, 100)
    ),
    ampBright: new FieldDefinition(pack7(0x000b), "Amp Bright", booleanField),
    ampSpType: new FieldDefinition(
      pack7(0x000c),
      "Amp SP type",
      enumField([
        "OFF",
        "ORIGIN",
        '1x8"',
        '1x10"',
        '1x12"',
        '2x12"',
        '4x10"',
        '4x12"',
        '8x12"',
      ] as const)
    ),
    ampMicType: new FieldDefinition(
      pack7(0x000d),
      "Amp Mic Type",
      enumField(["DYN57", "DYN421", "CND451", "CND87", "FLAT"] as const)
    ),
    ampMicDistance: new FieldDefinition(
      pack7(0x000e),
      "Amp Mic Distance",
      new BooleanField("OFF MIC", "ON MIC")
    ),
    ampMicPosition: new FieldDefinition(
      pack7(0x000f),
      "Amp Mic Position",
      new UByteField(0, 10, {
        format: (value) => {
          if (value === 0) {
            return "CENTER";
          }
          return String(value);
        },
      })
    ),
    ampMicLevel: new FieldDefinition(
      pack7(0x0010),
      "Amp Mic Level",
      new UByteField(0, 100)
    ),
    modChorusSendLevel: new FieldDefinition(
      pack7(0x0011),
      "MOD Chorus Send Level",
      new UByteField(0, 100)
    ),
    modDelaySendLevel: new FieldDefinition(
      pack7(0x0012),
      "MOD Delay Send Level",
      new UByteField(0, 100)
    ),
    modReverbSendLevel: new FieldDefinition(
      pack7(0x0013),
      "MOD Reverb Send Level",
      new UByteField(0, 100)
    ),
    reserved0014: new FieldDefinition(
      pack7(0x0014),
      "(Reserved)",
      new ReservedField()
    ),
    modSwitch: new FieldDefinition(pack7(0x0015), "MOD Switch", booleanField),
    modType: new FieldDefinition(
      pack7(0x0016),
      "MOD Type",
      enumField([
        "OD/DS",
        "WAH",
        "COMP",
        "LIMITER",
        "OCTAVE",
        "PHASER",
        "FLANGER",
        "TREMOLO",
        "ROTARY",
        "UNI-V",
        "PAN",
        "DELAY",
        "CHORUS",
        "EQ",
      ] as const)
    ),
    modPan: new FieldDefinition(pack7(0x0017), "MOD Pan", pan100Field),
    odDsType: new FieldDefinition(
      pack7(0x0018),
      "OD/DS Type",
      enumField([
        "MID BOOST",
        "CLEAN BOOST",
        "TREBLE BST",
        "BLUES OD",
        "CRUNCH",
        "NATURAL OD",
        "OD-1",
        "T-SCREAM",
        "TURBO OD",
        "WARM OD",
        "DISTORTION",
        "MILD DS",
        "MID DS",
        "RAT",
        "GUV DS",
        "DST+",
        "MODERN DS",
        "SOLID DS",
        "STACK",
        "LOUD",
        "METAL ZONE",
        "LEAD",
        "'60S FUZZ",
        "OCT FUZZ",
        "MUFF FUZZ",
      ] as const)
    ),
    odDsDrive: new FieldDefinition(
      pack7(0x0019),
      "OD/DS Drive",
      new UByteField(0, 120)
    ),
    odDsTone: new FieldDefinition(
      pack7(0x001a),
      "OD/DS Tone",
      new UByteField(0, 100)
    ),
    odDsLevel: new FieldDefinition(
      pack7(0x001b),
      "OD/DS Level",
      new UByteField(0, 100)
    ),
    wahMode: new FieldDefinition(
      pack7(0x001c),
      "WAH Mode",
      enumField(["MANUAL", "T.UP", "T.DOWN"] as const)
    ),
    wahType: new FieldDefinition(
      pack7(0x001d),
      "WAH Type",
      enumField([
        "CRY WAH",
        "VO WAH",
        "FAT WAH",
        "LIGHT WAH",
        "7STRING WAH",
        "RESO WAH",
      ] as const)
    ),
    wahPedalPosition: new FieldDefinition(
      pack7(0x001e),
      "WAH Pedal Position",
      new UByteField(0, 100)
    ),
    wahSens: new FieldDefinition(
      pack7(0x001f),
      "WAH Sens",
      new UByteField(0, 100)
    ),
    wahFreq: new FieldDefinition(
      pack7(0x0020),
      "WAH Freq",
      new UByteField(0, 100)
    ),
    wahPeak: new FieldDefinition(
      pack7(0x0021),
      "WAH Peak",
      new UByteField(0, 100)
    ),
    wahLevel: new FieldDefinition(
      pack7(0x0022),
      "WAH Level",
      new UByteField(0, 100)
    ),
    compSustain: new FieldDefinition(
      pack7(0x0023),
      "COMP Sustain",
      new UByteField(0, 100)
    ),
    compAttack: new FieldDefinition(
      pack7(0x0024),
      "COMP Attack",
      new UByteField(0, 100)
    ),
    compLevel: new FieldDefinition(
      pack7(0x0025),
      "COMP Level",
      new UByteField(0, 100)
    ),
    limiterThreshold: new FieldDefinition(
      pack7(0x0026),
      "LIMITER Threshold",
      new UByteField(0, 100)
    ),
    limiterRelease: new FieldDefinition(
      pack7(0x0027),
      "LIMITER Release",
      new UByteField(0, 100)
    ),
    limiterLevel: new FieldDefinition(
      pack7(0x0028),
      "LIMITER Level",
      new UByteField(0, 100)
    ),
    octaveOctLevel: new FieldDefinition(
      pack7(0x0029),
      "OCTAVE Oct Level",
      new UByteField(0, 100)
    ),
    octaveDryLevel: new FieldDefinition(
      pack7(0x002a),
      "OCTAVE Dry Level",
      new UByteField(0, 100)
    ),
    phaserType: new FieldDefinition(
      pack7(0x002b),
      "PHASER Type",
      enumField(["4STAGE", "8STAGE", "12STAGE", "BI-PHASE"] as const)
    ),
    phaserRate: new FieldDefinition(pack7(0x002c), "PHASER Rate", rate113Field),
    phaserDepth: new FieldDefinition(
      pack7(0x002d),
      "PHASER Depth",
      new UByteField(0, 100)
    ),
    phaserResonance: new FieldDefinition(
      pack7(0x002e),
      "PHASER Resonance",
      new UByteField(0, 100)
    ),
    phaserLevel: new FieldDefinition(
      pack7(0x002f),
      "PHASER Level",
      new UByteField(0, 100)
    ),
    flangerRate: new FieldDefinition(
      pack7(0x0030),
      "FLANGER Rate",
      rate113Field
    ),
    flangerDepth: new FieldDefinition(
      pack7(0x0031),
      "FLANGER Depth",
      new UByteField(0, 100)
    ),
    flangerManual: new FieldDefinition(
      pack7(0x0032),
      "FLANGER Manual",
      new UByteField(0, 100)
    ),
    flangerResonance: new FieldDefinition(
      pack7(0x0033),
      "FLANGER Resonance",
      new UByteField(0, 100)
    ),
    flangerLevel: new FieldDefinition(
      pack7(0x0034),
      "FLANGER Level",
      new UByteField(0, 100)
    ),
    tremoloRate: new FieldDefinition(
      pack7(0x0035),
      "TREMOLO Rate",
      rate113Field
    ),
    tremoloDepth: new FieldDefinition(
      pack7(0x0036),
      "TREMOLO Depth",
      new UByteField(0, 100)
    ),
    tremoloWaveShape: new FieldDefinition(
      pack7(0x0037),
      "TREMOLO Wave Shape",
      new UByteField(0, 100)
    ),
    tremoloLevel: new FieldDefinition(
      pack7(0x0038),
      "TREMOLO Level",
      new UByteField(0, 100)
    ),
    rotaryRateSlow: new FieldDefinition(
      pack7(0x0039),
      "ROTARY Rate Slow",
      rate113Field
    ),
    rotaryRateFast: new FieldDefinition(
      pack7(0x003a),
      "ROTARY Rate Fast",
      rate113Field
    ),
    rotaryDepth: new FieldDefinition(
      pack7(0x003b),
      "ROTARY Depth",
      new UByteField(0, 100)
    ),
    rotarySelect: new FieldDefinition(
      pack7(0x003c),
      "ROTARY Select",
      new BooleanField("SLOW", "FAST")
    ),
    rotaryLevel: new FieldDefinition(
      pack7(0x003d),
      "ROTARY Level",
      new UByteField(0, 100)
    ),
    uniVRate: new FieldDefinition(pack7(0x003e), "UNI-V Rate", rate113Field),
    uniVDepth: new FieldDefinition(
      pack7(0x003f),
      "UNI-V Depth",
      new UByteField(0, 100)
    ),
    uniVLevel: new FieldDefinition(
      pack7(0x0040),
      "UNI-V Level",
      new UByteField(0, 100)
    ),
    panRate: new FieldDefinition(pack7(0x0041), "PAN Rate", rate113Field),
    panDepth: new FieldDefinition(
      pack7(0x0042),
      "PAN Depth",
      new UByteField(0, 100)
    ),
    panWaveShape: new FieldDefinition(
      pack7(0x0043),
      "PAN Wave Shape",
      new UByteField(0, 100)
    ),
    panLevel: new FieldDefinition(
      pack7(0x0044),
      "PAN Level",
      new UByteField(0, 100)
    ),
    delayType: new FieldDefinition(
      pack7(0x0045),
      "DELAY Type",
      enumField([
        "SINGLE",
        "PAN",
        "STEREO",
        "REVERSE",
        "ANALOG",
        "TAPE",
        "MODULATE",
        "HICUT",
      ] as const)
    ),
    delayTime: new FieldDefinition(pack7(0x0046), "DELAY Time", time3413Field),
    delayFeedback: new FieldDefinition(
      pack7(0x0049),
      "DELAY Feedback",
      new UByteField(0, 100)
    ),
    delayEffectLevel: new FieldDefinition(
      pack7(0x004a),
      "DELAY Effect Level",
      new UByteField(0, 120)
    ),
    chorusType: new FieldDefinition(
      pack7(0x004b),
      "CHORUS Type",
      enumField([
        "MONO",
        "STEREO1",
        "STEREO2",
        "MONO MILD",
        "STEREO1 MILD",
        "STEREO2 MILD",
      ] as const)
    ),
    chorusRate: new FieldDefinition(pack7(0x004c), "CHORUS Rate", rate113Field),
    chorusDepth: new FieldDefinition(
      pack7(0x004d),
      "CHORUS Depth",
      new UByteField(0, 100)
    ),
    chorusEffectLevel: new FieldDefinition(
      pack7(0x004e),
      "CHORUS Effect Level",
      new UByteField(0, 100)
    ),
    eqLowCutoffFreq: new FieldDefinition(
      pack7(0x004f),
      "EQ Low Cutoff Freq",
      freqFlat800Field
    ),
    eqLowGain: new FieldDefinition(pack7(0x0050), "EQ Low Gain", gain20dBField),
    eqLowMidCutoffFreq: new FieldDefinition(
      pack7(0x0051),
      "EQ Low Mid Cutoff Freq",
      freq10000Field
    ),
    eqLowMidQ: new FieldDefinition(pack7(0x0052), "EQ Low Mid Q", q16Field),
    eqLowMidGain: new FieldDefinition(
      pack7(0x0053),
      "EQ Low Mid Gain",
      gain20dBField
    ),
    eqHighMidCutoffFreq: new FieldDefinition(
      pack7(0x0054),
      "EQ High Mid Cutoff Freq",
      freq10000Field
    ),
    eqHighMidQ: new FieldDefinition(pack7(0x0055), "EQ High Mid Q", q16Field),
    eqHighMidGain: new FieldDefinition(
      pack7(0x0056),
      "EQ High Mid Gain",
      gain20dBField
    ),
    eqHighGain: new FieldDefinition(
      pack7(0x0057),
      "EQ High Gain",
      gain20dBField
    ),
    eqHighCutoffFreq: new FieldDefinition(
      pack7(0x0058),
      "EQ High Cutoff Freq",
      freq11000FlatField
    ),
    eqLevel: new FieldDefinition(pack7(0x0059), "EQ Level", gain20dBField),
    nsSwitch: new FieldDefinition(pack7(0x005a), "NS Switch", booleanField),
    nsThreshold: new FieldDefinition(
      pack7(0x005b),
      "NS Threshold",
      new UByteField(0, 100)
    ),
    nsReleaseTime: new FieldDefinition(
      pack7(0x005c),
      "NS Release Time",
      new UByteField(0, 100)
    ),
  }),
  modelingTone: new StructDefinition(
    pack7(0x001000),
    "Modeling Tone",
    PatchModelingToneStruct
  ),
  patchPCMTone1: new StructDefinition(
    pack7(0x002000),
    "Patch PCM Tone1 Part",
    PatchPCMToneStruct
  ),
  patchPCMTone2: new StructDefinition(
    pack7(0x002100),
    "Patch PCM Tone2 Part",
    PatchPCMToneStruct
  ),
  patchPCMTone1Offset: new StructDefinition(
    pack7(0x003000),
    "Patch PCM Tone1 Part",
    PatchPCMToneOffsetStruct
  ),
  patchPCMTone2Offset: new StructDefinition(
    pack7(0x003100),
    "Patch PCM Tone2 Part",
    PatchPCMToneOffsetStruct
  ),
};

const SystemStruct = {
  common: new StructDefinition(0x000000, "Common", {
    guitarBassSelect: new FieldDefinition(
      pack7(0x001a),
      "GUITAR/BASS Select",
      enumField(["GUITAR", "BASS"] as const)
    ),
  }),
};

export const RolandGR55AddressMap = new StructDefinition(
  pack7(0x00000000),
  "Roland GR-55 Address Map",
  {
    system: new StructDefinition(pack7(0x02000000), "System", SystemStruct),
    temporaryPatch: new StructDefinition(
      pack7(0x18000000),
      "Temporary Patch",
      PatchStruct
    ),
  }
);

export const RolandGR55AddressMapAbsolute = getAddresses(
  RolandGR55AddressMap,
  0
);

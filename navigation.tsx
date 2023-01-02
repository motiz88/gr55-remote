import { NavigationProp } from "@react-navigation/native";

export type RootTabParamList = {
  IoSetup: object;
};

export type PatchDrawerParamList = {
  PatchStack: object;
};

export type PatchStackParamList = {
  PatchMain: object;
  PatchEffects: object;
  PatchTone: object;
  PatchAssigns: object;
  PatchMasterOther: object;
};

export type PatchEffectsTabParamList = {
  Struct: object;
  Amp: object;
  Mod: object;
  MFX: object;
  DLY: object;
  REV: object;
  CHO: object;
  EQ: object;
};

export type PatchToneTabParamList = {
  Normal: object;
  PCM1: object;
  PCM2: object;
  Modeling: object;
};

export type PatchAssignsTabParamList = {
  Assign1: object;
  Assign2: object;
  Assign3: object;
  Assign4: object;
  Assign5: object;
  Assign6: object;
  Assign7: object;
  Assign8: object;
};

export type GlobalNavigationProp = NavigationProp<
  | RootTabParamList
  | PatchDrawerParamList
  | PatchStackParamList
  | PatchToneTabParamList
  | PatchEffectsTabParamList,
  keyof (
    | RootTabParamList
    | PatchDrawerParamList
    | PatchStackParamList
    | PatchToneTabParamList
    | PatchEffectsTabParamList
  ),
  "RootTab" | "PatchDrawer" | "PatchStack" | "PatchTone" | "PatchEffects"
>;

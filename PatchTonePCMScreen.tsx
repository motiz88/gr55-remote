import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { useContext } from "react";
import { StyleSheet } from "react-native";

import { PopoverAwareScrollView } from "./PopoverAwareScrollView";
import { RefreshControl } from "./RefreshControl";
import { RemoteFieldPicker } from "./RemoteFieldPicker";
import { RemoteFieldPickerWithCategories } from "./RemoteFieldPickerWithCategories";
import { RemoteFieldSlider } from "./RemoteFieldSlider";
import { RemoteFieldSwitch } from "./RemoteFieldSwitch";
import { RemoteFieldSwitchedSection } from "./RemoteFieldSwitchedSection";
import { RolandGR55AddressMapAbsolute as GR55 } from "./RolandGR55AddressMap";
import { rolandToneCategories } from "./RolandGR55ToneMap";
import { RolandRemotePatchContext as PATCH } from "./RolandRemotePageContext";
import { useMainScrollViewSafeAreaStyle } from "./SafeAreaUtils";
import { PatchToneTabParamList } from "./navigation";

export function PatchTonePCMScreen({
  navigation,
  route,
}: MaterialTopTabScreenProps<PatchToneTabParamList, "PCM1" | "PCM2">) {
  const { reloadData } = useContext(PATCH);

  const pcmTonePage =
    route.name === "PCM1"
      ? GR55.temporaryPatch.patchPCMTone1
      : GR55.temporaryPatch.patchPCMTone2;

  const pcmToneOffsetPage =
    route.name === "PCM1"
      ? GR55.temporaryPatch.patchPCMTone1Offset
      : GR55.temporaryPatch.patchPCMTone2Offset;
  const safeAreaStyle = useMainScrollViewSafeAreaStyle();

  return (
    <PopoverAwareScrollView
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={reloadData} />
      }
      style={[styles.container]}
      contentContainerStyle={safeAreaStyle}
    >
      <RemoteFieldSwitchedSection page={PATCH} field={pcmTonePage.muteSwitch}>
        <RemoteFieldPickerWithCategories
          page={PATCH}
          field={pcmTonePage.toneSelect}
          categories={rolandToneCategories}
          shortDescription="Tone"
        />
        <RemoteFieldSlider page={PATCH} field={pcmTonePage.partLevel} />
        <RemoteFieldSlider page={PATCH} field={pcmTonePage.partOctaveShift} />
        <RemoteFieldSwitch page={PATCH} field={pcmTonePage.chromatic} />
        <RemoteFieldSwitch page={PATCH} field={pcmTonePage.legatoSwitch} />
        <RemoteFieldSlider
          page={PATCH}
          field={pcmToneOffsetPage.tvaLevelVelocitySensOffset}
        />
        <RemoteFieldPicker
          page={PATCH}
          field={pcmToneOffsetPage.tvaLevelVelocityCurve}
        />
        <RemoteFieldSwitch page={PATCH} field={pcmTonePage.nuanceSwitch} />
        <RemoteFieldSlider page={PATCH} field={pcmTonePage.partPan} />
        <RemoteFieldSlider page={PATCH} field={pcmTonePage.string1Level} />
        <RemoteFieldSlider page={PATCH} field={pcmTonePage.string2Level} />
        <RemoteFieldSlider page={PATCH} field={pcmTonePage.string3Level} />
        <RemoteFieldSlider page={PATCH} field={pcmTonePage.string4Level} />
        {/* TODO: What does this look like in bass mode? */}
        <RemoteFieldSlider page={PATCH} field={pcmTonePage.string5Level} />
        <RemoteFieldSlider page={PATCH} field={pcmTonePage.string6Level} />
        <RemoteFieldSlider page={PATCH} field={pcmTonePage.partCoarseTune} />
        <RemoteFieldSlider page={PATCH} field={pcmTonePage.partFineTune} />
        <RemoteFieldPicker
          page={PATCH}
          field={pcmTonePage.partPortamentoSwitch}
        />
        <RemoteFieldPicker
          page={PATCH}
          field={pcmToneOffsetPage.partPortamentoType}
        />
        <RemoteFieldSlider page={PATCH} field={pcmTonePage.portamentoTime} />
        <RemoteFieldPicker
          page={PATCH}
          field={pcmToneOffsetPage.tvfFilterType}
        />
        <RemoteFieldSlider
          page={PATCH}
          field={pcmToneOffsetPage.tvfCutoffFrequencyOffset}
        />
        <RemoteFieldSlider
          page={PATCH}
          field={pcmToneOffsetPage.tvfResonanceOffset}
        />
        <RemoteFieldSlider
          page={PATCH}
          field={pcmToneOffsetPage.tvfCutoffVelocitySens}
        />
        <RemoteFieldSlider
          page={PATCH}
          field={pcmToneOffsetPage.nuanceCutoffSens}
        />
        <RemoteFieldPicker
          page={PATCH}
          field={pcmToneOffsetPage.tvfCutoffVelocityCurve}
        />
        <RemoteFieldSlider
          page={PATCH}
          field={pcmToneOffsetPage.tvfCutoffKeyfollowOffset}
        />
        <RemoteFieldSlider
          page={PATCH}
          field={pcmToneOffsetPage.tvfEnvDepthOffset}
        />
        <RemoteFieldSlider
          page={PATCH}
          field={pcmToneOffsetPage.tvfEnvTime1Offset}
        />
        <RemoteFieldSlider
          page={PATCH}
          field={pcmToneOffsetPage.tvfEnvTime2Offset}
        />
        <RemoteFieldSlider
          page={PATCH}
          field={pcmToneOffsetPage.tvfEnvLevel3Offset}
        />
        <RemoteFieldSlider
          page={PATCH}
          field={pcmToneOffsetPage.tvfEnvTime4Offset}
        />
        <RemoteFieldSlider
          page={PATCH}
          field={pcmToneOffsetPage.tvfEnvTime1VelocitySensOffset}
        />
        <RemoteFieldSlider
          page={PATCH}
          field={pcmToneOffsetPage.tvfEnvTime1NuanceSensOffset}
        />
        <RemoteFieldSlider
          page={PATCH}
          field={pcmToneOffsetPage.tvaEnvTime1Offset}
        />
        <RemoteFieldSlider
          page={PATCH}
          field={pcmToneOffsetPage.tvaEnvTime2Offset}
        />
        <RemoteFieldSlider
          page={PATCH}
          field={pcmToneOffsetPage.tvaEnvLevel3Offset}
        />
        <RemoteFieldSlider
          page={PATCH}
          field={pcmToneOffsetPage.tvaEnvTime4Offset}
        />
        <RemoteFieldSlider
          page={PATCH}
          field={pcmToneOffsetPage.tvaEnvTime1VelocitySensOffset}
        />
        <RemoteFieldSlider
          page={PATCH}
          field={pcmToneOffsetPage.tvaEnvTime1NuanceSensOffset}
        />
        <RemoteFieldSlider
          page={PATCH}
          field={pcmToneOffsetPage.nuanceLevelSens}
        />
        <RemoteFieldPicker page={PATCH} field={pcmTonePage.releaseMode} />
        <RemoteFieldSlider
          page={PATCH}
          field={pcmToneOffsetPage.pitchEnvVelocitySensOffset}
        />
        <RemoteFieldSlider
          page={PATCH}
          field={pcmToneOffsetPage.pitchEnvOffset}
        />
        <RemoteFieldSlider
          page={PATCH}
          field={pcmToneOffsetPage.pitchEnvTime1Offset}
        />
        <RemoteFieldSlider
          page={PATCH}
          field={pcmToneOffsetPage.pitchEnvTime2Offset}
        />
        <RemoteFieldSlider page={PATCH} field={pcmToneOffsetPage.lfo1Rate} />
        <RemoteFieldSlider
          page={PATCH}
          field={pcmToneOffsetPage.lfo1PitchDepthOffset}
        />
        <RemoteFieldSlider
          page={PATCH}
          field={pcmToneOffsetPage.lfo1TVFDepthOffset}
        />
        <RemoteFieldSlider
          page={PATCH}
          field={pcmToneOffsetPage.lfo1TVADepthOffset}
        />
        <RemoteFieldSlider
          page={PATCH}
          field={pcmToneOffsetPage.lfo1PanDepthOffset}
        />
        <RemoteFieldSlider page={PATCH} field={pcmToneOffsetPage.lfo2Rate} />
        <RemoteFieldSlider
          page={PATCH}
          field={pcmToneOffsetPage.lfo2PitchDepthOffset}
        />
        <RemoteFieldSlider
          page={PATCH}
          field={pcmToneOffsetPage.lfo2TVFDepthOffset}
        />
        <RemoteFieldSlider
          page={PATCH}
          field={pcmToneOffsetPage.lfo2TVADepthOffset}
        />
        <RemoteFieldSlider
          page={PATCH}
          field={pcmToneOffsetPage.lfo2PanDepthOffset}
        />
      </RemoteFieldSwitchedSection>
    </PopoverAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});

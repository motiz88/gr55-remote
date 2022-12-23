import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { useContext } from "react";
import { ScrollView, StyleSheet, RefreshControl } from "react-native";

import {
  PatchFieldPicker,
  PatchFieldSlider,
  PatchFieldSwitch,
  SwitchedSection,
} from "./PatchFieldComponents";
import { RolandGR55AddressMapAbsolute as GR55 } from "./RolandGR55AddressMap";
import { RolandRemotePatchContext } from "./RolandRemotePatchContext";
import { useMainScrollViewSafeAreaStyle } from "./SafeAreaUtils";
import { PatchToneTabParamList } from "./navigation";

export function PatchTonePCMScreen({
  navigation,
  route,
}: MaterialTopTabScreenProps<PatchToneTabParamList, "PCM1" | "PCM2">) {
  const { reloadPatchData } = useContext(RolandRemotePatchContext);

  const pcmTonePage =
    route.name === "PCM1"
      ? GR55.temporaryPatch.patchPCMTone1
      : GR55.temporaryPatch.patchPCMTone2;

  const pcmToneOffsetPage =
    route.name === "PCM1"
      ? GR55.temporaryPatch.patchPCMTone1Offset
      : GR55.temporaryPatch.patchPCMTone2Offset;

  // TODO: FlatList + disabled section styling
  //
  // const renderItem = useCallback(({ item }) => item, []);
  // const fields = useMemo(
  //   () => [
  //     <PatchFieldSwitch field={pcmTonePage.muteSwitch} />,
  //     <PatchFieldPicker field={pcmTonePage.toneSelect} />,
  //     <PatchFieldSlider field={pcmTonePage.partLevel} />,
  //     <PatchFieldSlider field={pcmTonePage.partOctaveShift} />,
  //     <PatchFieldSwitch field={pcmTonePage.chromatic} />,
  //     <PatchFieldSwitch field={pcmTonePage.legatoSwitch} />,
  //     <PatchFieldSlider field={pcmToneOffsetPage.tvaLevelVelocitySensOffset} />,
  //     <PatchFieldPicker field={pcmToneOffsetPage.tvaLevelVelocityCurve} />,
  //     <PatchFieldSwitch field={pcmTonePage.nuanceSwitch} />,
  //     <PatchFieldSlider field={pcmTonePage.partPan} />,
  //     <PatchFieldSlider field={pcmTonePage.string1Level} />,
  //     <PatchFieldSlider field={pcmTonePage.string2Level} />,
  //     <PatchFieldSlider field={pcmTonePage.string3Level} />,
  //     <PatchFieldSlider field={pcmTonePage.string4Level} />,
  //     /* TODO: What does this look like in bass mode? */
  //     <PatchFieldSlider field={pcmTonePage.string5Level} />,
  //     <PatchFieldSlider field={pcmTonePage.string6Level} />,
  //     <PatchFieldSlider field={pcmTonePage.partCoarseTune} />,
  //     <PatchFieldSlider field={pcmTonePage.partFineTune} />,
  //     <PatchFieldPicker field={pcmTonePage.partPortamentoSwitch} />,
  //     <PatchFieldPicker field={pcmToneOffsetPage.partPortamentoType} />,
  //     <PatchFieldSlider field={pcmTonePage.portamentoTime} />,
  //     <PatchFieldPicker field={pcmToneOffsetPage.tvfFilterType} />,
  //     <PatchFieldSlider field={pcmToneOffsetPage.tvfCutoffFrequencyOffset} />,
  //     <PatchFieldSlider field={pcmToneOffsetPage.tvfResonanceOffset} />,
  //     <PatchFieldSlider field={pcmToneOffsetPage.tvfCutoffVelocitySens} />,
  //     <PatchFieldSlider field={pcmToneOffsetPage.nuanceCutoffSens} />,
  //     <PatchFieldPicker field={pcmToneOffsetPage.tvfCutoffVelocityCurve} />,
  //     <PatchFieldSlider field={pcmToneOffsetPage.tvfCutoffKeyfollowOffset} />,
  //     <PatchFieldSlider field={pcmToneOffsetPage.tvfEnvDepthOffset} />,
  //     <PatchFieldSlider field={pcmToneOffsetPage.tvfEnvTime1Offset} />,
  //     <PatchFieldSlider field={pcmToneOffsetPage.tvfEnvTime2Offset} />,
  //     <PatchFieldSlider field={pcmToneOffsetPage.tvfEnvLevel3Offset} />,
  //     <PatchFieldSlider field={pcmToneOffsetPage.tvfEnvTime4Offset} />,
  //     <PatchFieldSlider
  //       field={pcmToneOffsetPage.tvfEnvTime1VelocitySensOffset}
  //     />,
  //     <PatchFieldSlider
  //       field={pcmToneOffsetPage.tvfEnvTime1NuanceSensOffset}
  //     />,
  //     <PatchFieldSlider field={pcmToneOffsetPage.tvaEnvTime1Offset} />,
  //     <PatchFieldSlider field={pcmToneOffsetPage.tvaEnvTime2Offset} />,
  //     <PatchFieldSlider field={pcmToneOffsetPage.tvaEnvLevel3Offset} />,
  //     <PatchFieldSlider field={pcmToneOffsetPage.tvaEnvTime4Offset} />,
  //     <PatchFieldSlider
  //       field={pcmToneOffsetPage.tvaEnvTime1VelocitySensOffset}
  //     />,
  //     <PatchFieldSlider
  //       field={pcmToneOffsetPage.tvaEnvTime1NuanceSensOffset}
  //     />,
  //     <PatchFieldSlider field={pcmToneOffsetPage.nuanceLevelSens} />,
  //     <PatchFieldPicker field={pcmTonePage.releaseMode} />,
  //     <PatchFieldSlider field={pcmToneOffsetPage.pitchEnvVelocitySensOffset} />,
  //     <PatchFieldSlider field={pcmToneOffsetPage.pitchEnvOffset} />,
  //     <PatchFieldSlider field={pcmToneOffsetPage.pitchEnvTime1Offset} />,
  //     <PatchFieldSlider field={pcmToneOffsetPage.pitchEnvTime2Offset} />,
  //     <PatchFieldSlider field={pcmToneOffsetPage.lfo1Rate} />,
  //     <PatchFieldSlider field={pcmToneOffsetPage.lfo1PitchDepthOffset} />,
  //     <PatchFieldSlider field={pcmToneOffsetPage.lfo1TVFDepthOffset} />,
  //     <PatchFieldSlider field={pcmToneOffsetPage.lfo1TVADepthOffset} />,
  //     <PatchFieldSlider field={pcmToneOffsetPage.lfo1PanDepthOffset} />,
  //     <PatchFieldSlider field={pcmToneOffsetPage.lfo2Rate} />,
  //     <PatchFieldSlider field={pcmToneOffsetPage.lfo2PitchDepthOffset} />,
  //     <PatchFieldSlider field={pcmToneOffsetPage.lfo2TVFDepthOffset} />,
  //     <PatchFieldSlider field={pcmToneOffsetPage.lfo2TVADepthOffset} />,
  //     <PatchFieldSlider field={pcmToneOffsetPage.lfo2PanDepthOffset} />,
  //   ],
  //   [pcmTonePage, pcmToneOffsetPage]
  // );
  // return (
  //   <FlatList
  //     refreshControl={
  //       <RefreshControl refreshing={false} onRefresh={reloadPatchData} />
  //     }
  //     style={[styles.container]}
  //     data={fields}
  //     renderItem={renderItem}
  //   />
  // );

  const safeAreaStyle = useMainScrollViewSafeAreaStyle();

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={reloadPatchData} />
      }
      style={[styles.container]}
      contentContainerStyle={safeAreaStyle}
    >
      <SwitchedSection field={pcmTonePage.muteSwitch}>
        <PatchFieldPicker field={pcmTonePage.toneSelect} />
        <PatchFieldSlider field={pcmTonePage.partLevel} />
        <PatchFieldSlider field={pcmTonePage.partOctaveShift} />
        <PatchFieldSwitch field={pcmTonePage.chromatic} />
        <PatchFieldSwitch field={pcmTonePage.legatoSwitch} />
        <PatchFieldSlider
          field={pcmToneOffsetPage.tvaLevelVelocitySensOffset}
        />
        <PatchFieldPicker field={pcmToneOffsetPage.tvaLevelVelocityCurve} />
        <PatchFieldSwitch field={pcmTonePage.nuanceSwitch} />
        <PatchFieldSlider field={pcmTonePage.partPan} />
        <PatchFieldSlider field={pcmTonePage.string1Level} />
        <PatchFieldSlider field={pcmTonePage.string2Level} />
        <PatchFieldSlider field={pcmTonePage.string3Level} />
        <PatchFieldSlider field={pcmTonePage.string4Level} />
        {/* TODO: What does this look like in bass mode? */}
        <PatchFieldSlider field={pcmTonePage.string5Level} />
        <PatchFieldSlider field={pcmTonePage.string6Level} />
        <PatchFieldSlider field={pcmTonePage.partCoarseTune} />
        <PatchFieldSlider field={pcmTonePage.partFineTune} />
        <PatchFieldPicker field={pcmTonePage.partPortamentoSwitch} />
        <PatchFieldPicker field={pcmToneOffsetPage.partPortamentoType} />
        <PatchFieldSlider field={pcmTonePage.portamentoTime} />
        <PatchFieldPicker field={pcmToneOffsetPage.tvfFilterType} />
        <PatchFieldSlider field={pcmToneOffsetPage.tvfCutoffFrequencyOffset} />
        <PatchFieldSlider field={pcmToneOffsetPage.tvfResonanceOffset} />
        <PatchFieldSlider field={pcmToneOffsetPage.tvfCutoffVelocitySens} />
        <PatchFieldSlider field={pcmToneOffsetPage.nuanceCutoffSens} />
        <PatchFieldPicker field={pcmToneOffsetPage.tvfCutoffVelocityCurve} />
        <PatchFieldSlider field={pcmToneOffsetPage.tvfCutoffKeyfollowOffset} />
        <PatchFieldSlider field={pcmToneOffsetPage.tvfEnvDepthOffset} />
        <PatchFieldSlider field={pcmToneOffsetPage.tvfEnvTime1Offset} />
        <PatchFieldSlider field={pcmToneOffsetPage.tvfEnvTime2Offset} />
        <PatchFieldSlider field={pcmToneOffsetPage.tvfEnvLevel3Offset} />
        <PatchFieldSlider field={pcmToneOffsetPage.tvfEnvTime4Offset} />
        <PatchFieldSlider
          field={pcmToneOffsetPage.tvfEnvTime1VelocitySensOffset}
        />
        <PatchFieldSlider
          field={pcmToneOffsetPage.tvfEnvTime1NuanceSensOffset}
        />
        <PatchFieldSlider field={pcmToneOffsetPage.tvaEnvTime1Offset} />
        <PatchFieldSlider field={pcmToneOffsetPage.tvaEnvTime2Offset} />
        <PatchFieldSlider field={pcmToneOffsetPage.tvaEnvLevel3Offset} />
        <PatchFieldSlider field={pcmToneOffsetPage.tvaEnvTime4Offset} />
        <PatchFieldSlider
          field={pcmToneOffsetPage.tvaEnvTime1VelocitySensOffset}
        />
        <PatchFieldSlider
          field={pcmToneOffsetPage.tvaEnvTime1NuanceSensOffset}
        />
        <PatchFieldSlider field={pcmToneOffsetPage.nuanceLevelSens} />
        <PatchFieldPicker field={pcmTonePage.releaseMode} />
        <PatchFieldSlider
          field={pcmToneOffsetPage.pitchEnvVelocitySensOffset}
        />
        <PatchFieldSlider field={pcmToneOffsetPage.pitchEnvOffset} />
        <PatchFieldSlider field={pcmToneOffsetPage.pitchEnvTime1Offset} />
        <PatchFieldSlider field={pcmToneOffsetPage.pitchEnvTime2Offset} />
        <PatchFieldSlider field={pcmToneOffsetPage.lfo1Rate} />
        <PatchFieldSlider field={pcmToneOffsetPage.lfo1PitchDepthOffset} />
        <PatchFieldSlider field={pcmToneOffsetPage.lfo1TVFDepthOffset} />
        <PatchFieldSlider field={pcmToneOffsetPage.lfo1TVADepthOffset} />
        <PatchFieldSlider field={pcmToneOffsetPage.lfo1PanDepthOffset} />
        <PatchFieldSlider field={pcmToneOffsetPage.lfo2Rate} />
        <PatchFieldSlider field={pcmToneOffsetPage.lfo2PitchDepthOffset} />
        <PatchFieldSlider field={pcmToneOffsetPage.lfo2TVFDepthOffset} />
        <PatchFieldSlider field={pcmToneOffsetPage.lfo2TVADepthOffset} />
        <PatchFieldSlider field={pcmToneOffsetPage.lfo2PanDepthOffset} />
      </SwitchedSection>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  disabledSection: {
    backgroundColor: "#ddd",
  },
  container: {
    padding: 8,
  },
});

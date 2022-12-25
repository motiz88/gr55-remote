import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { useContext } from "react";
import { ScrollView, StyleSheet, RefreshControl } from "react-native";

import { PatchFieldPicker } from "./PatchFieldPicker";
import { PatchFieldSlider } from "./PatchFieldSlider";
import { PatchFieldSwitchedSection } from "./PatchFieldSwitchedSection";
import { RolandGR55AddressMapAbsolute as GR55 } from "./RolandGR55AddressMap";
import { RolandRemotePatchContext } from "./RolandRemotePatchContext";
import { useMainScrollViewSafeAreaStyle } from "./SafeAreaUtils";
import { PatchEffectsTabParamList } from "./navigation";

const { sendsAndEq, mfx, ampModNs, common } = GR55.temporaryPatch;

export function PatchEffectsReverbScreen({
  navigation,
}: MaterialTopTabScreenProps<PatchEffectsTabParamList, "REV">) {
  const { reloadPatchData } = useContext(RolandRemotePatchContext);

  const safeAreaStyle = useMainScrollViewSafeAreaStyle();

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={reloadPatchData} />
      }
      style={[styles.container]}
      contentContainerStyle={safeAreaStyle}
    >
      <PatchFieldSwitchedSection field={sendsAndEq.reverbSwitch}>
        <PatchFieldPicker field={sendsAndEq.reverbType} />
        <PatchFieldSlider field={sendsAndEq.reverbTime} />
        <PatchFieldPicker field={sendsAndEq.reverbHighCut} />
        <PatchFieldSlider field={sendsAndEq.reverbEffectLevel} />

        {/* TODO: send levels should be replicated next to the sources too. */}
        {/* TODO: maybe also a mixer view? */}
        <PatchFieldSlider field={mfx.mfxReverbSendLevel} />
        <PatchFieldSlider field={ampModNs.modReverbSendLevel} />
        <PatchFieldSlider field={common.bypassReverbSendLevel} />
      </PatchFieldSwitchedSection>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});

import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { useContext } from "react";
import { ScrollView, StyleSheet } from "react-native";

import { PatchFieldPicker } from "./PatchFieldPicker";
import { PatchFieldSlider } from "./PatchFieldSlider";
import { PatchFieldSwitchedSection } from "./PatchFieldSwitchedSection";
import { RefreshControl } from "./RefreshControl";
import { RolandGR55AddressMapAbsolute as GR55 } from "./RolandGR55AddressMap";
import { RolandRemotePatchContext } from "./RolandRemotePatchContext";
import { useMainScrollViewSafeAreaStyle } from "./SafeAreaUtils";
import { PatchEffectsTabParamList } from "./navigation";

const { sendsAndEq, mfx, ampModNs, common } = GR55.temporaryPatch;

export function PatchEffectsChorusScreen({
  navigation,
}: MaterialTopTabScreenProps<PatchEffectsTabParamList, "CHO">) {
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
      <PatchFieldSwitchedSection field={sendsAndEq.chorusSwitch}>
        <PatchFieldPicker field={sendsAndEq.chorusType} />
        <PatchFieldSlider field={sendsAndEq.chorusRate} />
        <PatchFieldSlider field={sendsAndEq.chorusDepth} />
        <PatchFieldSlider field={sendsAndEq.chorusEffectLevel} />

        {/* TODO: send levels should be replicated next to the sources too. */}
        {/* TODO: maybe also a mixer view? */}
        <PatchFieldSlider field={mfx.mfxChorusSendLevel} />
        <PatchFieldSlider field={ampModNs.modChorusSendLevel} />
        <PatchFieldSlider field={common.bypassChorusSendLevel} />
      </PatchFieldSwitchedSection>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});

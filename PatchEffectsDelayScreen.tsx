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

export function PatchEffectsDelayScreen({
  navigation,
}: MaterialTopTabScreenProps<PatchEffectsTabParamList, "DLY">) {
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
      <PatchFieldSwitchedSection field={sendsAndEq.delaySwitch}>
        <PatchFieldPicker field={sendsAndEq.delayType} />
        <PatchFieldSlider field={sendsAndEq.delayTime} />
        <PatchFieldSlider field={sendsAndEq.delayFeedback} />
        <PatchFieldSlider field={sendsAndEq.delayEffectLevel} />
        <PatchFieldSlider field={mfx.mfxDelaySendLevel} />
        <PatchFieldSlider field={ampModNs.modDelaySendLevel} />
        <PatchFieldSlider field={common.bypassDelaySendLevel} />
      </PatchFieldSwitchedSection>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});

import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { useContext } from "react";
import { ScrollView, StyleSheet, RefreshControl } from "react-native";

import {
  PatchFieldPicker,
  PatchFieldSlider,
  SwitchedSection,
} from "./PatchFieldComponents";
import { RolandGR55AddressMapAbsolute as GR55 } from "./RolandGR55AddressMap";
import { RolandRemotePatchContext } from "./RolandRemotePatchContext";
import { PatchEffectsTabParamList } from "./navigation";

const { sendsAndEq, mfx, ampModNs, common } = GR55.temporaryPatch;

export function PatchEffectsChorusScreen({
  navigation,
}: MaterialTopTabScreenProps<PatchEffectsTabParamList, "CHO">) {
  const { reloadPatchData } = useContext(RolandRemotePatchContext);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={reloadPatchData} />
      }
      style={[styles.container]}
    >
      <SwitchedSection field={sendsAndEq.chorusSwitch}>
        <PatchFieldPicker field={sendsAndEq.chorusType} />
        <PatchFieldSlider field={sendsAndEq.chorusRate} />
        <PatchFieldSlider field={sendsAndEq.chorusDepth} />
        <PatchFieldSlider field={sendsAndEq.chorusEffectLevel} />

        {/* TODO: send levels should be replicated next to the sources too. */}
        {/* TODO: maybe also a mixer view? */}
        <PatchFieldSlider field={mfx.mfxChorusSendLevel} />
        <PatchFieldSlider field={ampModNs.modChorusSendLevel} />
        <PatchFieldSlider field={common.bypassChorusSendLevel} />
      </SwitchedSection>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});

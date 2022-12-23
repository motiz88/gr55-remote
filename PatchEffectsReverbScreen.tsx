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

export function PatchEffectsReverbScreen({
  navigation,
}: MaterialTopTabScreenProps<PatchEffectsTabParamList, "REV">) {
  const { reloadPatchData } = useContext(RolandRemotePatchContext);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={reloadPatchData} />
      }
      style={[styles.container]}
    >
      <SwitchedSection field={sendsAndEq.reverbSwitch}>
        <PatchFieldPicker field={sendsAndEq.reverbType} />
        <PatchFieldSlider field={sendsAndEq.reverbTime} />
        <PatchFieldPicker field={sendsAndEq.reverbHighCut} />
        <PatchFieldSlider field={sendsAndEq.reverbEffectLevel} />

        {/* TODO: send levels should be replicated next to the sources too. */}
        {/* TODO: maybe also a mixer view? */}
        <PatchFieldSlider field={mfx.mfxReverbSendLevel} />
        <PatchFieldSlider field={ampModNs.modReverbSendLevel} />
        <PatchFieldSlider field={common.bypassReverbSendLevel} />
      </SwitchedSection>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});

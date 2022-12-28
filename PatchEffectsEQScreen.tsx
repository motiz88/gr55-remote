import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { useContext } from "react";
import { StyleSheet } from "react-native";

import { PatchFieldPicker } from "./PatchFieldPicker";
import { PatchFieldSlider } from "./PatchFieldSlider";
import { PatchFieldSwitchedSection } from "./PatchFieldSwitchedSection";
import { PopoverAwareScrollView } from "./PopoverAwareScrollView";
import { RefreshControl } from "./RefreshControl";
import { RolandGR55AddressMapAbsolute as GR55 } from "./RolandGR55AddressMap";
import { RolandRemotePatchContext } from "./RolandRemotePatchContext";
import { useMainScrollViewSafeAreaStyle } from "./SafeAreaUtils";
import { PatchEffectsTabParamList } from "./navigation";

const { sendsAndEq } = GR55.temporaryPatch;

export function PatchEffectsEQScreen({
  navigation,
}: MaterialTopTabScreenProps<PatchEffectsTabParamList, "EQ">) {
  const { reloadPatchData } = useContext(RolandRemotePatchContext);

  const safeAreaStyle = useMainScrollViewSafeAreaStyle();

  return (
    <PopoverAwareScrollView
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={reloadPatchData} />
      }
      style={[styles.container]}
      contentContainerStyle={safeAreaStyle}
    >
      <PatchFieldSwitchedSection field={sendsAndEq.eqSwitch}>
        <PatchFieldPicker field={sendsAndEq.eqLowCutoffFreq} />
        <PatchFieldSlider field={sendsAndEq.eqLowGain} />
        <PatchFieldPicker field={sendsAndEq.eqLowMidCutoffFreq} />
        <PatchFieldPicker field={sendsAndEq.eqLowMidQ} />
        <PatchFieldSlider field={sendsAndEq.eqLowMidGain} />
        <PatchFieldPicker field={sendsAndEq.eqHighMidCutoffFreq} />
        <PatchFieldPicker field={sendsAndEq.eqHighMidQ} />
        <PatchFieldSlider field={sendsAndEq.eqHighMidGain} />
        <PatchFieldSlider field={sendsAndEq.eqHighGain} />
        <PatchFieldPicker field={sendsAndEq.eqHighCutoffFreq} />
        <PatchFieldSlider field={sendsAndEq.eqLevel} />
        <PatchFieldSlider field={sendsAndEq.ezCharacter} />
      </PatchFieldSwitchedSection>
    </PopoverAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});

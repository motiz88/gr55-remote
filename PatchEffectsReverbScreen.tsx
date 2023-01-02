import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { useContext } from "react";
import { StyleSheet } from "react-native";

import { PopoverAwareScrollView } from "./PopoverAwareScrollView";
import { RefreshControl } from "./RefreshControl";
import { RemoteFieldPicker } from "./RemoteFieldPicker";
import { RemoteFieldSlider } from "./RemoteFieldSlider";
import { RemoteFieldSwitchedSection } from "./RemoteFieldSwitchedSection";
import { RolandGR55AddressMapAbsolute as GR55 } from "./RolandGR55AddressMap";
import { RolandRemotePatchContext as PATCH } from "./RolandRemotePageContext";
import { useMainScrollViewSafeAreaStyle } from "./SafeAreaUtils";
import { PatchEffectsTabParamList } from "./navigation";

const { sendsAndEq, mfx, ampModNs, common } = GR55.temporaryPatch;

export function PatchEffectsReverbScreen({
  navigation,
}: MaterialTopTabScreenProps<PatchEffectsTabParamList, "REV">) {
  const { reloadData } = useContext(PATCH);

  const safeAreaStyle = useMainScrollViewSafeAreaStyle();

  return (
    <PopoverAwareScrollView
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={reloadData} />
      }
      style={[styles.container]}
      contentContainerStyle={safeAreaStyle}
    >
      <RemoteFieldSwitchedSection page={PATCH} field={sendsAndEq.reverbSwitch}>
        <RemoteFieldPicker page={PATCH} field={sendsAndEq.reverbType} />
        <RemoteFieldSlider page={PATCH} field={sendsAndEq.reverbTime} />
        <RemoteFieldPicker page={PATCH} field={sendsAndEq.reverbHighCut} />
        <RemoteFieldSlider page={PATCH} field={sendsAndEq.reverbEffectLevel} />

        {/* TODO: send levels should be replicated next to the sources too. */}
        {/* TODO: maybe also a mixer view? */}
        <RemoteFieldSlider page={PATCH} field={mfx.mfxReverbSendLevel} />
        <RemoteFieldSlider page={PATCH} field={ampModNs.modReverbSendLevel} />
        <RemoteFieldSlider page={PATCH} field={common.bypassReverbSendLevel} />
      </RemoteFieldSwitchedSection>
    </PopoverAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});

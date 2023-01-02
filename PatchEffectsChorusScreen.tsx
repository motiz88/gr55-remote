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

export function PatchEffectsChorusScreen({
  navigation,
}: MaterialTopTabScreenProps<PatchEffectsTabParamList, "CHO">) {
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
      <RemoteFieldSwitchedSection page={PATCH} field={sendsAndEq.chorusSwitch}>
        <RemoteFieldPicker page={PATCH} field={sendsAndEq.chorusType} />
        <RemoteFieldSlider page={PATCH} field={sendsAndEq.chorusRate} />
        <RemoteFieldSlider page={PATCH} field={sendsAndEq.chorusDepth} />
        <RemoteFieldSlider page={PATCH} field={sendsAndEq.chorusEffectLevel} />

        {/* TODO: send levels should be replicated next to the sources too. */}
        {/* TODO: maybe also a mixer view? */}
        <RemoteFieldSlider page={PATCH} field={mfx.mfxChorusSendLevel} />
        <RemoteFieldSlider page={PATCH} field={ampModNs.modChorusSendLevel} />
        <RemoteFieldSlider page={PATCH} field={common.bypassChorusSendLevel} />
      </RemoteFieldSwitchedSection>
    </PopoverAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});

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

export function PatchEffectsDelayScreen({
  navigation,
}: MaterialTopTabScreenProps<PatchEffectsTabParamList, "DLY">) {
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
      <RemoteFieldSwitchedSection page={PATCH} field={sendsAndEq.delaySwitch}>
        <RemoteFieldPicker page={PATCH} field={sendsAndEq.delayType} />
        <RemoteFieldSlider page={PATCH} field={sendsAndEq.delayTime} />
        <RemoteFieldSlider page={PATCH} field={sendsAndEq.delayFeedback} />
        <RemoteFieldSlider page={PATCH} field={sendsAndEq.delayEffectLevel} />
        <RemoteFieldSlider page={PATCH} field={mfx.mfxDelaySendLevel} />
        <RemoteFieldSlider page={PATCH} field={ampModNs.modDelaySendLevel} />
        <RemoteFieldSlider page={PATCH} field={common.bypassDelaySendLevel} />
      </RemoteFieldSwitchedSection>
    </PopoverAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});

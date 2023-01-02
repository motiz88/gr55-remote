import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { useContext } from "react";
import { StyleSheet } from "react-native";

import { PopoverAwareScrollView } from "./PopoverAwareScrollView";
import { RefreshControl } from "./RefreshControl";
import { RemoteFieldPicker } from "./RemoteFieldPicker";
import { RemoteFieldSegmentedSwitch } from "./RemoteFieldSegmentedSwitch";
import { RemoteFieldSlider } from "./RemoteFieldSlider";
import { RemoteFieldSwitch } from "./RemoteFieldSwitch";
import { RemoteFieldSwitchedSection } from "./RemoteFieldSwitchedSection";
import { RolandGR55AddressMapAbsolute as GR55 } from "./RolandGR55AddressMap";
import { RolandRemotePatchContext as PATCH } from "./RolandRemotePageContext";
import { useMainScrollViewSafeAreaStyle } from "./SafeAreaUtils";
import { PatchEffectsTabParamList } from "./navigation";
import { useRemoteField } from "./useRemoteField";

export function PatchEffectsAmpScreen({
  navigation,
}: MaterialTopTabScreenProps<PatchEffectsTabParamList, "Amp">) {
  const { reloadData } = useContext(PATCH);

  const safeAreaStyle = useMainScrollViewSafeAreaStyle();

  const [ampType, setAmpType] = useRemoteField(
    PATCH,
    GR55.temporaryPatch.ampModNs.ampType
  );

  return (
    <PopoverAwareScrollView
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={reloadData} />
      }
      style={[styles.container]}
      contentContainerStyle={safeAreaStyle}
    >
      <RemoteFieldSwitchedSection
        page={PATCH}
        field={GR55.temporaryPatch.ampModNs.ampSwitch}
      >
        <RemoteFieldPicker
          page={PATCH}
          field={GR55.temporaryPatch.ampModNs.ampType}
          value={ampType}
          onValueChange={setAmpType}
        />
        <RemoteFieldSlider
          page={PATCH}
          field={GR55.temporaryPatch.ampModNs.ampGain}
        />
        <RemoteFieldSlider
          page={PATCH}
          field={GR55.temporaryPatch.ampModNs.ampLevel}
        />
        <RemoteFieldPicker
          page={PATCH}
          field={GR55.temporaryPatch.ampModNs.ampGainSwitch}
        />
        <RemoteFieldSwitch
          page={PATCH}
          field={GR55.temporaryPatch.ampModNs.ampSoloSwitch}
        />
        <RemoteFieldSlider
          page={PATCH}
          field={GR55.temporaryPatch.ampModNs.ampSoloLevel}
        />
        <RemoteFieldSlider
          page={PATCH}
          field={GR55.temporaryPatch.ampModNs.ampBass}
        />
        <RemoteFieldSlider
          page={PATCH}
          field={GR55.temporaryPatch.ampModNs.ampMiddle}
        />
        <RemoteFieldSlider
          page={PATCH}
          field={GR55.temporaryPatch.ampModNs.ampTreble}
        />
        <RemoteFieldSlider
          page={PATCH}
          field={GR55.temporaryPatch.ampModNs.ampPresence}
        />
        {ampType === "BOSS CLEAN" ||
        ampType === "JC-120" ||
        ampType === "JAZZ COMBO" ||
        ampType === "CLEAN TWIN" ||
        ampType === "PRO CRUNCH" ||
        ampType === "TWEED" ||
        ampType === "BOSS CRUNCH" ||
        ampType === "BLUES" ||
        ampType === "STACK CRUNCH" ||
        ampType === "BG LEAD" ||
        ampType === "BG DRIVE" ||
        ampType === "BG RHYTHM" ? (
          <RemoteFieldSwitch
            page={PATCH}
            field={GR55.temporaryPatch.ampModNs.ampBright}
          />
        ) : null}
        <RemoteFieldPicker
          page={PATCH}
          field={GR55.temporaryPatch.ampModNs.ampSpType}
        />
        <RemoteFieldPicker
          page={PATCH}
          field={GR55.temporaryPatch.ampModNs.ampMicType}
        />
        <RemoteFieldSegmentedSwitch
          page={PATCH}
          field={GR55.temporaryPatch.ampModNs.ampMicDistance}
        />
        <RemoteFieldSlider
          page={PATCH}
          field={GR55.temporaryPatch.ampModNs.ampMicPosition}
        />
        <RemoteFieldSlider
          page={PATCH}
          field={GR55.temporaryPatch.ampModNs.ampMicLevel}
        />
      </RemoteFieldSwitchedSection>
    </PopoverAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});

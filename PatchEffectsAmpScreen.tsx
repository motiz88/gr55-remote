import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { useContext } from "react";
import { ScrollView, StyleSheet, RefreshControl } from "react-native";

import {
  PatchFieldPicker,
  PatchFieldPickerControlled,
  PatchFieldSlider,
  PatchFieldSwitch,
  SwitchedSection,
} from "./PatchFieldComponents";
import { RolandGR55AddressMapAbsolute as GR55 } from "./RolandGR55AddressMap";
import { RolandRemotePatchContext } from "./RolandRemotePatchContext";
import { useMainScrollViewSafeAreaStyle } from "./SafeAreaUtils";
import { PatchEffectsTabParamList } from "./navigation";
import { usePatchField } from "./usePatchField";

export function PatchEffectsAmpScreen({
  navigation,
}: MaterialTopTabScreenProps<PatchEffectsTabParamList, "Amp">) {
  const { reloadPatchData } = useContext(RolandRemotePatchContext);

  const safeAreaStyle = useMainScrollViewSafeAreaStyle();

  const [ampType, setAmpType] = usePatchField(
    GR55.temporaryPatch.ampModNs.ampType,
    GR55.temporaryPatch.ampModNs.ampType.definition.type.labels[0]
  );

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={reloadPatchData} />
      }
      style={[styles.container]}
      contentContainerStyle={safeAreaStyle}
    >
      <SwitchedSection field={GR55.temporaryPatch.ampModNs.ampSwitch}>
        <PatchFieldPickerControlled
          field={GR55.temporaryPatch.ampModNs.ampType}
          value={ampType}
          onValueChange={setAmpType}
        />
        <PatchFieldSlider field={GR55.temporaryPatch.ampModNs.ampGain} />
        <PatchFieldSlider field={GR55.temporaryPatch.ampModNs.ampLevel} />
        <PatchFieldPicker field={GR55.temporaryPatch.ampModNs.ampGainSwitch} />
        <PatchFieldSwitch field={GR55.temporaryPatch.ampModNs.ampSoloSwitch} />
        <PatchFieldSlider field={GR55.temporaryPatch.ampModNs.ampSoloLevel} />
        <PatchFieldSlider field={GR55.temporaryPatch.ampModNs.ampBass} />
        <PatchFieldSlider field={GR55.temporaryPatch.ampModNs.ampMiddle} />
        <PatchFieldSlider field={GR55.temporaryPatch.ampModNs.ampTreble} />
        <PatchFieldSlider field={GR55.temporaryPatch.ampModNs.ampPresence} />
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
          <PatchFieldSwitch field={GR55.temporaryPatch.ampModNs.ampBright} />
        ) : null}
        <PatchFieldPicker field={GR55.temporaryPatch.ampModNs.ampSpType} />
        <PatchFieldPicker field={GR55.temporaryPatch.ampModNs.ampMicType} />
        <PatchFieldSwitch field={GR55.temporaryPatch.ampModNs.ampMicDistance} />
        <PatchFieldSlider field={GR55.temporaryPatch.ampModNs.ampMicPosition} />
        <PatchFieldSlider field={GR55.temporaryPatch.ampModNs.ampMicLevel} />
      </SwitchedSection>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  disabledSection: {
    backgroundColor: "#ddd",
  },
  container: {
    padding: 8,
  },
});

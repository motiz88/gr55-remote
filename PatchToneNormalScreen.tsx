import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { useContext } from "react";
import { ScrollView, StyleSheet, RefreshControl } from "react-native";

import { PatchFieldSlider, SwitchedSection } from "./PatchFieldComponents";
import { RolandGR55AddressMapAbsolute as GR55 } from "./RolandGR55AddressMap";
import { RolandRemotePatchContext } from "./RolandRemotePatchContext";
import { PatchToneTabParamList } from "./navigation";

export function PatchToneNormalScreen({
  navigation,
}: MaterialTopTabScreenProps<PatchToneTabParamList, "Normal">) {
  const { reloadPatchData } = useContext(RolandRemotePatchContext);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={reloadPatchData} />
      }
      style={[styles.container]}
    >
      <SwitchedSection field={GR55.temporaryPatch.common.normalPuMute}>
        <PatchFieldSlider field={GR55.temporaryPatch.common.normalPuLevel} />
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

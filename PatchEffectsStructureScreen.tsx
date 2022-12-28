import { useContext } from "react";
import { StyleSheet, Text } from "react-native";

import { PatchFieldPicker } from "./PatchFieldPicker";
import { PopoverAwareScrollView } from "./PopoverAwareScrollView";
import { RefreshControl } from "./RefreshControl";
import { RolandGR55AddressMapAbsolute as GR55 } from "./RolandGR55AddressMap";
import { RolandRemotePatchContext } from "./RolandRemotePatchContext";
import { useMainScrollViewSafeAreaStyle } from "./SafeAreaUtils";

const { common, patchPCMTone1, patchPCMTone2 } = GR55.temporaryPatch;

export function PatchEffectsStructureScreen() {
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
      <PatchFieldPicker field={common.effectStructure} />
      <Text>PCM1</Text>
      <PatchFieldPicker field={patchPCMTone1.partOutputMFXSelect} />
      <Text>PCM2</Text>
      <PatchFieldPicker field={patchPCMTone2.partOutputMFXSelect} />
      <PatchFieldPicker field={common.lineSelectModel} />
      <PatchFieldPicker field={common.lineSelectNormalPU} />
    </PopoverAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});

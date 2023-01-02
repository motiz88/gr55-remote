import { useContext } from "react";
import { StyleSheet, Text } from "react-native";

import { PopoverAwareScrollView } from "./PopoverAwareScrollView";
import { RefreshControl } from "./RefreshControl";
import { RemoteFieldPicker } from "./RemoteFieldPicker";
import { RolandGR55AddressMapAbsolute as GR55 } from "./RolandGR55AddressMap";
import { RolandRemotePatchContext as PATCH } from "./RolandRemotePageContext";
import { useMainScrollViewSafeAreaStyle } from "./SafeAreaUtils";

const { common, patchPCMTone1, patchPCMTone2 } = GR55.temporaryPatch;

export function PatchEffectsStructureScreen() {
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
      <RemoteFieldPicker page={PATCH} field={common.effectStructure} />
      <Text>PCM1</Text>
      <RemoteFieldPicker
        page={PATCH}
        field={patchPCMTone1.partOutputMFXSelect}
      />
      <Text>PCM2</Text>
      <RemoteFieldPicker
        page={PATCH}
        field={patchPCMTone2.partOutputMFXSelect}
      />
      <RemoteFieldPicker page={PATCH} field={common.lineSelectModel} />
      <RemoteFieldPicker page={PATCH} field={common.lineSelectNormalPU} />
    </PopoverAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});

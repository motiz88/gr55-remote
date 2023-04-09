import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useContext, useEffect } from "react";
import { StyleSheet } from "react-native";

import { PopoverAwareScrollView } from "./PopoverAwareScrollView";
import { RefreshControl } from "./RefreshControl";
import { RemoteFieldPicker } from "./RemoteFieldPicker";
import { RemoteFieldSlider } from "./RemoteFieldSlider";
import { RemoteFieldSwitchedSection } from "./RemoteFieldSwitchedSection";
import { RolandGR55AddressMapAbsolute as GR55 } from "./RolandGR55AddressMap";
import { RolandRemotePatchContext as PATCH } from "./RolandRemotePageContext";
import { useMainScrollViewSafeAreaStyle } from "./SafeAreaUtils";
import { PatchStackParamList } from "./navigation";
import { useRemoteField } from "./useRemoteField";

export function PatchMasterOtherScreen({
  navigation,
}: NativeStackScreenProps<PatchStackParamList, "PatchMasterOther">) {
  const [patchName] = useRemoteField(
    PATCH,
    GR55.temporaryPatch.common.patchName
  );
  useEffect(() => {
    navigation.setOptions({
      title: patchName + " > Other",
    });
  }, [navigation, patchName]);

  const { reloadData } = useContext(PATCH);

  const safeAreaStyle = useMainScrollViewSafeAreaStyle();

  const [altTuneType, setAltTuneType] = useRemoteField(
    PATCH,
    GR55.temporaryPatch.common.altTuneType
  );

  return (
    <PopoverAwareScrollView
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={reloadData} />
      }
      style={[styles.container]}
      contentContainerStyle={safeAreaStyle}
    >
      <RemoteFieldSlider
        page={PATCH}
        field={GR55.temporaryPatch.common.patchTempo}
      />
      {/* TODO: Fetch and render GK set names */}
      <RemoteFieldPicker
        page={PATCH}
        field={GR55.temporaryPatch.common.gkSet}
      />
      {/* TODO: Indicate that this is ignored if SYSTEM GUITAR OUT is anything other than PATCH */}
      <RemoteFieldPicker
        page={PATCH}
        field={GR55.temporaryPatch.common.guitarOutSource}
      />
      <RemoteFieldSwitchedSection
        page={PATCH}
        field={GR55.temporaryPatch.common.altTuneSwitch}
      >
        <RemoteFieldPicker
          page={PATCH}
          field={GR55.temporaryPatch.common.altTuneType}
          value={altTuneType}
          onValueChange={setAltTuneType}
        />
        {altTuneType === "USER" && (
          <>
            <RemoteFieldSlider
              page={PATCH}
              field={GR55.temporaryPatch.common.userTuneShiftString1}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={GR55.temporaryPatch.common.userTuneShiftString2}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={GR55.temporaryPatch.common.userTuneShiftString3}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={GR55.temporaryPatch.common.userTuneShiftString4}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={GR55.temporaryPatch.common.userTuneShiftString5}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={GR55.temporaryPatch.common.userTuneShiftString6}
            />
          </>
        )}
      </RemoteFieldSwitchedSection>
      <RemoteFieldSlider
        page={PATCH}
        field={GR55.temporaryPatch.common.vlinkPalette}
      />
      <RemoteFieldSlider
        page={PATCH}
        field={GR55.temporaryPatch.common.vlinkPatchClip}
      />
      <RemoteFieldSlider
        page={PATCH}
        field={GR55.temporaryPatch.common.vlinkClipChange}
      />
      <RemoteFieldPicker
        page={PATCH}
        field={GR55.temporaryPatch.common.vlinkExpPedal}
      />
      <RemoteFieldPicker
        page={PATCH}
        field={GR55.temporaryPatch.common.vlinkExpPedalOn}
      />
      <RemoteFieldPicker
        page={PATCH}
        field={GR55.temporaryPatch.common.vlinkGkVol}
      />
    </PopoverAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});

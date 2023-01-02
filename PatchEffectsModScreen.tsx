import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { useContext } from "react";
import { StyleSheet } from "react-native";

import { PopoverAwareScrollView } from "./PopoverAwareScrollView";
import { RefreshControl } from "./RefreshControl";
import { RemoteFieldPicker } from "./RemoteFieldPicker";
import { RemoteFieldSegmentedSwitch } from "./RemoteFieldSegmentedSwitch";
import { RemoteFieldSlider } from "./RemoteFieldSlider";
import { RemoteFieldSwitchedSection } from "./RemoteFieldSwitchedSection";
import { RolandGR55AddressMapAbsolute as GR55 } from "./RolandGR55AddressMap";
import { RolandRemotePatchContext as PATCH } from "./RolandRemotePageContext";
import { useMainScrollViewSafeAreaStyle } from "./SafeAreaUtils";
import { PatchEffectsTabParamList } from "./navigation";
import { useRemoteField } from "./useRemoteField";

export function PatchEffectsModScreen({
  navigation,
}: MaterialTopTabScreenProps<PatchEffectsTabParamList, "Mod">) {
  const { reloadData } = useContext(PATCH);

  const [modType, setModType] = useRemoteField(
    PATCH,
    GR55.temporaryPatch.ampModNs.modType
  );

  const safeAreaStyle = useMainScrollViewSafeAreaStyle();

  return (
    <PopoverAwareScrollView
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={reloadData} />
      }
      style={[styles.container]}
      contentContainerStyle={safeAreaStyle}
    >
      {/* "The PAN parameter is valid even if SWITCH is OFF." - GR-55 Owner's Manual */}
      <RemoteFieldSlider
        page={PATCH}
        field={GR55.temporaryPatch.ampModNs.modPan}
      />
      <RemoteFieldSwitchedSection
        page={PATCH}
        field={GR55.temporaryPatch.ampModNs.modSwitch}
      >
        <RemoteFieldPicker
          page={PATCH}
          field={GR55.temporaryPatch.ampModNs.modType}
          value={modType}
          onValueChange={setModType}
        />
        {modType === "OD/DS" && (
          <>
            <RemoteFieldPicker
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.odDsType}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.odDsDrive}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.odDsTone}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.odDsLevel}
            />
          </>
        )}
        {modType === "WAH" && <WahSection />}
        {modType === "COMP" && (
          <>
            <RemoteFieldSlider
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.compSustain}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.compAttack}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.compLevel}
            />
          </>
        )}
        {modType === "LIMITER" && (
          <>
            <RemoteFieldSlider
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.limiterThreshold}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.limiterRelease}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.limiterLevel}
            />
          </>
        )}
        {modType === "OCTAVE" && (
          <>
            <RemoteFieldSlider
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.octaveOctLevel}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.octaveDryLevel}
            />
          </>
        )}
        {modType === "PHASER" && (
          <>
            <RemoteFieldPicker
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.phaserType}
            />
            {/* TODO: Rate field has labels at the end of the range */}
            <RemoteFieldSlider
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.phaserRate}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.phaserDepth}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.phaserResonance}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.phaserLevel}
            />
          </>
        )}
        {modType === "FLANGER" && (
          <>
            {/* TODO: Rate field has labels at the end of the range */}
            <RemoteFieldSlider
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.flangerRate}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.flangerDepth}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.flangerManual}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.flangerResonance}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.flangerLevel}
            />
          </>
        )}
        {modType === "TREMOLO" && (
          <>
            {/* TODO: Rate field has labels at the end of the range */}
            <RemoteFieldSlider
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.tremoloRate}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.tremoloDepth}
            />
            {/* TODO: Render wave shape? */}
            <RemoteFieldSlider
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.tremoloWaveShape}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.tremoloLevel}
            />
          </>
        )}
        {modType === "ROTARY" && (
          <>
            {/* TODO: Rate field has labels at the end of the range */}
            <RemoteFieldSlider
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.rotaryRateSlow}
            />
            {/* TODO: Rate field has labels at the end of the range */}
            <RemoteFieldSlider
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.rotaryRateFast}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.rotaryDepth}
            />
            <RemoteFieldSegmentedSwitch
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.rotarySelect}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.rotaryLevel}
            />
          </>
        )}
        {modType === "UNI-V" && (
          <>
            {/* TODO: Rate field has labels at the end of the range */}
            <RemoteFieldSlider
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.uniVRate}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.uniVDepth}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.uniVLevel}
            />
          </>
        )}
        {modType === "PAN" && (
          <>
            {/* TODO: Rate field has labels at the end of the range */}
            <RemoteFieldSlider
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.panRate}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.panDepth}
            />
            {/* TODO: Render wave shape? */}
            <RemoteFieldSlider
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.panWaveShape}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.panLevel}
            />
          </>
        )}
        {modType === "DELAY" && (
          <>
            <RemoteFieldPicker
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.delayType}
            />
            {/* TODO: Time field has labels at the end of the range */}
            <RemoteFieldSlider
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.delayTime}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.delayFeedback}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.delayEffectLevel}
            />
          </>
        )}
        {modType === "CHORUS" && (
          <>
            <RemoteFieldPicker
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.chorusType}
            />
            {/* TODO: Rate field has labels at the end of the range */}
            <RemoteFieldSlider
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.chorusRate}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.chorusDepth}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.chorusEffectLevel}
            />
          </>
        )}
        {modType === "EQ" && (
          /* TODO: Graphical EQ! */
          <>
            <RemoteFieldPicker
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.eqLowCutoffFreq}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.eqLowGain}
            />
            <RemoteFieldPicker
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.eqLowMidCutoffFreq}
            />
            {/* TODO: Slider with nonlinear stops */}
            <RemoteFieldPicker
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.eqLowMidQ}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.eqLowMidGain}
            />
            <RemoteFieldPicker
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.eqHighMidCutoffFreq}
            />
            {/* TODO: Slider with nonlinear stops */}
            <RemoteFieldPicker
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.eqHighMidQ}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.eqHighMidGain}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.eqHighGain}
            />
            <RemoteFieldPicker
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.eqHighCutoffFreq}
            />
            <RemoteFieldSlider
              page={PATCH}
              field={GR55.temporaryPatch.ampModNs.eqLevel}
            />
          </>
        )}
      </RemoteFieldSwitchedSection>
      <RemoteFieldSwitchedSection
        page={PATCH}
        field={GR55.temporaryPatch.ampModNs.nsSwitch}
      >
        <RemoteFieldSlider
          page={PATCH}
          field={GR55.temporaryPatch.ampModNs.nsThreshold}
        />
        <RemoteFieldSlider
          page={PATCH}
          field={GR55.temporaryPatch.ampModNs.nsReleaseTime}
        />
      </RemoteFieldSwitchedSection>
    </PopoverAwareScrollView>
  );
}

function WahSection() {
  const [wahMode, setWahMode] = useRemoteField(
    PATCH,
    GR55.temporaryPatch.ampModNs.wahMode
  );
  return (
    <>
      <RemoteFieldPicker
        page={PATCH}
        field={GR55.temporaryPatch.ampModNs.wahMode}
        value={wahMode}
        onValueChange={setWahMode}
      />
      {wahMode === "MANUAL" && (
        <>
          <RemoteFieldPicker
            page={PATCH}
            field={GR55.temporaryPatch.ampModNs.wahType}
          />
          <RemoteFieldSlider
            page={PATCH}
            field={GR55.temporaryPatch.ampModNs.wahPedalPosition}
          />
        </>
      )}
      {(wahMode === "T.UP" || wahMode === "T.DOWN") && (
        <>
          <RemoteFieldSlider
            page={PATCH}
            field={GR55.temporaryPatch.ampModNs.wahSens}
          />
          <RemoteFieldSlider
            page={PATCH}
            field={GR55.temporaryPatch.ampModNs.wahFreq}
          />
          <RemoteFieldSlider
            page={PATCH}
            field={GR55.temporaryPatch.ampModNs.wahPeak}
          />
        </>
      )}
      <RemoteFieldSlider
        page={PATCH}
        field={GR55.temporaryPatch.ampModNs.wahLevel}
      />
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});

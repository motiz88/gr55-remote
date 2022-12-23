import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { useContext } from "react";
import { ScrollView, StyleSheet, RefreshControl } from "react-native";

import {
  PatchFieldSlider,
  PatchFieldPickerControlled,
  PatchFieldPicker,
  PatchFieldSwitch,
  SwitchedSection,
} from "./PatchFieldComponents";
import { RolandGR55AddressMapAbsolute as GR55 } from "./RolandGR55AddressMap";
import { RolandRemotePatchContext } from "./RolandRemotePatchContext";
import { PatchEffectsTabParamList } from "./navigation";
import { usePatchField } from "./usePatchField";

export function PatchEffectsModScreen({
  navigation,
}: MaterialTopTabScreenProps<PatchEffectsTabParamList, "Mod">) {
  const { reloadPatchData } = useContext(RolandRemotePatchContext);

  const [modType, setModType] = usePatchField(
    GR55.temporaryPatch.ampModNs.modType,
    GR55.temporaryPatch.ampModNs.modType.definition.type.labels[0]
  );

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={reloadPatchData} />
      }
      style={[styles.container]}
    >
      {/* "The PAN parameter is valid even if SWITCH is OFF." - GR-55 Owner's Manual */}
      <PatchFieldSlider field={GR55.temporaryPatch.ampModNs.modPan} />
      <SwitchedSection field={GR55.temporaryPatch.ampModNs.modSwitch}>
        <PatchFieldPickerControlled
          field={GR55.temporaryPatch.ampModNs.modType}
          value={modType}
          onValueChange={setModType}
        />
        {modType === "OD/DS" && (
          <>
            <PatchFieldPicker field={GR55.temporaryPatch.ampModNs.odDsType} />
            <PatchFieldSlider field={GR55.temporaryPatch.ampModNs.odDsDrive} />
            <PatchFieldSlider field={GR55.temporaryPatch.ampModNs.odDsTone} />
            <PatchFieldSlider field={GR55.temporaryPatch.ampModNs.odDsLevel} />
          </>
        )}
        {modType === "WAH" && (
          <>
            <PatchFieldPicker field={GR55.temporaryPatch.ampModNs.wahMode} />
            <PatchFieldSlider field={GR55.temporaryPatch.ampModNs.wahSens} />
            <PatchFieldSlider field={GR55.temporaryPatch.ampModNs.wahFreq} />
            <PatchFieldSlider field={GR55.temporaryPatch.ampModNs.wahPeak} />
            <PatchFieldSlider field={GR55.temporaryPatch.ampModNs.wahLevel} />
          </>
        )}
        {modType === "COMP" && (
          <>
            <PatchFieldSlider
              field={GR55.temporaryPatch.ampModNs.compSustain}
            />
            <PatchFieldSlider field={GR55.temporaryPatch.ampModNs.compAttack} />
            <PatchFieldSlider field={GR55.temporaryPatch.ampModNs.compLevel} />
          </>
        )}
        {modType === "LIMITER" && (
          <>
            <PatchFieldSlider
              field={GR55.temporaryPatch.ampModNs.limiterThreshold}
            />
            <PatchFieldSlider
              field={GR55.temporaryPatch.ampModNs.limiterRelease}
            />
            <PatchFieldSlider
              field={GR55.temporaryPatch.ampModNs.limiterLevel}
            />
          </>
        )}
        {modType === "OCTAVE" && (
          <>
            <PatchFieldSlider
              field={GR55.temporaryPatch.ampModNs.octaveOctLevel}
            />
            <PatchFieldSlider
              field={GR55.temporaryPatch.ampModNs.octaveDryLevel}
            />
          </>
        )}
        {modType === "PHASER" && (
          <>
            <PatchFieldPicker field={GR55.temporaryPatch.ampModNs.phaserType} />
            {/* TODO: Rate field has labels at the end of the range */}
            <PatchFieldSlider field={GR55.temporaryPatch.ampModNs.phaserRate} />
            <PatchFieldSlider
              field={GR55.temporaryPatch.ampModNs.phaserDepth}
            />
            <PatchFieldSlider
              field={GR55.temporaryPatch.ampModNs.phaserResonance}
            />
            <PatchFieldSlider
              field={GR55.temporaryPatch.ampModNs.phaserLevel}
            />
          </>
        )}
        {modType === "FLANGER" && (
          <>
            {/* TODO: Rate field has labels at the end of the range */}
            <PatchFieldSlider
              field={GR55.temporaryPatch.ampModNs.flangerRate}
            />
            <PatchFieldSlider
              field={GR55.temporaryPatch.ampModNs.flangerDepth}
            />
            <PatchFieldSlider
              field={GR55.temporaryPatch.ampModNs.flangerManual}
            />
            <PatchFieldSlider
              field={GR55.temporaryPatch.ampModNs.flangerResonance}
            />
            <PatchFieldSlider
              field={GR55.temporaryPatch.ampModNs.flangerLevel}
            />
          </>
        )}
        {modType === "TREMOLO" && (
          <>
            {/* TODO: Rate field has labels at the end of the range */}
            <PatchFieldSlider
              field={GR55.temporaryPatch.ampModNs.tremoloRate}
            />
            <PatchFieldSlider
              field={GR55.temporaryPatch.ampModNs.tremoloDepth}
            />
            {/* TODO: Render wave shape? */}
            <PatchFieldSlider
              field={GR55.temporaryPatch.ampModNs.tremoloWaveShape}
            />
            <PatchFieldSlider
              field={GR55.temporaryPatch.ampModNs.tremoloLevel}
            />
          </>
        )}
        {modType === "ROTARY" && (
          <>
            {/* TODO: Rate field has labels at the end of the range */}
            <PatchFieldSlider
              field={GR55.temporaryPatch.ampModNs.rotaryRateSlow}
            />
            {/* TODO: Rate field has labels at the end of the range */}
            <PatchFieldSlider
              field={GR55.temporaryPatch.ampModNs.rotaryRateFast}
            />
            <PatchFieldSlider
              field={GR55.temporaryPatch.ampModNs.rotaryDepth}
            />
            <PatchFieldSwitch
              field={GR55.temporaryPatch.ampModNs.rotarySelect}
            />
            <PatchFieldSlider
              field={GR55.temporaryPatch.ampModNs.rotaryLevel}
            />
          </>
        )}
        {modType === "UNI-V" && (
          <>
            {/* TODO: Rate field has labels at the end of the range */}
            <PatchFieldSlider field={GR55.temporaryPatch.ampModNs.uniVRate} />
            <PatchFieldSlider field={GR55.temporaryPatch.ampModNs.uniVDepth} />
            <PatchFieldSlider field={GR55.temporaryPatch.ampModNs.uniVLevel} />
          </>
        )}
        {modType === "PAN" && (
          <>
            {/* TODO: Rate field has labels at the end of the range */}
            <PatchFieldSlider field={GR55.temporaryPatch.ampModNs.panRate} />
            <PatchFieldSlider field={GR55.temporaryPatch.ampModNs.panDepth} />
            {/* TODO: Render wave shape? */}
            <PatchFieldSlider
              field={GR55.temporaryPatch.ampModNs.panWaveShape}
            />
            <PatchFieldSlider field={GR55.temporaryPatch.ampModNs.panLevel} />
          </>
        )}
        {modType === "DELAY" && (
          <>
            <PatchFieldPicker field={GR55.temporaryPatch.ampModNs.delayType} />
            {/* TODO: Time field has labels at the end of the range */}
            <PatchFieldSlider field={GR55.temporaryPatch.ampModNs.delayTime} />
            <PatchFieldSlider
              field={GR55.temporaryPatch.ampModNs.delayFeedback}
            />
            <PatchFieldSlider
              field={GR55.temporaryPatch.ampModNs.delayEffectLevel}
            />
          </>
        )}
        {modType === "CHORUS" && (
          <>
            <PatchFieldPicker field={GR55.temporaryPatch.ampModNs.chorusType} />
            {/* TODO: Rate field has labels at the end of the range */}
            <PatchFieldSlider field={GR55.temporaryPatch.ampModNs.chorusRate} />
            <PatchFieldSlider
              field={GR55.temporaryPatch.ampModNs.chorusDepth}
            />
            <PatchFieldSlider
              field={GR55.temporaryPatch.ampModNs.chorusEffectLevel}
            />
          </>
        )}
        {modType === "EQ" && (
          /* TODO: Graphical EQ! */
          <>
            <PatchFieldPicker
              field={GR55.temporaryPatch.ampModNs.eqLowCutoffFreq}
            />
            {/* TODO: Units */}
            <PatchFieldSlider field={GR55.temporaryPatch.ampModNs.eqLowGain} />
            <PatchFieldPicker
              field={GR55.temporaryPatch.ampModNs.eqLowMidCutoffFreq}
            />
            {/* TODO: Slider with nonlinear stops */}
            <PatchFieldPicker field={GR55.temporaryPatch.ampModNs.eqLowMidQ} />
            {/* TODO: Units */}
            <PatchFieldSlider
              field={GR55.temporaryPatch.ampModNs.eqLowMidGain}
            />
            <PatchFieldPicker
              field={GR55.temporaryPatch.ampModNs.eqHighMidCutoffFreq}
            />
            {/* TODO: Slider with nonlinear stops */}
            <PatchFieldPicker field={GR55.temporaryPatch.ampModNs.eqHighMidQ} />
            {/* TODO: Units */}
            <PatchFieldSlider
              field={GR55.temporaryPatch.ampModNs.eqHighMidGain}
            />
            {/* TODO: Units */}
            <PatchFieldSlider field={GR55.temporaryPatch.ampModNs.eqHighGain} />
            <PatchFieldPicker
              field={GR55.temporaryPatch.ampModNs.eqHighCutoffFreq}
            />
            {/* TODO: Units */}
            <PatchFieldSlider field={GR55.temporaryPatch.ampModNs.eqLevel} />
          </>
        )}
      </SwitchedSection>
      <SwitchedSection field={GR55.temporaryPatch.ampModNs.nsSwitch}>
        <PatchFieldSlider field={GR55.temporaryPatch.ampModNs.nsThreshold} />
        <PatchFieldSlider field={GR55.temporaryPatch.ampModNs.nsReleaseTime} />
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

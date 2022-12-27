import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useContext, useEffect, useMemo, useState } from "react";
import { Button, ScrollView, View, StyleSheet, Text } from "react-native";

import { PatchFieldPicker } from "./PatchFieldPicker";
import { PatchFieldSlider } from "./PatchFieldSlider";
import { PatchFieldStyles } from "./PatchFieldStyles";
import { PatchFieldSwitchedSection } from "./PatchFieldSwitchedSection";
import { PatchFieldWaveShapePicker } from "./PatchFieldWaveShapePicker";
import { RefreshControl } from "./RefreshControl";
import {
  FieldReference,
  isEnumFieldReference,
  isNumericFieldReference,
  NumericField,
} from "./RolandAddressMap";
import { RolandGR55AddressMapAbsolute as GR55 } from "./RolandGR55AddressMap";
import { AssignDefinition } from "./RolandGR55Assigns";
import {
  RolandGR55PatchAssignsMapBassMode,
  RolandGR55PatchAssignsMapGuitarMode,
} from "./RolandGR55AssignsMap";
import { RolandRemotePatchContext } from "./RolandRemotePatchContext";
import { useMainScrollViewSafeAreaStyle } from "./SafeAreaUtils";
import { SegmentedPicker } from "./SegmentedPicker";
import { RootStackParamList } from "./navigation";
import { useGR55GuitarBassSelect } from "./useGR55GuitarBassSelect";
import { usePatchField } from "./usePatchField";

export function PatchAssignsScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "PatchAssigns">) {
  const [patchName] = usePatchField(GR55.temporaryPatch.common.patchName);
  useEffect(() => {
    navigation.setOptions({
      title: patchName + " > Assigns",
      headerRight: () => (
        <View style={{ marginRight: 8 }}>
          <Button
            onPress={() => navigation.navigate("IoSetup", {})}
            title="Setup"
          />
        </View>
      ),
    });
  }, [navigation, patchName]);

  const { reloadPatchData } = useContext(RolandRemotePatchContext);

  const safeAreaStyle = useMainScrollViewSafeAreaStyle();

  // TODO: Move to navigation
  const [currentAssign, setCurrentAssign] = useState("1");

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={reloadPatchData} />
      }
      style={[styles.container]}
      contentContainerStyle={safeAreaStyle}
    >
      <SegmentedPicker
        values={["1", "2", "3", "4", "5", "6", "7", "8"]}
        value={currentAssign}
        onValueChange={setCurrentAssign}
        style={{ marginBottom: 8 }}
      />
      {currentAssign === "1" && (
        <AssignSection assign={GR55.temporaryPatch.common.assign1} />
      )}
      {currentAssign === "2" && (
        <AssignSection assign={GR55.temporaryPatch.common.assign2} />
      )}
      {currentAssign === "3" && (
        <AssignSection assign={GR55.temporaryPatch.common.assign3} />
      )}
      {currentAssign === "4" && (
        <AssignSection assign={GR55.temporaryPatch.common.assign4} />
      )}
      {currentAssign === "5" && (
        <AssignSection assign={GR55.temporaryPatch.common.assign5} />
      )}
      {currentAssign === "6" && (
        <AssignSection assign={GR55.temporaryPatch.common.assign6} />
      )}
      {currentAssign === "7" && (
        <AssignSection assign={GR55.temporaryPatch.common.assign7} />
      )}
      {currentAssign === "8" && (
        <AssignSection assign={GR55.temporaryPatch.common.assign8} />
      )}
    </ScrollView>
  );
}

function AssignSection({
  assign,
}: {
  assign: typeof GR55.temporaryPatch.common.assign1;
}) {
  const [source, setSource] = usePatchField(assign.source);
  // TODO: loading states for system and patch data (Suspense?)
  const [guitarBassSelect = "GUITAR"] = useGR55GuitarBassSelect();
  const assignsMap = useMemo(() => {
    if (guitarBassSelect === "GUITAR") {
      return RolandGR55PatchAssignsMapGuitarMode;
    }
    return RolandGR55PatchAssignsMapBassMode;
  }, [guitarBassSelect]);
  const [target, setTarget] = usePatchField(assign.target);
  const assignDef = assignsMap.getByIndex(target);
  return (
    <>
      <PatchFieldSwitchedSection field={assign.switch}>
        {/* TODO: Useful target picker */}
        <View style={{ flexDirection: "row" }}>
          <View style={PatchFieldStyles.fieldDescription} />
          <Text style={PatchFieldStyles.fieldControl}>
            {assignDef.description}
          </Text>
        </View>
        <PatchFieldSlider
          field={assign.target}
          value={target}
          onValueChange={setTarget}
        />
        {/* TODO: Range slider? But what about inverted ranges? */}
        {/* TODO: Value ranges/types vary by target */}
        <PatchAssignBoundField
          assignDef={assignDef}
          minOrMaxField={assign.targetMin}
        />
        <PatchAssignBoundField
          assignDef={assignDef}
          minOrMaxField={assign.targetMax}
        />
        <PatchFieldPicker
          field={assign.source}
          value={source}
          onValueChange={setSource}
        />
        <PatchFieldPicker field={assign.sourceMode} />
        {/* TODO: Range slider? But what about inverted ranges? */}
        <PatchFieldSlider field={assign.activeRangeLo} />
        <PatchFieldSlider field={assign.activeRangeHi} />
        {source === "INT PDL" && (
          <>
            <PatchFieldPicker field={assign.internalPedalTrigger} />
            <PatchFieldSlider field={assign.internalPedalTime} />
            {/* TODO: Curve icons */}
            <PatchFieldPicker field={assign.internalPedalCurve} />
          </>
        )}
        {source === "WAVE PDL" && (
          <>
            <PatchFieldSlider field={assign.wavePedalRate} />
            <PatchFieldWaveShapePicker field={assign.wavePedalForm} />
          </>
        )}
      </PatchFieldSwitchedSection>
    </>
  );
}

function PatchAssignBoundField({
  assignDef,
  minOrMaxField,
}: {
  assignDef: AssignDefinition;
  minOrMaxField: FieldReference<NumericField>;
}) {
  const reinterpretedField = useMemo(() => {
    return assignDef.reinterpretAssignValueField(minOrMaxField);
  }, [assignDef, minOrMaxField]);
  if (reinterpretedField) {
    if (isNumericFieldReference(reinterpretedField)) {
      return <PatchFieldSlider field={reinterpretedField} />;
    } else if (isEnumFieldReference(reinterpretedField)) {
      return <PatchFieldPicker field={reinterpretedField} />;
    }
    // TODO: Eventually we should not have this fallback
    console.error(
      "Could not render reinterpreted field",
      reinterpretedField.definition.description,
      "for",
      assignDef.description
    );
  }
  // TODO: Eventually we should not have this fallback
  console.log(
    "Falling back to default field rendering for",
    assignDef.description,
    "in",
    minOrMaxField.definition.description
  );
  return <PatchFieldSlider field={minOrMaxField} />;
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button, ScrollView, View, StyleSheet } from "react-native";

import { PatchFieldPicker } from "./PatchFieldPicker";
import { PatchFieldSlider } from "./PatchFieldSlider";
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
import { AssignDefinition, AssignsMap } from "./RolandGR55Assigns";
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
import usePrevious from "./usePrevious";

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

function useAssignTargetRangeField(
  assignDef: AssignDefinition,
  minOrMaxField: FieldReference<NumericField>,
  isMax: boolean
) {
  const reinterpretedField = useMemo(() => {
    return assignDef.reinterpretAssignValueField(minOrMaxField);
  }, [assignDef, minOrMaxField]);
  const [, setValue] = usePatchField(reinterpretedField);
  const reset = useCallback(() => {
    const nextValue = isMax
      ? reinterpretedField.definition.type.max
      : reinterpretedField.definition.type.min;
    setValue(nextValue);
  }, [
    isMax,
    reinterpretedField.definition.type.max,
    reinterpretedField.definition.type.min,
    setValue,
  ]);
  return { field: reinterpretedField, reset };
}

function useAssign(
  assignsMap: AssignsMap,
  assign: typeof GR55.temporaryPatch.common.assign1,
  target: number
) {
  const assignDef = assignsMap.getByIndex(target);
  const { field: targetMinField, reset: resetMin } = useAssignTargetRangeField(
    assignDef,
    assign.targetMin,
    false
  );
  const { field: targetMaxField, reset: resetMax } = useAssignTargetRangeField(
    assignDef,
    assign.targetMax,
    true
  );
  const resetRange = useCallback(() => {
    resetMin();
    resetMax();
  }, [resetMin, resetMax]);
  return { targetMinField, targetMaxField, assignDef, resetRange };
}

function useAssignTargetField(
  assignsMap: AssignsMap,
  targetField: FieldReference<NumericField>
) {
  return useMemo(
    () => assignsMap.reinterpretTargetField(targetField),
    [assignsMap, targetField]
  );
}

function AssignSection({
  assign,
}: {
  assign: typeof GR55.temporaryPatch.common.assign1;
}) {
  const [source, setSource] = usePatchField(assign.source);
  const [target, setTarget] = usePatchField(assign.target);
  // TODO: loading states for system and patch data (Suspense?)
  const [guitarBassSelect = "GUITAR"] = useGR55GuitarBassSelect();
  const assignsMap = useMemo(() => {
    if (guitarBassSelect === "GUITAR") {
      return RolandGR55PatchAssignsMapGuitarMode;
    }
    return RolandGR55PatchAssignsMapBassMode;
  }, [guitarBassSelect]);
  const targetField = useAssignTargetField(assignsMap, assign.target);
  const { targetMinField, targetMaxField, resetRange } = useAssign(
    assignsMap,
    assign,
    target
  );

  const pendingRangeReset = useRef(false);
  const resetRangeRef = useRef(resetRange);
  useEffect(() => {
    resetRangeRef.current = resetRange;
  });
  const handleTargetChange = useCallback(
    (nextTarget: number) => {
      // NOTE: At least with Picker, this fires only for true user events, as expected.
      pendingRangeReset.current = true;
      setTarget(nextTarget);
    },
    [setTarget]
  );
  const previousTarget = usePrevious(target);
  useEffect(() => {
    if (previousTarget !== target && pendingRangeReset.current) {
      resetRangeRef.current();
      pendingRangeReset.current = false;
    }
  }, [previousTarget, target]);

  return (
    // NOTE: We use `key` to force re-rendering in order to avoid some
    // apparent bugs in the field controls.
    <>
      <PatchFieldSwitchedSection field={assign.switch} key={assign.address}>
        <PatchFieldPicker
          field={targetField}
          value={target}
          onValueChange={handleTargetChange}
        />
        <PatchDynamicField field={targetMinField} key={target + "min"} />
        <PatchDynamicField field={targetMaxField} key={target + "max"} />
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

function PatchDynamicField({ field }: { field: FieldReference<any> }) {
  if (isNumericFieldReference(field)) {
    return <PatchFieldSlider field={field} />;
  } else if (isEnumFieldReference(field)) {
    return <PatchFieldPicker field={field} />;
  }
  // TODO: Eventually we should not have this fallback
  console.error("Could not render dynamic field", field.definition.description);
  return null;
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});

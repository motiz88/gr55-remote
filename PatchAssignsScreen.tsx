import {
  createMaterialTopTabNavigator,
  MaterialTopTabScreenProps,
} from "@react-navigation/material-top-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useContext, useEffect, useMemo, useRef } from "react";
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
import { RolandRemotePatchContext } from "./RolandRemotePatchContext";
import { useMainScrollViewSafeAreaStyle } from "./SafeAreaUtils";
import { PatchAssignsTabParamList, RootStackParamList } from "./navigation";
import { useAssignsMap } from "./useAssignsMap";
import { usePatchField } from "./usePatchField";
import usePrevious from "./usePrevious";

const Tab = createMaterialTopTabNavigator<PatchAssignsTabParamList>();

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
      headerTintColor: "cornflowerblue",
    });
  }, [navigation, patchName]);

  return (
    <Tab.Navigator
      id="PatchAssigns"
      backBehavior="history"
      screenOptions={{ tabBarStyle: { backgroundColor: "#F1F5FD" } }}
    >
      <Tab.Screen
        name="Assign1"
        component={PatchAssignScreen}
        options={{ title: "1" }}
      />
      <Tab.Screen
        name="Assign2"
        component={PatchAssignScreen}
        options={{ title: "2" }}
      />
      <Tab.Screen
        name="Assign3"
        component={PatchAssignScreen}
        options={{ title: "3" }}
      />
      <Tab.Screen
        name="Assign4"
        component={PatchAssignScreen}
        options={{ title: "4" }}
      />
      <Tab.Screen
        name="Assign5"
        component={PatchAssignScreen}
        options={{ title: "5" }}
      />
      <Tab.Screen
        name="Assign6"
        component={PatchAssignScreen}
        options={{ title: "6" }}
      />
      <Tab.Screen
        name="Assign7"
        component={PatchAssignScreen}
        options={{ title: "7" }}
      />
      <Tab.Screen
        name="Assign8"
        component={PatchAssignScreen}
        options={{ title: "8" }}
      />
    </Tab.Navigator>
  );
}

const assignsByRouteName = {
  Assign1: GR55.temporaryPatch.common.assign1,
  Assign2: GR55.temporaryPatch.common.assign2,
  Assign3: GR55.temporaryPatch.common.assign3,
  Assign4: GR55.temporaryPatch.common.assign4,
  Assign5: GR55.temporaryPatch.common.assign5,
  Assign6: GR55.temporaryPatch.common.assign6,
  Assign7: GR55.temporaryPatch.common.assign7,
  Assign8: GR55.temporaryPatch.common.assign8,
};

function PatchAssignScreen({
  navigation,
  route,
}: MaterialTopTabScreenProps<
  PatchAssignsTabParamList,
  | "Assign1"
  | "Assign2"
  | "Assign3"
  | "Assign4"
  | "Assign5"
  | "Assign6"
  | "Assign7"
  | "Assign8"
>) {
  const { reloadPatchData } = useContext(RolandRemotePatchContext);

  const safeAreaStyle = useMainScrollViewSafeAreaStyle();

  const assignsMap = useAssignsMap();
  if (!assignsMap) {
    // TODO: Throw an error? Show an error message?
    return <></>;
  }
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={reloadPatchData} />
      }
      style={[styles.container]}
      contentContainerStyle={safeAreaStyle}
    >
      <AssignSection
        assignsMap={assignsMap}
        assign={assignsByRouteName[route.name]}
      />
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
  assignsMap,
}: {
  assign: typeof GR55.temporaryPatch.common.assign1;
  assignsMap: AssignsMap;
}) {
  const [source, setSource] = usePatchField(assign.source);
  const [target, setTarget] = usePatchField(assign.target);
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

    // TODO: Propagate this via context so that switched sections can use the same color
    // 10/11ths of the way from cornflowerblue to #f2f2f2
    backgroundColor: "#E5EAF2",
  },
});

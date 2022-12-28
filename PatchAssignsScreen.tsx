import {
  createMaterialTopTabNavigator,
  MaterialTopTabScreenProps,
} from "@react-navigation/material-top-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useContext, useEffect, useMemo } from "react";
import { Button, View, StyleSheet, Text } from "react-native";

import { ContextualStyleProvider } from "./ContextualStyle";
import { PatchFieldPicker } from "./PatchFieldPicker";
import { PatchFieldSlider } from "./PatchFieldSlider";
import { PatchFieldSwitchedSection } from "./PatchFieldSwitchedSection";
import { PatchFieldWaveShapePicker } from "./PatchFieldWaveShapePicker";
import { PopoverAwareScrollView } from "./PopoverAwareScrollView";
import { usePopovers } from "./Popovers";
import { RefreshControl } from "./RefreshControl";
import {
  FieldReference,
  isEnumFieldReference,
  isNumericFieldReference,
  NumericField,
} from "./RolandAddressMap";
import { RolandGR55AddressMapAbsolute as GR55 } from "./RolandGR55AddressMap";
import { AssignDefinition, AssignsMap } from "./RolandGR55Assigns";
import { useRolandGR55Assigns } from "./RolandGR55AssignsContainer";
import { RolandRemotePatchContext } from "./RolandRemotePatchContext";
import { useMainScrollViewSafeAreaStyle } from "./SafeAreaUtils";
import { PatchAssignsTabParamList, RootStackParamList } from "./navigation";
import { useAssignsMap } from "./useAssignsMap";
import { usePatchField } from "./usePatchField";

const Tab = createMaterialTopTabNavigator<PatchAssignsTabParamList>();

// 10/11ths of the way from cornflowerblue to #f2f2f2
const ASSIGNS_BACKGROUND_COLOR = "#E5EAF2";

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

  const { closeAllPopovers } = usePopovers();
  const [assign1Switch] = usePatchField(
    GR55.temporaryPatch.common.assign1.switch
  );
  const [assign2Switch] = usePatchField(
    GR55.temporaryPatch.common.assign2.switch
  );
  const [assign3Switch] = usePatchField(
    GR55.temporaryPatch.common.assign3.switch
  );
  const [assign4Switch] = usePatchField(
    GR55.temporaryPatch.common.assign4.switch
  );
  const [assign5Switch] = usePatchField(
    GR55.temporaryPatch.common.assign5.switch
  );
  const [assign6Switch] = usePatchField(
    GR55.temporaryPatch.common.assign6.switch
  );
  const [assign7Switch] = usePatchField(
    GR55.temporaryPatch.common.assign7.switch
  );
  const [assign8Switch] = usePatchField(
    GR55.temporaryPatch.common.assign8.switch
  );
  const renderLabel = useCallback(
    ({
      children,
      focused,
      color,
    }: {
      children: string;
      focused: boolean;
      color: string;
    }) => {
      const assigned =
        (children === "1" && assign1Switch) ||
        (children === "2" && assign2Switch) ||
        (children === "3" && assign3Switch) ||
        (children === "4" && assign4Switch) ||
        (children === "5" && assign5Switch) ||
        (children === "6" && assign6Switch) ||
        (children === "7" && assign7Switch) ||
        (children === "8" && assign8Switch);
      return (
        <AssignTabLabel focused={focused} color={color} assigned={assigned}>
          {children}
        </AssignTabLabel>
      );
    },
    [
      assign1Switch,
      assign2Switch,
      assign3Switch,
      assign4Switch,
      assign5Switch,
      assign6Switch,
      assign7Switch,
      assign8Switch,
    ]
  );

  return (
    <Tab.Navigator
      id="PatchAssigns"
      backBehavior="history"
      screenOptions={{
        tabBarStyle: { backgroundColor: "#F1F5FD" },
        tabBarLabel: renderLabel,
      }}
      screenListeners={{
        blur: () => {
          closeAllPopovers();
        },
      }}
    >
      <Tab.Screen
        name="Assign1"
        component={PatchAssignScreen}
        options={{
          title: "1",
        }}
      />
      <Tab.Screen
        name="Assign2"
        component={PatchAssignScreen}
        options={{
          title: "2",
        }}
      />
      <Tab.Screen
        name="Assign3"
        component={PatchAssignScreen}
        options={{
          title: "3",
        }}
      />
      <Tab.Screen
        name="Assign4"
        component={PatchAssignScreen}
        options={{
          title: "4",
        }}
      />
      <Tab.Screen
        name="Assign5"
        component={PatchAssignScreen}
        options={{
          title: "5",
        }}
      />
      <Tab.Screen
        name="Assign6"
        component={PatchAssignScreen}
        options={{
          title: "6",
        }}
      />
      <Tab.Screen
        name="Assign7"
        component={PatchAssignScreen}
        options={{
          title: "7",
        }}
      />
      <Tab.Screen
        name="Assign8"
        component={PatchAssignScreen}
        options={{
          title: "8",
        }}
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
    throw new Error(
      "PatchAssignScreen: Assigns map is not available. This should not be reachable."
    );
  }
  return (
    <PopoverAwareScrollView
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={reloadPatchData} />
      }
      style={[styles.container]}
      contentContainerStyle={safeAreaStyle}
    >
      <ContextualStyleProvider
        value={{
          backgroundColor: ASSIGNS_BACKGROUND_COLOR,
        }}
      >
        <AssignSection
          assignsMap={assignsMap}
          assign={assignsByRouteName[route.name]}
        />
      </ContextualStyleProvider>
    </PopoverAwareScrollView>
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
  return { field: reinterpretedField };
}

function useAssign(
  assignsMap: AssignsMap,
  assign: typeof GR55.temporaryPatch.common.assign1,
  target: number
) {
  const assignDef = assignsMap.getByIndex(target);
  const { field: targetMinField } = useAssignTargetRangeField(
    assignDef,
    assign.targetMin,
    false
  );
  const { field: targetMaxField } = useAssignTargetRangeField(
    assignDef,
    assign.targetMax,
    true
  );
  return { targetMinField, targetMaxField, assignDef };
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
  const { setAssignTarget } = useRolandGR55Assigns();
  const [source, setSource] = usePatchField(assign.source);
  const [target, setTarget] = usePatchField(assign.target);
  const targetField = useAssignTargetField(assignsMap, assign.target);
  const { targetMinField, targetMaxField } = useAssign(
    assignsMap,
    assign,
    target
  );

  const handleTargetChange = useCallback(
    (nextTarget: number) => {
      // NOTE: At least with Picker, this fires only for true user events, as expected.
      // setAssignTarget resets the range as a side effect.
      setAssignTarget(assign, nextTarget);
      setTarget(nextTarget);
    },
    [setAssignTarget, assign, setTarget]
  );

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
  throw new Error(
    "Could not render dynamic field " + field.definition.description
  );
}

function AssignTabLabel({
  assigned,
  children,
  color,
}: {
  assigned: boolean;
  children: React.ReactNode;
  focused: boolean;
  color: string;
}) {
  return (
    <Text style={[styles.label, { color }, assigned && styles.labelAssigned]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    backgroundColor: ASSIGNS_BACKGROUND_COLOR,
  },
  label: {
    textAlign: "center",
    textTransform: "uppercase",
    fontSize: 18,
    margin: 4,
    backgroundColor: "transparent",
  },
  labelAssigned: {
    fontWeight: "bold",
    textShadowColor: "lightgray",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    fontSize: 18,
  },
});

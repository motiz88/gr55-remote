import {
  createMaterialTopTabNavigator,
  MaterialTopTabScreenProps,
} from "@react-navigation/material-top-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useContext, useEffect, useMemo } from "react";
import { StyleSheet } from "react-native";

import { ContextualStyleProvider } from "./ContextualStyle";
import { PopoverAwareScrollView } from "./PopoverAwareScrollView";
import { usePopovers } from "./Popovers";
import { RefreshControl } from "./RefreshControl";
import { RemoteFieldDynamic } from "./RemoteFieldDynamic";
import { RemoteFieldPicker } from "./RemoteFieldPicker";
import { RemoteFieldSlider } from "./RemoteFieldSlider";
import { RemoteFieldSwitchedSection } from "./RemoteFieldSwitchedSection";
import { RemoteFieldWaveShapePicker } from "./RemoteFieldWaveShapePicker";
import { FieldReference, NumericField } from "./RolandAddressMap";
import { RolandGR55AddressMapAbsolute as GR55 } from "./RolandGR55AddressMap";
import { AssignDefinition, AssignsMap } from "./RolandGR55Assigns";
import { useRolandGR55Assigns } from "./RolandGR55AssignsContainer";
import { RolandRemotePatchContext as PATCH } from "./RolandRemotePageContext";
import { useMainScrollViewSafeAreaStyle } from "./SafeAreaUtils";
import { useTheme } from "./Theme";
import { ThemedText as Text } from "./ThemedText";
import { PatchAssignsTabParamList, PatchStackParamList } from "./navigation";
import { useAssignsMap } from "./useAssignsMap";
import { useRemoteField } from "./useRemoteField";

const Tab = createMaterialTopTabNavigator<PatchAssignsTabParamList>();

export function PatchAssignsScreen({
  navigation,
}: NativeStackScreenProps<PatchStackParamList, "PatchAssigns">) {
  const theme = useTheme();
  const [patchName] = useRemoteField(
    PATCH,
    GR55.temporaryPatch.common.patchName
  );
  useEffect(() => {
    navigation.setOptions({
      title: patchName + " > Assigns",
      headerTintColor: "cornflowerblue",
    });
  }, [navigation, patchName]);

  const { closeAllPopovers } = usePopovers();
  const [assign1Switch] = useRemoteField(
    PATCH,
    GR55.temporaryPatch.common.assign1.switch
  );
  const [assign2Switch] = useRemoteField(
    PATCH,
    GR55.temporaryPatch.common.assign2.switch
  );
  const [assign3Switch] = useRemoteField(
    PATCH,
    GR55.temporaryPatch.common.assign3.switch
  );
  const [assign4Switch] = useRemoteField(
    PATCH,
    GR55.temporaryPatch.common.assign4.switch
  );
  const [assign5Switch] = useRemoteField(
    PATCH,
    GR55.temporaryPatch.common.assign5.switch
  );
  const [assign6Switch] = useRemoteField(
    PATCH,
    GR55.temporaryPatch.common.assign6.switch
  );
  const [assign7Switch] = useRemoteField(
    PATCH,
    GR55.temporaryPatch.common.assign7.switch
  );
  const [assign8Switch] = useRemoteField(
    PATCH,
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
        tabBarStyle: { backgroundColor: theme.colors.assigns.tabBarBackground },
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
  const { reloadData } = useContext(PATCH);

  const safeAreaStyle = useMainScrollViewSafeAreaStyle();

  const theme = useTheme();

  const assignsMap = useAssignsMap();
  if (!assignsMap) {
    throw new Error(
      "PatchAssignScreen: Assigns map is not available. This should not be reachable."
    );
  }

  return (
    <PopoverAwareScrollView
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={reloadData} />
      }
      style={[
        { backgroundColor: theme.colors.assigns.background },
        styles.container,
      ]}
      contentContainerStyle={safeAreaStyle}
    >
      <ContextualStyleProvider
        value={{
          backgroundColor: theme.colors.assigns.background,
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
  const [source, setSource] = useRemoteField(PATCH, assign.source);
  const [target, setTarget] = useRemoteField(PATCH, assign.target);
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
      <RemoteFieldSwitchedSection
        page={PATCH}
        field={assign.switch}
        key={assign.address}
      >
        <RemoteFieldPicker
          page={PATCH}
          field={targetField}
          value={target}
          onValueChange={handleTargetChange}
        />
        <RemoteFieldDynamic
          page={PATCH}
          field={targetMinField}
          key={target + "min"}
        />
        <RemoteFieldDynamic
          page={PATCH}
          field={targetMaxField}
          key={target + "max"}
        />
        <RemoteFieldPicker
          page={PATCH}
          field={assign.source}
          value={source}
          onValueChange={setSource}
        />
        <RemoteFieldPicker page={PATCH} field={assign.sourceMode} />
        {/* TODO: Range slider? But what about inverted ranges? */}
        <RemoteFieldSlider page={PATCH} field={assign.activeRangeLo} />
        <RemoteFieldSlider page={PATCH} field={assign.activeRangeHi} />
        {source === "INT PDL" && (
          <>
            <RemoteFieldPicker
              page={PATCH}
              field={assign.internalPedalTrigger}
            />
            <RemoteFieldSlider page={PATCH} field={assign.internalPedalTime} />
            {/* TODO: Curve icons */}
            <RemoteFieldPicker page={PATCH} field={assign.internalPedalCurve} />
          </>
        )}
        {source === "WAVE PDL" && (
          <>
            <RemoteFieldSlider page={PATCH} field={assign.wavePedalRate} />
            <RemoteFieldWaveShapePicker
              page={PATCH}
              field={assign.wavePedalForm}
            />
          </>
        )}
      </RemoteFieldSwitchedSection>
    </>
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

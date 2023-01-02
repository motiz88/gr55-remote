import { useNavigation } from "@react-navigation/native";
import { useCallback } from "react";
import { GestureResponderEvent } from "react-native";
import { Rect } from "react-native-popover-view";

import { FieldRow } from "./FieldRow";
import { usePopovers } from "./Popovers";
import { FieldReference } from "./RolandAddressMap";
import { AssignsMap } from "./RolandGR55Assigns";
import { useRolandGR55Assigns } from "./RolandGR55AssignsContainer";
import { GlobalNavigationProp } from "./navigation";
import { useAssignsMap } from "./useAssignsMap";

export function PatchFieldRow({
  field,
  children,
  inline,
}: {
  field: FieldReference;
  children: React.ReactNode;
  inline?: boolean;
}) {
  const assignsMap = useAssignsMap();
  const assignDefIndex = assignsMap?.getIndexByField(field);
  const isAssignable = assignsMap != null && assignDefIndex != null;
  if (isAssignable) {
    return (
      <AssignablePatchFieldRow
        field={field}
        inline={inline}
        assignsMap={assignsMap}
        assignDefIndex={assignDefIndex}
      >
        {children}
      </AssignablePatchFieldRow>
    );
  }
  return (
    <FieldRow description={field.definition.description} inline={inline}>
      {children}
    </FieldRow>
  );
}

function AssignablePatchFieldRow({
  field,
  children,
  inline,
  assignsMap,
  assignDefIndex,
}: {
  field: FieldReference;
  children: React.ReactNode;
  inline?: boolean;
  assignsMap: AssignsMap;
  assignDefIndex: number;
}) {
  const {
    getAssignsForAssignDef,
    createAssign,
    deleteAssigns,
    firstAvailableAssignIndex,
  } = useRolandGR55Assigns();
  const assignsForDef = getAssignsForAssignDef(assignDefIndex);
  const { showPopover, closeAllPopovers } = usePopovers();

  const navigation = useNavigation<GlobalNavigationProp>();
  const handleLongPress = useCallback(
    (
      event: GestureResponderEvent,
      rowMeasurements: { x: number; y: number; width: number; height: number }
    ) => {
      showPopover({
        props: {
          id: "AssignFromField",
          canCreateAssign:
            assignsForDef.length === 0 && firstAvailableAssignIndex !== -1,
          canDeleteAssigns: assignsForDef.length > 0,
          editableAssigns: assignsForDef,
          onCreateAssign: () => {
            const createdAssignIndex = createAssign(assignDefIndex);
            navigation.getParent("PatchStack")!.navigate("PatchAssigns", {
              screen: `Assign${createdAssignIndex + 1}`,
            });
          },
          onDeleteAssigns: () => {
            deleteAssigns(assignDefIndex);
          },
          onEditAssign: (assignIndex) => {
            navigation.getParent("PatchStack")!.navigate("PatchAssigns", {
              screen: `Assign${assignIndex + 1}`,
            });
          },
          showNoAssignsAvailable:
            assignsForDef.length === 0 && firstAvailableAssignIndex === -1,
        },
        source: new Rect(
          event.nativeEvent.pageX,
          rowMeasurements.y,
          0,
          rowMeasurements.height
        ),
      });
    },
    [
      assignDefIndex,
      assignsForDef,
      createAssign,
      deleteAssigns,
      firstAvailableAssignIndex,
      navigation,
      showPopover,
    ]
  );
  const handlePress = useCallback(() => {
    if (assignsForDef.length === 0) {
      return;
    }
    navigation.getParent("PatchStack")!.navigate("PatchAssigns", {
      screen: `Assign${assignsForDef[assignsForDef.length - 1] + 1}`,
    });
  }, [navigation, assignsForDef]);
  if (assignsForDef.length > 0) {
    return (
      <FieldRow
        description={field.definition.description}
        inline={inline}
        isAssigned
        onPressIn={closeAllPopovers}
        onLongPress={handleLongPress}
        onPress={handlePress}
      >
        {children}
      </FieldRow>
    );
  }
  return (
    <FieldRow
      description={field.definition.description}
      inline={inline}
      onLongPress={handleLongPress}
      onPressIn={closeAllPopovers}
    >
      {children}
    </FieldRow>
  );
}

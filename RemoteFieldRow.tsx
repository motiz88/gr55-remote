import { useNavigation } from "@react-navigation/native";
import { useCallback } from "react";
import { GestureResponderEvent } from "react-native";
import { Rect } from "react-native-popover-view";

import { FieldRow } from "./FieldRow";
import { usePopovers } from "./Popovers";
import { FieldReference } from "./RolandAddressMap";
import { useRolandGR55Assigns } from "./RolandGR55AssignsContainer";
import {
  RolandRemotePageContext,
  RolandRemotePatchContext as PATCH,
} from "./RolandRemotePageContext";
import { GlobalNavigationProp } from "./navigation";
import { useAssignsMap } from "./useAssignsMap";
import { useRemoteField } from "./useRemoteField";

export function RemoteFieldRow({
  page,
  field,
  children,
  inline,
}: {
  page: RolandRemotePageContext;
  field: FieldReference;
  children: React.ReactNode;
  inline?: boolean;
}) {
  const assignsMap = useAssignsMap();
  // TODO: Maybe store an isAssignable bit in the page definition instead of hardcoding page === PATCH?
  const assignDefIndex =
    page === PATCH ? assignsMap?.getIndexByField(field) : undefined;
  const isAssignable = page === PATCH && assignDefIndex != null;
  const [, , status] = useRemoteField(page, field);
  const isPending = status === "pending";
  if (isAssignable && !isPending) {
    return (
      <AssignablePatchFieldRow
        field={field}
        inline={inline}
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
  assignDefIndex,
}: {
  field: FieldReference;
  children: React.ReactNode;
  inline?: boolean;
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

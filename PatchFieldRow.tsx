import { useNavigation } from "@react-navigation/native";
import { useCallback } from "react";
import { Pressable, Text } from "react-native";

import { FieldRow } from "./FieldRow";
import { PatchFieldStyles } from "./PatchFieldStyles";
import { FieldReference } from "./RolandAddressMap";
import { RolandGR55AddressMapAbsolute as GR55 } from "./RolandGR55AddressMap";
import { AssignsMap } from "./RolandGR55Assigns";
import { GlobalNavigationProp } from "./navigation";
import { useAssignsMap } from "./useAssignsMap";
import { usePatchField } from "./usePatchField";

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
  const [assign1Target] = usePatchField(
    GR55.temporaryPatch.common.assign1.target
  );
  const [assign1Switch] = usePatchField(
    GR55.temporaryPatch.common.assign1.switch
  );
  const [assign2Target] = usePatchField(
    GR55.temporaryPatch.common.assign2.target
  );
  const [assign2Switch] = usePatchField(
    GR55.temporaryPatch.common.assign2.switch
  );
  const [assign3Target] = usePatchField(
    GR55.temporaryPatch.common.assign3.target
  );
  const [assign3Switch] = usePatchField(
    GR55.temporaryPatch.common.assign3.switch
  );
  const [assign4Target] = usePatchField(
    GR55.temporaryPatch.common.assign4.target
  );
  const [assign4Switch] = usePatchField(
    GR55.temporaryPatch.common.assign4.switch
  );
  const [assign5Target] = usePatchField(
    GR55.temporaryPatch.common.assign5.target
  );
  const [assign5Switch] = usePatchField(
    GR55.temporaryPatch.common.assign5.switch
  );
  const [assign6Target] = usePatchField(
    GR55.temporaryPatch.common.assign6.target
  );
  const [assign6Switch] = usePatchField(
    GR55.temporaryPatch.common.assign6.switch
  );
  const [assign7Target] = usePatchField(
    GR55.temporaryPatch.common.assign7.target
  );
  const [assign7Switch] = usePatchField(
    GR55.temporaryPatch.common.assign7.switch
  );
  const [assign8Target] = usePatchField(
    GR55.temporaryPatch.common.assign8.target
  );
  const [assign8Switch] = usePatchField(
    GR55.temporaryPatch.common.assign8.switch
  );
  const assignIndex: -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 = (
    [
      assign1Switch && assign1Target === assignDefIndex,
      assign2Switch && assign2Target === assignDefIndex,
      assign3Switch && assign3Target === assignDefIndex,
      assign4Switch && assign4Target === assignDefIndex,
      assign5Switch && assign5Target === assignDefIndex,
      assign6Switch && assign6Target === assignDefIndex,
      assign7Switch && assign7Target === assignDefIndex,
      assign8Switch && assign8Target === assignDefIndex,
    ] as const
  )
    // TODO: Any point in handling multiple assignments to one field here?
    .indexOf(true) as any;

  const navigation = useNavigation<GlobalNavigationProp>();
  const handleAssignLinkPress = useCallback(() => {
    navigation.getParent("RootStack")!.navigate("PatchAssigns", {
      screen: `Assign${assignIndex + 1}`,
    });
  }, [assignIndex, navigation]);
  if (assignIndex !== -1) {
    return (
      <FieldRow
        description={field.definition.description}
        descriptionSecondary={
          <Pressable android_ripple={{ color: "lightgray" }}>
            <Text
              style={PatchFieldStyles.fieldDescriptionSecondaryLink}
              onPress={handleAssignLinkPress}
            >
              Assign{assignIndex + 1}
            </Text>
          </Pressable>
        }
        inline={inline}
        isAssigned
      >
        {children}
      </FieldRow>
    );
  }
  return (
    <FieldRow description={field.definition.description} inline={inline}>
      {children}
    </FieldRow>
  );
}

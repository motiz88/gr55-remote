import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { StyleSheet, FlatList } from "react-native";

import {
  AsciiStringField,
  FieldDefinition,
  StructDefinition,
  getAddresses,
  parse,
} from "./RolandAddressMap";
import { RolandGR55NotConnectedView } from "./RolandGR55NotConnectedView";
import { RolandGR55PatchMap } from "./RolandGR55PatchMap";
import { pack7 } from "./RolandSysExProtocol";
import { useMainScrollViewSafeAreaStyle } from "./SafeAreaUtils";
import { ThemedText as Text } from "./ThemedText";
import { RootTabParamList } from "./navigation";
import { usePatchMap } from "./usePatchMap";
import { useRolandRemotePageState } from "./useRolandRemotePageState";

const ITEM_HEIGHT = 44;

export function LibraryPatchListScreen({
  navigation,
}: BottomTabScreenProps<RootTabParamList, "LibraryPatchList", "RootTab">) {
  const safeAreaStyle = useMainScrollViewSafeAreaStyle();

  const patchMap = usePatchMap();
  if (!patchMap) {
    return <RolandGR55NotConnectedView navigation={navigation} />;
  }
  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={safeAreaStyle}
      data={patchMap.patchList}
      renderItem={({ item }) => <PatchItem patch={item} />}
      getItemLayout={getItemLayout}
    />
  );
}

function getItemLayout(_: any, index: number) {
  return {
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  };
}

function PatchItem({
  patch,
}: {
  patch: RolandGR55PatchMap["patchList"][number];
}) {
  const patchName =
    patch.userPatch != null ? (
      <UserPatchName patch={patch} userPatch={patch.userPatch} />
    ) : /* TODO: system patch names */ null;
  return (
    <Text style={styles.item}>
      {patch.styleLabel} {patch.patchNumberLabel} {patchName}
    </Text>
  );
}

const CompactPatchDefinition = new StructDefinition(
  pack7(0x000000),
  "User patch (compact)",
  {
    common: new StructDefinition(pack7(0x000000), "Common", {
      patchName: new FieldDefinition(
        pack7(0x0001),
        "Patch Name",
        new AsciiStringField(16)
      ),
    }),
  }
);

const CompactPatchDefinitionAddresses = getAddresses(CompactPatchDefinition, 0);

function UserPatchName({
  patch,
  userPatch,
}: {
  patch: RolandGR55PatchMap["patchList"][number];
  userPatch: NonNullable<RolandGR55PatchMap["patchList"][number]["userPatch"]>;
}) {
  const { pageData } = useRolandRemotePageState({
    address: userPatch.baseAddress,
    definition: CompactPatchDefinition,
  });
  if (pageData) {
    const [patchName] = parse(
      pageData[
        userPatch.baseAddress +
          CompactPatchDefinitionAddresses.common.patchName.address
      ],
      CompactPatchDefinitionAddresses.common.patchName.definition,
      0
    );
    return <>{patchName.value}</>;
  }
  return null;
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  item: {
    height: ITEM_HEIGHT,
  },
});

import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useMemo } from "react";
import { StyleSheet, FlatList, useWindowDimensions, View } from "react-native";

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
import { useLayout } from "./useLayout";
import { usePatchMap } from "./usePatchMap";
import { useRolandRemotePageState } from "./useRolandRemotePageState";

const ITEM_HEIGHT = 2 * 32;
const ITEM_WIDTH = 16 * 16;
const ITEM_HPADDING = 8;
const ITEM_VPADDING = 8;
const ITEM_FONT_SIZE = 20;

export function LibraryPatchListScreen({
  navigation,
}: BottomTabScreenProps<RootTabParamList, "LibraryPatchList", "RootTab">) {
  const safeAreaStyle = useMainScrollViewSafeAreaStyle();
  const { onLayout, ...layout } = useLayout();
  const windowDimensions = useWindowDimensions();
  const availableWidth = layout.width || windowDimensions.width;
  const itemsPerRow = Math.max(
    Math.floor(availableWidth / (ITEM_WIDTH + ITEM_HPADDING * 2)),
    1
  );
  const patchMap = usePatchMap();
  const rows = useMemo(() => {
    if (!patchMap) {
      return [];
    }
    const rowsMut: RolandGR55PatchMap["patchList"][] = [];
    for (let i = 0; i < patchMap.patchList.length; i += itemsPerRow) {
      rowsMut.push(patchMap.patchList.slice(i, i + itemsPerRow));
    }
    return rowsMut;
  }, [itemsPerRow, patchMap]);

  if (!patchMap) {
    return <RolandGR55NotConnectedView navigation={navigation} />;
  }

  return (
    <FlatList
      onLayout={onLayout}
      style={styles.container}
      contentContainerStyle={safeAreaStyle}
      data={rows}
      renderItem={({ item }) => <PatchRow items={item} />}
      getItemLayout={getRowLayout}
    />
  );
}

function getRowLayout(_: any, index: number) {
  return {
    length: ITEM_HEIGHT + ITEM_VPADDING * 2,
    offset: (ITEM_HEIGHT + ITEM_VPADDING * 2) * index,
    index,
  };
}

function PatchRow({
  items,
}: {
  items: readonly RolandGR55PatchMap["patchList"][number][];
}) {
  return (
    <View style={styles.row}>
      {items.map((item) => (
        <PatchItem patch={item} key={item.styleLabel + item.patchNumberLabel} />
      ))}
    </View>
  );
}

function PatchItem({
  patch,
}: {
  patch: RolandGR55PatchMap["patchList"][number];
}) {
  const patchName =
    patch.userPatch != null ? (
      <UserPatchName patch={patch} userPatch={patch.userPatch} />
    ) : (
      patch.builtInName
    );
  return (
    <Text style={styles.item}>
      {patch.styleLabel} {patch.patchNumberLabel}
      {"\n"}
      {patchName}
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  item: {
    height: ITEM_HEIGHT + ITEM_VPADDING * 2,
    width: ITEM_WIDTH + ITEM_HPADDING * 2,
    paddingHorizontal: ITEM_HPADDING,
    paddingVertical: ITEM_VPADDING,
    fontSize: ITEM_FONT_SIZE,
    textAlign: "center",
    textAlignVertical: "center",
  },
});

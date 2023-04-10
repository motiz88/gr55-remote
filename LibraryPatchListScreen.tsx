import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useRef } from "react";
import {
  StyleSheet,
  FlatList,
  useWindowDimensions,
  View,
  Pressable,
} from "react-native";

import {
  AsciiStringField,
  FieldDefinition,
  StructDefinition,
  getAddresses,
  parse,
} from "./RolandAddressMap";
import { RolandGR55NotConnectedView } from "./RolandGR55NotConnectedView";
import { RolandGR55PatchMap } from "./RolandGR55PatchMap";
import { useRolandRemotePatchSelection } from "./RolandRemotePatchSelection";
import { pack7 } from "./RolandSysExProtocol";
import { useMainScrollViewSafeAreaStyle } from "./SafeAreaUtils";
import { useTheme } from "./Theme";
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
  const data = useMemo(() => {
    const rows: RolandGR55PatchMap["patchList"][] = [];
    const bankMsbAndPcToRowIndex: number[][] = [];
    if (patchMap) {
      let rowIndex = 0;
      for (let i = 0; i < patchMap.patchList.length; i += itemsPerRow) {
        const rowPatches = patchMap.patchList.slice(i, i + itemsPerRow);
        rows.push(rowPatches);
        for (const patch of rowPatches) {
          bankMsbAndPcToRowIndex[patch.bankMSB] =
            bankMsbAndPcToRowIndex[patch.bankMSB] ?? [];
          bankMsbAndPcToRowIndex[patch.bankMSB][patch.pc] = rowIndex;
        }
        ++rowIndex;
      }
    }
    return {
      rows,
      bankMsbAndPcToRowIndex,
    };
  }, [itemsPerRow, patchMap]);

  const { selectedPatch, setSelectedPatch } = useRolandRemotePatchSelection();
  const listRef = useRef<FlatList<any>>(null);
  const scrollToPatch = useCallback(
    (
      patch:
        | {
            bankSelectMSB: number;
            pc: number;
          }
        | undefined
    ) => {
      const rowIndex =
        data.bankMsbAndPcToRowIndex[patch?.bankSelectMSB ?? 0]?.[
          patch?.pc ?? 0
        ];
      if (rowIndex == null) {
        return;
      }
      // scroll to the row
      listRef.current?.scrollToIndex({
        animated: true,
        index: rowIndex,
        viewPosition: 0.5,
      });
    },
    [data]
  );
  useFocusEffect(
    useCallback(() => {
      scrollToPatch(selectedPatch);
    }, [scrollToPatch, selectedPatch])
  );
  const handleSelectPatch = useCallback(
    (patch: { bankSelectMSB: number; pc: number }) => {
      setSelectedPatch(patch);
    },
    [setSelectedPatch]
  );
  const listExtraDeps = useMemo(
    () => [selectedPatch, itemsPerRow, handleSelectPatch],
    [selectedPatch, itemsPerRow, handleSelectPatch]
  );
  if (!patchMap) {
    return <RolandGR55NotConnectedView navigation={navigation} />;
  }

  return (
    <FlatList
      ref={listRef}
      onLayout={onLayout}
      style={styles.container}
      contentContainerStyle={safeAreaStyle}
      data={data.rows}
      renderItem={({ item }) => (
        <PatchRow
          items={item}
          selectedPatch={selectedPatch}
          itemsPerRow={itemsPerRow}
          onSelectPatch={handleSelectPatch}
        />
      )}
      getItemLayout={getRowLayout}
      extraData={listExtraDeps}
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
  selectedPatch,
  itemsPerRow,
  onSelectPatch,
}: {
  items: readonly RolandGR55PatchMap["patchList"][number][];
  selectedPatch:
    | {
        bankSelectMSB: number;
        pc: number;
      }
    | undefined;
  itemsPerRow: number;
  onSelectPatch: (patch: { bankSelectMSB: number; pc: number }) => void;
}) {
  return (
    <View style={styles.row}>
      {items.map((item) => (
        <PatchItem
          patch={item}
          key={item.styleLabel + item.patchNumberLabel}
          selectedPatch={selectedPatch}
          onSelectPatch={onSelectPatch}
        />
      ))}
      {items.length < itemsPerRow
        ? Array(itemsPerRow - items.length)
            .fill(null)
            .map((_, index) => <PatchItemPlaceholder key={index} />)
        : null}
    </View>
  );
}

function PatchItemPlaceholder() {
  return <View style={[styles.item]} />;
}

function PatchItem({
  patch,
  selectedPatch,
  onSelectPatch,
}: {
  patch: RolandGR55PatchMap["patchList"][number];
  selectedPatch:
    | {
        bankSelectMSB: number;
        pc: number;
      }
    | undefined;
  onSelectPatch: (patch: { bankSelectMSB: number; pc: number }) => void;
}) {
  const patchName =
    patch.userPatch != null ? (
      <UserPatchName patch={patch} userPatch={patch.userPatch} />
    ) : (
      patch.builtInName
    );
  const theme = useTheme();
  const handlePress = useCallback(() => {
    onSelectPatch({ bankSelectMSB: patch.bankMSB, pc: patch.pc });
  }, [onSelectPatch, patch]);
  return (
    <Pressable onPress={handlePress}>
      <Text
        style={[
          styles.item,
          selectedPatch?.bankSelectMSB === patch.bankMSB &&
            selectedPatch?.pc === patch.pc && {
              backgroundColor: theme.colors.library.selectedPatch,
            },
        ]}
      >
        {patch.styleLabel} {patch.patchNumberLabel}
        {"\n"}
        {patchName}
      </Text>
    </Pressable>
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

import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { memo, useCallback, useMemo, useRef, useState } from "react";
import {
  StyleSheet,
  FlatList,
  useWindowDimensions,
  View,
  Pressable,
  ViewToken,
  Animated,
  Platform,
} from "react-native";
import { useAnimation } from "react-native-animation-hooks";

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
import { AnimatedThemedText } from "./ThemedText";
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
  const viewableRowsRange = useRef<{
    firstVisibleItemIndex: number | null;
    lastVisibleItemIndex: number | null;
  }>();
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
      let middleVisibleItemIndex;
      // scroll to the row if it's not already visible
      if (
        viewableRowsRange.current &&
        viewableRowsRange.current.firstVisibleItemIndex != null &&
        viewableRowsRange.current.lastVisibleItemIndex != null
      ) {
        if (
          rowIndex >= viewableRowsRange.current.firstVisibleItemIndex &&
          rowIndex <= viewableRowsRange.current.lastVisibleItemIndex
        ) {
          return;
        }
        middleVisibleItemIndex = Math.floor(
          (viewableRowsRange.current.firstVisibleItemIndex +
            viewableRowsRange.current.lastVisibleItemIndex) /
            2
        );
      }

      // TODO: don't scroll on viewport size / orientation change

      listRef.current?.scrollToIndex({
        animated:
          middleVisibleItemIndex != null &&
          Math.abs(rowIndex - middleVisibleItemIndex) <= data.rows.length / 2,
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
  const isFocused = useIsFocused();
  const listExtraDeps = useMemo(
    () => [selectedPatch, itemsPerRow, handleSelectPatch, isFocused],
    [selectedPatch, itemsPerRow, handleSelectPatch, isFocused]
  );
  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length === 0) {
        return;
      }
      const firstVisibleItemIndex = viewableItems[0].index;
      const lastVisibleItemIndex =
        viewableItems[viewableItems.length - 1].index;

      // store in ref for use during the scrolling callback
      viewableRowsRange.current = {
        firstVisibleItemIndex,
        lastVisibleItemIndex,
      };
    },
    []
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
      initialNumToRender={Math.round(
        Math.max(
          10,
          (layout.height || windowDimensions.height) /
            (ITEM_HEIGHT + ITEM_VPADDING * 2)
        )
      )}
      windowSize={1.6}
      // @refresh reset - FIXME: this is a workaround for a bug in react-native
      onViewableItemsChanged={handleViewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 100,
      }}
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

const PatchRow = memo(function PatchRow({
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
    <View style={[styles.row, itemsPerRow === 1 && styles.singleColumnRow]}>
      {items.map((item) => (
        <PatchItem
          patch={item}
          key={item.styleLabel + item.patchNumberLabel}
          isSelected={
            selectedPatch?.bankSelectMSB === item.bankMSB &&
            selectedPatch?.pc === item.pc
          }
          onSelectPatch={onSelectPatch}
          isSingleColumn={itemsPerRow === 1}
        />
      ))}
      {items.length < itemsPerRow
        ? Array(itemsPerRow - items.length)
            .fill(null)
            .map((_, index) => <PatchItemPlaceholder key={index} />)
        : null}
    </View>
  );
});

function PatchItemPlaceholder() {
  return <View style={[styles.item]} />;
}

const PatchItem = memo(function PatchItem({
  patch,
  isSelected,
  onSelectPatch,
  isSingleColumn,
}: {
  patch: RolandGR55PatchMap["patchList"][number];
  isSelected: boolean;
  onSelectPatch: (patch: { bankSelectMSB: number; pc: number }) => void;
  isSingleColumn: boolean;
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
  const [isPressed, setIsPressed] = useState(false);
  const handlePressIn = useCallback(() => {
    setIsPressed(true);
  }, []);
  const handlePressOut = useCallback(() => {
    setIsPressed(false);
  }, []);
  const touchOpacity = useAnimation({
    type: "timing",
    initialValue: isPressed ? 0.25 : 1,
    toValue: isPressed ? 0.25 : 1,
    duration: isPressed ? 0 : 300,
    useNativeDriver: true,
  });
  return (
    <View>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        android_ripple={{ color: theme.colors.library.selectedPatch }}
      >
        <Animated.View
          style={[
            styles.item,
            isSelected && {
              backgroundColor: theme.colors.library.selectedPatch,
            },
            isSingleColumn && styles.singleColumnItem,
          ]}
        >
          <AnimatedThemedText
            style={[
              styles.itemText,
              Platform.select({ ios: { opacity: touchOpacity } }),
            ]}
          >
            {patch.styleLabel} {patch.patchNumberLabel}
            {"\n"}
            {patchName}
          </AnimatedThemedText>
        </Animated.View>
      </Pressable>
    </View>
  );
});

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
  const isFocused = useIsFocused();
  const { pageData } = useRolandRemotePageState(
    useMemo(
      () =>
        isFocused
          ? {
              address: userPatch.baseAddress,
              definition: CompactPatchDefinition,
            }
          : // TODO: This hack cancels the request when the screen is not focused
            // but also forces a refetch every time we return to the screen.
            // Need to hoist the data fetching to a higher level so we can
            // do this a bit more elegantly.
            undefined,
      [isFocused, userPatch.baseAddress]
    )
  );
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
  singleColumnRow: {
    flexDirection: "column",
  },
  item: {
    height: ITEM_HEIGHT + ITEM_VPADDING * 2,
    width: ITEM_WIDTH + ITEM_HPADDING * 2,
    paddingHorizontal: ITEM_HPADDING,
    paddingVertical: ITEM_VPADDING,
  },
  itemText: {
    fontSize: ITEM_FONT_SIZE,
    textAlign: "center",
    textAlignVertical: "center",
  },
  singleColumnItem: {
    width: "100%",
  },
});

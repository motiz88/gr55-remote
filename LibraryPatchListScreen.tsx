import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import {
  memo,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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

import { PendingTextPlaceholder } from "./PendingContentPlaceholders";
import { RolandGR55NotConnectedView } from "./RolandGR55NotConnectedView";
import {
  RolandGR55PatchDescription,
  useRolandGR55RemotePatchDescriptions,
} from "./RolandGR55RemotePatchDescriptions";
import { useRolandRemotePatchSelection } from "./RolandRemotePatchSelection";
import { useMainScrollViewSafeAreaStyle } from "./SafeAreaUtils";
import { useTheme } from "./Theme";
import { ThemedSearchBar } from "./ThemedSearchBar";
import { AnimatedThemedText } from "./ThemedText";
import { RootTabParamList } from "./navigation";
import { useLayout } from "./useLayout";
import { useFocusQueryPriority } from "./useRolandDataTransfer";

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
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const { patches } = useRolandGR55RemotePatchDescriptions();
  const data = useMemo(() => {
    const rows: RolandGR55PatchDescription[][] = [];
    const bankMsbAndPcToRowIndex: number[][] = [];
    if (patches) {
      const filteredPatchList = deferredSearch
        ? patches.filter((patch) => {
            return patch.data?.name
              .toLowerCase()
              .includes(deferredSearch.toLowerCase());
          })
        : patches;
      let rowIndex = 0;
      for (let i = 0; i < filteredPatchList.length; i += itemsPerRow) {
        const rowPatches = filteredPatchList.slice(i, i + itemsPerRow);
        rows.push(rowPatches);
        for (const patch of rowPatches) {
          bankMsbAndPcToRowIndex[patch.identity.bankMSB] =
            bankMsbAndPcToRowIndex[patch.identity.bankMSB] ?? [];
          bankMsbAndPcToRowIndex[patch.identity.bankMSB][patch.identity.pc] =
            rowIndex;
        }
        ++rowIndex;
      }
    }
    return {
      rows,
      bankMsbAndPcToRowIndex,
    };
  }, [itemsPerRow, patches, deferredSearch]);

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
      if (rowIndex >= data.rows.length) {
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
  const handleChangeText = useCallback((value: string) => {
    setSearch(value);
    isPendingScroll.current = true;
  }, []);
  const isPendingScroll = useRef<boolean>(false);
  useEffect(() => {
    if (isPendingScroll.current) {
      isPendingScroll.current = false;
      scrollToPatch(selectedPatch);
    }
  }, [scrollToPatch, search, selectedPatch]);
  useFocusQueryPriority("read_patch_list");

  if (!patches) {
    return <RolandGR55NotConnectedView navigation={navigation} />;
  }

  // TODO: add a "no results" view
  // TODO: add a refresh control
  // TODO: indicate whether the search function is ready (e.g. if the patches are still loading)

  return (
    <>
      <ThemedSearchBar
        placeholder="Search patches..."
        onChangeText={handleChangeText}
        value={search}
      />
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
        // @refresh reset - FIXME: this is a workaround for a bug in react-native
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 100,
        }}
      />
    </>
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
  items: readonly RolandGR55PatchDescription[];
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
          key={item.identity.styleLabel + item.identity.patchNumberLabel}
          isSelected={
            selectedPatch?.bankSelectMSB === item.identity.bankMSB &&
            selectedPatch?.pc === item.identity.pc
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
  patch: RolandGR55PatchDescription;
  isSelected: boolean;
  onSelectPatch: (patch: { bankSelectMSB: number; pc: number }) => void;
  isSingleColumn: boolean;
}) {
  const theme = useTheme();
  const handlePress = useCallback(() => {
    onSelectPatch({
      bankSelectMSB: patch.identity.bankMSB,
      pc: patch.identity.pc,
    });
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
  const pressFeedbackStyle = useMemo(
    () => Platform.select({ ios: { opacity: touchOpacity } }),
    [touchOpacity]
  );
  const patchName = (
    <PatchName patch={patch} pressFeedbackStyle={pressFeedbackStyle} />
  );
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
          <AnimatedThemedText style={[styles.itemText, pressFeedbackStyle]}>
            {patch.identity.styleLabel} {patch.identity.patchNumberLabel}
          </AnimatedThemedText>
          {patchName}
        </Animated.View>
      </Pressable>
    </View>
  );
});

function PatchName({
  patch,
  pressFeedbackStyle,
}: {
  patch: RolandGR55PatchDescription;
  pressFeedbackStyle: React.ComponentProps<(typeof Animated)["Text"]>["style"];
}) {
  if (patch.data) {
    return (
      <AnimatedThemedText style={[styles.itemText, pressFeedbackStyle]}>
        {patch.data.name}
      </AnimatedThemedText>
    );
  }
  if (patch.status === "pending") {
    return <PendingTextPlaceholder chars={16} textStyle={styles.itemText} />;
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
    alignItems: "center",
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

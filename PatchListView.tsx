import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FlatList,
  useWindowDimensions,
  View,
  Pressable,
  ViewToken,
  Animated,
  Platform,
  StyleSheet,
} from "react-native";
import { useAnimation } from "react-native-animation-hooks";

import { PendingTextPlaceholder } from "./PendingContentPlaceholders";
import { RolandGR55PatchDescription } from "./RolandGR55RemotePatchDescriptions";
import { PatchId } from "./RolandRemotePatchSelection";
import { useTheme } from "./Theme";
import { AnimatedThemedText } from "./ThemedText";
import { useLayout } from "./useLayout";

const ITEM_HEIGHT = 2 * 32;
const ITEM_WIDTH = 16 * 16;
const ITEM_HPADDING = 8;
const ITEM_VPADDING = 8;
const ITEM_FONT_SIZE = 20;

export const PatchListView = forwardRef(function (
  {
    data,
    selectedPatch,
    onSelectedPatchChange,
    contentContainerStyle,
  }: {
    data: RolandGR55PatchDescription[] | null;
    selectedPatch: PatchId | undefined;
    onSelectedPatchChange: (patch: PatchId) => void;
    contentContainerStyle: React.ComponentProps<
      typeof FlatList
    >["contentContainerStyle"];
  },
  ref: React.ForwardedRef<{
    scrollToPatch: (patch: PatchId | undefined) => void;
  }>
) {
  const listRef = useRef<FlatList<any>>(null);
  const { onLayout, ...layout } = useLayout();
  const windowDimensions = useWindowDimensions();
  const availableWidth = layout.width || windowDimensions.width;
  const itemsPerRow = Math.max(
    Math.floor(availableWidth / (ITEM_WIDTH + ITEM_HPADDING * 2)),
    1
  );
  const listData = useMemo(() => {
    const rows: RolandGR55PatchDescription[][] = [];
    const bankMsbAndPcToRowIndex: number[][] = [];
    if (data) {
      let rowIndex = 0;
      for (let i = 0; i < data.length; i += itemsPerRow) {
        const rowPatches = data.slice(i, i + itemsPerRow);
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
  }, [itemsPerRow, data]);
  const viewableRowsRange = useRef<{
    firstVisibleItemIndex: number | null;
    lastVisibleItemIndex: number | null;
  }>();
  const scrollToPatch = useCallback(
    (patch: PatchId | undefined) => {
      const rowIndex =
        listData.bankMsbAndPcToRowIndex[patch?.bankSelectMSB ?? 0]?.[
          patch?.pc ?? 0
        ];
      if (rowIndex == null) {
        return;
      }
      if (rowIndex >= listData.rows.length) {
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
          Math.abs(rowIndex - middleVisibleItemIndex) <=
            listData.rows.length / 2,
        index: rowIndex,
        viewPosition: 0.5,
      });
    },
    [listData]
  );
  useFocusEffect(
    useCallback(() => {
      scrollToPatch(selectedPatch);
    }, [scrollToPatch, selectedPatch])
  );
  const handleSelectPatch = useCallback(
    (patch: PatchId) => {
      onSelectedPatchChange(patch);
    },
    [onSelectedPatchChange]
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
  useImperativeHandle(
    ref,
    () => ({
      scrollToPatch,
    }),
    [scrollToPatch]
  );
  return (
    <FlatList
      ref={listRef}
      onLayout={onLayout}
      style={styles.container}
      contentContainerStyle={contentContainerStyle}
      data={listData.rows}
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
      // The keyboard will not dismiss automatically, and the scroll view will not catch taps, but children of the scroll view can catch taps.
      keyboardShouldPersistTaps="handled"
    />
  );
});

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
  selectedPatch: PatchId | undefined;
  itemsPerRow: number;
  onSelectPatch: (patch: PatchId) => void;
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
  onSelectPatch: (patch: PatchId) => void;
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

export const styles = StyleSheet.create({
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

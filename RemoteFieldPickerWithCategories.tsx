import { useCallback, useMemo, useState } from "react";
import { Dimensions, Platform, StyleSheet, View } from "react-native";

import { FieldRow } from "./FieldRow";
import { styles as pickerStyles } from "./Picker";
import { RemoteFieldRow } from "./RemoteFieldRow";
import {
  PickerControl,
  useRemoteFieldSystemPicker,
} from "./RemoteFieldSystemPicker";
import {
  EnumField,
  FieldReference,
  FieldType,
  isEnumFieldReference,
  isNumericFieldReference,
  NumericField,
} from "./RolandAddressMap";
import { RolandRemotePageContext } from "./RolandRemotePageContext";
import { ThemedPicker as Picker } from "./ThemedPicker";
import { ThemedText as Text } from "./ThemedText";

const SINGLE_PICKER_REQUIRED_WIDTH = 300;

function getLayoutForWidth(width: number): "normal" | "wide" {
  return Platform.select({
    ios: width >= SINGLE_PICKER_REQUIRED_WIDTH ? "wide" : "normal",
    default: "normal",
  });
}

export function RemoteFieldPickerWithCategories<T extends number | string>({
  page,
  field,
  value: valueProp,
  onValueChange: onValueChangeProp,
  categories,
  shortDescription,
}: {
  page: RolandRemotePageContext;
  field: FieldReference<
    FieldType<T> & (EnumField<{ [encoded: number]: string }> | NumericField)
  >;
  value?: T;
  onValueChange?: (value: T) => void;
  categories: { name: string; first: T; last: T }[];
  shortDescription?: string;
}) {
  const { value, onValueChange, items, isPending } = useRemoteFieldSystemPicker(
    {
      page,
      field,
      value: valueProp,
      onValueChange: onValueChangeProp,
    }
  );
  const { category, handleCategoryChange, categoryPickerItems } =
    useCategories<T>(field, categories, value, onValueChange);
  const [layout, setLayout] = useState<"normal" | "wide">(
    // HACK: Approximate the initial layout to avoid a flash of the wrong layout
    getLayoutForWidth(Dimensions.get("window").width * 0.66)
  );
  const handleMainPickerLayout = useCallback(
    (event: { nativeEvent: { layout: { width: number } } }) => {
      setLayout(getLayoutForWidth(event.nativeEvent.layout.width));
    },
    []
  );
  const categoryPicker = (
    <PickerControl
      value={category!.name}
      onValueChange={handleCategoryChange}
      items={categoryPickerItems}
      isPending={isPending}
      style={layout === "wide" ? styles.pickerInWideLayout : undefined}
    />
  );
  const mainPicker = (
    <PickerControl
      value={value}
      onValueChange={onValueChange}
      items={items}
      isPending={isPending}
      style={layout === "wide" ? styles.pickerInWideLayout : undefined}
    />
  );

  return (
    <>
      {layout === "normal" ? (
        <FieldRow description={field.definition.description + " (Category)"}>
          {categoryPicker}
        </FieldRow>
      ) : null}
      <RemoteFieldRow page={page} field={field}>
        <View
          onLayout={handleMainPickerLayout}
          style={[styles.row, layout === "wide" && styles.rowInWideLayout]}
        >
          {layout === "wide" ? (
            <WithLabel label="Category">{categoryPicker}</WithLabel>
          ) : null}
          {layout === "wide" ? (
            <WithLabel label={shortDescription ?? field.definition.description}>
              {mainPicker}
            </WithLabel>
          ) : (
            mainPicker
          )}
        </View>
      </RemoteFieldRow>
    </>
  );
}

function WithLabel({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.labelAndContentContainer}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

function useCategories<T extends number | string>(
  field: FieldReference<
    FieldType<T> & (EnumField<{ [encoded: number]: string }> | NumericField)
  >,
  categories: { name: string; first: T; last: T }[],
  value: string | number,
  onValueChange: (newValue: T) => void
) {
  const fieldValuesToNumbers = useMemo(() => {
    if (isEnumFieldReference(field)) {
      const result = Object.create(null);
      for (const [encoded, label] of Object.entries(
        field.definition.type.labels
      )) {
        result[label] = Number.parseInt(encoded, 10);
      }
      return result;
    }
    if (!isNumericFieldReference(field)) {
      throw new Error("Expected enum or numeric field");
    }
    return null;
  }, [field]);

  const categoriesWithIndices = useMemo(() => {
    const result = categories.map((category) => ({
      ...category,
      firstNumeric: (fieldValuesToNumbers
        ? fieldValuesToNumbers[category.first]
        : category.first) as number,
      lastNumeric: (fieldValuesToNumbers
        ? fieldValuesToNumbers[category.last]
        : category.last) as number,
    }));
    result.sort((a, b) => a.firstNumeric - b.firstNumeric);
    // Assert categories are non-overlapping and contiguous
    for (let i = 0; i < result.length - 1; i++) {
      if (result[i].lastNumeric + 1 !== result[i + 1].firstNumeric) {
        throw new Error(
          `Categories must be non-overlapping and contiguous: ${JSON.stringify(
            result
          )}`
        );
      }
    }
    return result;
  }, [categories, fieldValuesToNumbers]);
  const valueNumeric = fieldValuesToNumbers
    ? fieldValuesToNumbers[value as string]
    : (value as number);
  const category = findCategory(categoriesWithIndices, valueNumeric);
  const categoryPickerItems = useMemo(() => {
    return categoriesWithIndices.map((category) => (
      <Picker.Item
        label={category.name}
        key={category.name}
        value={category.name}
      />
    ));
  }, [categoriesWithIndices]);
  const handleCategoryChange = useCallback(
    (categoryName: string) => {
      const category = categoriesWithIndices.find(
        (category) => category.name === categoryName
      );
      if (!category) {
        throw new Error(`Unknown category: ${categoryName}`);
      }
      const newValue = category.first;
      onValueChange(newValue as T);
    },
    [categoriesWithIndices, onValueChange]
  );
  return { category, handleCategoryChange, categoryPickerItems };
}

function findCategory<T extends number | string>(
  categoriesWithIndices: {
    name: string;
    first: T;
    last: T;
    firstNumeric: number;
    lastNumeric: number;
  }[],
  valueNumeric: number
) {
  // Since categories are non-overlapping and contiguous, we can use binary search
  let low = 0;
  let high = categoriesWithIndices.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (categoriesWithIndices[mid].firstNumeric <= valueNumeric) {
      if (valueNumeric <= categoriesWithIndices[mid].lastNumeric) {
        return categoriesWithIndices[mid];
      }
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return null;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  rowInWideLayout: pickerStyles.container,
  pickerInWideLayout: {
    borderWidth: 0,
    ...Platform.select({ ios: { backgroundColor: "transparent" } }),
  },
  label: {
    marginHorizontal: 8,
    marginTop: 8,
    textAlign: "center",
    opacity: 0.66,
    textTransform: "uppercase",
  },
  labelAndContentContainer: {
    flex: 1,
    flexDirection: "column",
  },
});

import { useCallback, useMemo } from "react";

import { FieldRow } from "./FieldRow";
import {
  PickerControl,
  RemoteFieldSystemPicker,
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
import { useMaybeControlledRemoteField } from "./useRemoteField";

export function RemoteFieldPickerWithCategories<T extends number | string>({
  page,
  field,
  value: valueProp,
  onValueChange: onValueChangeProp,
  categories,
}: {
  page: RolandRemotePageContext;
  field: FieldReference<
    FieldType<T> & (EnumField<{ [encoded: number]: string }> | NumericField)
  >;
  value?: T;
  onValueChange?: (value: T) => void;
  categories: { name: string; first: T; last: T }[];
}) {
  const [value, onValueChange, status] = useMaybeControlledRemoteField(
    page,
    field,
    valueProp,
    onValueChangeProp
  );
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
  return (
    <>
      {/* TODO: Place the pickers side-by-side on iOS when the display is wide enough */}
      <FieldRow description={field.definition.description + " (Category)"}>
        <PickerControl
          value={category!.name}
          onValueChange={handleCategoryChange}
          items={categoryPickerItems}
          isPending={status === "pending"}
        />
      </FieldRow>
      <RemoteFieldSystemPicker
        page={page}
        field={field}
        value={valueProp}
        onValueChange={onValueChangeProp}
      />
    </>
  );
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

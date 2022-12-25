import { useCallback, useMemo } from "react";
import { Text, View } from "react-native";

import { DirectPicker } from "./DirectPicker";
import { PatchFieldStyles } from "./PatchFieldStyles";
import { BooleanField, FieldReference } from "./RolandAddressMap";
import { usePatchField } from "./usePatchField";

export function PatchFieldSegmentedSwitch({
  field,
  inline,
}: {
  field: FieldReference<BooleanField>;
  inline?: boolean;
}) {
  const [value, setValue] = usePatchField(field, false);
  return (
    <PatchFieldSegmentedSwitchControlled
      field={field}
      value={value}
      onValueChange={setValue}
      inline={inline}
    />
  );
}

export function PatchFieldSegmentedSwitchControlled({
  field,
  value,
  onValueChange,
}: {
  value: boolean;
  onValueChange: (value: boolean) => void;
  field: FieldReference<BooleanField>;
  inline?: boolean;
  segmented?: boolean;
}) {
  const invertedForDisplay = field.definition.type.invertedForDisplay;

  const handleLabelChange = useCallback(
    (label: string) => {
      onValueChange(label === field.definition.type.trueLabel);
    },
    [field, onValueChange]
  );
  const labelsInOrder = useMemo(
    () =>
      invertedForDisplay
        ? ([
            field.definition.type.trueLabel,
            field.definition.type.falseLabel,
          ] as const)
        : ([
            field.definition.type.falseLabel,
            field.definition.type.trueLabel,
          ] as const),
    [field, invertedForDisplay]
  );
  return (
    <View style={PatchFieldStyles.fieldRow}>
      <Text style={PatchFieldStyles.fieldDescription}>
        {field.definition.description}
      </Text>
      <DirectPicker
        style={PatchFieldStyles.fieldControl}
        onValueChange={handleLabelChange}
        value={
          (invertedForDisplay ? !value : value)
            ? field.definition.type.trueLabel
            : field.definition.type.falseLabel
        }
        values={labelsInOrder}
      />
    </View>
  );
}

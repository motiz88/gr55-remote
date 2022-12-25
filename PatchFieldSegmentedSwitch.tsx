import { useCallback, useMemo } from "react";
import { Text, View } from "react-native";

import { PatchFieldStyles } from "./PatchFieldStyles";
import { BooleanField, FieldReference } from "./RolandAddressMap";
import { SegmentedPicker } from "./SegmentedPicker";
import { useMaybeControlledPatchField } from "./usePatchField";

export function PatchFieldSegmentedSwitch({
  field,
  value: valueProp,
  onValueChange: onValueChangeProp,
}: {
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  field: FieldReference<BooleanField>;
  inline?: boolean;
  segmented?: boolean;
}) {
  const [value, onValueChange] = useMaybeControlledPatchField(
    field,
    valueProp,
    onValueChangeProp
  );
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
      <SegmentedPicker
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

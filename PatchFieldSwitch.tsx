import { useCallback, useMemo } from "react";
import { Switch, Text, View, Pressable, StyleSheet } from "react-native";

import { PatchFieldStyles } from "./PatchFieldStyles";
import { BooleanField, FieldReference } from "./RolandAddressMap";
import { usePatchField } from "./usePatchField";

export function PatchFieldSwitch({
  field,
  inline,
}: {
  field: FieldReference<BooleanField>;
  inline?: boolean;
}) {
  const [value, setValue] = usePatchField(field, false);
  return (
    <PatchFieldSwitchControlled
      field={field}
      value={value}
      onValueChange={setValue}
      inline={inline}
    />
  );
}

export function PatchFieldSwitchControlled({
  field,
  value,
  onValueChange,
  inline,
}: {
  value: boolean;
  onValueChange: (value: boolean) => void;
  field: FieldReference<BooleanField>;
  inline?: boolean;
}) {
  const invertedForDisplay = field.definition.type.invertedForDisplay;

  const handleValueChange = useCallback(
    (value: boolean) => {
      if (invertedForDisplay) {
        value = !value;
      }
      onValueChange(value);
    },
    [onValueChange, invertedForDisplay]
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

  const inlineSwitch = (
    // Prevent the switch from triggering any parent Pressables
    <Pressable android_disableSound>
      <Switch
        style={inline ? null : styles.switchBetweenLabels}
        onValueChange={handleValueChange}
        value={invertedForDisplay ? !value : value}
      />
    </Pressable>
  );
  if (inline) {
    return inlineSwitch;
  }
  return (
    <View style={PatchFieldStyles.fieldRow}>
      <Text style={PatchFieldStyles.fieldDescription}>
        {field.definition.description}
      </Text>
      <View
        style={[PatchFieldStyles.horizontal, PatchFieldStyles.fieldControl]}
      >
        <Text style={styles.switchLabel}>{labelsInOrder[0]}</Text>
        {inlineSwitch}
        <Text style={styles.switchLabel}>{labelsInOrder[1]}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  switchLabel: {
    textAlignVertical: "center",
    userSelect: "none",
  },
  switchBetweenLabels: {
    marginHorizontal: 8,
  },
});

import { useCallback, useContext, useMemo } from "react";
import { Switch, Text, View, Pressable, StyleSheet } from "react-native";

import { FieldRowContext } from "./FieldRow";
import { PatchFieldRow } from "./PatchFieldRow";
import { PatchFieldStyles } from "./PatchFieldStyles";
import { BooleanField, FieldReference } from "./RolandAddressMap";
import { useMaybeControlledPatchField } from "./usePatchField";

export function PatchFieldSwitch({
  field,
  value: valueProp,
  onValueChange: onValueChangeProp,
  inline,
}: {
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  field: FieldReference<BooleanField>;
  inline?: boolean;
}) {
  const [value, onValueChange] = useMaybeControlledPatchField(
    field,
    valueProp,
    onValueChangeProp
  );
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

  return (
    <PatchFieldRow field={field} inline={inline}>
      <SwitchControl
        inline={inline ?? false}
        invertedForDisplay={invertedForDisplay}
        value={value}
        handleValueChange={handleValueChange}
        labelsInOrder={labelsInOrder}
      />
    </PatchFieldRow>
  );
}

function SwitchControl({
  inline,
  invertedForDisplay,
  value,
  handleValueChange,
  labelsInOrder,
}: {
  inline: boolean;
  invertedForDisplay: boolean;
  value: boolean;
  handleValueChange: (value: boolean) => void;
  labelsInOrder: readonly [string, string];
}) {
  const { isAssigned } = useContext(FieldRowContext);

  const inlineSwitch = (
    // Prevent the switch from triggering any parent Pressables
    <Pressable android_disableSound>
      <Switch
        style={inline ? null : styles.switchBetweenLabels}
        onValueChange={handleValueChange}
        value={invertedForDisplay ? !value : value}
        trackColor={
          isAssigned ? { false: "#bccee9", true: "cornflowerblue" } : undefined
        }
        ios_backgroundColor={isAssigned ? "#bccee9" : undefined}
      />
    </Pressable>
  );
  return inline ? (
    inlineSwitch
  ) : (
    <View
      style={[PatchFieldStyles.horizontal, PatchFieldStyles.fieldControlInner]}
    >
      <Text style={styles.switchLabel}>{labelsInOrder[0]}</Text>
      {inlineSwitch}
      <Text style={styles.switchLabel}>{labelsInOrder[1]}</Text>
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

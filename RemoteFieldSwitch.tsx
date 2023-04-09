import { useCallback, useMemo } from "react";
import { Switch, View, Pressable, StyleSheet } from "react-native";

import { FieldStyles } from "./FieldStyles";
import { RemoteFieldRow } from "./RemoteFieldRow";
import { BooleanField, FieldReference } from "./RolandAddressMap";
import { RolandRemotePageContext } from "./RolandRemotePageContext";
import { ThemedText as Text } from "./ThemedText";
import { useMaybeControlledRemoteField } from "./useRemoteField";

export function RemoteFieldSwitch({
  page,
  field,
  value: valueProp,
  onValueChange: onValueChangeProp,
  inline,
}: {
  page: RolandRemotePageContext;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  field: FieldReference<BooleanField>;
  inline?: boolean;
}) {
  const [value, onValueChange] = useMaybeControlledRemoteField(
    page,
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
    <RemoteFieldRow page={page} field={field} inline={inline}>
      <SwitchControl
        inline={inline ?? false}
        invertedForDisplay={invertedForDisplay}
        value={value}
        handleValueChange={handleValueChange}
        labelsInOrder={labelsInOrder}
      />
    </RemoteFieldRow>
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
  // const { isAssigned } = useContext(FieldRowContext);
  // TODO: Show assigned state when all controls can reliably handle long press etc
  const isAssigned = false;

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
    <View style={[FieldStyles.horizontal, FieldStyles.fieldControlInner]}>
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

import Slider from "@react-native-community/slider";
import { Picker } from "@react-native-picker/picker";
import { useCallback, useMemo } from "react";
import { Switch, Text, StyleSheet, View } from "react-native";

import {
  BooleanField,
  EnumField,
  FieldDefinition,
  NumericField,
} from "./RolandAddressMap";
import { SwitchSelector } from "./SwitchSelector";
import { usePatchField } from "./usePatchField";

export function PatchFieldSlider({
  field,
  disabled,
  inline,
}: {
  field: { address: number; definition: FieldDefinition<NumericField> };
  disabled?: boolean;
  inline?: boolean;
}) {
  const [value, setValue] = usePatchField(field, field.definition.type.min);
  return (
    <PatchFieldSliderControlled
      field={field}
      disabled={disabled}
      value={value}
      onValueChange={setValue}
      inline={inline}
    />
  );
}

export function PatchFieldSliderControlled({
  field,
  disabled,
  value,
  onValueChange,
  inline,
}: {
  field: { address: number; definition: FieldDefinition<NumericField> };
  disabled?: boolean;
  value: number;
  onValueChange: (value: number) => void;
  inline?: boolean;
}) {
  const handleValueChange = useCallback(
    (valueOrValues: number | number[]) => {
      if (typeof valueOrValues === "number") {
        onValueChange(valueOrValues);
      } else {
        onValueChange(valueOrValues[0]);
      }
    },
    [onValueChange]
  );
  const prettyValue = field.definition.type.format(value);
  const inlineSlider = (
    <View style={styles.sliderContainer}>
      <Text style={styles.sliderValueLabel}>{prettyValue}</Text>
      <Slider
        disabled={disabled}
        minimumValue={field.definition.type.min}
        maximumValue={field.definition.type.max}
        step={field.definition.type.step}
        onValueChange={handleValueChange}
        value={value}
      />
    </View>
  );
  if (inline) {
    return inlineSlider;
  }
  return (
    <View style={styles.fieldRow}>
      <Text style={styles.fieldDescription}>
        {field.definition.description}
      </Text>
      <View style={styles.fieldControl}>{inlineSlider}</View>
    </View>
  );
}

export function PatchFieldPicker<T extends string>({
  field,
  disabled,
}: {
  field: {
    address: number;
    definition: FieldDefinition<EnumField<{ [encoded: number]: T }>>;
  };
  disabled?: boolean;
}) {
  const [value, setValue] = usePatchField(
    field,
    field.definition.type.labels[0]
  );
  if (Object.keys(field.definition.type.labels).length <= 3) {
    return (
      <PatchFieldSwitchSelectorControlled
        field={field}
        value={value}
        disabled={disabled}
        onValueChange={setValue}
      />
    );
  }
  return (
    <PatchFieldPickerControlled
      field={field}
      value={value}
      disabled={disabled}
      onValueChange={setValue}
    />
  );
}

export function PatchFieldPickerControlled<T extends string>({
  field,
  disabled,
  value,
  onValueChange,
}: {
  field: {
    address: number;
    definition: FieldDefinition<EnumField<{ [encoded: number]: T }>>;
  };
  disabled?: boolean;
  value: T;
  onValueChange: (value: T) => void;
}) {
  const items = useMemo(
    () =>
      Object.entries(field.definition.type.labels).map(([encoded, label]) => (
        <Picker.Item label={label} key={encoded} value={label} />
      )),
    [field]
  );
  return (
    <View style={styles.fieldRow}>
      <Text style={styles.fieldDescription}>
        {field.definition.description}
      </Text>
      <Picker
        enabled={!disabled}
        onValueChange={onValueChange}
        selectedValue={value}
        style={styles.fieldControl}
      >
        {items}
      </Picker>
    </View>
  );
}

export function PatchFieldSwitchSelectorControlled<T extends string>({
  field,
  disabled,
  value,
  onValueChange,
}: {
  field: {
    address: number;
    definition: FieldDefinition<EnumField<{ [encoded: number]: T }>>;
  };
  disabled?: boolean;
  value: T;
  onValueChange: (value: T) => void;
}) {
  const options = useMemo(
    () =>
      Object.entries(field.definition.type.labels).map(
        ([encoded, label], index) => ({
          label,
          value: label,
        })
      ),
    [field]
  );

  return (
    <View style={styles.fieldRow}>
      <Text style={styles.fieldDescription}>
        {field.definition.description}
      </Text>
      <SwitchSelector
        options={options}
        value={value}
        onValueChange={onValueChange}
        style={styles.fieldControl}
      />
    </View>
  );
}

export function PatchFieldSwitchControlled({
  field,
  value,
  disabled,
  onValueChange,
  inline,
}: {
  value: boolean;
  onValueChange: (value: boolean) => void;
  field: {
    address: number;
    definition: FieldDefinition<BooleanField>;
  };
  disabled?: boolean;
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
  const inlineSwitch = (
    <Switch
      style={inline ? null : styles.switchBetweenLabels}
      disabled={disabled}
      onValueChange={handleValueChange}
      value={invertedForDisplay ? !value : value}
    />
  );
  if (inline) {
    return inlineSwitch;
  }
  return (
    <View style={styles.fieldRow}>
      <Text style={styles.fieldDescription}>
        {field.definition.description}
      </Text>
      <View style={[styles.horizontal, styles.fieldControl]}>
        <Text style={styles.switchLabel}>
          {invertedForDisplay
            ? field.definition.type.trueLabel
            : field.definition.type.falseLabel}
        </Text>
        {inlineSwitch}
        <Text style={styles.switchLabel}>
          {invertedForDisplay
            ? field.definition.type.falseLabel
            : field.definition.type.trueLabel}
        </Text>
      </View>
    </View>
  );
}
export function PatchFieldSwitch({
  field,
  disabled,
  inline,
}: {
  field: {
    address: number;
    definition: FieldDefinition<BooleanField>;
  };
  disabled?: boolean;
  inline?: boolean;
}) {
  const [value, setValue] = usePatchField(field, false);
  return (
    <PatchFieldSwitchControlled
      field={field}
      value={value}
      onValueChange={setValue}
      disabled={disabled}
      inline={inline}
    />
  );
}

export function PatchFieldPlaceholder({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <View style={styles.fieldRow}>
      <Text style={styles.fieldDescription}>{children}</Text>
    </View>
  );
}

export function SwitchedSection({
  field,
  children,
}: {
  field: {
    address: number;
    definition: FieldDefinition<BooleanField>;
  };
  children: React.ReactNode;
}) {
  const [value, setValue] = usePatchField(field, false);
  return (
    <>
      <PatchFieldSwitchControlled
        field={field}
        value={value}
        onValueChange={setValue}
      />
      <View
        style={
          (field.definition.type.invertedForDisplay ? !value : value)
            ? null
            : styles.disabledSection
        }
      >
        {children}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  horizontal: {
    flexDirection: "row",
    // justifyContent: "space-between",
  },
  switchLabel: {
    textAlignVertical: "center",
    userSelect: "none",
  },
  fieldRow: {
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  fieldDescription: {
    // marginBottom: -4,
    flex: 1,
    textAlignVertical: "center",
  },
  fieldControl: {
    flex: 2,
    marginStart: 8,
  },
  sliderValueLabel: {},
  sliderContainer: { flex: 1 },
  sliderTrack: {
    height: 32,
  },
  disabledSection: {
    // TODO: overhaul disabled styling
    backgroundColor: "#ddd",
  },
  switchBetweenLabels: {
    marginHorizontal: 8,
  },
});

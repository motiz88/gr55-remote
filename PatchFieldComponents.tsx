import Slider from "@react-native-community/slider";
import { Picker } from "@react-native-picker/picker";
import { useCallback, useMemo } from "react";
import {
  Switch,
  Text,
  StyleSheet,
  View,
  Pressable,
  Animated,
} from "react-native";
import { useAnimation } from "react-native-animation-hooks";

import { DirectPicker } from "./DirectPicker";
import {
  BooleanField,
  EnumField,
  FieldDefinition,
  NumericField,
} from "./RolandAddressMap";
import { usePatchField } from "./usePatchField";

export function PatchFieldSlider({
  field,
  inline,
}: {
  field: { address: number; definition: FieldDefinition<NumericField> };
  inline?: boolean;
}) {
  const [value, setValue] = usePatchField(field, field.definition.type.min);
  return (
    <PatchFieldSliderControlled
      field={field}
      value={value}
      onValueChange={setValue}
      inline={inline}
    />
  );
}

export function PatchFieldSliderControlled({
  field,
  value,
  onValueChange,
  inline,
}: {
  field: { address: number; definition: FieldDefinition<NumericField> };
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
}: {
  field: {
    address: number;
    definition: FieldDefinition<EnumField<{ [encoded: number]: T }>>;
  };
}) {
  const [value, setValue] = usePatchField(
    field,
    field.definition.type.labels[0]
  );
  return (
    <PatchFieldPickerControlled
      field={field}
      value={value}
      onValueChange={setValue}
    />
  );
}

export function PatchFieldWaveShapePicker<
  T extends "SAW" | "SQU" | "SQR" | "TRI" | "SIN" | "SAW1" | "SAW2"
>({
  field,
}: {
  field: {
    address: number;
    definition: FieldDefinition<EnumField<{ [encoded: number]: T }>>;
  };
}) {
  const [value, setValue] = usePatchField(
    field,
    field.definition.type.labels[0]
  );
  return (
    <PatchFieldWaveShapePickerControlled
      field={field}
      value={value}
      onValueChange={setValue}
    />
  );
}

const iconsByShapeLabel = {
  SAW: require("./assets/icon-rising-sawtooth-wave.png"),
  SQU: require("./assets/icon-square-wave.png"),
  SQR: require("./assets/icon-square-wave.png"),
  TRI: require("./assets/icon-triangle-wave.png"),
  SIN: require("./assets/icon-sine-wave.png"),
  SAW1: require("./assets/icon-rising-sawtooth-wave.png"),
  SAW2: require("./assets/icon-falling-sawtooth-wave.png"),
};

export function PatchFieldWaveShapePickerControlled<
  T extends "SAW" | "SQU" | "SQR" | "TRI" | "SIN" | "SAW1" | "SAW2"
>({
  field,
  value,
  onValueChange,
}: {
  field: {
    address: number;
    definition: FieldDefinition<EnumField<{ [encoded: number]: T }>>;
  };
  value: T;
  onValueChange: (value: T) => void;
}) {
  const values = useMemo(
    () =>
      Object.values(field.definition.type.labels).map((label) => ({
        value: label,
        icon: iconsByShapeLabel[label],
      })),
    [field]
  );
  return (
    <View style={styles.fieldRow}>
      <Text style={styles.fieldDescription}>
        {field.definition.description}
      </Text>
      <DirectPicker
        style={styles.fieldControl}
        values={values}
        value={value}
        onValueChange={onValueChange}
      />
    </View>
  );
}

export function PatchFieldPickerControlled<T extends string>({
  field,
  value,
  onValueChange,
}: {
  field: {
    address: number;
    definition: FieldDefinition<EnumField<{ [encoded: number]: T }>>;
  };
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
  if (Object.keys(field.definition.type.labels).length <= 3) {
    return (
      <PatchFieldDirectPickerControlled
        field={field}
        value={value}
        onValueChange={onValueChange}
      />
    );
  }
  return (
    <View style={styles.fieldRow}>
      <Text style={styles.fieldDescription}>
        {field.definition.description}
      </Text>
      <Picker
        onValueChange={onValueChange}
        selectedValue={value}
        style={styles.fieldControl}
      >
        {items}
      </Picker>
    </View>
  );
}

export function PatchFieldDirectPickerControlled<T extends string>({
  field,
  value,
  onValueChange,
}: {
  field: {
    address: number;
    definition: FieldDefinition<EnumField<{ [encoded: number]: T }>>;
  };
  value: T;
  onValueChange: (value: T) => void;
}) {
  const values = useMemo(
    () => Object.values(field.definition.type.labels),
    [field]
  );
  return (
    <View style={styles.fieldRow}>
      <Text style={styles.fieldDescription}>
        {field.definition.description}
      </Text>
      <DirectPicker
        style={styles.fieldControl}
        values={values}
        value={value}
        onValueChange={onValueChange}
      />
    </View>
  );
}

export function PatchFieldSegmentedSwitchControlled({
  field,
  value,
  onValueChange,
}: {
  value: boolean;
  onValueChange: (value: boolean) => void;
  field: {
    address: number;
    definition: FieldDefinition<BooleanField>;
  };
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
    <View style={styles.fieldRow}>
      <Text style={styles.fieldDescription}>
        {field.definition.description}
      </Text>
      <DirectPicker
        style={styles.fieldControl}
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

export function PatchFieldSwitchControlled({
  field,
  value,
  onValueChange,
  inline,
}: {
  value: boolean;
  onValueChange: (value: boolean) => void;
  field: {
    address: number;
    definition: FieldDefinition<BooleanField>;
  };
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
    <View style={styles.fieldRow}>
      <Text style={styles.fieldDescription}>
        {field.definition.description}
      </Text>
      <View style={[styles.horizontal, styles.fieldControl]}>
        <Text style={styles.switchLabel}>{labelsInOrder[0]}</Text>
        {inlineSwitch}
        <Text style={styles.switchLabel}>{labelsInOrder[1]}</Text>
      </View>
    </View>
  );
}

export function PatchFieldSwitch({
  field,
  inline,
}: {
  field: {
    address: number;
    definition: FieldDefinition<BooleanField>;
  };
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

export function PatchFieldSegmentedSwitch({
  field,
  inline,
}: {
  field: {
    address: number;
    definition: FieldDefinition<BooleanField>;
  };
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
  const isDisabled = field.definition.type.invertedForDisplay ? value : !value;

  const overlayOpacity = useAnimation({
    type: "timing",
    initialValue: isDisabled ? 0.5 : 0,
    toValue: isDisabled ? 0.5 : 0,
    duration: 150,
    useNativeDriver: true,
  });

  return (
    <>
      <PatchFieldSwitchControlled
        field={field}
        value={value}
        onValueChange={setValue}
      />
      <View>
        {/* NOTE: This is first with a custom zIndex, because placing this last
            with a "natural" zIndex breaks some overlaid components' touch
            behaviour (specifically Slider) on web. */}
        <Animated.View
          pointerEvents="none"
          style={[styles.disabledSectionOverlay, { opacity: overlayOpacity }]}
        />
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
  disabledSectionOverlay: {
    zIndex: 1,
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#f2f2f2",
    opacity: 0.5,
  },
  switchBetweenLabels: {
    marginHorizontal: 8,
  },
});

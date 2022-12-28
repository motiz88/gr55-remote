import { useMemo } from "react";

import { PatchFieldRow } from "./PatchFieldRow";
import { PatchFieldStyles } from "./PatchFieldStyles";
import { EnumField, FieldReference } from "./RolandAddressMap";
import { SegmentedPicker } from "./SegmentedPicker";
import { useMaybeControlledPatchField } from "./usePatchField";

const iconsByShapeLabel = {
  SAW: require("./assets/icon-rising-sawtooth-wave.png"),
  SQU: require("./assets/icon-square-wave.png"),
  SQR: require("./assets/icon-square-wave.png"),
  TRI: require("./assets/icon-triangle-wave.png"),
  SIN: require("./assets/icon-sine-wave.png"),
  SAW1: require("./assets/icon-rising-sawtooth-wave.png"),
  SAW2: require("./assets/icon-falling-sawtooth-wave.png"),
};

type WaveShapeLabel = keyof typeof iconsByShapeLabel;

export function PatchFieldWaveShapePicker<T extends WaveShapeLabel>({
  field,
  value: valueProp,
  onValueChange: onValueChangeProp,
}: {
  field: FieldReference<EnumField<{ [encoded: number]: T }>>;
  value?: T;
  onValueChange?: (value: T) => void;
}) {
  const [value, onValueChange] = useMaybeControlledPatchField(
    field,
    valueProp,
    onValueChangeProp
  );
  const values = useMemo(
    () =>
      Object.values(field.definition.type.labels).map((label) => ({
        value: label,
        icon: iconsByShapeLabel[label],
      })),
    [field]
  );
  return (
    <PatchFieldRow field={field}>
      <SegmentedPickerControl
        value={value}
        onValueChange={onValueChange}
        values={values}
      />
    </PatchFieldRow>
  );
}

function SegmentedPickerControl<T extends string>({
  value,
  onValueChange,
  values,
}: {
  value: T;
  onValueChange: (value: T) => void;
  values: readonly { value: T; icon: any }[];
}) {
  // const { isAssigned } = useContext(FieldRowContext);
  // TODO: Show assigned state when all controls can reliably handle long press etc
  const isAssigned = false;

  return (
    <SegmentedPicker
      style={PatchFieldStyles.fieldControlInner}
      onValueChange={onValueChange}
      value={value}
      values={values}
      tintColor={isAssigned ? "cornflowerblue" : undefined}
    />
  );
}

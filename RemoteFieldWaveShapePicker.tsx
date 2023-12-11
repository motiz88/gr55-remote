import { useMemo } from "react";

import { FieldStyles } from "./FieldStyles";
import { RemoteFieldRow } from "./RemoteFieldRow";
import { EnumField, FieldReference } from "./RolandAddressMap";
import { RolandRemotePageContext } from "./RolandRemotePageContext";
import { SegmentedPicker } from "./SegmentedPicker";
import { useMaybeControlledRemoteField } from "./useRemoteField";

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

export function RemoteFieldWaveShapePicker<T extends WaveShapeLabel>({
  page,
  field,
  value: valueProp,
  onValueChange: onValueChangeProp,
}: {
  page: RolandRemotePageContext;
  field: FieldReference<EnumField<{ [encoded: number]: T }>>;
  value?: T;
  onValueChange?: (value: T) => void;
}) {
  const [value, onValueChange, status] = useMaybeControlledRemoteField(
    page,
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

  const isPending = status === "pending";

  return (
    <RemoteFieldRow page={page} field={field}>
      <SegmentedPickerControl
        value={value}
        onValueChange={onValueChange}
        values={values}
        isPending={isPending}
      />
    </RemoteFieldRow>
  );
}

export function SegmentedPickerControl<T extends string>({
  value,
  onValueChange,
  values,
  isPending,
}: {
  value: T;
  onValueChange: (value: T) => void;
  values: readonly { value: T; icon: any }[];
  isPending: boolean;
}) {
  // const { isAssigned } = useContext(FieldRowContext);
  // TODO: Show assigned state when all controls can reliably handle long press etc
  const isAssigned = false;

  return (
    <SegmentedPicker
      style={FieldStyles.fieldControlInner}
      onValueChange={onValueChange}
      value={isPending ? undefined : value}
      values={values}
      tintColor={isAssigned ? "cornflowerblue" : undefined}
      disabled={isPending}
    />
  );
}

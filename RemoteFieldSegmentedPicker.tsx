import { useMemo } from "react";

import { FieldStyles } from "./FieldStyles";
import { RemoteFieldRow } from "./RemoteFieldRow";
import { EnumField, FieldReference } from "./RolandAddressMap";
import { RolandRemotePageContext } from "./RolandRemotePageContext";
import { SegmentedPicker } from "./SegmentedPicker";
import { useMaybeControlledRemoteField } from "./useRemoteField";

export function RemoteFieldSegmentedPicker<T extends string>({
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
    () => Object.values(field.definition.type.labels),
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

function SegmentedPickerControl<T extends string>({
  value,
  onValueChange,
  values,
  isPending,
}: {
  value: T;
  onValueChange: (value: T) => void;
  values: readonly T[];
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

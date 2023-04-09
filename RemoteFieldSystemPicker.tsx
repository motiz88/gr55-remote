import { useMemo } from "react";

import { FieldStyles } from "./FieldStyles";
import { RemoteFieldRow } from "./RemoteFieldRow";
import {
  EnumField,
  FieldReference,
  FieldType,
  isEnumFieldReference,
  isNumericFieldReference,
  NumericField,
} from "./RolandAddressMap";
import { RolandRemotePageContext } from "./RolandRemotePageContext";
import { ThemedPicker as Picker } from "./ThemedPicker";
import { useMaybeControlledRemoteField } from "./useRemoteField";

export function RemoteFieldSystemPicker<T extends number | string>({
  page,
  field,
  value: valueProp,
  onValueChange: onValueChangeProp,
}: {
  page: RolandRemotePageContext;
  field: FieldReference<
    FieldType<T> & (EnumField<{ [encoded: number]: string }> | NumericField)
  >;
  value?: T;
  onValueChange?: (value: T) => void;
}) {
  const [value, onValueChange] = useMaybeControlledRemoteField(
    page,
    field,
    valueProp,
    onValueChangeProp
  );
  const items = useMemo(() => {
    if (isEnumFieldReference(field)) {
      return Object.entries(field.definition.type.labels).map(
        ([encoded, label]) => (
          <Picker.Item label={label} key={encoded} value={label} />
        )
      );
    }
    if (!isNumericFieldReference(field)) {
      throw new Error("Expected enum or numeric field");
    }
    const items = [];
    for (
      let i = field.definition.type.min;
      i <= field.definition.type.max;
      i += field.definition.type.step
    ) {
      items.push(
        <Picker.Item
          label={field.definition.type.format(i)}
          key={i}
          value={i}
        />
      );
    }
    return items;
  }, [field]);
  return (
    <RemoteFieldRow page={page} field={field}>
      <PickerControl
        value={value}
        onValueChange={onValueChange}
        items={items}
      />
    </RemoteFieldRow>
  );
}

function PickerControl<T extends number | string>({
  value,
  onValueChange,
  items,
}: {
  value: T;
  onValueChange: (value: T) => void;
  items: readonly JSX.Element[];
}) {
  // const { isAssigned } = useContext(FieldRowContext);
  // TODO: Show assigned state when all controls can reliably handle long press etc
  const isAssigned = false;

  return (
    <Picker
      onValueChange={onValueChange}
      selectedValue={value}
      style={[
        FieldStyles.fieldControlInner,
        isAssigned && {
          borderColor: "cornflowerblue",
          borderWidth: 2,
          margin: -2,
          backgroundColor: "#6495ed22",
        },
      ]}
    >
      {items}
    </Picker>
  );
}

import { useMemo } from "react";

import { RemoteFieldRow } from "./RemoteFieldRow";
import { SegmentedPickerControl } from "./RemoteFieldWaveShapePicker";
import { EnumField, FieldReference } from "./RolandAddressMap";
import { RolandRemotePageContext } from "./RolandRemotePageContext";
import { useMaybeControlledRemoteField } from "./useRemoteField";

const iconsByCurveLabel = {
  FIX: null,
  // TODO: Better icons
  "1": require("./assets/gr55-velocity-curve-1.png"),
  "2": require("./assets/gr55-velocity-curve-2.png"),
  "3": require("./assets/gr55-velocity-curve-3.png"),
  "4": require("./assets/gr55-velocity-curve-4.png"),
  "5": require("./assets/gr55-velocity-curve-5.png"),
  "6": require("./assets/gr55-velocity-curve-6.png"),
  "7": require("./assets/gr55-velocity-curve-7.png"),
  TONE: null,
};

type VelocityCurveLabel = keyof typeof iconsByCurveLabel;

export function RemoteFieldVelocityCurvePicker<T extends VelocityCurveLabel>({
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
        icon: iconsByCurveLabel[label],
      })),
    [field]
  );

  const isPending = status === "pending";

  return (
    <RemoteFieldRow page={page} field={field}>
      {/* TODO: Non-segmented picker when there are too many options to fit on screen */}
      <SegmentedPickerControl
        value={value}
        onValueChange={onValueChange}
        values={values}
        isPending={isPending}
      />
    </RemoteFieldRow>
  );
}

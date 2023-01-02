import { RemoteFieldPicker } from "./RemoteFieldPicker";
import { RemoteFieldSlider } from "./RemoteFieldSlider";
import {
  FieldReference,
  isEnumFieldReference,
  isNumericFieldReference,
} from "./RolandAddressMap";
import { RolandRemotePageContext } from "./RolandRemotePageContext";

export function RemoteFieldDynamic({
  page,
  field,
}: {
  page: RolandRemotePageContext;
  field: FieldReference<any>;
}) {
  if (isNumericFieldReference(field)) {
    return <RemoteFieldSlider page={page} field={field} />;
  } else if (isEnumFieldReference(field)) {
    return <RemoteFieldPicker page={page} field={field} />;
  }
  throw new Error(
    "Could not render dynamic field " + field.definition.description
  );
}

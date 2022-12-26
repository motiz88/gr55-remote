import * as React from "react";

import {
  AtomReference,
  FieldDefinition,
  ParsedDataBag,
} from "./RolandAddressMap";

export const RolandRemotePatchContext = React.createContext<{
  patchData: undefined | ParsedDataBag;
  patchReadError: undefined | Error;
  patchReadStatus: undefined | "pending" | "resolved" | "rejected";
  reloadPatchData: () => void;
  localOverrides: ParsedDataBag;
  setLocalOverride: <T extends FieldDefinition<any>>(
    field: AtomReference<T>,
    value: ReturnType<T["type"]["decode"]>
  ) => void;
  subscribeToField: <T extends FieldDefinition<any>>(
    field: AtomReference<T>,
    listener: (value: ReturnType<T["type"]["decode"]>) => void
  ) => () => void;
}>({
  patchData: undefined,
  patchReadError: undefined,
  patchReadStatus: undefined,
  reloadPatchData: () => {},
  localOverrides: {},
  setLocalOverride: () => {},
  subscribeToField: () => () => {},
});

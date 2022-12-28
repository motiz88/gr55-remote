import * as React from "react";

import { AtomReference, FieldDefinition, RawDataBag } from "./RolandAddressMap";

export const RolandRemotePatchContext = React.createContext<{
  patchData: undefined | RawDataBag;
  patchReadError: undefined | Error;
  patchReadStatus: undefined | "pending" | "resolved" | "rejected";
  reloadPatchData: () => void;
  localOverrides: RawDataBag;
  setLocalOverride: <T extends FieldDefinition<any>>(
    field: AtomReference<T>,
    value: Uint8Array | ReturnType<T["type"]["decode"]>
  ) => void;
  setPatchField: <T extends FieldDefinition<any>>(
    field: AtomReference<T>,
    value: Uint8Array | ReturnType<T["type"]["decode"]>
  ) => void;
  subscribeToField: <T extends FieldDefinition<any>>(
    field: AtomReference<T>,
    listener: (valueBytes: Uint8Array) => void
  ) => () => void;
}>({
  patchData: undefined,
  patchReadError: undefined,
  patchReadStatus: undefined,
  reloadPatchData: () => {},
  localOverrides: {},
  setLocalOverride: () => {},
  setPatchField: () => {},
  subscribeToField: () => () => {},
});

import * as React from "react";

import { FieldDefinition, ParsedAtom, ParsedDataBag } from "./RolandAddressMap";

export const RolandRemotePatchContext = React.createContext<{
  patchData: undefined | [ParsedAtom<any>, ParsedDataBag];
  patchReadError: undefined | Error;
  patchReadStatus: undefined | "pending" | "resolved" | "rejected";
  reloadPatchData: () => void;
  localOverrides: ParsedDataBag;
  setLocalOverride: <T extends FieldDefinition<any>>(
    field: {
      address: number;
      definition: T;
    },
    value: ReturnType<T["type"]["decode"]>
  ) => void;
  subscribeToField: <T extends FieldDefinition<any>>(
    field: {
      address: number;
      definition: T;
    },
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

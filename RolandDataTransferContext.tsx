import * as React from "react";

import {
  AtomDefinition,
  AtomReference,
  FieldDefinition,
  ParsedAtom,
  ParsedDataBag,
} from "./RolandAddressMap";

export const RolandDataTransferContext = React.createContext<{
  requestData:
    | undefined
    | (<T extends AtomDefinition>(
        block: T,
        baseAddress?: number
      ) => Promise<[ParsedAtom<T>, ParsedDataBag]>);
  setField:
    | undefined
    | (<T extends FieldDefinition<any>>(
        field: AtomReference<T>,
        newValue: ReturnType<T["type"]["decode"]>
      ) => void);
}>({
  requestData: undefined,
  setField: undefined,
});

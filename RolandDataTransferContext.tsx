import * as React from "react";

import {
  AtomDefinition,
  AtomReference,
  FieldDefinition,
  RawDataBag,
} from "./RolandAddressMap";

export const RolandDataTransferContext = React.createContext<{
  requestData:
    | undefined
    | (<T extends AtomDefinition>(
        block: T,
        baseAddress?: number,
        signal?: AbortSignal
      ) => Promise<RawDataBag>);
  setField:
    | undefined
    | (<T extends FieldDefinition<any>>(
        field: AtomReference<T>,
        newValue: Uint8Array | ReturnType<T["type"]["decode"]>
      ) => void);
}>({
  requestData: undefined,
  setField: undefined,
});

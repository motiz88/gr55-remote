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
        signal?: AbortSignal,
        queueID?: string
      ) => Promise<RawDataBag>);
  setField:
    | undefined
    | (<T extends FieldDefinition<any>>(
        field: AtomReference<T>,
        newValue: Uint8Array | ReturnType<T["type"]["decode"]>
      ) => void);
  registerQueueAsPriority: (queueID: string) => void;
  unregisterQueueAsPriority: (queueID: string) => void;
}>({
  requestData: undefined,
  setField: undefined,
  registerQueueAsPriority: () => {},
  unregisterQueueAsPriority: () => {},
});

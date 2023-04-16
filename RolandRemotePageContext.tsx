import * as React from "react";

import { AtomReference, FieldDefinition, RawDataBag } from "./RolandAddressMap";

type RolandRemotePageState = {
  pageData: undefined | RawDataBag;
  pageReadError: undefined | Error;
  pageReadStatus: undefined | "pending" | "resolved" | "rejected";
  reloadData: () => void;
  localOverrides: RawDataBag;
  setLocalOverride: <T extends FieldDefinition<any>>(
    field: AtomReference<T>,
    value: Uint8Array | ReturnType<T["type"]["decode"]>
  ) => void;
  setRemoteField: <T extends FieldDefinition<any>>(
    field: AtomReference<T>,
    value: Uint8Array | ReturnType<T["type"]["decode"]>
  ) => void;
  subscribeToField: <T extends FieldDefinition<any>>(
    field: AtomReference<T>,
    listener: (valueBytes: Uint8Array) => void
  ) => () => void;
};

const rolandRemotePageEmptyState = {
  pageData: undefined,
  pageReadError: undefined,
  pageReadStatus: undefined,
  reloadData: () => {},
  localOverrides: {},
  setLocalOverride: () => {},
  setRemoteField: () => {},
  subscribeToField: () => () => {},
};

export const RolandRemotePatchContext =
  React.createContext<RolandRemotePageState>(rolandRemotePageEmptyState);

export const RolandRemoteSystemContext =
  React.createContext<RolandRemotePageState>(rolandRemotePageEmptyState);

export const RolandRemoteSetupContext =
  React.createContext<RolandRemotePageState>(rolandRemotePageEmptyState);

export type RolandRemotePageContext =
  | typeof RolandRemotePatchContext
  | typeof RolandRemoteSystemContext
  | typeof RolandRemoteSetupContext;

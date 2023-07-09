import * as React from "react";

import { AtomReference, FieldDefinition, RawDataBag } from "./RolandAddressMap";

export type RolandRemotePageState = {
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
    value: Uint8Array,
    previousValue: Uint8Array | void
  ) => void;
  subscribeToField: <T extends FieldDefinition<any>>(
    field: AtomReference<T>,
    listener: (valueBytes: Uint8Array) => void
  ) => () => void;
};

type RolandRemotePatchState = RolandRemotePageState & {
  isModifiedSinceSave: boolean;
  setModifiedSinceSave: (value: boolean) => void;
  saveAndSelectUserPatch: (userPatchNumber: number) => Promise<void>;
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

const rolandRemotePatchEmptyState = {
  ...rolandRemotePageEmptyState,
  isModifiedSinceSave: false,
  setModifiedSinceSave: () => {},
  saveAndSelectUserPatch: async () => {},
};

export const RolandRemotePatchContext =
  React.createContext<RolandRemotePatchState>(rolandRemotePatchEmptyState);

export const RolandRemoteSystemContext =
  React.createContext<RolandRemotePageState>(rolandRemotePageEmptyState);

export const RolandRemoteSetupContext =
  React.createContext<RolandRemotePageState>(rolandRemotePageEmptyState);

export type RolandRemotePageContext =
  | typeof RolandRemotePatchContext
  | typeof RolandRemoteSystemContext
  | typeof RolandRemoteSetupContext;

import { useCallback, useContext, useEffect, useMemo } from "react";

import { createEditHistory } from "./EditHistory";
import {
  AtomReference,
  FieldDefinition,
  FieldType,
  encode,
} from "./RolandAddressMap";
import { RolandRemotePatchContext as PATCH } from "./RolandRemotePageContext";
import { RolandRemotePageEditHistoryRegistryProvider } from "./RolandRemotePageEditHistoryRegistry";
import { useRolandRemotePatchSelection } from "./RolandRemotePatchSelection";
import { useUserOptions } from "./UserOptions";
import { usePrevious } from "./usePrevious";

type SetRemoteFieldAction<T extends FieldDefinition<any>> = {
  type: "setRemoteField";
  field: AtomReference<T>;
  fromValue: Uint8Array;
  toValue: Uint8Array;
};

type Action = SetRemoteFieldAction<FieldDefinition<FieldType<unknown>>>;

const { Container, useEditHistory } = createEditHistory<Action>();

function RolandRemotePatchEditHistoryMiddleware({
  children,
}: {
  children: React.ReactNode;
}) {
  const editHistory = useEditHistory();
  const { push: pushToHistory, clear: clearHistory } = editHistory;
  const remotePatchState = useContext(PATCH);
  const { reloadData: reloadDataImpl, setRemoteField: setRemoteFieldImpl } =
    remotePatchState;

  const { selectedPatch } = useRolandRemotePatchSelection();
  const previousPatch = usePrevious(selectedPatch);
  useEffect(() => {
    if (!selectedPatch) {
      return;
    }
    if (
      previousPatch?.bankSelectMSB !== selectedPatch.bankSelectMSB ||
      previousPatch?.pc !== selectedPatch.pc
    ) {
      clearHistory();
    }
  }, [selectedPatch, previousPatch, clearHistory]);

  const setRemoteField = useCallback(
    <T extends FieldDefinition<FieldType<any>>>(
      field: AtomReference<T>,
      value: Uint8Array,
      previousValue: Uint8Array | void
    ) => {
      if (!previousValue || !equals(previousValue, value)) {
        pushToHistory({
          type: "setRemoteField",
          field,
          fromValue:
            previousValue ??
            // TODO: Maybe remove this and avoid pushing actions for fields that haven't been read yet?
            encode(field.definition.type.emptyValue, field.definition.type),
          toValue: value,
        });
      }
      setRemoteFieldImpl(field, value, previousValue);
    },
    [pushToHistory, setRemoteFieldImpl]
  );

  const reloadData = useCallback(() => {
    clearHistory();
    reloadDataImpl();
  }, [clearHistory, reloadDataImpl]);

  const remotePatchStateWithEditHistory = useMemo(
    () => ({
      ...remotePatchState,
      setRemoteField,
      reloadData,
    }),
    [reloadData, remotePatchState, setRemoteField]
  );

  return (
    <PATCH.Provider value={remotePatchStateWithEditHistory}>
      <RolandRemotePageEditHistoryRegistryProvider
        page={PATCH}
        editHistory={editHistory}
      >
        {children}
      </RolandRemotePageEditHistoryRegistryProvider>
    </PATCH.Provider>
  );
}

function onMergeActions(
  previousAction: Action,
  nextAction: Action
): Action | void {
  if (
    previousAction.type === "setRemoteField" &&
    nextAction.type === "setRemoteField" &&
    previousAction.field === nextAction.field
  ) {
    return {
      ...nextAction,
      fromValue: previousAction.fromValue,
    };
  }
}

export function RolandRemotePatchEditHistoryContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const remotePatchState = useContext(PATCH);
  const onUndoAction = useCallback(
    (action: Action) => {
      // TODO: If possible, reset isModifiedSinceSave when rolling back to a state that was saved to begin with.
      if (action.type === "setRemoteField") {
        remotePatchState.setRemoteField(action.field, action.fromValue);
      }
    },
    [remotePatchState]
  );
  const onRedoAction = useCallback(
    (action: Action) => {
      if (action.type === "setRemoteField") {
        remotePatchState.setRemoteField(action.field, action.toValue);
      }
    },
    [remotePatchState]
  );
  const [{ enableExperimentalFeatures }] = useUserOptions();
  if (!enableExperimentalFeatures) {
    return <>{children}</>;
  }
  return (
    <Container
      onMergeActions={onMergeActions}
      onRedoAction={onRedoAction}
      onUndoAction={onUndoAction}
    >
      <RolandRemotePatchEditHistoryMiddleware>
        {children}
      </RolandRemotePatchEditHistoryMiddleware>
    </Container>
  );
}

export { useEditHistory as useRolandRemotePatchEditHistory };

function equals(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

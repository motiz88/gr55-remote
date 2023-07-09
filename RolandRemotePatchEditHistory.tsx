import { useCallback, useContext, useEffect } from "react";

import { createEditHistory } from "./EditHistory";
import {
  AtomReference,
  FieldDefinition,
  FieldType,
  encode,
} from "./RolandAddressMap";
import { RolandDataTransferContext } from "./RolandDataTransfer";
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
  const remotePatchState = useContext(PATCH);

  const { setField } = useContext(RolandDataTransferContext);
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
      editHistory.clear();
    }
  }, [selectedPatch, previousPatch, editHistory]);

  const setRemoteField = useCallback(
    <T extends FieldDefinition<FieldType<any>>>(
      field: AtomReference<T>,
      value: Uint8Array,
      previousValue: Uint8Array | void
    ) => {
      remotePatchState.setLocalOverride(field, value);
      if (!previousValue || !equals(previousValue, value)) {
        editHistory.push({
          type: "setRemoteField",
          field,
          fromValue:
            previousValue ??
            // TODO: Maybe remove this and avoid pushing actions for fields that haven't been read yet?
            encode(field.definition.type.emptyValue, field.definition.type),
          toValue: value,
        });
      }
      setField?.(field, value);
    },
    [remotePatchState, editHistory, setField]
  );

  const reloadData = useCallback(() => {
    editHistory.clear();
    remotePatchState.reloadData();
  }, [editHistory, remotePatchState]);

  const remotePatchStateWithEditHistory = {
    ...remotePatchState,
    setRemoteField,
    reloadData,
  };

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
    console.log(
      "RolandRemotePatchEditHistory: Merging setRemoteField actions",
      {
        previousAction,
        nextAction,
      }
    );
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

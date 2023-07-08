import { useCallback, useContext, useEffect } from "react";

import { createEditHistory } from "./EditHistory";
import { AtomReference, FieldDefinition, FieldType } from "./RolandAddressMap";
import { RolandDataTransferContext } from "./RolandDataTransfer";
import { RolandRemotePatchContext as PATCH } from "./RolandRemotePageContext";
import { useRolandRemotePatchSelection } from "./RolandRemotePatchSelection";
import { useUserOptions } from "./UserOptions";
import { usePrevious } from "./usePrevious";

type SetRemoteFieldAction<T extends FieldDefinition<any>> = {
  type: "setRemoteField";
  field: AtomReference<T>;
  fromValue: Uint8Array | ReturnType<T["type"]["decode"]>;
  toValue: Uint8Array | ReturnType<T["type"]["decode"]>;
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

  const { requestData, setField } = useContext(RolandDataTransferContext);
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
    <T extends FieldDefinition<any>>(
      field: AtomReference<T>,
      value: Uint8Array | ReturnType<T["type"]["decode"]>
    ) => {
      // Set the local override synchronously so that the UI updates immediately.
      remotePatchState.setLocalOverride(field, value);
      if (requestData) {
        // Request the new value on the write queue (!) in order to get an accurate
        // base state for undo purposes.
        // TODO: Remove this slow round-trip to the remote device and use the last value from the UI instead.
        requestData(
          field.definition,
          field.address,
          undefined,
          "write_utmost"
        ).then((data) => {
          // TODO: Merge into the last action (automatic transaction?) if they both have the same fromValue.
          // Alternatively maybe just implementing transactions in the UI is enough.
          editHistory.push({
            type: "setRemoteField",
            field,
            fromValue: data[field.address],
            toValue: value,
          });
          setField?.(field, value);
        });
      } else {
        setField?.(field, value);
      }
    },
    [remotePatchState, requestData, editHistory, setField]
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
      {children}
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

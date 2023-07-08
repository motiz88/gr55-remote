import invariant from "invariant";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react";

type EditHistoryAPIType<ActionT> = {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  startTransaction: () => void;
  endTransaction: () => void;
  push: (action: ActionT) => void;
};

type EditHistoryEntry<ActionT> = Readonly<{ actions: readonly ActionT[] }>;

type EditHistoryInternalState<ActionT> = Readonly<{
  history: readonly EditHistoryEntry<ActionT>[];
  activeEntryIndex: number;
  transactionState: null | {
    readonly actions: ActionT[];
  };
  transactionDepth: number;
}>;

function wrapWithLog<T extends (...args: any[]) => any>(fn: T): T {
  return ((...args: any[]) => {
    // console.log(
    //   `Calling ${fn.name} with`,
    //   require("util").inspect(args, { depth: 10 })
    // );
    const result = fn(...args);
    // console.log(
    //   `Result of ${fn.name} is`,
    //   require("util").inspect(result, { depth: 10 })
    // );
    return result;
  }) as any;
}

function internalReducer<ActionT>(
  state: EditHistoryInternalState<ActionT>,
  op:
    | {
        type: "push";
        action: ActionT;
        onMergeActions?: (a: ActionT, b: ActionT) => ActionT | void;
      }
    | { type: "undo" }
    | { type: "redo" }
    | { type: "startTransaction" }
    | { type: "endTransaction" }
): EditHistoryInternalState<ActionT> {
  if (__DEV__) {
    invariant(state.transactionDepth >= 0, "transactionDepth >= 0");
    invariant(
      state.transactionDepth >= 1 === !!state.transactionState,
      "transactionDepth >= 1 === !!transactionState"
    );
  }
  switch (op.type) {
    case "push":
      if (state.transactionState) {
        // Try to merge into the last action in the transaction
        const lastAction =
          state.transactionState.actions[
            state.transactionState.actions.length - 1
          ];
        const mergedAction =
          lastAction != null && op.onMergeActions
            ? op.onMergeActions(lastAction, op.action)
            : undefined;
        if (mergedAction) {
          return {
            ...state,
            transactionState: {
              ...state.transactionState,
              actions: [
                ...state.transactionState.actions.slice(0, -1),
                mergedAction,
              ],
            },
          };
        }
        // Otherwise, just append to the transaction
        return {
          ...state,
          transactionState: {
            ...state.transactionState,
            actions: [...state.transactionState.actions, op.action],
          },
        };
      }
      return {
        ...state,
        history: [
          ...state.history.slice(0, state.activeEntryIndex + 1),
          { actions: [op.action] },
        ],
        activeEntryIndex: state.activeEntryIndex + 1,
      };
    case "undo":
      if (state.activeEntryIndex <= -1) {
        return state;
      }
      // Prevent undo in the middle of a transaction
      if (state.transactionState) {
        if (__DEV__) {
          console.warn(
            `Attempted to ${op.type} in the middle of a transaction, ignoring`
          );
        }
        return state;
      }
      return {
        ...state,
        activeEntryIndex: state.activeEntryIndex - 1,
      };
    case "redo":
      if (state.activeEntryIndex >= state.history.length - 1) {
        return state;
      }
      // Prevent redo in the middle of a transaction
      if (state.transactionState) {
        if (__DEV__) {
          console.warn(
            `Attempted to ${op.type} in the middle of a transaction, ignoring`
          );
        }
        return state;
      }
      return {
        ...state,
        activeEntryIndex: state.activeEntryIndex + 1,
      };
    case "startTransaction":
      if (state.transactionState) {
        return {
          ...state,
          transactionDepth: state.transactionDepth + 1,
        };
      }
      return {
        ...state,
        transactionState: {
          actions: [],
        },
        transactionDepth: 1,
      };
    case "endTransaction":
      if (!state.transactionState) {
        return state;
      }
      if (state.transactionDepth > 1) {
        return {
          ...state,
          transactionDepth: state.transactionDepth - 1,
        };
      }
      // Push the transaction as a single entry
      return {
        ...state,
        history: [
          ...state.history.slice(0, state.activeEntryIndex + 1),
          state.transactionState,
        ],
        activeEntryIndex: state.activeEntryIndex + 1,
        transactionState: null,
        transactionDepth: 0,
      };
  }
}

function useEditHistoryImpl<ActionT>(
  options: Readonly<{
    onMergeActions?: (
      previousAction: ActionT,
      nextAction: ActionT
    ) => ActionT | void;
    onRedoAction?: (action: ActionT) => void;
    onUndoAction?: (action: ActionT) => void;
  }>
) {
  const [state, dispatch] = useReducer(wrapWithLog(internalReducer<ActionT>), {
    history: [],
    activeEntryIndex: -1,
    transactionState: null,
    transactionDepth: 0,
  });

  const isInTransaction = state.transactionDepth > 0;

  const undo = useCallback(() => {
    // Fire onUndoAction for each action in the entry in reverse order, if not in a transaction
    if (
      !isInTransaction &&
      options.onUndoAction &&
      state.activeEntryIndex >= 0
    ) {
      for (
        let i = state.history[state.activeEntryIndex].actions.length - 1;
        i >= 0;
        i--
      ) {
        const action = state.history[state.activeEntryIndex].actions[i];
        options.onUndoAction(action);
      }
    }
    dispatch({ type: "undo" });
  }, [options, state.activeEntryIndex, state.history, isInTransaction]);

  const redo = useCallback(() => {
    // Fire onRedoAction for each action in the entry, if not in a transaction
    if (
      !isInTransaction &&
      options.onRedoAction &&
      state.activeEntryIndex + 1 < state.history.length
    ) {
      for (const action of state.history[state.activeEntryIndex + 1].actions) {
        options.onRedoAction(action);
      }
    }
    dispatch({ type: "redo" });
  }, [isInTransaction, options, state.activeEntryIndex, state.history]);
  const canUndo = state.activeEntryIndex >= 0;
  const canRedo = state.activeEntryIndex < state.history.length - 1;
  const startTransaction = useCallback(() => {
    dispatch({ type: "startTransaction" });
  }, []);
  const endTransaction = useCallback(() => {
    dispatch({ type: "endTransaction" });
  }, []);
  const push = useCallback(
    (action: ActionT) => {
      dispatch({
        type: "push",
        action,
        onMergeActions: options.onMergeActions,
      });
    },
    [options.onMergeActions]
  );
  return useMemo(
    () => ({
      undo,
      redo,
      canUndo,
      canRedo,
      startTransaction,
      endTransaction,
      push,
    }),
    [undo, redo, canUndo, canRedo, startTransaction, endTransaction, push]
  );
}

export function createEditHistory<ActionT>() {
  const EditHistoryAPI = createContext<EditHistoryAPIType<ActionT>>({
    undo: () => {},
    redo: () => {},
    canUndo: false,
    canRedo: false,
    startTransaction: () => {},
    endTransaction: () => {},
    push: () => {},
  });

  function useEditHistory() {
    return useContext(EditHistoryAPI);
  }

  function Container({
    children,
    onMergeActions,
    onRedoAction,
    onUndoAction,
  }: Readonly<{
    onRedoAction?: (action: ActionT) => void;
    onUndoAction?: (action: ActionT) => void;
    onMergeActions?: (
      previousAction: ActionT,
      nextAction: ActionT
    ) => ActionT | void;
    children: React.ReactNode;
  }>) {
    const ctx = useEditHistoryImpl<ActionT>({
      onMergeActions,
      onRedoAction,
      onUndoAction,
    });
    return (
      <EditHistoryAPI.Provider value={ctx}>{children}</EditHistoryAPI.Provider>
    );
  }

  return {
    useEditHistory,
    Container,
  };
}

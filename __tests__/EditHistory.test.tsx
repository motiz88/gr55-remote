import React, { Dispatch, SetStateAction, useEffect } from "react";
import { create, act, ReactTestRenderer } from "react-test-renderer";

import { createEditHistory } from "../EditHistory";

// Define actions for the purpose of this test
type TestAction =
  | { type: "assign"; from: number; to: number }
  | { type: "multiply"; by: number };

type TestEditHistory = ReturnType<typeof createEditHistory<TestAction>>;

describe("EditHistory", () => {
  let Container: TestEditHistory["Container"];
  let useEditHistory: TestEditHistory["useEditHistory"];

  const TestContext = React.createContext<
    [number, Dispatch<SetStateAction<number>>, number]
  >([NaN, () => {}, NaN]);

  const onMergeActions = jest.fn(
    (previousAction: TestAction, nextAction: TestAction): TestAction | void => {
      if (previousAction.type !== nextAction.type) {
        return;
      }
      switch (previousAction.type) {
        case "assign":
          return {
            type: "assign",
            from: previousAction.from,
            to: (nextAction as typeof previousAction).to,
          };
        case "multiply":
          return {
            type: "multiply",
            by: previousAction.by * (nextAction as typeof previousAction).by,
          };
      }
    }
  );

  const Test = ({ children }: { children: React.ReactNode }) => {
    const [state, setState] = React.useState(0);
    const [committedState, setCommittedState] = React.useState(0);
    const onRedoAction = React.useCallback((action: TestAction) => {
      // console.log("redo", action);
      switch (action.type) {
        case "assign":
          setState(action.to);
          setCommittedState(action.to);
          break;
        case "multiply":
          setState((s) => s * action.by);
          setCommittedState((s) => s * action.by);
          break;
      }
    }, []);
    const onUndoAction = React.useCallback((action: TestAction) => {
      // console.log("undo", action);
      switch (action.type) {
        case "assign":
          setState(action.from);
          setCommittedState(action.from);
          break;
        case "multiply":
          setState((s) => s / action.by);
          setCommittedState((s) => s / action.by);
          break;
      }
    }, []);
    const onCommitAction = React.useCallback((action: TestAction) => {
      // console.log("commit", action);
      switch (action.type) {
        case "assign":
          setCommittedState(action.to);
          break;
        case "multiply":
          setCommittedState((s) => s * action.by);
          break;
      }
    }, []);
    return (
      <Container
        onRedoAction={onRedoAction}
        onUndoAction={onUndoAction}
        onMergeActions={onMergeActions}
        onCommitAction={onCommitAction}
      >
        <TestContext.Provider value={[state, setState, committedState]}>
          {children}
        </TestContext.Provider>
      </Container>
    );
  };

  const UI = () => {
    const editHistoryAPI = useEditHistory();
    return (
      <>
        {editHistoryAPI.canUndo ? "Can undo" : "Cannot undo"}
        {editHistoryAPI.canRedo ? "Can redo" : "Cannot redo"}
      </>
    );
  };

  const Reader = () => {
    const [state] = React.useContext(TestContext);
    // console.log({ state });
    return <>{state}</>;
  };

  const CommittedReader = () => {
    const [, , committedState] = React.useContext(TestContext);
    // console.log({ committedState });
    return <>{committedState}</>;
  };

  const AssignOnce = ({ value }: { value: number }) => {
    const [state, setState] = React.useContext(TestContext);
    const editHistoryAPI = useEditHistory();
    const assign = React.useCallback(
      (to: number) => {
        // console.log("assigning", { to });
        setState(to);
        editHistoryAPI.push({
          type: "assign",
          from: state,
          to,
        });
      },
      [editHistoryAPI, setState, state]
    );
    useEffect(() => {
      assign(value);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return null;
  };

  const MultiplyOnce = ({ by }: { by: number }) => {
    const [, setState] = React.useContext(TestContext);
    const editHistoryAPI = useEditHistory();
    const multiply = React.useCallback(
      (by: number) => {
        setState((s) => s * by);
        editHistoryAPI.push({
          type: "multiply",
          by,
        });
      },
      [editHistoryAPI, setState]
    );
    useEffect(() => {
      multiply(by);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return null;
  };

  const UndoOnce = () => {
    const editHistoryAPI = useEditHistory();
    useEffect(() => {
      editHistoryAPI.undo();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return null;
  };

  const RedoOnce = () => {
    const editHistoryAPI = useEditHistory();
    useEffect(() => {
      editHistoryAPI.redo();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return null;
  };

  const StartTransactionOnce = () => {
    const editHistoryAPI = useEditHistory();
    useEffect(() => {
      editHistoryAPI.startTransaction();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return null;
  };

  const EndTransactionOnce = () => {
    const editHistoryAPI = useEditHistory();
    useEffect(() => {
      editHistoryAPI.endTransaction();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return null;
  };

  const ClearOnce = () => {
    const editHistoryAPI = useEditHistory();
    useEffect(() => {
      editHistoryAPI.clear();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return null;
  };

  beforeEach(() => {
    ({ Container, useEditHistory } = createEditHistory<TestAction>());

    jest.clearAllMocks();
  });

  test("performs undo and redo", () => {
    let root: ReactTestRenderer;
    act(() => {
      root = create(
        <Test>
          State: <Reader />
          Committed: <CommittedReader />
          <UI />
        </Test>
      );
    });
    expect(root!.toJSON()).toEqual([
      "State: ",
      "0",
      "Committed: ",
      "0",
      "Cannot undo",
      "Cannot redo",
    ]);

    act(() => {
      root!.update(
        <Test>
          State: <Reader />
          Committed: <CommittedReader />
          <UI />
          <UndoOnce />
        </Test>
      );
    });
    expect(root!.toJSON()).toEqual([
      "State: ",
      "0",
      "Committed: ",
      "0",
      "Cannot undo",
      "Cannot redo",
    ]);

    act(() => {
      root!.update(
        <Test>
          State: <Reader />
          Committed: <CommittedReader />
          <UI />
          <AssignOnce value={42} />
        </Test>
      );
    });

    expect(root!.toJSON()).toEqual([
      "State: ",
      "42",
      "Committed: ",
      "42",
      "Can undo",
      "Cannot redo",
    ]);

    act(() => {
      root!.update(
        <Test>
          State: <Reader />
          Committed: <CommittedReader />
          <UI />
          <UndoOnce />
        </Test>
      );
    });

    expect(root!.toJSON()).toEqual([
      "State: ",
      "0",
      "Committed: ",
      "0",
      "Cannot undo",
      "Can redo",
    ]);

    act(() => {
      root!.update(
        <Test>
          State: <Reader />
          Committed: <CommittedReader />
          <UI />
          <RedoOnce />
        </Test>
      );
    });

    expect(root!.toJSON()).toEqual([
      "State: ",
      "42",
      "Committed: ",
      "42",
      "Can undo",
      "Cannot redo",
    ]);

    // Try redoing again - noop

    act(() => {
      root!.update(
        <Test>
          State: <Reader />
          Committed: <CommittedReader />
          <UI />
          <RedoOnce key="force1" />
        </Test>
      );
    });

    expect(root!.toJSON()).toEqual([
      "State: ",
      "42",
      "Committed: ",
      "42",
      "Can undo",
      "Cannot redo",
    ]);

    act(() => {
      root!.update(
        <Test>
          State: <Reader />
          Committed: <CommittedReader />
          <UI />
          <MultiplyOnce by={2} />
          <MultiplyOnce by={50} />
        </Test>
      );
    });

    expect(root!.toJSON()).toEqual([
      "State: ",
      "4200",
      "Committed: ",
      "4200",
      "Can undo",
      "Cannot redo",
    ]);

    act(() => {
      root!.update(
        <Test>
          State: <Reader />
          Committed: <CommittedReader />
          <UI />
          <UndoOnce />
        </Test>
      );
    });

    expect(root!.toJSON()).toEqual([
      "State: ",
      "84",
      "Committed: ",
      "84",
      "Can undo",
      "Can redo",
    ]);

    act(() => {
      root!.update(
        <Test>
          State: <Reader />
          Committed: <CommittedReader />
          <UI />
          <MultiplyOnce by={500} />
        </Test>
      );
    });

    expect(root!.toJSON()).toEqual([
      "State: ",
      "42000",
      "Committed: ",
      "42000",
      "Can undo",
      "Cannot redo",
    ]);

    act(() => {
      root!.update(
        <Test>
          State: <Reader />
          Committed: <CommittedReader />
          <UI />
          <UndoOnce />
        </Test>
      );
    });

    expect(root!.toJSON()).toEqual([
      "State: ",
      "84",
      "Committed: ",
      "84",
      "Can undo",
      "Can redo",
    ]);

    act(() => {
      root!.update(
        <Test>
          State: <Reader />
          Committed: <CommittedReader />
          <UI />
          <UndoOnce key="force" />
        </Test>
      );
    });

    expect(root!.toJSON()).toEqual([
      "State: ",
      "42",
      "Committed: ",
      "42",
      "Can undo",
      "Can redo",
    ]);

    act(() => {
      root!.update(
        <Test>
          State: <Reader />
          Committed: <CommittedReader />
          <UI />
          <UndoOnce key="force2" />
        </Test>
      );
    });

    expect(root!.toJSON()).toEqual([
      "State: ",
      "0",
      "Committed: ",
      "0",
      "Cannot undo",
      "Can redo",
    ]);

    // Advance and then clear
    act(() => {
      root!.update(
        <Test>
          State: <Reader />
          Committed: <CommittedReader />
          <UI />
          <RedoOnce />
        </Test>
      );
    });

    expect(root!.toJSON()).toEqual([
      "State: ",
      "42",
      "Committed: ",
      "42",
      "Can undo",
      "Can redo",
    ]);

    act(() => {
      root!.update(
        <Test>
          State: <Reader />
          Committed: <CommittedReader />
          <UI />
          <ClearOnce />
        </Test>
      );
    });

    expect(root!.toJSON()).toEqual([
      "State: ",
      "42",
      "Committed: ",
      "42",
      "Cannot undo",
      "Cannot redo",
    ]);

    act(() => {
      root!.update(
        <Test>
          State: <Reader />
          Committed: <CommittedReader />
          <UI />
          <UndoOnce />
        </Test>
      );
    });

    expect(root!.toJSON()).toEqual([
      "State: ",
      "42",
      "Committed: ",
      "42",
      "Cannot undo",
      "Cannot redo",
    ]);
  });

  test("transactions", () => {
    let root: ReactTestRenderer;
    act(() => {
      root = create(
        <Test>
          State: <Reader />
          Committed: <CommittedReader />
          <UI />
          <StartTransactionOnce />
        </Test>
      );
    });
    expect(root!.toJSON()).toEqual([
      "State: ",
      "0",
      "Committed: ",
      "0",
      "Cannot undo",
      "Cannot redo",
    ]);

    act(() => {
      root!.update(
        <Test>
          State: <Reader />
          Committed: <CommittedReader />
          <UI />
          <AssignOnce value={42} />
        </Test>
      );
    });

    expect(root!.toJSON()).toEqual([
      "State: ",
      "42",
      "Committed: ",
      "0",
      "Cannot undo",
      "Cannot redo",
    ]);

    act(() => {
      root!.update(
        <Test>
          State: <Reader />
          Committed: <CommittedReader />
          <UI />
          <AssignOnce value={1010} key="force" />
        </Test>
      );
    });

    expect(root!.toJSON()).toEqual([
      "State: ",
      "1010",
      "Committed: ",
      "0",
      "Cannot undo",
      "Cannot redo",
    ]);

    act(() => {
      root!.update(
        <Test>
          State: <Reader />
          Committed: <CommittedReader />
          <UI />
          <MultiplyOnce by={2} />
        </Test>
      );
    });

    expect(root!.toJSON()).toEqual([
      "State: ",
      "2020",
      "Committed: ",
      "0",
      "Cannot undo",
      "Cannot redo",
    ]);

    act(() => {
      root!.update(
        <Test>
          State: <Reader />
          Committed: <CommittedReader />
          <UI />
          <EndTransactionOnce />
        </Test>
      );
    });

    expect(root!.toJSON()).toEqual([
      "State: ",
      "2020",
      "Committed: ",
      "2020",
      "Can undo",
      "Cannot redo",
    ]);

    act(() => {
      root!.update(
        <Test>
          State: <Reader />
          Committed: <CommittedReader />
          <UI />
          <UndoOnce />
        </Test>
      );
    });

    expect(root!.toJSON()).toEqual([
      "State: ",
      "0",
      "Committed: ",
      "0",
      "Cannot undo",
      "Can redo",
    ]);

    act(() => {
      root!.update(
        <Test>
          State: <Reader />
          Committed: <CommittedReader />
          <UI />
          <RedoOnce />
        </Test>
      );
    });

    expect(root!.toJSON()).toEqual([
      "State: ",
      "2020",
      "Committed: ",
      "2020",
      "Can undo",
      "Cannot redo",
    ]);
  });
});

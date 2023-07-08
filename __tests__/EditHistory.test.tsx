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
    [number, Dispatch<SetStateAction<number>>]
  >([NaN, () => {}]);

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
    const onRedoAction = React.useCallback((action: TestAction) => {
      // console.log("redo", action);
      switch (action.type) {
        case "assign":
          setState(action.to);
          break;
        case "multiply":
          setState((s) => s * action.by);
          break;
      }
    }, []);
    const onUndoAction = React.useCallback((action: TestAction) => {
      // console.log("undo", action);
      switch (action.type) {
        case "assign":
          setState(action.from);
          break;
        case "multiply":
          setState((s) => s / action.by);
          break;
      }
    }, []);
    return (
      <Container
        onRedoAction={onRedoAction}
        onUndoAction={onUndoAction}
        onMergeActions={onMergeActions}
      >
        <TestContext.Provider value={[state, setState]}>
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
          <UI />
        </Test>
      );
    });
    expect(root!.toJSON()).toEqual([
      "State: ",
      "0",
      "Cannot undo",
      "Cannot redo",
    ]);

    act(() => {
      root!.update(
        <Test>
          State: <Reader />
          <UI />
          <UndoOnce />
        </Test>
      );
    });
    expect(root!.toJSON()).toEqual([
      "State: ",
      "0",
      "Cannot undo",
      "Cannot redo",
    ]);

    act(() => {
      root!.update(
        <Test>
          State: <Reader />
          <UI />
          <AssignOnce value={42} />
        </Test>
      );
    });

    expect(root!.toJSON()).toEqual([
      "State: ",
      "42",
      "Can undo",
      "Cannot redo",
    ]);

    act(() => {
      root!.update(
        <Test>
          State: <Reader />
          <UI />
          <UndoOnce />
        </Test>
      );
    });

    expect(root!.toJSON()).toEqual(["State: ", "0", "Cannot undo", "Can redo"]);

    act(() => {
      root!.update(
        <Test>
          State: <Reader />
          <UI />
          <RedoOnce />
        </Test>
      );
    });

    expect(root!.toJSON()).toEqual([
      "State: ",
      "42",
      "Can undo",
      "Cannot redo",
    ]);

    // Try redoing again - noop

    act(() => {
      root!.update(
        <Test>
          State: <Reader />
          <UI />
          <RedoOnce key="force1" />
        </Test>
      );
    });

    expect(root!.toJSON()).toEqual([
      "State: ",
      "42",
      "Can undo",
      "Cannot redo",
    ]);

    act(() => {
      root!.update(
        <Test>
          State: <Reader />
          <UI />
          <MultiplyOnce by={2} />
          <MultiplyOnce by={50} />
        </Test>
      );
    });

    expect(root!.toJSON()).toEqual([
      "State: ",
      "4200",
      "Can undo",
      "Cannot redo",
    ]);

    act(() => {
      root!.update(
        <Test>
          State: <Reader />
          <UI />
          <UndoOnce />
        </Test>
      );
    });

    expect(root!.toJSON()).toEqual(["State: ", "84", "Can undo", "Can redo"]);

    act(() => {
      root!.update(
        <Test>
          State: <Reader />
          <UI />
          <MultiplyOnce by={500} />
        </Test>
      );
    });

    expect(root!.toJSON()).toEqual([
      "State: ",
      "42000",
      "Can undo",
      "Cannot redo",
    ]);

    act(() => {
      root!.update(
        <Test>
          State: <Reader />
          <UI />
          <UndoOnce />
        </Test>
      );
    });

    expect(root!.toJSON()).toEqual(["State: ", "84", "Can undo", "Can redo"]);

    act(() => {
      root!.update(
        <Test>
          State: <Reader />
          <UI />
          <UndoOnce key="force" />
        </Test>
      );
    });

    expect(root!.toJSON()).toEqual(["State: ", "42", "Can undo", "Can redo"]);

    act(() => {
      root!.update(
        <Test>
          State: <Reader />
          <UI />
          <UndoOnce key="force2" />
        </Test>
      );
    });

    expect(root!.toJSON()).toEqual(["State: ", "0", "Cannot undo", "Can redo"]);
  });

  test("transactions", () => {
    let root: ReactTestRenderer;
    act(() => {
      root = create(
        <Test>
          State: <Reader />
          <UI />
          <StartTransactionOnce />
        </Test>
      );
    });
    expect(root!.toJSON()).toEqual([
      "State: ",
      "0",
      "Cannot undo",
      "Cannot redo",
    ]);

    act(() => {
      root!.update(
        <Test>
          State: <Reader />
          <UI />
          <AssignOnce value={42} />
        </Test>
      );
    });

    expect(root!.toJSON()).toEqual([
      "State: ",
      "42",
      "Cannot undo",
      "Cannot redo",
    ]);

    act(() => {
      root!.update(
        <Test>
          State: <Reader />
          <UI />
          <AssignOnce value={1010} key="force" />
        </Test>
      );
    });

    expect(root!.toJSON()).toEqual([
      "State: ",
      "1010",
      "Cannot undo",
      "Cannot redo",
    ]);

    act(() => {
      root!.update(
        <Test>
          State: <Reader />
          <UI />
          <MultiplyOnce by={2} />
        </Test>
      );
    });

    expect(root!.toJSON()).toEqual([
      "State: ",
      "2020",
      "Cannot undo",
      "Cannot redo",
    ]);

    act(() => {
      root!.update(
        <Test>
          State: <Reader />
          <UI />
          <EndTransactionOnce />
        </Test>
      );
    });

    expect(root!.toJSON()).toEqual([
      "State: ",
      "2020",
      "Can undo",
      "Cannot redo",
    ]);

    act(() => {
      root!.update(
        <Test>
          State: <Reader />
          <UI />
          <UndoOnce />
        </Test>
      );
    });

    expect(root!.toJSON()).toEqual(["State: ", "0", "Cannot undo", "Can redo"]);

    act(() => {
      root!.update(
        <Test>
          State: <Reader />
          <UI />
          <RedoOnce />
        </Test>
      );
    });

    expect(root!.toJSON()).toEqual([
      "State: ",
      "2020",
      "Can undo",
      "Cannot redo",
    ]);
  });
});

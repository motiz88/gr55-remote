import { useEffect, useState } from "react";

type PendingState = [undefined, undefined, "pending"];
type ResolvedState<Result> = [Result, undefined, "resolved"];
type RejectedState = [undefined, Error, "rejected"];

function useCancellablePromise<Result = any>(
  // NOTE: use with useCallback to avoid infinite loop
  promiseFactory: (signal: AbortSignal) => Promise<Result>
): PendingState | ResolvedState<Result> | RejectedState {
  const [state, setState] = useState<
    PendingState | ResolvedState<Result> | RejectedState
  >([undefined, undefined, "pending"]);

  useEffect(() => {
    const controller = new AbortController();

    const promise = promiseFactory(controller.signal);
    setState([undefined, undefined, "pending"]);

    promise
      .then((result: Result) => {
        if (!controller.signal.aborted) {
          setState([result, undefined, "resolved"]);
        }
      })
      .catch((error: Error) => {
        if (!controller.signal.aborted) {
          setState([undefined, error, "rejected"]);
        }
      });

    return () => {
      controller.abort();
    };
  }, [promiseFactory]);

  return state;
}

export default useCancellablePromise;

import { ForwardedRef, RefObject, useEffect, useRef } from "react";

export function useAndForwardRef<T>(
  ref: ForwardedRef<T>,
  initialValue: T | null = null
): RefObject<T> {
  const targetRef = useRef<T | null>(initialValue);

  useEffect(() => {
    if (!ref) return;

    if (typeof ref === "function") {
      ref(targetRef.current);
    } else {
      ref.current = targetRef.current;
    }
  }, [ref]);

  return targetRef;
}

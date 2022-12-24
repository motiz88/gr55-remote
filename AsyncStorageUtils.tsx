import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMemo, useCallback, useState, useEffect } from "react";
import { Platform } from "react-native";
import usePromise from "react-use-promise";

type Serializable = { [key: string]: Serializable } | string | number | boolean;

function parse<T extends Serializable>(
  json: string | null | undefined
): T | undefined {
  if (json == null) {
    return undefined;
  }
  return JSON.parse(json);
}

export function useAsyncStorageValue<T extends Serializable>(key: string) {
  const [value, error, status] = usePromise(
    () => AsyncStorage.getItem(key),
    [key]
  );
  const parsedValue = useMemo(() => {
    return parse<T>(value);
  }, [value]);
  const setValueAsync = useCallback(
    (newValue: T | undefined | null) => {
      if (newValue == null) {
        AsyncStorage.removeItem(key);
      } else {
        AsyncStorage.setItem(key, JSON.stringify(newValue));
      }
    },
    [key]
  );
  return [parsedValue, error, status, setValueAsync] as const;
}

function useStateWithStoredDefault<T extends Serializable>(
  key: string,
  defaultIfNotStored: T
): [T, (newValue: T) => void, "pending" | "rejected" | "resolved"];
function useStateWithStoredDefault<T extends Serializable>(
  key: string
): [T | undefined, (newValue: T) => void, "pending" | "rejected" | "resolved"];
function useStateWithStoredDefault<T extends Serializable>(
  key: string,
  defaultIfNotStored?: T
) {
  const [value, setValueInState] = useState<T>();
  const [storedValue, , storageReadStatus, setStoredValue] =
    useAsyncStorageValue<T>(key);
  const setValue = useCallback(
    (newValue: T) => {
      setValueInState(newValue);
      setStoredValue(newValue);
    },
    [setStoredValue]
  );
  useEffect(() => {
    if (value == null && storedValue != null) {
      setValueInState(storedValue);
    } else if (storageReadStatus === "rejected" && defaultIfNotStored != null) {
      setValueInState(defaultIfNotStored);
    }
  }, [value, storedValue, defaultIfNotStored, storageReadStatus]);
  return [value ?? defaultIfNotStored, setValue, storageReadStatus] as const;
}

export { useStateWithStoredDefault };

import { createContext, useContext, useMemo } from "react";

import { useStateWithStoredDefault } from "./AsyncStorageUtils";

export type UserOptions = Readonly<{
  enableExperimentalFeatures: boolean;
}>;

const DEFAULT_OPTIONS = {
  enableExperimentalFeatures: false,
};

const UserOptionsContext = createContext<
  readonly [UserOptions, (newOptions: Partial<UserOptions>) => void]
>([DEFAULT_OPTIONS, () => {}]);

export function UserOptionsContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const [enableExperimentalFeatures, setEnableExperimentalFeatures] =
    useStateWithStoredDefault<boolean>(
      "@motiz88/gr55-remote/UserOptions/enableExperimentalFeatures",
      false
    );
  const userOptionsAndSetter = useMemo(
    () =>
      [
        {
          enableExperimentalFeatures,
        },
        (newOptions: Partial<UserOptions>) => {
          if (newOptions.enableExperimentalFeatures != null) {
            setEnableExperimentalFeatures(
              newOptions.enableExperimentalFeatures
            );
          }
        },
      ] as const,
    [enableExperimentalFeatures, setEnableExperimentalFeatures]
  );
  return (
    <UserOptionsContext.Provider value={userOptionsAndSetter}>
      {children}
    </UserOptionsContext.Provider>
  );
}

export function useUserOptions() {
  return useContext(UserOptionsContext);
}

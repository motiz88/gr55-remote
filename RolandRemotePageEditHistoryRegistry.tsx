import { createContext, useContext, useMemo } from "react";

import { EditHistoryAPIType } from "./EditHistory";
import { RolandRemotePageContext } from "./RolandRemotePageContext";

type RolandRemotePageEditHistoryRegistry = {
  editHistoryByPage: ReadonlyMap<
    RolandRemotePageContext,
    EditHistoryAPIType<unknown>
  >;
};

const RolandRemotePageEditHistoryRegistryContext =
  createContext<RolandRemotePageEditHistoryRegistry>({
    editHistoryByPage: new Map(),
  });

function useRolandRemotePageEditHistoryRegistry() {
  return useContext(RolandRemotePageEditHistoryRegistryContext);
}

export function useEditHistoryForPage(
  page: RolandRemotePageContext
): EditHistoryAPIType<unknown> | void {
  const registry = useRolandRemotePageEditHistoryRegistry();
  return registry.editHistoryByPage.get(page);
}

/// Associates an EditHistoryAPIType with a RolandRemotePageContext.
export function RolandRemotePageEditHistoryRegistryProvider({
  children,
  page,
  editHistory,
}: {
  children: React.ReactNode;
  page: RolandRemotePageContext;
  editHistory: EditHistoryAPIType<any>;
}) {
  const registry = useRolandRemotePageEditHistoryRegistry();
  const newRegistry = useMemo(
    () => ({
      ...registry,
      editHistoryByPage: new Map(registry.editHistoryByPage).set(
        page,
        editHistory
      ),
    }),
    [registry, page, editHistory]
  );
  return (
    <RolandRemotePageEditHistoryRegistryContext.Provider value={newRegistry}>
      {children}
    </RolandRemotePageEditHistoryRegistryContext.Provider>
  );
}

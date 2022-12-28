import { createContext, useContext } from "react";
import { ColorValue } from "react-native";

export function useContextualStyle() {
  return useContext(ContextualStyleContext);
}

export function ContextualStyleProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: Partial<ContextualStyle>;
}) {
  const inheritedStyles = useContextualStyle();
  return (
    <ContextualStyleContext.Provider value={{ ...inheritedStyles, ...value }}>
      {children}
    </ContextualStyleContext.Provider>
  );
}

const ContextualStyleContext = createContext<ContextualStyle>({
  backgroundColor: "#f2f2f2",
});

export interface ContextualStyle {
  backgroundColor: ColorValue;
}

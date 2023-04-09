import { useTheme } from "@react-navigation/native";

import { ContextualStyleProvider } from "./ContextualStyle";

export function ThemedContextualStyleProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  const theme = useTheme();
  return (
    <ContextualStyleProvider
      value={{
        backgroundColor: theme.colors.background,
      }}
    >
      {children}
    </ContextualStyleProvider>
  );
}

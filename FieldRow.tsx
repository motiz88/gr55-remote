import { createContext, useMemo } from "react";
import { Text, View } from "react-native";

import { PatchFieldStyles } from "./PatchFieldStyles";

export function FieldRow({
  description,
  descriptionSecondary,
  children,
  inline,
  isAssigned,
}: {
  description: React.ReactNode;
  descriptionSecondary?: React.ReactNode;
  children?: React.ReactNode;
  inline?: boolean;
  isAssigned?: boolean;
}) {
  const fieldRowContext = useMemo(
    () => ({ isAssigned: isAssigned ?? false }),
    [isAssigned]
  );
  return (
    <FieldRowContext.Provider value={fieldRowContext}>
      {inline ? (
        <>{children}</>
      ) : (
        <View
          style={[
            PatchFieldStyles.fieldRow,
            isAssigned && PatchFieldStyles.fieldRowAssigned,
          ]}
        >
          <View style={PatchFieldStyles.fieldDescriptionColumn}>
            <Text
              style={[
                PatchFieldStyles.fieldDescription,
                isAssigned && PatchFieldStyles.fieldDescriptionAssigned,
              ]}
            >
              {description}
            </Text>
            {descriptionSecondary}
          </View>
          {children && (
            <View
              style={[
                PatchFieldStyles.fieldControl,
                isAssigned && PatchFieldStyles.fieldControlAssigned,
              ]}
            >
              {children}
            </View>
          )}
        </View>
      )}
    </FieldRowContext.Provider>
  );
}

export const FieldRowContext = createContext<{
  isAssigned: boolean;
}>({ isAssigned: false });

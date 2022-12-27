import { Text, View } from "react-native";

import { PatchFieldStyles } from "./PatchFieldStyles";

export function FieldRow({
  description,
  children,
}: {
  description: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <View style={PatchFieldStyles.fieldRow}>
      <Text style={PatchFieldStyles.fieldDescription}>{description}</Text>
      {children && (
        <View style={PatchFieldStyles.fieldControl}>{children}</View>
      )}
    </View>
  );
}

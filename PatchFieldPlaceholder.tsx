import { Text, View } from "react-native";

import { PatchFieldStyles } from "./PatchFieldStyles";

export function PatchFieldPlaceholder({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <View style={PatchFieldStyles.fieldRow}>
      <Text style={PatchFieldStyles.fieldDescription}>{children}</Text>
    </View>
  );
}

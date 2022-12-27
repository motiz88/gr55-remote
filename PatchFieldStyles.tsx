import { StyleSheet } from "react-native";

export const PatchFieldStyles = StyleSheet.create({
  horizontal: {
    flexDirection: "row",
  },
  fieldRow: {
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  fieldDescription: {
    flex: 1,
    textAlignVertical: "center",
  },
  fieldControl: {
    flex: 2,
    marginStart: 8,
  },
  fieldControlInner: {
    flex: 1,
  },
});

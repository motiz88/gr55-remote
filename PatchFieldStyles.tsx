import { StyleSheet } from "react-native";

export const PatchFieldStyles = StyleSheet.create({
  horizontal: {
    flexDirection: "row",
  },
  fieldRow: {
    paddingTop: 8,
    paddingBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  fieldDescriptionColumn: {
    flex: 1,
    textAlignVertical: "center",
    flexDirection: "row",
  },
  fieldDescription: {
    textAlignVertical: "center",
  },
  fieldControl: {
    flex: 2,
    marginStart: 8,
  },
  fieldControlInner: {
    flex: 1,
  },
  fieldRowAssigned: {},
  fieldDescriptionAssigned: {},
  fieldControlAssigned: {},
  fieldRowPressed: {
    opacity: 0.5,
  },
});

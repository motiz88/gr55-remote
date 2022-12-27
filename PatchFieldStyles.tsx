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
  fieldDescriptionColumn: {
    flex: 1,
    textAlignVertical: "center",
    flexDirection: "column",
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
  fieldDescriptionSecondaryLink: {
    // TODO: Move the entire color scheme for assigns to a central place
    color: "cornflowerblue",
    textTransform: "uppercase",
    marginTop: 4,
  },
});

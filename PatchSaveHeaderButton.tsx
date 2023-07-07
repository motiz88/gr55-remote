import { Ionicons } from "@expo/vector-icons";
import { MenuAction, MenuView } from "@react-native-menu/menu";
import { useNavigation } from "@react-navigation/native";
import { Button } from "@rneui/themed";
import { useContext, useCallback, useMemo, useState } from "react";
import { Platform, View } from "react-native";

import { RolandRemotePatchContext as PATCH } from "./RolandRemotePageContext";
import { useRolandRemotePatchSelection } from "./RolandRemotePatchSelection";
import { useUserOptions } from "./UserOptions";
import { GlobalNavigationProp } from "./navigation";
import { usePatchMap } from "./usePatchMap";

export function PatchSaveHeaderButton({
  tintColor,
}: {
  tintColor: string | undefined;
}) {
  const { isModifiedSinceSave, saveAndSelectUserPatch } = useContext(PATCH);

  const [{ enableExperimentalFeatures }] = useUserOptions();
  const patchMap = usePatchMap();
  const { selectedPatch } = useRolandRemotePatchSelection();
  const patch = useMemo(() => {
    if (!patchMap || !selectedPatch) {
      return undefined;
    }
    // NOTE: O(n), but patch changes are rare
    return patchMap.patchList.find(
      (p) =>
        p.bankMSB === selectedPatch.bankSelectMSB && p.pc === selectedPatch.pc
    );
  }, [patchMap, selectedPatch]);
  const userPatchNumber = patch?.userPatch?.patchNumber;
  const canQuickSave = isModifiedSinceSave && userPatchNumber != null;
  const navigation = useNavigation<GlobalNavigationProp>();
  // TODO: Disable Save As action as needed
  const canSaveAs = true;
  const handleSave = useCallback(async () => {
    if (userPatchNumber == null) {
      return;
    }
    await saveAndSelectUserPatch(userPatchNumber);
  }, [saveAndSelectUserPatch, userPatchNumber]);
  const handleSaveAs = useCallback(async () => {
    navigation!.getParent("PatchStack")!.navigate("PatchSaveAs", {
      initialUserPatchNumber: userPatchNumber,
    });
  }, [navigation, userPatchNumber]);
  // TODO: Implement auto-save
  const canAutoSave = false;
  const [autoSave, setAutoSave] = useState(false);
  const handlePressAction = useCallback(
    ({
      nativeEvent,
    }: {
      nativeEvent: {
        event: string;
      };
    }) => {
      switch (nativeEvent.event as "quick_save" | "save_as" | "auto_save") {
        case "quick_save":
          handleSave();
          break;
        case "save_as":
          handleSaveAs();
          break;
        case "auto_save":
          setAutoSave((value) => !value);
          break;
      }
    },
    [handleSave, handleSaveAs]
  );
  const actions: MenuAction[] = useMemo(
    () => [
      {
        title: "Quick Save",
        subtitle: patch
          ? patch.styleLabel + " " + patch.patchNumberLabel
          : undefined,
        id: "quick_save",
        image: Platform.select({
          ios: "square.and.arrow.down",
          android: "ic_menu_save",
        }),
        attributes: {
          disabled: !canQuickSave || autoSave,
        },
      },
      {
        id: "auto_save",
        title: "Auto Save",
        titleColor: "#46F289",
        image: Platform.select({
          ios: "a.square",
          android: "ic_menu_refresh",
        }),
        state: autoSave ? "on" : "off",
        attributes: {
          disabled: !canAutoSave,
          // TODO: Implement auto-save
          hidden: true,
        },
      },
      {
        title: "Save As...",
        id: "save_as",
        image: Platform.select({
          ios: "square.and.arrow.down.on.square",
          android: "ic_menu_save",
        }),
        attributes: {
          disabled: !canSaveAs,
        },
      },
    ],
    [autoSave, canAutoSave, canQuickSave, canSaveAs, patch]
  );
  return (
    <View style={{ flexDirection: "row" }}>
      {/* <View style={{ paddingEnd: 8 }}> */}
      {enableExperimentalFeatures && (
        <MenuView
          title={
            userPatchNumber != null && !isModifiedSinceSave
              ? "No unsaved changes"
              : ""
          }
          onPressAction={handlePressAction}
          actions={actions}
          shouldOpenOnLongPress={false}
        >
          <Button type="clear" onPress={undefined}>
            <Ionicons
              name="ellipsis-horizontal-circle"
              size={24}
              color={tintColor}
            />
          </Button>
        </MenuView>
      )}
    </View>
  );
}

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Button } from "@rneui/themed";
import { useContext, useCallback, useMemo } from "react";
import { View } from "react-native";

import { RolandRemotePatchContext as PATCH } from "./RolandRemotePageContext";
import { useRolandRemotePatchSelection } from "./RolandRemotePatchSelection";
import { GlobalNavigationProp } from "./navigation";
import { usePatchMap } from "./usePatchMap";

export function PatchSaveHeaderButton({
  tintColor,
}: {
  tintColor: string | undefined;
}) {
  const { isModifiedSinceSave, saveAndSelectUserPatch } = useContext(PATCH);

  const patchMap = usePatchMap();
  const { selectedPatch } = useRolandRemotePatchSelection();
  const userPatchNumber = useMemo(() => {
    if (!patchMap || !selectedPatch) {
      return undefined;
    }
    // NOTE: O(n), but patch changes are rare
    const patch = patchMap.patchList.find(
      (p) =>
        p.bankMSB === selectedPatch.bankSelectMSB && p.pc === selectedPatch.pc
    );
    return patch?.userPatch?.patchNumber;
  }, [patchMap, selectedPatch]);
  const canQuickSave = isModifiedSinceSave && userPatchNumber != null;
  const navigation = useNavigation<GlobalNavigationProp>();
  // TODO: Disable Save As action as needed
  const canSaveAs = true;
  const handleSave = useCallback(async () => {
    if (userPatchNumber == null) {
      return;
    }
    const patch = userPatchNumber;
    await saveAndSelectUserPatch(patch);
  }, [saveAndSelectUserPatch, userPatchNumber]);
  const handleSaveAs = useCallback(async () => {
    navigation!.getParent("PatchStack")!.navigate("PatchSaveAs", {
      initialUserPatchNumber: userPatchNumber,
    });
  }, [navigation, userPatchNumber]);
  return (
    <View style={{ flexDirection: "row" }}>
      {canSaveAs && (
        <View style={{ paddingStart: 8 }}>
          <Button disabled={!canSaveAs} type="clear" onPress={handleSaveAs}>
            <MaterialCommunityIcons
              name="pencil-plus"
              size={24}
              color={canSaveAs ? tintColor : "lightgray"}
            />
          </Button>
        </View>
      )}
      {userPatchNumber != null && (
        <View style={{ paddingStart: 8 }}>
          <Button disabled={!canQuickSave} type="clear" onPress={handleSave}>
            <MaterialCommunityIcons
              name={canQuickSave ? "pencil" : "check"}
              size={24}
              color={canQuickSave ? tintColor : "lightgray"}
            />
          </Button>
        </View>
      )}
    </View>
  );
}

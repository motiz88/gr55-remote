import { Entypo } from "@expo/vector-icons";
import { Button } from "@rneui/themed";
import { useContext, useCallback, useMemo } from "react";
import { View } from "react-native";

import { RolandRemotePatchContext as PATCH } from "./RolandRemotePageContext";
import { useRolandRemotePatchSelection } from "./RolandRemotePatchSelection";
import { useUserOptions } from "./UserOptions";
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
  // TODO: Allow saving system patches to user area
  const canSave = isModifiedSinceSave && userPatchNumber != null;
  const handleSave = useCallback(async () => {
    if (userPatchNumber == null) {
      return;
    }
    // TODO: Let user select destination patch
    const patch = userPatchNumber;
    await saveAndSelectUserPatch(patch);
  }, [saveAndSelectUserPatch, userPatchNumber]);
  return (
    <View style={{ paddingEnd: 8 }}>
      {enableExperimentalFeatures && (
        <Button disabled={!canSave} type="clear" onPress={handleSave}>
          <Entypo
            name="save"
            size={24}
            color={canSave ? tintColor : "lightgray"}
          />
        </Button>
      )}
    </View>
  );
}

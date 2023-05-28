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
    // TODO: Invalidate the cached patch description for the destination patch

    // Notes on how the GR-55 handles this command:
    // 1. The GR-55 will send a patch change message when the patch is saved, *before* sending the
    //    0x0f000002 response. This is fine because our queueing mechanism will ensure that the
    //    patch change message is processed before we send any follow-up messages (e.g. to read
    //    the new temporary patch data from the device).
    // 2. It appears that the separate "Command for storing User data to internal memory" (writing
    //    0x01 to 0x0f000001) is not necessary. It may become necessary if we want to make direct
    //    writes to the User area, instead of (or in addition to) writing to the Temporary area.
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

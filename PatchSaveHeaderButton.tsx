import { Entypo } from "@expo/vector-icons";
import { Button } from "@rneui/themed";
import { useContext, useCallback } from "react";
import { View } from "react-native";

import { RolandRemotePatchContext as PATCH } from "./RolandRemotePageContext";
import { useUserOptions } from "./UserOptions";

export function PatchSaveHeaderButton({
  tintColor,
}: {
  tintColor: string | undefined;
}) {
  const { isModifiedSinceSave, setModifiedSinceSave } = useContext(PATCH);
  const canSave = isModifiedSinceSave;
  const [{ enableExperimentalFeatures }] = useUserOptions();
  const handleSave = useCallback(() => {
    setModifiedSinceSave(false);
  }, [setModifiedSinceSave]);
  return (
    <View style={{ paddingEnd: 8 }}>
      {/* TODO: dim button when there are no changes to the current patch */}
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

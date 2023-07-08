import { Ionicons } from "@expo/vector-icons";
import { Button } from "@rneui/themed";
import { View } from "react-native";

import { useRolandRemotePatchEditHistory } from "./RolandRemotePatchEditHistory";
import { useUserOptions } from "./UserOptions";

export function PatchUndoRedoHeaderControls({
  tintColor,
}: {
  tintColor: string | undefined;
}) {
  const editHistory = useRolandRemotePatchEditHistory();

  const [{ enableExperimentalFeatures }] = useUserOptions();

  return (
    <View style={{ flexDirection: "row" }}>
      {enableExperimentalFeatures && (
        <>
          <Button type="clear" onPress={editHistory.undo}>
            <Ionicons
              name="arrow-undo"
              size={24}
              color={editHistory.canUndo ? tintColor : "lightgray"}
              disabled={!editHistory.canUndo}
            />
          </Button>
          <Button type="clear" onPress={editHistory.redo}>
            <Ionicons
              name="arrow-redo"
              size={24}
              color={editHistory.canRedo ? tintColor : "lightgray"}
              disabled={!editHistory.canRedo}
            />
          </Button>
        </>
      )}
    </View>
  );
}

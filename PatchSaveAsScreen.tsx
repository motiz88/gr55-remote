import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button } from "@rneui/themed";
import React, { useCallback, useContext, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

import { PatchListView } from "./PatchListView";
import { PendingTextPlaceholder } from "./PendingContentPlaceholders";
import { useFocusQueryPriority } from "./RolandDataTransfer";
import { RolandGR55AddressMapAbsolute as GR55 } from "./RolandGR55AddressMap";
import { RolandGR55NotConnectedView } from "./RolandGR55NotConnectedView";
import { useRolandGR55RemotePatchDescriptions } from "./RolandGR55RemotePatchDescriptions";
import { RolandRemotePatchContext as PATCH } from "./RolandRemotePageContext";
import { PatchId } from "./RolandRemotePatchSelection";
import { ThemedText as Text } from "./ThemedText";
import { PatchStackParamList } from "./navigation";
import { usePatchMap } from "./usePatchMap";
import { useRemoteField } from "./useRemoteField";

export function PatchSaveAsScreen({
  navigation,
  route,
}: NativeStackScreenProps<PatchStackParamList, "PatchSaveAs">) {
  const { saveAndSelectUserPatch } = useContext(PATCH);
  const { patches } = useRolandGR55RemotePatchDescriptions();
  const patchMap = usePatchMap();

  const userPatchDescriptions = useMemo(() => {
    const result = [];
    for (const patch of patches ?? []) {
      if (!patch.identity.userPatch) {
        continue;
      }
      result[patch.identity.userPatch.patchNumber] = patch;
    }
    return result;
  }, [patches]);
  useFocusQueryPriority("read_patch_list");
  const [selectedPatch, setSelectedPatch] = useState(
    route.params?.initialUserPatchNumber ?? 0
  );
  const selectedPatchId = useMemo(() => {
    return {
      bankSelectMSB: userPatchDescriptions[selectedPatch].identity.bankMSB,
      pc: userPatchDescriptions[selectedPatch].identity.pc,
    };
  }, [selectedPatch, userPatchDescriptions]);
  const setSelectedPatchId = useCallback(
    (id: PatchId) => {
      setSelectedPatch(
        userPatchDescriptions.findIndex((patch) => {
          return (
            patch.identity.bankMSB === id.bankSelectMSB &&
            patch.identity.pc === id.pc
          );
        })
      );
    },
    [userPatchDescriptions]
  );
  const [patchName, , patchNameStatus] = useRemoteField(
    PATCH,
    GR55.temporaryPatch.common.patchName
  );
  const handleSave = useCallback(() => {
    // TODO: Await this and indicate progress
    saveAndSelectUserPatch(selectedPatch);
    navigation.pop();
  }, [navigation, saveAndSelectUserPatch, selectedPatch]);
  const canSave = useMemo(
    () =>
      patchNameStatus !== "pending" &&
      patchMap != null &&
      selectedPatchId != null,
    [patchNameStatus, patchMap, selectedPatchId]
  );
  if (!patchMap) {
    // TODO: Make it fit the screen, or just pop to the previous screen
    return <RolandGR55NotConnectedView navigation={navigation} />;
  }
  // TODO: Make this less ugly
  return (
    <View style={styles.container}>
      <Text>
        Save{" "}
        {patchNameStatus === "pending" ? (
          <PendingTextPlaceholder chars={16} />
        ) : (
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>{patchName}</Text>
        )}{" "}
        to:
      </Text>
      {/* TODO: Layout flickers on first render on iPad */}
      <PatchListView
        data={patches!.filter((p) => p.identity.userPatch)}
        selectedPatch={selectedPatchId}
        onSelectedPatchChange={setSelectedPatchId}
      />
      <Button onPress={handleSave} disabled={!canSave}>
        Save
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    flex: 1,
  },
});

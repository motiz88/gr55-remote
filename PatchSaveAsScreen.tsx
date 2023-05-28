import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button } from "@rneui/themed";
import React, { useCallback, useContext, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

import { PendingTextPlaceholder } from "./PendingContentPlaceholders";
import { Picker } from "./Picker";
import { RolandGR55AddressMapAbsolute as GR55 } from "./RolandGR55AddressMap";
import { RolandGR55NotConnectedView } from "./RolandGR55NotConnectedView";
import { useRolandGR55RemotePatchDescriptions } from "./RolandGR55RemotePatchDescriptions";
import { RolandRemotePatchContext as PATCH } from "./RolandRemotePageContext";
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
  const patchPickerItemsUserPatches = useMemo(() => {
    return userPatchDescriptions.map((patch, index) => {
      return (
        <Picker.Item
          label={`${patch.identity.styleLabel} ${
            patch.identity.patchNumberLabel
          } ${
            patch.status === "pending" ? "..." : patch.data?.name ?? ""
          }`.trimEnd()}
          key={index}
          value={index}
        />
      );
    });
  }, [userPatchDescriptions]);
  const [selectedPatch, setSelectedPatch] = useState(
    route.params?.initialUserPatchNumber ?? 0
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
          <Text style={{ fontWeight: "bold" }}>{patchName}</Text>
        )}{" "}
        to...
      </Text>
      <Picker selectedValue={selectedPatch} onValueChange={setSelectedPatch}>
        {patchPickerItemsUserPatches}
      </Picker>
      <Button onPress={handleSave}>Save</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});

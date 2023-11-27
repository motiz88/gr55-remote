import { useTheme as useNavigationTheme } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button } from "@rneui/themed";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { StyleSheet, View } from "react-native";

import { MIDINotAvailableView } from "./MIDINotAvailableView";
import { useMidiIoContext } from "./MidiIo";
import { PatchListView } from "./PatchListView";
import { PendingTextPlaceholder } from "./PendingContentPlaceholders";
import { useFocusQueryPriority } from "./RolandDataTransfer";
import { RolandGR55AddressMapAbsolute as GR55 } from "./RolandGR55AddressMap";
import { RolandGR55NotConnectedView } from "./RolandGR55NotConnectedView";
import { useRolandGR55RemotePatchDescriptions } from "./RolandGR55RemotePatchDescriptions";
import { RolandRemotePatchContext as PATCH } from "./RolandRemotePageContext";
import { PatchId } from "./RolandRemotePatchSelection";
import { useTheme } from "./Theme";
import { ThemedText as Text } from "./ThemedText";
import { PatchStackParamList } from "./navigation";
import { usePatchMap } from "./usePatchMap";
import { useRemoteField } from "./useRemoteField";
import { useRenamePatchPrompt } from "./useRenamePatchPrompt";

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
  const destinationPatch = userPatchDescriptions[selectedPatch];
  const selectedPatchId = useMemo(
    () =>
      destinationPatch
        ? {
            bankSelectMSB: destinationPatch.identity.bankMSB,
            pc: destinationPatch.identity.pc,
          }
        : undefined,
    [destinationPatch]
  );
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
  const [patchName, setPatchName, patchNameStatus] = useRemoteField(
    PATCH,
    GR55.temporaryPatch.common.patchName
  );
  // We allow the user to edit the patch name before saving, but we don't want to
  // write the patch name to the temporary patch until the user actually saves.
  const [localPatchName, setLocalPatchName] = useState(patchName);
  const { renamePatch } = useRenamePatchPrompt({
    patchName: localPatchName,
    setPatchName: setLocalPatchName,
  });
  const handleSave = useCallback(() => {
    // TODO: When we have auto-save, this should *not* be replicated to the "current" patch like other field changes would be.
    setPatchName(localPatchName);
    // TODO: Await this and indicate progress
    saveAndSelectUserPatch(selectedPatch);
    navigation.pop();
  }, [
    localPatchName,
    navigation,
    saveAndSelectUserPatch,
    selectedPatch,
    setPatchName,
  ]);
  const canSave = useMemo(
    () => patchNameStatus !== "pending" && patchMap != null,
    [patchNameStatus, patchMap]
  );
  const navigationTheme = useNavigationTheme();
  // TODO: Adapt look to match platform, this currently mimics the iOS nav bar
  useEffect(() => {
    navigation.setOptions({
      headerLeft: ({ tintColor }) => (
        <Button
          onPress={() => navigation.pop()}
          type="clear"
          titleStyle={{ color: tintColor ?? navigationTheme.colors.primary }}
        >
          Cancel
        </Button>
      ),
      headerRight: ({ tintColor }) => (
        <Button
          onPress={handleSave}
          disabled={!canSave}
          type="clear"
          titleStyle={{ color: tintColor ?? navigationTheme.colors.primary }}
        >
          Save
        </Button>
      ),
    });
  }, [canSave, handleSave, navigation, navigationTheme.colors.primary]);
  const userPatches = useMemo(() => {
    return patches?.filter((p) => p.identity.userPatch);
  }, [patches]);
  const theme = useTheme();
  const destinationStyleLabel = useMemo(
    () =>
      destinationPatch
        ? spacesToNbsp(destinationPatch.identity.styleLabel)
        : undefined,
    [destinationPatch]
  );
  const destinationPatchNumberLabel = useMemo(
    () =>
      destinationPatch
        ? spacesToNbsp(destinationPatch.identity.patchNumberLabel)
        : undefined,
    [destinationPatch]
  );
  const patchListRef = useRef<React.ComponentRef<typeof PatchListView>>(null);
  const scrollToSelection = useCallback(() => {
    if (selectedPatchId == null) {
      return;
    }
    patchListRef.current?.scrollToPatch(selectedPatchId);
  }, [selectedPatchId]);
  useEffect(() => {
    setLocalPatchName(patchName);
  }, [patchName]);
  const { midiStatus } = useMidiIoContext();
  if (midiStatus === "not-supported" || midiStatus === "permission-denied") {
    // TODO: Make it fit the screen, or just pop to the previous screen
    return <MIDINotAvailableView reason={midiStatus} />;
  }
  if (!patchMap || !userPatches) {
    // TODO: Make it fit the screen, or just pop to the previous screen
    return <RolandGR55NotConnectedView navigation={navigation} />;
  }
  // TODO: Modal background is black on black in dark mode, needs contrast like in light mode
  return (
    <View style={styles.container}>
      {destinationPatch ? (
        <View
          style={[
            styles.summaryMessage,
            { backgroundColor: theme.colors.saveAsSummaryBackground },
          ]}
        >
          <Text style={styles.summaryText}>
            {patchNameStatus === "rejected" ? (
              "Patch"
            ) : patchNameStatus === "pending" ? (
              <PendingTextPlaceholder chars={16} />
            ) : (
              <Text onPress={renamePatch} style={styles.patchNameText}>
                {localPatchName}
              </Text>
            )}{" "}
            will be written to{" "}
            <Text style={styles.patchNameText} onPress={scrollToSelection}>
              {destinationStyleLabel!}
              {"\u00a0" /* nbsp */}
              {destinationPatchNumberLabel!}
              {destinationPatch.status ===
              "rejected" ? null : destinationPatch.status === "pending" ? (
                <>
                  {" "}
                  <PendingTextPlaceholder chars={16} />
                </>
              ) : (
                <>
                  {destinationPatch.data?.name === localPatchName ? null : (
                    <>
                      {" "}
                      <Text style={[styles.overwrittenPatchNameText]}>
                        ({destinationPatch.data?.name})
                      </Text>
                    </>
                  )}
                </>
              )}
            </Text>
            .
          </Text>
        </View>
      ) : null}
      {/* TODO: Layout flickers on first render on iPad */}
      <PatchListView
        data={userPatches}
        selectedPatch={selectedPatchId}
        onSelectedPatchChange={setSelectedPatchId}
        style={styles.list}
        ref={patchListRef}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    flex: 1,
  },
  list: {
    paddingTop: 0,
    paddingBottom: 8,
    paddingHorizontal: 8,
  },
  summaryMessage: {
    padding: 8,
  },
  summaryText: {
    fontSize: 16,
  },
  patchNameText: {
    fontWeight: "bold",
  },
  overwrittenPatchNameText: {
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
    fontWeight: "normal",
    fontStyle: "italic",
    opacity: 0.6,
  },
});

function spacesToNbsp(s: string) {
  return s.replace(/ /g, "\u00a0");
}

import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { LibraryPatchListNoResultsView } from "./LibraryPatchListNoResultsView";
import { MIDINotAvailableView } from "./MIDINotAvailableView";
import { useMidiIoContext } from "./MidiIo";
import { PatchListView } from "./PatchListView";
import { useFocusQueryPriority } from "./RolandDataTransfer";
import { RolandGR55NotConnectedView } from "./RolandGR55NotConnectedView";
import { useRolandGR55RemotePatchDescriptions } from "./RolandGR55RemotePatchDescriptions";
import { useRolandRemotePatchSelection } from "./RolandRemotePatchSelection";
import { useMainScrollViewSafeAreaStyle } from "./SafeAreaUtils";
import { ThemedSearchBar } from "./ThemedSearchBar";
import { RootTabParamList } from "./navigation";

export function LibraryPatchListScreen({
  navigation,
}: BottomTabScreenProps<RootTabParamList, "LibraryPatchList", "RootTab">) {
  const safeAreaStyle = useMainScrollViewSafeAreaStyle();
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const { patches } = useRolandGR55RemotePatchDescriptions();
  const filteredPatchList = useMemo(() => {
    if (!patches) {
      return null;
    }
    return deferredSearch
      ? patches.filter((patch) => {
          return patch.data?.name
            .toLowerCase()
            .includes(deferredSearch.toLowerCase());
        })
      : patches;
  }, [deferredSearch, patches]);

  const { selectedPatch, setSelectedPatch } = useRolandRemotePatchSelection();
  const patchListRef = useRef<React.ComponentRef<typeof PatchListView>>(null);

  const isPendingScroll = useRef<boolean>(false);
  const handleChangeText = useCallback((value: string) => {
    setSearch(value);
    isPendingScroll.current = true;
  }, []);
  useEffect(() => {
    if (isPendingScroll.current) {
      isPendingScroll.current = false;
      patchListRef.current?.scrollToPatch(selectedPatch);
    }
  }, [search, selectedPatch]);

  useFocusQueryPriority("read_patch_list");

  const anyPatchesPending = useMemo(
    () => patches?.some((patch) => patch.status === "pending") ?? false,
    [patches]
  );

  const { midiStatus } = useMidiIoContext();
  if (midiStatus === "not-supported" || midiStatus === "permission-denied") {
    return <MIDINotAvailableView reason={midiStatus} />;
  }

  if (!patches) {
    return <RolandGR55NotConnectedView navigation={navigation} />;
  }
  let content;
  if (
    search !== "" &&
    !(anyPatchesPending || deferredSearch !== search) &&
    filteredPatchList &&
    !filteredPatchList.length
  ) {
    content = <LibraryPatchListNoResultsView />;
  } else {
    content = (
      <PatchListView
        ref={patchListRef}
        data={filteredPatchList}
        selectedPatch={selectedPatch}
        onSelectedPatchChange={setSelectedPatch}
        contentContainerStyle={safeAreaStyle}
      />
    );
  }
  return (
    <>
      <ThemedSearchBar
        placeholder="Search patches..."
        onChangeText={handleChangeText}
        value={search}
        showLoading={anyPatchesPending || deferredSearch !== search}
      />
      {content}
    </>
  );
}

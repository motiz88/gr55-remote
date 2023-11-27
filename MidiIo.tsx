import { requestMIDIAccess } from "@motiz88/react-native-midi";
import type { MIDIInput, MIDIOutput } from "@motiz88/react-native-midi";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Platform } from "react-native";
import usePromise from "react-use-promise";

import { useStateWithStoredDefault } from "./AsyncStorageUtils";

export const MidiIoContext = createContext<{
  inputPort: MIDIInput | void | null;
  outputPort: MIDIOutput | void | null;
  midiStatus: "pending" | "permission-denied" | "not-supported" | "ok";
}>({ inputPort: null, outputPort: null, midiStatus: "pending" });

export const MidiIoSetupContext = createContext<{
  midiIoContext: {
    inputPort: MIDIInput | null | undefined;
    outputPort: MIDIOutput | null | undefined;
  };
  inputs: ReadonlyMap<string, MIDIInput>;
  outputs: ReadonlyMap<string, MIDIOutput>;
  currentInputId: string | undefined;
  currentOutputId: string | undefined;
  setCurrentInputId: (id: string) => void;
  setCurrentOutputId: (id: string) => void;
}>({
  midiIoContext: {
    inputPort: null,
    outputPort: null,
  },
  inputs: new Map(),
  outputs: new Map(),
  currentInputId: undefined,
  currentOutputId: undefined,
  setCurrentInputId: () => {},
  setCurrentOutputId: () => {},
});

const MIDI_NOT_SUPPORTED_ERROR = new Error();

function useMIDIAccess(sysex: boolean = false) {
  return usePromise(
    () =>
      // TODO: Move check into @motiz88/react-native-midi?
      Platform.OS === "web" &&
      typeof navigator.requestMIDIAccess === "undefined"
        ? Promise.reject(MIDI_NOT_SUPPORTED_ERROR)
        : requestMIDIAccess({ sysex }),
    [sysex]
  );
}

function useMidiIoSetupImpl() {
  const [midiAccess, midiAccessError, midiAccessStatus] = useMIDIAccess(true);

  const midiStatus = useMemo(() => {
    if (midiAccessStatus === "pending") {
      return "pending" as const;
    }
    if (midiAccessError === MIDI_NOT_SUPPORTED_ERROR) {
      return "not-supported" as const;
    }
    if (midiAccessStatus === "rejected") {
      return "permission-denied" as const;
    }
    return "ok" as const;
  }, [midiAccessStatus, midiAccessError]);

  const [inputPort, setInputPort, inputPortReadStatus] =
    useStateWithStoredDefault<string>(
      "@motiz88/gr55-remote/MidiIoSetup/inputPort"
    );
  const [outputPort, setOutputPort, outputPortReadStatus] =
    useStateWithStoredDefault<string>(
      "@motiz88/gr55-remote/MidiIoSetup/outputPort"
    );
  const [midiStateChangeCount, setMidiStateChangeCount] = useState(0);

  const handleMidiStateChange = useCallback(() => {
    const connectedInputPort =
      inputPort != null ? midiAccess?.inputs.get(inputPort) : null;
    const connectedOutputPort =
      outputPort != null ? midiAccess?.outputs.get(outputPort) : null;

    if (
      inputPortReadStatus !== "pending" &&
      connectedInputPort == null &&
      midiAccess &&
      midiAccess.inputs.size
    ) {
      setInputPort([...midiAccess.inputs.keys()][0]);
    }
    if (
      outputPortReadStatus !== "pending" &&
      connectedOutputPort == null &&
      midiAccess &&
      midiAccess.outputs.size
    ) {
      setOutputPort([...midiAccess.outputs.keys()][0]);
    }
    setMidiStateChangeCount((x) => x + 1);
  }, [
    inputPort,
    midiAccess,
    outputPort,
    inputPortReadStatus,
    outputPortReadStatus,
    setInputPort,
    setOutputPort,
  ]);

  useEffect(() => {
    const myMidiAccess = midiAccess;
    if (myMidiAccess) {
      myMidiAccess.addEventListener("statechange", handleMidiStateChange);
      return () => {
        myMidiAccess.removeEventListener("statechange", handleMidiStateChange);
      };
    }
  }, [midiAccess, handleMidiStateChange]);

  useEffect(() => {
    handleMidiStateChange();
  }, [inputPort, outputPort, midiAccess, handleMidiStateChange]);

  const midiIoContext = useMemo(() => {
    // eslint-disable-next-line no-unused-expressions
    midiStateChangeCount;
    return {
      inputPort: inputPort != null ? midiAccess?.inputs?.get(inputPort) : null,
      outputPort:
        outputPort != null ? midiAccess?.outputs?.get(outputPort) : null,
      midiStatus,
    };
  }, [inputPort, midiAccess, midiStateChangeCount, outputPort, midiStatus]);

  const { inputs, outputs } = useMemo(() => {
    // eslint-disable-next-line no-unused-expressions
    midiStateChangeCount;
    return {
      inputs: new Map(midiAccess?.inputs),
      outputs: new Map(midiAccess?.outputs),
    };
  }, [midiAccess, midiStateChangeCount]);

  return {
    midiIoContext,
    inputs,
    outputs,
    currentInputId: inputPort,
    currentOutputId: outputPort,
    setCurrentInputId: setInputPort,
    setCurrentOutputId: setOutputPort,
  };
}

export function MidiIoSetupContainer({
  children,
}: {
  children?: React.ReactNode;
}) {
  const midiIoSetupState = useMidiIoSetupImpl();
  return (
    <MidiIoSetupContext.Provider value={midiIoSetupState}>
      <MidiIoContext.Provider value={midiIoSetupState.midiIoContext}>
        {children}
      </MidiIoContext.Provider>
    </MidiIoSetupContext.Provider>
  );
}

export function useMidiIoContext() {
  return useContext(MidiIoContext);
}

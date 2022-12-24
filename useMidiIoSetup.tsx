import { requestMIDIAccess } from "@motiz88/react-native-midi";
import { useCallback, useEffect, useMemo, useState } from "react";
import usePromise from "react-use-promise";

import { useStateWithStoredDefault } from "./AsyncStorageUtils";

function useMIDIAccess(sysex: boolean = false) {
  return usePromise(() => requestMIDIAccess({ sysex }), [sysex]);
}

export function useMidiIoSetup() {
  const [midiAccess] = useMIDIAccess(true);

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
    };
  }, [inputPort, midiAccess, midiStateChangeCount, outputPort]);

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

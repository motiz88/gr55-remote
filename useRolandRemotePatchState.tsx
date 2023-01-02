import { MIDIMessageEvent } from "@motiz88/react-native-midi";
import { useContext, useEffect } from "react";

import { MidiIoContext } from "./MidiIoContext";
import { RolandGR55SysExConfig } from "./RolandDevices";
import { RolandIoSetupContext } from "./RolandIoSetupContext";
import { useRolandRemotePageState } from "./useRolandRemotePageState";

export function useRolandRemotePatchState() {
  const { selectedDevice } = useContext(RolandIoSetupContext);
  const sysExConfig = selectedDevice?.sysExConfig ?? RolandGR55SysExConfig;
  const addressMap = sysExConfig.addressMap;

  const remotePageState = useRolandRemotePageState(addressMap?.temporaryPatch);
  const { inputPort } = useContext(MidiIoContext);

  useEffect(() => {
    if (!inputPort) {
      return;
    }
    const handleMidiMessage = ({ data }: MIDIMessageEvent) => {
      // program change, any channel
      if ((data[0] & 0xf0) === 0xc0) {
        remotePageState.reloadData();
      }
    };

    inputPort.addEventListener("midimessage", handleMidiMessage);

    return () => {
      inputPort.removeEventListener("midimessage", handleMidiMessage as any);
    };
  }, [inputPort, selectedDevice, inputPort?.state, remotePageState]);

  return remotePageState;
}

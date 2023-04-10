import { MIDIMessageEvent } from "@motiz88/react-native-midi";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import usePromise from "react-use-promise";

import { MidiIoContext } from "./MidiIoContext";
import { parse } from "./RolandAddressMap";
import { RolandDataTransferContext } from "./RolandDataTransferContext";
import { RolandGR55SysExConfig } from "./RolandDevices";
import { RolandIoSetupContext } from "./RolandIoSetupContext";
import { useRolandRemotePageState } from "./useRolandRemotePageState";

const RolandRemotePatchSelectionContext = createContext<{
  selectedPatch?: {
    bankSelectMSB: number;
    pc: number;
  };
  setSelectedPatch: (patch: { bankSelectMSB: number; pc: number }) => void;
}>({
  setSelectedPatch: () => {},
});

export function RolandRemotePatchSelectionContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const { selectedDevice } = useContext(RolandIoSetupContext);
  const sysExConfig = selectedDevice?.sysExConfig ?? RolandGR55SysExConfig;
  const addressMap = sysExConfig.addressMap;

  const remotePageState = useRolandRemotePageState(addressMap?.setup);
  const { inputPort, outputPort } = useContext(MidiIoContext);

  const nextBankSelectMSB = useRef<number>();

  const { requestData } = useContext(RolandDataTransferContext);

  const [selectedPatch, setSelectedPatch] = useState<{
    bankSelectMSB: number;
    pc: number;
  }>();

  usePromise(async () => {
    if (!addressMap || !requestData) {
      return;
    }
    const setupData = await requestData(
      addressMap.setup.definition,
      addressMap.setup.address
    );

    const [parsedBsMsb] = parse(
      setupData[
        addressMap.setup.address +
          addressMap.setup.definition.$.patchBsMsb.offset
      ],
      addressMap.setup.definition.$.patchBsMsb,
      0
    );

    const [parsedPc] = parse(
      setupData[
        addressMap.setup.address + addressMap.setup.definition.$.patchPc.offset
      ],
      addressMap.setup.definition.$.patchPc,
      0
    );

    const remoteSelectedPatch = {
      bankSelectMSB: parsedBsMsb.value,
      pc: parsedPc.value,
    };
    setSelectedPatch((localSelection) => {
      if (localSelection) {
        return localSelection;
      }
      return remoteSelectedPatch;
    });
  }, [addressMap, requestData]);

  useEffect(() => {
    if (!inputPort) {
      return;
    }
    const handleMidiMessage = ({ data }: MIDIMessageEvent) => {
      // program change, any channel
      if ((data[0] & 0xf0) === 0xc0 && data.length === 2) {
        if (nextBankSelectMSB.current != null) {
          setSelectedPatch({
            bankSelectMSB: nextBankSelectMSB.current,
            pc: data[1],
          });
        }
      }
      // bank select MSB, any channel
      if ((data[0] & 0xf0) === 0xb0 && data[1] === 0x00) {
        // only takes effect on next program change
        nextBankSelectMSB.current = data[2];
      }
    };

    inputPort.addEventListener("midimessage", handleMidiMessage);

    return () => {
      inputPort.removeEventListener("midimessage", handleMidiMessage as any);
    };
  }, [inputPort, selectedDevice, inputPort?.state, remotePageState]);

  const setAndSendSelectedPatch = useCallback(
    (patch: { bankSelectMSB: number; pc: number }) => {
      if (!selectedDevice || !outputPort) {
        return;
      }
      setSelectedPatch(patch);
      outputPort.send([0xb0, 0x00, patch.bankSelectMSB]);
      // TODO: Read PATCH CH from device and send on that channel
      outputPort.send([0xc0, patch.pc]);
    },
    [outputPort, selectedDevice]
  );
  const ctx = useMemo(
    () => ({ selectedPatch, setSelectedPatch: setAndSendSelectedPatch }),
    [selectedPatch, setAndSendSelectedPatch]
  );

  return (
    <RolandRemotePatchSelectionContext.Provider value={ctx}>
      {children}
    </RolandRemotePatchSelectionContext.Provider>
  );
}

export function useRolandRemotePatchSelection() {
  return useContext(RolandRemotePatchSelectionContext);
}

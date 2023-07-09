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

import { MidiIoContext } from "./MidiIoContext";
import { parse } from "./RolandAddressMap";
import { RolandDataTransferContext } from "./RolandDataTransferContext";
import { RolandGR55SysExConfig } from "./RolandDevices";
import { RolandIoSetupContext } from "./RolandIoSetupContext";
import useCancellablePromise from "./useCancellablePromise";

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

  const { inputPort, outputPort } = useContext(MidiIoContext);

  const nextBankSelectMSB = useRef<number>();

  const { requestData, setField } = useContext(RolandDataTransferContext);

  const [selectedPatch, setSelectedPatch] = useState<{
    bankSelectMSB: number;
    pc: number;
  }>();

  useCancellablePromise(
    useCallback(
      async (signal) => {
        if (!addressMap || !requestData) {
          return;
        }
        const setupData = await requestData(
          addressMap.setup.definition,
          addressMap.setup.address,
          signal,
          "read_utmost"
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
            addressMap.setup.address +
              addressMap.setup.definition.$.patchPc.offset
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
      },
      [addressMap, requestData]
    )
  );

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
  }, [inputPort, selectedDevice, inputPort?.state]);

  const setAndSendSelectedPatch = useCallback(
    (patch: { bankSelectMSB: number; pc: number }) => {
      if (!selectedDevice || !outputPort || !setField) {
        return;
      }
      setSelectedPatch(patch);
      // Instead of a standard program change, send a SysEx write to the setup page.
      // On the GR-55 this is better than a standard program change because it takes
      // effect regardless of the current screen selected on the device, and bypasses
      // the PC RX SWITCH setting (which might be set to OFF).
      // See https://www.vguitarforums.com/smf/index.php?topic=35932.0
      // TODO: If we ever support devices that don't expose this via SysEx, we'll need
      // to fall back to a standard program change.
      // TODO: Use RemotePage abstraction for setup page.
      setField(
        {
          address:
            addressMap!.setup.address +
            addressMap!.setup.definition.$.patchBsMsb.offset,
          definition: addressMap!.setup.definition.$.patchBsMsb,
        },
        patch.bankSelectMSB
      );
      setField(
        {
          address:
            addressMap!.setup.address +
            addressMap!.setup.definition.$.patchPc.offset,
          definition: addressMap!.setup.definition.$.patchPc,
        },
        patch.pc
      );
    },
    [addressMap, outputPort, selectedDevice, setField]
  );
  const ctx = useMemo(
    () => ({
      selectedPatch: selectedPatch
        ? {
            bankSelectMSB: selectedPatch.bankSelectMSB,
            pc: selectedPatch.pc,
          }
        : undefined,
      setSelectedPatch: setAndSendSelectedPatch,
    }),
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

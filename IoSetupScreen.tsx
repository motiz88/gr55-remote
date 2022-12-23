import { Picker } from "@react-native-picker/picker";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useContext, useMemo } from "react";
import { ScrollView, StyleSheet, Switch, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MidiIoSetupContext } from "./MidiIoSetupContext";
import { RolandIoSetupContext } from "./RolandIoSetupContext";
import { RootStackParamList } from "./navigation";

export function IoSetupScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "IoSetup">) {
  const {
    inputs,
    outputs,
    setCurrentInputId,
    currentInputId,
    setCurrentOutputId,
    currentOutputId,
  } = useContext(MidiIoSetupContext);

  const rolandIoSetupContext = useContext(RolandIoSetupContext);

  const insets = useSafeAreaInsets();

  const safeAreaStyle = useMemo(
    () => ({
      // TODO: Landscape mode?
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
    }),
    [insets]
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={safeAreaStyle}>
      {inputs && outputs && (
        <>
          <Text>Input</Text>
          <Picker
            onValueChange={setCurrentInputId}
            selectedValue={currentInputId}
          >
            {[...inputs.entries()].map(([key, input]) => (
              <Picker.Item label={input.name} key={key} value={key} />
            ))}
          </Picker>
          <Text>Output</Text>
          <Picker
            onValueChange={setCurrentOutputId}
            selectedValue={currentOutputId}
          >
            {[...outputs.entries()].map(([key, output]) => (
              <Picker.Item label={output.name} key={key} value={key} />
            ))}
          </Picker>
        </>
      )}
      <>
        <Text>Connected devices</Text>
        <Picker
          onValueChange={rolandIoSetupContext.setSelectedDeviceKey}
          selectedValue={rolandIoSetupContext.selectedDeviceKey}
        >
          {[...rolandIoSetupContext.connectedDevices.entries()].map(
            ([key, device]) => {
              const deviceIdHexTag =
                "[0x" +
                device.identity.deviceId.toString(16).padStart(2, "0") +
                "]";

              return (
                <Picker.Item
                  label={deviceIdHexTag + " " + device.description}
                  key={key}
                  value={key}
                />
              );
            }
          )}
        </Picker>
      </>
      <>
        <Text>Include fake GR-55</Text>
        <Switch
          onValueChange={rolandIoSetupContext.setIncludeFakeDevice}
          value={rolandIoSetupContext.includeFakeDevice}
        />
      </>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});

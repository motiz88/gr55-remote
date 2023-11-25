import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button } from "@rneui/themed";
import { useCallback, useContext, useEffect } from "react";
import { StyleSheet, Switch } from "react-native";

import { canShowBluetoothSettings } from "./BluetoothSettingsScreen";
import { MidiIoSetupContext } from "./MidiIo";
import { PopoverAwareScrollView } from "./PopoverAwareScrollView";
import { RolandIoSetupContext } from "./RolandIoSetup";
import { useMainScrollViewSafeAreaStyle } from "./SafeAreaUtils";
import { ThemedPicker as Picker } from "./ThemedPicker";
import { ThemedText as Text } from "./ThemedText";
import { useUserOptions } from "./UserOptions";
import { SetupStackParamList } from "./navigation";

export function IoSetupScreen({
  navigation,
}: NativeStackScreenProps<SetupStackParamList, "IoSetup", "SetupStack">) {
  const {
    inputs,
    outputs,
    setCurrentInputId,
    currentInputId,
    setCurrentOutputId,
    currentOutputId,
  } = useContext(MidiIoSetupContext);

  const rolandIoSetupContext = useContext(RolandIoSetupContext);

  const safeAreaStyle = useMainScrollViewSafeAreaStyle();

  const [userOptions, setUserOptions] = useUserOptions();

  const setEnableExperimentalFeatures = useCallback(
    (enableExperimentalFeatures: boolean) =>
      setUserOptions({
        enableExperimentalFeatures,
      }),
    [setUserOptions]
  );

  useEffect(() => {
    if (canShowBluetoothSettings) {
      const navigateToBluetoothSettings = () => {
        navigation.navigate("BluetoothSettings", {});
      };
      navigation.setOptions({
        headerRight: ({ tintColor }) => {
          return (
            <Button type="clear" onPress={navigateToBluetoothSettings}>
              <MaterialCommunityIcons
                name="bluetooth"
                size={24}
                color={tintColor}
              />
            </Button>
          );
        },
      });
    }
  }, [navigation]);

  return (
    <PopoverAwareScrollView
      style={styles.container}
      contentContainerStyle={safeAreaStyle}
    >
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
      <>
        <Text>Enable experimental options 🧪</Text>
        <Switch
          onValueChange={setEnableExperimentalFeatures}
          value={userOptions.enableExperimentalFeatures}
        />
      </>
    </PopoverAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});

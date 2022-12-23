import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { IoSetupScreen } from "./IoSetupScreen";
import { MidiIoContext } from "./MidiIoContext";
import { MidiIoSetupContext } from "./MidiIoSetupContext";
import { PatchEffectsScreen } from "./PatchEffectsScreen";
import { PatchMainScreen } from "./PatchMainScreen";
import { PatchToneScreen } from "./PatchToneScreen";
import { RolandDataTransferContext } from "./RolandDataTransferContext";
import { RolandIoSetupContext } from "./RolandIoSetupContext";
import { RolandRemotePatchContext } from "./RolandRemotePatchContext";
import { RootStackParamList } from "./navigation";
import { useMidiIoSetup } from "./useMidiIoSetup";
import { useRolandDataTransfer } from "./useRolandDataTransfer";
import { useRolandIoSetup } from "./useRolandIoSetup";
import { useRolandRemotePatchState } from "./useRolandRemotePatchState";

const RootStack = createNativeStackNavigator<RootStackParamList>();

function MidiIoSetupContainer({ children }: { children?: React.ReactNode }) {
  const midiIoSetupState = useMidiIoSetup();
  return (
    <MidiIoSetupContext.Provider value={midiIoSetupState}>
      <MidiIoContext.Provider value={midiIoSetupState.midiIoContext}>
        {children}
      </MidiIoContext.Provider>
    </MidiIoSetupContext.Provider>
  );
}

function RolandIoSetupContainer({ children }: { children?: React.ReactNode }) {
  const rolandIoSetupState = useRolandIoSetup();
  return (
    <RolandIoSetupContext.Provider value={rolandIoSetupState}>
      {children}
    </RolandIoSetupContext.Provider>
  );
}

function RolandRemotePatchStateContainer({
  children,
}: {
  children?: React.ReactNode;
}) {
  const rolandRemotePatchState = useRolandRemotePatchState();
  return (
    <RolandRemotePatchContext.Provider value={rolandRemotePatchState}>
      {children}
    </RolandRemotePatchContext.Provider>
  );
}

function RolandDataTransferContainer({
  children,
}: {
  children?: React.ReactNode;
}) {
  const rolandDataTransfer = useRolandDataTransfer();
  return (
    <RolandDataTransferContext.Provider value={rolandDataTransfer}>
      {children}
    </RolandDataTransferContext.Provider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <MidiIoSetupContainer>
          <RolandIoSetupContainer>
            <RolandDataTransferContainer>
              <RolandRemotePatchStateContainer>
                <RootStack.Navigator
                  initialRouteName="PatchMain"
                  id="RootStack"
                >
                  <RootStack.Screen
                    name="PatchMain"
                    component={PatchMainScreen}
                  />
                  <RootStack.Screen
                    name="PatchTone"
                    component={PatchToneScreen}
                  />
                  <RootStack.Screen
                    name="PatchEffects"
                    component={PatchEffectsScreen}
                  />
                  <RootStack.Screen
                    name="IoSetup"
                    component={IoSetupScreen}
                    options={{ title: "Setup" }}
                  />
                </RootStack.Navigator>
              </RolandRemotePatchStateContainer>
            </RolandDataTransferContainer>
          </RolandIoSetupContainer>
        </MidiIoSetupContainer>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

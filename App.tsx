import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import AppNavigationContainer from "./AppNavigationContainer";
import { IoSetupScreen } from "./IoSetupScreen";
import { MidiIoContext } from "./MidiIoContext";
import { MidiIoSetupContext } from "./MidiIoSetupContext";
import { PatchAssignsScreen } from "./PatchAssignsScreen";
import { PatchEffectsScreen } from "./PatchEffectsScreen";
import { PatchMainScreen } from "./PatchMainScreen";
import { PatchToneScreen } from "./PatchToneScreen";
import { PopoversContainer, usePopovers } from "./Popovers";
import { RolandDataTransferContext } from "./RolandDataTransferContext";
import { RolandGR55AssignsContainer } from "./RolandGR55AssignsContainer";
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
      <MidiIoSetupContainer>
        <RolandIoSetupContainer>
          <RolandDataTransferContainer>
            <RolandRemotePatchStateContainer>
              <AppNavigationContainer>
                <RolandGR55AssignsContainer>
                  <PopoversContainer>
                    <RootNavigator />
                  </PopoversContainer>
                </RolandGR55AssignsContainer>
              </AppNavigationContainer>
            </RolandRemotePatchStateContainer>
          </RolandDataTransferContainer>
        </RolandIoSetupContainer>
      </MidiIoSetupContainer>
    </SafeAreaProvider>
  );
}

function RootNavigator() {
  const { closeAllPopovers } = usePopovers();
  return (
    <RootStack.Navigator
      initialRouteName="PatchMain"
      id="RootStack"
      screenListeners={{
        transitionStart: () => {
          closeAllPopovers();
        },
        blur: () => {
          closeAllPopovers();
        },
      }}
    >
      <RootStack.Screen
        name="PatchMain"
        component={PatchMainScreen}
        listeners={
          {
            // blur: () => {
            //   closeAllPopovers();
            // },
          }
        }
      />
      <RootStack.Screen
        name="PatchTone"
        component={PatchToneScreen}
        listeners={
          {
            // blur: () => {
            //   closeAllPopovers();
            // },
          }
        }
      />
      <RootStack.Screen
        name="PatchEffects"
        component={PatchEffectsScreen}
        listeners={
          {
            // blur: () => {
            //   closeAllPopovers();
            // },
          }
        }
      />
      <RootStack.Screen
        name="PatchAssigns"
        component={PatchAssignsScreen}
        listeners={
          {
            // blur: () => {
            //   closeAllPopovers();
            // },
          }
        }
      />
      <RootStack.Screen
        name="IoSetup"
        component={IoSetupScreen}
        options={{ title: "Setup" }}
        listeners={
          {
            // blur: () => {
            //   closeAllPopovers();
            // },
          }
        }
      />
    </RootStack.Navigator>
  );
}

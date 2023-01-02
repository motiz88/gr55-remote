// import { createDrawerNavigator } from "@react-navigation/drawer";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
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
import { PatchStackParamList } from "./navigation";
import { useMidiIoSetup } from "./useMidiIoSetup";
import { useRolandDataTransfer } from "./useRolandDataTransfer";
import { useRolandIoSetup } from "./useRolandIoSetup";
import { useRolandRemotePatchState } from "./useRolandRemotePatchState";

const PatchStack = createNativeStackNavigator<PatchStackParamList>();

const PatchDrawer = createDrawerNavigator();
const RootTab = createBottomTabNavigator();

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
                    <RootTabNavigator />
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

function PatchDrawerContent(
  props: DrawerContentComponentProps
): React.ReactNode {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        style={{ paddingLeft: 0 }}
        label="Tone"
        onPress={() => props.navigation.navigate("PatchTone")}
      />
      <DrawerItem
        style={{ paddingLeft: 20 }}
        label="Normal Pickup"
        onPress={() =>
          props.navigation.navigate("PatchTone", { screen: "Normal" })
        }
      />
      <DrawerItem
        style={{ paddingLeft: 20 }}
        label="PCM1"
        onPress={() =>
          props.navigation.navigate("PatchTone", { screen: "PCM1" })
        }
      />
      <DrawerItem
        style={{ paddingLeft: 20 }}
        label="PCM2"
        onPress={() =>
          props.navigation.navigate("PatchTone", { screen: "PCM2" })
        }
      />
      <DrawerItem
        style={{ paddingLeft: 20 }}
        label="Modeling"
        onPress={() =>
          props.navigation.navigate("PatchTone", { screen: "Modeling" })
        }
      />
      <DrawerItem
        style={{ paddingLeft: 0 }}
        label="Effects"
        onPress={() => props.navigation.navigate("PatchEffects")}
      />
      <DrawerItem
        style={{ paddingLeft: 0 }}
        label="Assigns"
        onPress={() => props.navigation.navigate("PatchAssigns")}
      />
    </DrawerContentScrollView>
  );
}

function PatchDrawerNavigator() {
  return (
    <PatchDrawer.Navigator drawerContent={PatchDrawerContent} id="PatchDrawer">
      <PatchDrawer.Screen
        name="PatchStack"
        component={PatchStackNavigator}
        options={{ headerShown: false, title: "Home" }}
      />
    </PatchDrawer.Navigator>
  );
}

function RootTabNavigator() {
  return (
    <RootTab.Navigator id="RootTab">
      <RootTab.Screen
        name="PatchDrawer"
        component={PatchDrawerNavigator}
        options={{
          headerShown: false,
          title: "Patch",
          tabBarIcon: ({ color }) => (
            <Entypo name="sound-mix" size={24} color={color} />
          ),
        }}
      />
      <RootTab.Screen
        name="IoSetup"
        component={IoSetupScreen}
        options={{
          title: "Setup",
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings" size={24} color={color} />
          ),
        }}
      />
    </RootTab.Navigator>
  );
}

function PatchStackNavigator() {
  const { closeAllPopovers } = usePopovers();
  return (
    <PatchStack.Navigator
      initialRouteName="PatchMain"
      id="PatchStack"
      screenListeners={{
        transitionStart: () => {
          closeAllPopovers();
        },
        blur: () => {
          closeAllPopovers();
        },
      }}
    >
      <PatchStack.Screen name="PatchMain" component={PatchMainScreen} />
      <PatchStack.Screen name="PatchTone" component={PatchToneScreen} />
      <PatchStack.Screen name="PatchEffects" component={PatchEffectsScreen} />
      <PatchStack.Screen name="PatchAssigns" component={PatchAssignsScreen} />
    </PatchStack.Navigator>
  );
}

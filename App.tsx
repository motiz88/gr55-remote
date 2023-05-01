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
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import AppNavigationContainer from "./AppNavigationContainer";
import { IoSetupScreen } from "./IoSetupScreen";
import { LibraryPatchListScreen } from "./LibraryPatchListScreen";
import { MidiIoContext } from "./MidiIoContext";
import { MidiIoSetupContext } from "./MidiIoSetupContext";
import { PatchAssignsScreen } from "./PatchAssignsScreen";
import { PatchEffectsScreen } from "./PatchEffectsScreen";
import { PatchMainScreen } from "./PatchMainScreen";
import { PatchMasterOtherScreen } from "./PatchMasterOtherScreen";
import { PatchMasterPedalGkCtlScreen } from "./PatchMasterPedalGkCtlScreen";
import { PatchToneScreen } from "./PatchToneScreen";
import { PopoversContainer, usePopovers } from "./Popovers";
import { RolandDataTransferContext } from "./RolandDataTransferContext";
import { RolandGR55AssignsContainer } from "./RolandGR55AssignsContainer";
import { RolandGR55RemotePatchDescriptionsContainer } from "./RolandGR55RemotePatchDescriptions";
import { RolandIoSetupContext } from "./RolandIoSetupContext";
import {
  RolandRemotePatchContext,
  RolandRemoteSystemContext,
} from "./RolandRemotePageContext";
import { RolandRemotePatchSelectionContainer } from "./RolandRemotePatchSelection";
import { ThemeProvider } from "./Theme";
import { ThemedContextualStyleProvider } from "./ThemedContextualStyleProvider";
import { UserOptionsContainer, useUserOptions } from "./UserOptions";
import { PatchStackParamList, RootTabParamList } from "./navigation";
import { useMidiIoSetup } from "./useMidiIoSetup";
import {
  useFocusQueryPriority,
  useRolandDataTransfer,
} from "./useRolandDataTransfer";
import { useRolandIoSetup } from "./useRolandIoSetup";
import { useRolandRemotePatchState } from "./useRolandRemotePatchState";
import { useRolandRemoteSystemState } from "./useRolandRemoteSystemState";

const PatchStack = createNativeStackNavigator<PatchStackParamList>();

const PatchDrawer = createDrawerNavigator();
const RootTab = createBottomTabNavigator<RootTabParamList>();

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

function RolandRemoteSystemStateContainer({
  children,
}: {
  children?: React.ReactNode;
}) {
  const rolandRemoteSystemState = useRolandRemoteSystemState();
  return (
    <RolandRemoteSystemContext.Provider value={rolandRemoteSystemState}>
      {children}
    </RolandRemoteSystemContext.Provider>
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
      <UserOptionsContainer>
        <MidiIoSetupContainer>
          <RolandIoSetupContainer>
            <RolandDataTransferContainer>
              <RolandRemoteSystemStateContainer>
                <RolandGR55RemotePatchDescriptionsContainer>
                  <RolandRemotePatchSelectionContainer>
                    <RolandRemotePatchStateContainer>
                      <AppNavigationContainer>
                        <RolandGR55AssignsContainer>
                          <ThemeProvider>
                            <ThemedContextualStyleProvider>
                              <PopoversContainer>
                                <KeyboardAvoidingView
                                  behavior={
                                    Platform.OS === "ios"
                                      ? "padding"
                                      : undefined
                                  }
                                  enabled={
                                    // On Android we rely on android:windowSoftInputMode="resize".
                                    // On web we currently let things render under the keyboard.
                                    Platform.OS === "ios"
                                  }
                                  style={styles.keyboardAvoidingView}
                                >
                                  <RootTabNavigator />
                                </KeyboardAvoidingView>
                              </PopoversContainer>
                            </ThemedContextualStyleProvider>
                          </ThemeProvider>
                        </RolandGR55AssignsContainer>
                      </AppNavigationContainer>
                    </RolandRemotePatchStateContainer>
                  </RolandRemotePatchSelectionContainer>
                </RolandGR55RemotePatchDescriptionsContainer>
              </RolandRemoteSystemStateContainer>
            </RolandDataTransferContainer>
          </RolandIoSetupContainer>
        </MidiIoSetupContainer>
      </UserOptionsContainer>
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
      {/* <DrawerItem
        style={{ paddingLeft: 0 }}
        label="Master"
        onPress={() => props.navigation.navigate("PatchAssigns")}
      /> */}
      <DrawerItem
        style={{ paddingLeft: 0 }}
        label="Pedal / GK Control"
        onPress={() => props.navigation.navigate("PatchMasterPedalGkCtl")}
      />
      <DrawerItem
        style={{ paddingLeft: 0 }}
        label="Assigns"
        onPress={() => props.navigation.navigate("PatchAssigns")}
      />
      <DrawerItem
        style={{ paddingLeft: 0 }}
        label="Other"
        onPress={() => props.navigation.navigate("PatchMasterOther")}
      />
    </DrawerContentScrollView>
  );
}

function PatchDrawerNavigator() {
  useFocusQueryPriority("read_patch_details");
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
  const EXPERIMENTAL_ROUTES = ["LibraryPatchList"];
  const [{ enableExperimentalFeatures }] = useUserOptions();
  return (
    <RootTab.Navigator
      id="RootTab"
      screenOptions={({ route }) => ({
        tabBarHideOnKeyboard: true,
        tabBarButton:
          !enableExperimentalFeatures &&
          EXPERIMENTAL_ROUTES.includes(route.name)
            ? () => {
                return null;
              }
            : undefined,
      })}
    >
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
        name="LibraryPatchList"
        component={LibraryPatchListScreen}
        options={{
          title: "Library 🧪",
          tabBarIcon: ({ color }) => (
            <Ionicons name="library" size={24} color={color} />
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
      <PatchStack.Screen
        name="PatchMasterOther"
        component={PatchMasterOtherScreen}
        options={{ title: "Other" }}
      />
      <PatchStack.Screen
        name="PatchMasterPedalGkCtl"
        component={PatchMasterPedalGkCtlScreen}
        options={{ title: "Pedal / GK CTL" }}
      />
    </PatchStack.Navigator>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
});

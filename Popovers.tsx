import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useRef,
} from "react";
import {
  ColorValue,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Popover, { PopoverMode as Mode, Rect } from "react-native-popover-view";

export type PopoverProps =
  | {
      id: "AssignFromField";
      onCreateAssign: () => void;
      canCreateAssign: boolean;
      onDeleteAssigns: () => void;
      canDeleteAssigns: boolean;
      editableAssigns: readonly number[];
      onEditAssign: (assignIndex: number) => void;
      showNoAssignsAvailable: boolean;
    }
  | { id: "OtherPopover"; foo: number };

type PopoversState = {
  props: PopoverProps | undefined;
  source: Rect | React.RefObject<View> | undefined;
  visible: boolean;
};

export type ShowPopoverOptions = Readonly<{
  props: PopoverProps;
  source: Rect | React.RefObject<View>;
}>;

function popoversReducer(
  state: PopoversState,
  action:
    | {
        props: PopoverProps;
        type: "SHOW";
        source: Rect | React.RefObject<View>;
      }
    | {
        type: "HIDE";
      }
): PopoversState {
  switch (action.type) {
    case "SHOW":
      return {
        ...state,
        props: action.props,
        visible: true,
        source: action.source,
      };
    case "HIDE":
      return {
        ...state,
        visible: false,
      };
    default:
      return state;
  }
}

function popoversInit() {
  return {
    source: undefined,
    visible: false,
    props: undefined,
  };
}

export function PopoversContainer({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(
    popoversReducer,
    undefined,
    popoversInit
  );
  const showPopover = useCallback(({ props, source }: ShowPopoverOptions) => {
    dispatch({ type: "SHOW", props, source });
  }, []);
  const popoversContext = useMemo(
    () => ({
      showPopover,
      closeAllPopovers: () => dispatch({ type: "HIDE" }),
    }),
    [showPopover, dispatch]
  );
  return (
    <>
      <PopoversContext.Provider value={popoversContext}>
        {children}
      </PopoversContext.Provider>
      <AssignFromFieldPopover
        state={state}
        onRequestClose={popoversContext.closeAllPopovers}
      />
    </>
  );
}

function AssignFromFieldPopover({
  state,
  onRequestClose,
}: {
  state: PopoversState;
  onRequestClose: () => void;
}) {
  const handleCreateAssign = useCallback(() => {
    if (!lastProps.current) {
      return;
    }
    lastProps.current.onCreateAssign();
    onRequestClose();
  }, [onRequestClose]);
  const handleDeleteAssigns = useCallback(() => {
    if (!lastProps.current) {
      return;
    }
    lastProps.current.onDeleteAssigns();
    onRequestClose();
  }, [onRequestClose]);
  const lastProps = useRef<PopoverProps & { id: "AssignFromField" }>();
  if (state.props?.id === "AssignFromField") {
    lastProps.current = state.props;
  }

  return (
    <Popover
      popoverStyle={styles.popover}
      isVisible={state.visible && state.props?.id === "AssignFromField"}
      from={state.source}
      onRequestClose={onRequestClose}
      mode={Mode.TOOLTIP}
      animationConfig={{ duration: 100 }}
    >
      {lastProps.current?.canCreateAssign && (
        <PopoverMenuItem onPress={handleCreateAssign}>
          Assign...
        </PopoverMenuItem>
      )}
      {lastProps.current?.showNoAssignsAvailable && (
        <PopoverMenuItem disabled>
          Assign... (No slots available)
        </PopoverMenuItem>
      )}
      {lastProps.current?.editableAssigns.map((assignIndex) => (
        <PopoverMenuItem
          key={assignIndex}
          onPress={() => {
            lastProps.current?.onEditAssign(assignIndex);
            onRequestClose();
          }}
        >
          {lastProps.current!.editableAssigns.length > 1
            ? `Edit assignment #${assignIndex + 1}`
            : "Edit assignment"}
        </PopoverMenuItem>
      ))}
      {lastProps.current?.canDeleteAssigns && (
        <PopoverMenuItem onPress={handleDeleteAssigns} color="red">
          Unassign {lastProps.current!.editableAssigns.length > 1 ? "all" : ""}
        </PopoverMenuItem>
      )}
    </Popover>
  );
}

function PopoverMenuItem({
  children,
  onPress,
  color,
  disabled,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  color?: ColorValue;
  disabled?: boolean;
}) {
  const view = (
    <View style={styles.popoverMenuItem}>
      <Text
        numberOfLines={1}
        style={[{ color }, disabled && styles.popoverMenuItemTextDisabled]}
      >
        {children}
      </Text>
    </View>
  );
  if (disabled || !onPress) {
    return <>{view}</>;
  }
  return <TouchableOpacity onPress={onPress}>{view}</TouchableOpacity>;
}

const PopoversContext = createContext<{
  showPopover: (options: ShowPopoverOptions) => void;
  closeAllPopovers: () => void;
}>({
  showPopover: () => {},
  closeAllPopovers: () => {},
});

export const usePopovers = () => useContext(PopoversContext);

const styles = StyleSheet.create({
  popover: {
    backgroundColor: "white",
  },
  popoverMenuItem: {
    padding: 16,
  },
  popoverMenuItemTextDisabled: {
    color: "grey",
  },
});

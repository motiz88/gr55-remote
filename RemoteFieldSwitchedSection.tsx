import { View, Animated, StyleSheet } from "react-native";
import { useAnimation } from "react-native-animation-hooks";

import { useContextualStyle } from "./ContextualStyle";
import { RemoteFieldSwitch } from "./RemoteFieldSwitch";
import { BooleanField, FieldReference } from "./RolandAddressMap";
import { RolandRemotePageContext } from "./RolandRemotePageContext";
import { useRemoteField } from "./useRemoteField";

export function RemoteFieldSwitchedSection({
  page,
  field,
  children,
}: {
  page: RolandRemotePageContext;
  field: FieldReference<BooleanField>;
  children?: React.ReactNode;
}) {
  const [value, setValue, status] = useRemoteField(page, field);
  const isDisabled = field.definition.type.invertedForDisplay ? value : !value;
  const isPending = status === "pending";

  const overlayOpacity = useAnimation({
    type: "timing",
    initialValue: isPending ? 0.5 : isDisabled ? 0.5 : 0,
    toValue: isPending ? 0.5 : isDisabled ? 0.5 : 0,
    duration: 150,
    useNativeDriver: true,
  });
  const { backgroundColor } = useContextualStyle();
  return (
    <>
      <RemoteFieldSwitch
        page={page}
        field={field}
        value={value}
        onValueChange={setValue}
      />
      <View>
        {/* NOTE: This is first with a custom zIndex, because placing this last
                with a "natural" zIndex breaks some overlaid components' touch
                behaviour (specifically Slider) on web. */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.disabledSectionOverlay,
            { backgroundColor },
            { opacity: overlayOpacity },
          ]}
        />
        {children}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  disabledSectionOverlay: {
    zIndex: 1,
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.5,
  },
});

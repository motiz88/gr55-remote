import { View, Animated, StyleSheet } from "react-native";
import { useAnimation } from "react-native-animation-hooks";

import { PatchFieldSwitch } from "./PatchFieldSwitch";
import { BooleanField, FieldReference } from "./RolandAddressMap";
import { usePatchField } from "./usePatchField";

export function PatchFieldSwitchedSection({
  field,
  children,
}: {
  field: FieldReference<BooleanField>;
  children?: React.ReactNode;
}) {
  const [value, setValue] = usePatchField(field, false);
  const isDisabled = field.definition.type.invertedForDisplay ? value : !value;

  const overlayOpacity = useAnimation({
    type: "timing",
    initialValue: isDisabled ? 0.5 : 0,
    toValue: isDisabled ? 0.5 : 0,
    duration: 150,
    useNativeDriver: true,
  });

  return (
    <>
      <PatchFieldSwitch field={field} value={value} onValueChange={setValue} />
      <View>
        {/* NOTE: This is first with a custom zIndex, because placing this last
                with a "natural" zIndex breaks some overlaid components' touch
                behaviour (specifically Slider) on web. */}
        <Animated.View
          pointerEvents="none"
          style={[styles.disabledSectionOverlay, { opacity: overlayOpacity }]}
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
    // TODO: Vary based on theme (dark/light mode)
    backgroundColor: "#f2f2f2",
    opacity: 0.5,
  },
});

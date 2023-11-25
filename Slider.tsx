import { Slider as MiblanchardSlider } from "@miblanchard/react-native-slider";
import { ComponentProps } from "react";
import { StyleSheet } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";

const THUMB_TOUCH_SIZE_DEFAULT = {
  width: 48,
  height: 48,
};

export function Slider(
  props: Omit<
    ComponentProps<typeof MiblanchardSlider>,
    "thumbTouchSize" | "trackStyle" | "thumbStyle" | "animationType"
  >
) {
  const native = Gesture.Native();
  return (
    <GestureDetector gesture={native}>
      <MiblanchardSlider
        thumbTouchSize={THUMB_TOUCH_SIZE_DEFAULT}
        trackStyle={styles.sliderTrack}
        thumbStyle={styles.sliderThumb}
        {...props}
      />
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  sliderTrack: {
    height: 32,
  },
  sliderThumb: {
    opacity: 0,
    width: 0,
  },
});

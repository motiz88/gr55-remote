import { Slider as RNESlider } from "@rneui/themed";
import { StyleSheet } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";

import type { PortableSliderProps } from "./Slider";

export function Slider(props: PortableSliderProps) {
  const pan = Gesture.Pan();
  return (
    // Detect a pan gesture without acting on it - this is just to steal the
    // gesture from a parent scroll view (in particular react-navigation's).
    <GestureDetector gesture={pan}>
      <RNESlider
        allowTouchTrack
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
    // This is a hack to make the slider *track* render mostly correctly. It looks wonky at value=min though.
    width: 1,
  },
});

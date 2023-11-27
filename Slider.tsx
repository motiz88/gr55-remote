import { Slider as MiblanchardSlider } from "@miblanchard/react-native-slider";
import { StyleSheet, ViewStyle } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";

export type PortableSliderProps = Readonly<{
  maximumValue?: number;
  minimumValue?: number;
  step?: number;
  onValueChange?: (value: number | number[]) => void;
  onSlidingStart?: (value: number | number[]) => void;
  onSlidingComplete?: (value: number | number[]) => void;
  value?: number;
  minimumTrackTintColor?: string;
  maximumTrackTintColor?: string;
  disabled?: boolean;
  trackStyle?: ViewStyle;
  thumbTouchSize?: Readonly<{
    width: number;
    height: number;
  }>;
}>;

export function Slider(props: PortableSliderProps) {
  const native = Gesture.Native();
  return (
    <GestureDetector gesture={native}>
      <MiblanchardSlider thumbStyle={styles.sliderThumb} {...props} />
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  sliderThumb: {
    opacity: 0,
    width: 0,
  },
});

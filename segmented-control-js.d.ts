// Hack to expose the pure JS version of SegmentedControl with types
declare module "@react-native-segmented-control/segmented-control/js/SegmentedControl.js" {
  import SegmentedControl from "@react-native-segmented-control/segmented-control";
  export default SegmentedControl;
}

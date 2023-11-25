import ExpoModulesCore
import CoreMIDI

public class MidiHardwareManagerModule: Module {
  public func definition() -> ModuleDefinition {
    Name("MidiHardwareManager")

    View(MidiHardwareManagerView.self) {}
  }
}

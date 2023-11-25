import ExpoModulesCore
import CoreMIDI

public class MidiHardwareManagerModule: Module {
  public func definition() -> ModuleDefinition {
    Name("MidiHardwareManager")

    View(MidiHardwareManagerView.self) {}

    Function("setNetworkSessionsEnabled") { (enabled: Bool) in
        let session = MIDINetworkSession.default()
        session.isEnabled = true
        session.connectionPolicy = enabled ? MIDINetworkConnectionPolicy.anyone : MIDINetworkConnectionPolicy.noOne
    }
  }
}

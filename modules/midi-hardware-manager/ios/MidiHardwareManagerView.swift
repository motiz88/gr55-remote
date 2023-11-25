import ExpoModulesCore
import CoreAudioKit

class MidiHardwareManagerView: ExpoView {
  private var bleClientVC = CABTMIDICentralViewController()

  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    addSubview(bleClientVC.view)
  }
  
  override func layoutSubviews() {
    bleClientVC.view.frame = bounds
  }
}

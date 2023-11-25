package com.motiz88.reactnativemidi

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class MidiHardwareManagerModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("MidiHardwareManager")

    View(MidiHardwareManagerView::class) {}
  }
}

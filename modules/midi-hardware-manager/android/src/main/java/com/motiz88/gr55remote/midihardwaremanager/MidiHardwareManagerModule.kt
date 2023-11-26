package com.motiz88.gr55remote.midihardwaremanager

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import android.content.Context
import android.media.midi.*
import android.os.Handler
import android.os.Looper
import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.CodedException
import android.bluetooth.*

class MidiHardwareManagerModule : Module() {
  private val midiManager: MidiManager?
        get() = appContext.reactContext?.getSystemService(Context.MIDI_SERVICE) as? MidiManager
  private val bluetoothManager: BluetoothManager?
        get() = appContext.reactContext?.getSystemService(Context.BLUETOOTH_SERVICE) as? BluetoothManager
  private val openDevices = HashMap<Int, MidiDevice>()

  override fun definition() = ModuleDefinition {
    Name("MidiHardwareManager")

    View(MidiHardwareManagerView::class) {}

    AsyncFunction("openBluetoothDevice") { id: String, promise: Promise ->
        midiManager!!.openBluetoothDevice(
          bluetoothManager!!.getAdapter().getRemoteDevice(id),{
            if (it == null) {
                promise.reject(CodedException("Failed to open device"))
            } else {
                openDevices[it.hashCode()] = it
                promise.resolve(it.hashCode())
            }
        }, Handler(Looper.myLooper()!!))
    }

    Function("closeDevice") { hashCode: Int ->
        val device = openDevices[hashCode]
        if (device != null) {   
          device.close()
          openDevices.remove(hashCode)
        }
    }
  }
}

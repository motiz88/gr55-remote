import { PermissionsAndroid, Platform } from "react-native";
import {
  BleError,
  BleErrorCode,
  BleManager,
  Device,
  State as BluetoothState,
  LogLevel,
  type UUID,
} from "react-native-ble-plx";

class BLEServiceInstance {
  manager: BleManager;

  constructor() {
    this.manager = new BleManager();
    this.manager.setLogLevel(LogLevel.Verbose);
  }

  initializeBLE = () =>
    new Promise<void>((resolve) => {
      const subscription = this.manager.onStateChange((state) => {
        switch (state) {
          case BluetoothState.Unsupported:
            this.showDevError("");
            break;
          case BluetoothState.PoweredOff:
            this.onBluetoothPowerOff();
            this.manager.enable().catch((error: BleError) => {
              if (error.errorCode === BleErrorCode.BluetoothUnauthorized) {
                this.requestBluetoothPermission();
              }
            });
            break;
          case BluetoothState.Unauthorized:
            this.requestBluetoothPermission();
            break;
          case BluetoothState.PoweredOn:
            resolve();
            subscription.remove();
            break;
          default:
            console.error("Unsupported state: ", state);
        }
      }, true);
    });

  onBluetoothPowerOff = () => {
    this.showDevError("Bluetooth is turned off");
  };

  scanDevices = async (
    onDeviceFound: (device: Device) => void,
    UUIDs: UUID[] | null = null,
    legacyScan?: boolean
  ) => {
    this.manager.startDeviceScan(UUIDs, { legacyScan }, (error, device) => {
      if (error) {
        this.onError(error);
        console.error(error.message);
        this.manager.stopDeviceScan();
        return;
      }
      if (device) {
        onDeviceFound(device);
      }
    });
  };

  onError = (error: BleError) => {
    switch (error.errorCode) {
      case BleErrorCode.BluetoothUnauthorized:
        this.requestBluetoothPermission();
        break;
      case BleErrorCode.LocationServicesDisabled:
        this.showDevError("Location services are disabled");
        break;
      default:
        this.showDevError(JSON.stringify(error, null, 4));
    }
  };

  requestBluetoothPermission = async () => {
    if (Platform.OS === "ios") {
      return true;
    }
    if (
      Platform.OS === "android" &&
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    ) {
      const apiLevel = parseInt(Platform.Version.toString(), 10);

      if (apiLevel < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      if (
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN &&
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
      ) {
        const result = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        ]);

        return (
          result["android.permission.BLUETOOTH_CONNECT"] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          result["android.permission.BLUETOOTH_SCAN"] ===
            PermissionsAndroid.RESULTS.GRANTED
        );
      }
    }

    this.showDevError("Permission have not been granted");

    return false;
  };

  showDevError = (error: string) => {
    console.error(error);
  };
}

export const BLEService = new BLEServiceInstance();

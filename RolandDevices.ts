import { RolandGR55AddressMapAbsolute } from "./RolandGR55AddressMap";
import { RolandSysExConfig } from "./RolandSysExProtocol";

export const RolandGR55SysExConfig: RolandSysExConfig = {
  description: "Roland GR-55",
  manufacturerId: 0x41,
  addressBytes: 4,
  modelId: [0x00, 0x00, 0x53],
  familyCode: 0x5302,
  modelNumber: 0x0000,
  addressMap: {
    temporaryPatch: RolandGR55AddressMapAbsolute.temporaryPatch,
  },
};

export const AllSysExConfigs: readonly RolandSysExConfig[] = [
  RolandGR55SysExConfig,
];

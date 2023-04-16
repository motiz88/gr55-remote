import type { RolandAddressMap } from "./RolandAddressMap";
import { AssignsMap } from "./RolandGR55Assigns";
import type { RolandGR55PatchMap } from "./RolandGR55PatchMap";

export interface RolandSysExConfig {
  readonly description: string;
  readonly manufacturerId: number;
  readonly addressBytes: 3 | 4;
  readonly modelId: readonly number[];
  readonly familyCode: number;
  readonly modelNumber: number;
  readonly addressMap?: RolandAddressMap;

  // Configuration specific to the GR-55
  readonly gr55?: {
    readonly assignsMapBassMode: AssignsMap;
    readonly assignsMapGuitarMode: AssignsMap;
    readonly patchMapBassMode: RolandGR55PatchMap;
    readonly patchMapGuitarMode: RolandGR55PatchMap;
  };
}

export const GAP_BETWEEN_MESSAGES_MS = 20;
export const BULK_DATA_TRANSFER_SIZE_PER_MESSAGE = 256;

export const ALL_DEVICES = 0x7f;

// DT1, for writing data to the device
export const MESSAGE_DATA_SET_1 = 0x12;

// RQ1, for reading data from the device
export const MESSAGE_DATA_REQUEST_1 = 0x11;

export const BROADCAST_IDENTITY_REQUEST_MESSAGE = [
  0xf0,
  // Universal Non-realtime message
  0x7e,
  ALL_DEVICES,
  // General Information
  0x06,
  // Identity Request
  0x01,
  0xf7,
];

export function rolandChecksum(bytes: readonly number[]) {
  let sum = 0;
  for (const byte of bytes) {
    sum = sum + byte;
  }
  return (128 - (sum % 128)) & 0x7f;
}

function convertAddressToByteArray(
  address: number,
  addressBytes: number
): number[] {
  const addressArray = [];
  for (let i = 0; i < addressBytes; i++) {
    addressArray.unshift((address >> (i * 8)) & 0xff);
  }
  return addressArray;
}

export function makeDataSetMessage(
  deviceConstants: RolandSysExConfig,
  deviceId: number,
  address: number,
  valueBytes: readonly number[] | Readonly<Uint8Array>
) {
  const addressArray = convertAddressToByteArray(
    unpack7(address),
    deviceConstants.addressBytes
  );
  return [
    0xf0,
    deviceConstants.manufacturerId,
    deviceId,
    ...deviceConstants.modelId,
    MESSAGE_DATA_SET_1,
    ...addressArray,
    ...valueBytes,
    rolandChecksum([...addressArray, ...valueBytes]),
    0xf7,
  ];
}

export function makeDataRequestMessage(
  deviceConstants: RolandSysExConfig,
  deviceID: number,
  address: number,
  lengthPacked: number
) {
  const addressArray = convertAddressToByteArray(
    unpack7(address),
    deviceConstants.addressBytes
  );
  const lengthArray = convertAddressToByteArray(
    unpack7(lengthPacked),
    deviceConstants.addressBytes
  );
  return [
    0xf0,
    deviceConstants.manufacturerId,
    deviceID,
    ...deviceConstants.modelId,
    MESSAGE_DATA_REQUEST_1,
    ...addressArray,
    ...lengthArray,
    rolandChecksum([...addressArray, ...lengthArray]),
    0xf7,
  ];
}

export type ParsedDataResponse = {
  deviceId: number;
  address: number;
  addressBytes: Readonly<Uint8Array>;
  valueBytes: Readonly<Uint8Array>;
  checksum: number;
};

export function parseDataResponseMessage(
  deviceConstants: RolandSysExConfig,
  data: Uint8Array
): Readonly<ParsedDataResponse> | undefined {
  if (
    data.length >=
      6 + deviceConstants.addressBytes + deviceConstants.modelId.length &&
    // SysEx start
    data[0] === 0xf0 &&
    data[1] === deviceConstants.manufacturerId &&
    data[3 + deviceConstants.modelId.length] === MESSAGE_DATA_SET_1
  ) {
    const deviceId = data[2];
    const modelIdLength = deviceConstants.modelId.length;
    for (let i = 0; i < modelIdLength; ++i) {
      if (data[3 + i] !== deviceConstants.modelId[i]) {
        return;
      }
    }
    const addressBytes = data.slice(
      4 + modelIdLength,
      4 + modelIdLength + deviceConstants.addressBytes
    );
    // convert the address bytes to a number
    const addressBytesLength = deviceConstants.addressBytes;
    let address = 0;
    for (let i = 0; i < addressBytesLength; ++i) {
      address = (address << 7) | (addressBytes[i] & 0x7f);
    }
    const valueBytes = data.slice(
      4 + modelIdLength + deviceConstants.addressBytes,
      data.length - 2
    );
    const checksum = data[data.length - 2];
    return { deviceId, address, addressBytes, valueBytes, checksum };
  }
}

export function isValidChecksum({
  addressBytes,
  valueBytes,
  checksum,
}: Readonly<{
  addressBytes: Readonly<Uint8Array>;
  valueBytes: Readonly<Uint8Array>;
  checksum: number;
}>): boolean {
  return rolandChecksum([...addressBytes, ...valueBytes, checksum]) === 0;
}

export type DeviceIdentity = {
  manufacturerId: number;
  deviceId: number;
  deviceFamily: number;
  deviceModel: number;
  softwareRevisionLevel: number;
};

export function parseIdentityReplyMessage(
  data: Uint8Array
): DeviceIdentity | void {
  if (
    data.length >= 15 &&
    // SysEx start
    data[0] === 0xf0 &&
    // Universal Non-realtime Message
    data[1] === 0x7e &&
    // General Information
    data[3] === 0x06 &&
    // Identity Reply
    data[4] === 0x02
  ) {
    const manufacturerId = data[5];
    const deviceFamily = (data[6] << 8) + data[7];
    const deviceModel = (data[8] << 8) + data[9];
    const softwareRevisionLevel =
      ((data[10] << (24 + data[11])) << (16 + data[12])) << (8 + data[13]);
    const deviceId = data[2];
    return {
      manufacturerId,
      deviceId,
      deviceFamily,
      deviceModel,
      softwareRevisionLevel,
    };
  }
}

export function pack7(number8: number) {
  // delete the most significant bit of each 8-bit byte to make 7-bit bytes
  let number7 = 0;
  let shift = 0;
  while (number8 !== 0) {
    if (number8 & 0x80) {
      throw new Error("Bytes passed to pack7 must be 7-bit");
    }
    number7 |= (number8 & 0x7f) << shift;
    number8 >>= 8;
    shift += 7;
  }
  return number7;
}

export function unpack7(number7: number) {
  // add an 8th bit to each 7-bit byte
  let number8 = 0;
  let shift = 0;
  while (number7 !== 0) {
    number8 |= (number7 & 0x7f) << shift;
    number7 >>= 7;
    shift += 8;
  }
  return number8;
}

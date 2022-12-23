import { isValidChecksum, rolandChecksum } from "../RolandSysExProtocol";

describe("Roland checksum", () => {
  test("round trip", () => {
    const data = new Uint8Array(4);
    const dataView = new DataView(data.buffer);
    for (let i = 0; i < 1 << 17; ++i) {
      dataView.setUint32(0, i);
      const checksum = rolandChecksum([...data]);
      expect(
        isValidChecksum({
          addressBytes: data.slice(0, 3),
          valueBytes: data.slice(3, 4),
          checksum,
        })
      ).toBe(true);
    }
  });
});

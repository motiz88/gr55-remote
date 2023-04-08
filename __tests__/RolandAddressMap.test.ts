import {
  AsciiStringField,
  booleanField,
  C63Field,
  C64Field,
  EnumField,
  fetchAndParse,
  FieldDefinition,
  getAddresses,
  parse,
  StructDefinition,
  UByteField,
  USplit12Field,
  UWordField,
} from "../RolandAddressMap";

describe("parse", () => {
  test("parses a boolean field", () => {
    expect(
      parse(new Uint8Array([0]), new FieldDefinition(0, "", booleanField), 0)[0]
    ).toMatchInlineSnapshot(`
      {
        "value": false,
      }
    `);

    expect(
      parse(new Uint8Array([1]), new FieldDefinition(0, "", booleanField), 0)[0]
    ).toMatchInlineSnapshot(`
      {
        "value": true,
      }
    `);

    expect(
      parse(
        new Uint8Array([0x70]),
        new FieldDefinition(0, "", booleanField),
        0
      )[0]
    ).toMatchInlineSnapshot(`
      {
        "value": false,
      }
    `);

    expect(
      parse(
        new Uint8Array([0x71]),
        new FieldDefinition(0, "", booleanField),
        0
      )[0]
    ).toMatchInlineSnapshot(`
      {
        "value": true,
      }
    `);
  });

  test("parses a string field", () => {
    expect(
      parse(
        new Uint8Array([32, 65, 66, 67, 32, 65, 65, 65]),
        new FieldDefinition(
          0,
          "String With Leading Spaces",
          new AsciiStringField(8)
        ),

        0
      )[0]
    ).toMatchInlineSnapshot(`
      {
        "value": " ABC AAA",
      }
    `);

    expect(
      parse(
        new Uint8Array([65, 66, 67, 32, 65, 65, 65, 32, 32]),
        new FieldDefinition(
          0,
          "String With Trailing Spaces",
          new AsciiStringField(9)
        ),

        0
      )[0]
    ).toMatchInlineSnapshot(`
      {
        "value": "ABC AAA",
      }
    `);

    expect(
      () =>
        parse(
          new Uint8Array([65, 66, 67, 32, 65, 65, 65, 32, 32]),
          new FieldDefinition(0, "Long String", new AsciiStringField(16)),
          0
        )[0]
    ).toThrowErrorMatchingInlineSnapshot(
      `"Data too short, parsing failed at address 9 while parsing Long String (16-byte ASCII string)"`
    );
  });

  test("parses a nested address map", () => {
    const addressMap = new StructDefinition(5, "Test address map", {
      childA: new StructDefinition(0, "Child A", {
        grandchildA: new FieldDefinition(0, "Grandchild A", booleanField),
        grandchildB: new FieldDefinition(1, "Grandchild B", booleanField),
      }),
      childB: new FieldDefinition(5, "Child B", booleanField),
    });
    const [parsed, flatParsed] = parse(
      new Uint8Array([
        // #0: Padding
        0x7f, 0x7f, 0x7f, 0x7f, 0x7f,
        // #5: childA.grandchildA
        0,
        // #6: childA.grandchildB
        1,
        // #7: Padding
        0x7f, 0x7f, 0x7f,
        // #10: childB
        0,
      ]),
      addressMap,
      5
    );
    expect(parsed).toMatchInlineSnapshot(`
      {
        "childA": {
          "grandchildA": {
            "value": false,
          },
          "grandchildB": {
            "value": true,
          },
        },
        "childB": {
          "value": false,
        },
      }
    `);
    expect(flatParsed[5]).toBe(parsed.childA.grandchildA);
    expect(flatParsed[6]).toBe(parsed.childA.grandchildB);
    expect(flatParsed[10]).toBe(parsed.childB);
  });
});

describe("fetchAndParse", () => {
  test("fetches and parses a noncontiguous nested struct", async () => {
    const addressMap = new StructDefinition(5, "Test address map", {
      childA: new StructDefinition(0, "Child A", {
        grandchildA: new FieldDefinition(0, "Grandchild A", booleanField),
        grandchildB: new FieldDefinition(1, "Grandchild B", booleanField),
      }),
      childB: new FieldDefinition(5, "Child B", booleanField),
    });
    const mockData = new Uint8Array([
      // #0: Padding
      0x7f, 0x7f, 0x7f, 0x7f, 0x7f,
      // #5: childA.grandchildA
      0,
      // #6: childA.grandchildB
      1,
      // #7: Padding
      0x7f, 0x7f, 0x7f,
      // #10: childB
      0,
    ]);
    const fetchContiguous = jest.fn(async (absoluteAddress, length) => {
      return mockData.slice(absoluteAddress, absoluteAddress + length);
    });
    const fetchedAndParsed = await fetchAndParse(
      addressMap,
      5,
      fetchContiguous
    );
    expect(fetchedAndParsed).toEqual(parse(mockData, addressMap, 5));
  });

  test("coalesces contiguous fields into a single fetch", async () => {
    const addressMap = new StructDefinition(5, "Test address map", {
      childA: new StructDefinition(0, "Child A", {
        grandchildA: new FieldDefinition(0, "Grandchild A", booleanField),
        grandchildB: new FieldDefinition(1, "Grandchild B", booleanField),
        grandchildC: new FieldDefinition(5, "Grandchild C", booleanField),
        grandchildD: new FieldDefinition(
          6,
          "Grandchild D",
          new UByteField(0, 100)
        ),
      }),
    });
    const mockData = new Uint8Array([
      // #0: Padding
      0x7f, 0x7f, 0x7f, 0x7f, 0x7f,
      // #5: childA.grandchildA
      0,
      // #6: childA.grandchildB
      1,
      // #7: Padding
      0x7f, 0x7f, 0x7f,
      // #10: childA.grandchildC
      0,
      // #11: childA.grandchildD
      0x42,
    ]);
    const fetchContiguous = jest.fn(async (absoluteAddress, length) => {
      return mockData.slice(absoluteAddress, absoluteAddress + length);
    });
    const fetchedAndParsed = await fetchAndParse(
      addressMap,
      5,
      fetchContiguous
    );
    expect(fetchContiguous).toBeCalledTimes(2);
    expect(fetchedAndParsed).toEqual(parse(mockData, addressMap, 5));
  });
});

describe("getAddresses", () => {
  test("processes a nested address map", () => {
    const addressMap = new StructDefinition(5, "Test address map", {
      childA: new StructDefinition(0, "Child A", {
        grandchildA: new FieldDefinition(0, "Grandchild A", booleanField),
        grandchildB: new FieldDefinition(1, "Grandchild B", booleanField),
      }),
      childB: new FieldDefinition(5, "Child B", booleanField),
    });
    const absoluteAddresses = getAddresses(addressMap, 5);
    expect(absoluteAddresses).toEqual({
      definition: addressMap,
      address: 5,
      childA: {
        address: 5,
        definition: addressMap.$.childA,
        grandchildA: {
          address: 5,
          definition: addressMap.$.childA.$.grandchildA,
        },
        grandchildB: {
          address: 6,
          definition: addressMap.$.childA.$.grandchildB,
        },
      },
      childB: {
        address: 10,
        definition: addressMap.$.childB,
      },
    });
  });
});

describe("UWordField", () => {
  const field = new UWordField(0, 2048);

  test("decodes adjacent 7 bit bytes", () => {
    const valueBytes = new Uint8Array([0b0000001, 0b0010001]);
    const decoded = field.decode(valueBytes, 0, valueBytes.length);
    expect(decoded).toBe(0b00000010010001);
  });

  test("encodes adjacent 7 bit bytes", () => {
    const valueBytes = new Uint8Array(field.size);
    field.encode(0b00000010010001, valueBytes, 0, valueBytes.length);
    expect(valueBytes).toEqual(new Uint8Array([0b0000001, 0b0010001]));
  });
});

describe("1-byte enum", () => {
  const field = new EnumField({ 1: "a", 127: "b" });

  test("decodes 7 bit byte", () => {
    const valueBytes = new Uint8Array([0b0000001, 0b1111111]);
    expect(field.decode(valueBytes, 0, 1)).toBe("a");
    expect(field.decode(valueBytes, 1, 1)).toBe("b");
  });

  test("encodes 7 bit byte", () => {
    const valueBytes = new Uint8Array(2);
    field.encode("a", valueBytes, 0, 1);
    field.encode("b", valueBytes, 1, 1);
    expect(valueBytes).toEqual(new Uint8Array([0b0000001, 0b1111111]));
  });
});

describe("enum based on UWordField", () => {
  const field = new EnumField({ 0: "a", 145: "b" }, new UWordField(0, 2048));

  test("decodes adjacent 7 bit bytes", () => {
    const valueBytes = new Uint8Array([0b0000001, 0b0010001]);
    const decoded = field.decode(valueBytes, 0, valueBytes.length);
    expect(decoded).toBe("b");
  });

  test("encodes adjacent 7 bit bytes", () => {
    const valueBytes = new Uint8Array(field.size);
    field.encode("b", valueBytes, 0, valueBytes.length);
    expect(valueBytes).toEqual(new Uint8Array([0b0000001, 0b0010001]));
  });
});

describe("UByteField with offset", () => {
  const field = new UByteField(-3, 3, { encodedOffset: 64 });
  test("decodes", () => {
    const valueBytes = new Uint8Array([61, 64, 67]);
    expect(field.decode(valueBytes, 0, 1)).toBe(-3);
    expect(field.decode(valueBytes, 1, 1)).toBe(0);
    expect(field.decode(valueBytes, 2, 1)).toBe(3);
  });

  test("encodes", () => {
    const valueBytes = new Uint8Array(3);
    field.encode(-3, valueBytes, 0, 1);
    field.encode(0, valueBytes, 1, 1);
    field.encode(3, valueBytes, 2, 1);
    expect(valueBytes).toEqual(new Uint8Array([61, 64, 67]));
  });
});

describe("UByteField with offset and factor", () => {
  const field = new UByteField(-200, 200, {
    encodedOffset: 64,
    decodedFactor: 10,
  });
  test("decodes", () => {
    const valueBytes = new Uint8Array([63, 64, 84]);
    expect(field.decode(valueBytes, 0, 1)).toBe(-10);
    expect(field.decode(valueBytes, 1, 1)).toBe(0);
    expect(field.decode(valueBytes, 2, 1)).toBe(200);
  });

  test("encodes", () => {
    const valueBytes = new Uint8Array(3);
    field.encode(-10, valueBytes, 0, 1);
    field.encode(0, valueBytes, 1, 1);
    field.encode(200, valueBytes, 2, 1);
    expect(valueBytes).toEqual(new Uint8Array([63, 64, 84]));
  });
});

describe("C64Field", () => {
  const field = new C64Field();
  test("decodes", () => {
    const valueBytes = new Uint8Array([0, 32, 64, 95, 127]);
    expect(field.decode(valueBytes, 0, 1)).toBe(-50);
    expect(field.decode(valueBytes, 1, 1)).toBe(-25);
    expect(field.decode(valueBytes, 2, 1)).toBe(0);
    expect(field.decode(valueBytes, 3, 1)).toBe(25);
    expect(field.decode(valueBytes, 4, 1)).toBe(50);
  });

  test("encodes", () => {
    const valueBytes = new Uint8Array(5);
    field.encode(-50, valueBytes, 0, 1);
    field.encode(-25, valueBytes, 1, 1);
    field.encode(0, valueBytes, 2, 1);
    field.encode(25, valueBytes, 3, 1);
    field.encode(50, valueBytes, 4, 1);
    expect(valueBytes).toEqual(new Uint8Array([0, 32, 64, 95, 127]));
  });
});

describe("C63Field", () => {
  const field = new C63Field();
  test("decodes", () => {
    const valueBytes = new Uint8Array([1, 33, 64, 96, 127]);
    expect(field.decode(valueBytes, 0, 1)).toBe(-50);
    expect(field.decode(valueBytes, 1, 1)).toBe(-25);
    expect(field.decode(valueBytes, 2, 1)).toBe(0);
    expect(field.decode(valueBytes, 3, 1)).toBe(25);
    expect(field.decode(valueBytes, 4, 1)).toBe(50);
  });

  test("encodes", () => {
    const valueBytes = new Uint8Array(5);
    field.encode(-50, valueBytes, 0, 1);
    field.encode(-25, valueBytes, 1, 1);
    field.encode(0, valueBytes, 2, 1);
    field.encode(25, valueBytes, 3, 1);
    field.encode(50, valueBytes, 4, 1);
    expect(valueBytes).toEqual(new Uint8Array([1, 33, 64, 96, 127]));
  });
});

describe("remapping", () => {
  describe("decodedFactor", () => {
    const field = new UWordField(0, 2048);
    const remappedField = field.remapped({ decodedFactor: 10 });

    test("updates metadata", () => {
      expect(remappedField.size).toBe(2);
      expect(remappedField.min).toBe(0);
      expect(remappedField.max).toBe(20480);
      expect(remappedField.description).toMatchInlineSnapshot(
        `"remapped to [0, 20480] from unsigned word [0, 2048]"`
      );
    });

    test("encode normally, then decode remapped", () => {
      const valueBytes = new Uint8Array(2);
      field.encode(102, valueBytes, 0, valueBytes.length);
      expect(remappedField.decode(valueBytes, 0, valueBytes.length)).toBe(1020);
    });

    test("encode remapped, then decode normally", () => {
      const valueBytes = new Uint8Array(2);
      remappedField.encode(1020, valueBytes, 0, valueBytes.length);
      expect(field.decode(valueBytes, 0, valueBytes.length)).toBe(102);
    });
  });

  describe("encodedOffset", () => {
    const field = new UWordField(0, 2048);
    const remappedField = field.remapped({ encodedOffset: 1024 });

    test("updates metadata", () => {
      expect(remappedField.size).toBe(2);
      expect(remappedField.min).toBe(-1024);
      expect(remappedField.max).toBe(1024);
      expect(remappedField.description).toMatchInlineSnapshot(
        `"remapped to [-1024, 1024] from unsigned word [0, 2048]"`
      );
    });

    test("encode normally, then decode remapped", () => {
      const valueBytes = new Uint8Array(2);
      field.encode(256, valueBytes, 0, valueBytes.length);
      expect(remappedField.decode(valueBytes, 0, valueBytes.length)).toBe(-768);
    });

    test("encode remapped, then decode normally", () => {
      const valueBytes = new Uint8Array(2);
      remappedField.encode(-768, valueBytes, 0, valueBytes.length);
      expect(field.decode(valueBytes, 0, valueBytes.length)).toBe(256);
    });
  });

  describe("min and max", () => {
    const field = new UWordField(0, 2048);
    const remappedField = field.remapped({ min: 1, max: 100 });

    test("updates metadata", () => {
      expect(remappedField.size).toBe(2);
      expect(remappedField.min).toBe(1);
      expect(remappedField.max).toBe(100);
      expect(remappedField.description).toMatchInlineSnapshot(
        `"remapped to [1, 100] from unsigned word [0, 2048]"`
      );
    });

    test("encode normally, then decode remapped", () => {
      const valueBytes = new Uint8Array(2);
      field.encode(2, valueBytes, 0, valueBytes.length);
      expect(remappedField.decode(valueBytes, 0, valueBytes.length)).toBe(2);
    });

    test("encode remapped, then decode normally", () => {
      const valueBytes = new Uint8Array(2);
      remappedField.encode(2, valueBytes, 0, valueBytes.length);
      expect(field.decode(valueBytes, 0, valueBytes.length)).toBe(2);
    });
  });

  describe("format", () => {
    const field = new USplit12Field(-1024, 1023);
    test("with min/max", () => {
      const remappedField = field.remapped({ min: 0, max: 100 });
      expect(remappedField.format(0)).toBe("0");
      expect(remappedField.format(100)).toBe("100");
    });
  });
});

import { pack7 } from "./RolandSysExProtocol";

export interface RolandAddressMap {
  readonly temporaryPatch: AtomReference;
  readonly system: AtomReference;
}

export type AtomReference<Definition extends AtomDefinition = AtomDefinition> =
  {
    address: number;
    definition: Definition;
  };

export type FieldReference<T extends FieldType<any> = FieldType<any>> =
  AtomReference<FieldDefinition<T>>;

export abstract class AtomDefinition {
  constructor(
    // The offset of this atom relative to its parent's start address
    public readonly offset: number,
    public readonly description: string
  ) {}
  abstract readonly isContiguous: boolean;
  abstract readonly size: number;
}

export interface FieldType<Representation> {
  encode(
    value: Representation,
    outBytes: Uint8Array,
    offset: number,
    length: number
  ): void;
  decode(bytes: Uint8Array, offset: number, length: number): Representation;
  readonly size: number;
  readonly description: string;
  readonly emptyValue: Representation;
}

export interface NumericField extends FieldType<number> {
  min: number;
  max: number;
  step: number;
  format: (value: number) => string;
  remapped(options?: {
    encodedOffset?: number;
    decodedFactor?: number;
    min?: number;
    max?: number;
    format?: (value: number) => string;
  }): NumericField;
  encodedOffset?: number;
}

abstract class NumericFieldBase implements NumericField {
  abstract min: number;
  abstract max: number;
  abstract step: number;
  abstract encode(
    value: number,
    outBytes: Uint8Array,
    offset: number,
    length: number
  ): void;
  abstract decode(bytes: Uint8Array, offset: number, length: number): number;
  abstract readonly size: number;
  abstract readonly description: string;

  constructor(options?: { format?: (value: number) => string }) {
    if (options?.format) {
      this.format = options.format;
    }
  }

  remapped(options?: {
    encodedOffset?: number;
    decodedFactor?: number;
    format?: (value: number) => string;
    min?: number;
    max?: number;
  }): NumericField {
    return new RemappedNumericField(this, options);
  }

  format(value: number): string {
    return (this.min < 0 && value > 0 ? "+" : "") + value.toString();
  }

  get emptyValue(): number {
    return this.min;
  }
}

export class RemappedNumericField
  extends NumericFieldBase
  implements NumericField
{
  readonly min: number;
  readonly max: number;
  readonly step: number;

  encode(
    value: number,
    outBytes: Uint8Array,
    offset: number,
    length: number
  ): void {
    const cookedValue = Math.round(
      Math.min(Math.max(this.min, value), this.max) / this.decodedFactor +
        this.encodedOffset
    );
    this.rawField.encode(cookedValue, outBytes, offset, length);
  }

  decode(bytes: Uint8Array, offset: number, length: number): number {
    const result = this.rawField.decode(bytes, offset, length);
    return this.decodedFactor * (result - this.encodedOffset);
  }

  size: number;

  description: string;

  private readonly decodedFactor: number;
  readonly encodedOffset: number;

  // encoded = (decoded / decodedFactor) + encodedOffset
  // therefore decoded = (encoded - encodedOffset) * decodedFactor

  constructor(
    private readonly rawField: NumericField,
    options?: {
      encodedOffset?: number;
      decodedFactor?: number;
      format?: (value: number) => string;
      min?: number;
      max?: number;
    }
  ) {
    super({
      format: options?.format,
    });
    this.decodedFactor = options?.decodedFactor ?? 1;
    this.encodedOffset = options?.encodedOffset ?? 0;
    this.min =
      options?.min ??
      (this.rawField.min - this.encodedOffset) * this.decodedFactor;
    this.max =
      options?.max ??
      (this.rawField.max - this.encodedOffset) * this.decodedFactor;
    this.step = this.decodedFactor;
    this.size = this.rawField.size;
    this.description = `remapped to [${this.min}, ${this.max}] from ${this.rawField.description}`;
  }
}

export class AsciiStringField implements FieldType<string> {
  readonly description: string;

  constructor(public readonly size: number) {
    this.description = `${this.size}-byte ASCII string`;
  }

  encode(
    value: string,
    outBytes: Uint8Array,
    offset: number,
    _length: number
  ): void {
    for (let i = 0; i < this.size; ++i) {
      let char = value.charCodeAt(i);
      if (!char || Number.isNaN(char)) {
        char = 32; /* Space */
      }
      if (char < 32 || char > 127) {
        char = 63; /* Question mark */
      }
      outBytes[offset + i] = char;
    }
  }

  decode(bytes: Uint8Array, offset: number, length: number): string {
    let result = "";
    for (let i = 0; i < length; ++i) {
      const char = bytes[offset + i] & 0x7f;
      result += String.fromCharCode(char);
    }
    return result.trimEnd();
  }

  readonly emptyValue: string = "";
}

export class BooleanField implements FieldType<boolean> {
  readonly size = 1;
  encode(
    value: boolean,
    outBytes: Uint8Array,
    offset: number,
    _length: number
  ): void {
    outBytes[offset] = value ? 1 : 0;
  }
  decode(bytes: Uint8Array, offset: number, _length: number): boolean {
    return (bytes[offset] & 0x1) !== 0;
  }
  constructor(
    public falseLabel: string = "Off",
    public trueLabel: string = "On",
    options?: { invertedForDisplay?: boolean }
  ) {
    this.invertedForDisplay = options?.invertedForDisplay ?? false;
  }

  readonly description: string = "Boolean";
  readonly invertedForDisplay: boolean;
  readonly emptyValue: boolean = false;

  // TODO: Should these be inverted if invertedForDisplay is true?
  readonly min: boolean = false;
  readonly max: boolean = true;
}

export class ReservedField implements FieldType<undefined> {
  encode(
    value: undefined,
    outBytes: Uint8Array,
    offset: number,
    _length: number
  ): void {}

  decode(bytes: Uint8Array, offset: number, _length: number): undefined {
    return undefined;
  }

  constructor(public readonly size: number = 1) {
    this.description = `${size} reserved byte${size > 1 ? "s" : ""}`;
  }
  readonly description: string;
  readonly emptyValue: undefined = undefined;
}

export class UIntBEField extends NumericFieldBase implements NumericField {
  encode(
    value: number,
    outBytes: Uint8Array,
    offset: number,
    _length: number
  ): void {
    const cookedValue = Math.round(
      Math.min(Math.max(this.min, value), this.max) / this.decodedFactor +
        this.encodedOffset
    );
    for (let i = 0; i < this.size; ++i) {
      // big endian, groups of 7 bits
      outBytes[offset + i] = (cookedValue >> ((this.size - i - 1) * 7)) & 0x7f;
    }
  }

  decode(bytes: Uint8Array, offset: number, _length: number): number {
    let result = 0;
    for (let i = 0; i < this.size; ++i) {
      result = (result << 7) | (bytes[offset + i] & 0x7f);
    }
    return this.decodedFactor * (result - this.encodedOffset);
  }

  constructor(
    public readonly min: number,
    public readonly max: number,
    public readonly size: number,
    options?: {
      encodedOffset?: number;
      decodedFactor?: number;
      format?: (value: number) => string;
    }
  ) {
    super({ format: options?.format });
    this.description = `unsigned int (${size} byte${size > 1 ? "s" : ""}) [${
      this.min
    }, ${this.max}]`;
    this.encodedOffset = options?.encodedOffset ?? 0;
    this.decodedFactor = options?.decodedFactor ?? 1;
    this.step = this.decodedFactor;
  }
  readonly description: string;

  // the offset added to the value before encoding
  readonly encodedOffset: number;
  // the factor by which the decoded value is multiplied for presentation
  readonly decodedFactor: number;
  readonly step: number;
}

export class UByteField extends UIntBEField {
  constructor(
    public readonly min: number = 0,
    public readonly max: number = 127,
    options?: {
      encodedOffset?: number;
      decodedFactor?: number;
      format?: (value: number) => string;
    }
  ) {
    super(min, max, 1, options);
    this.description = `unsigned byte [${this.min}, ${this.max}]`;
  }
  readonly description: string;
}

export class UWordField extends UIntBEField {
  constructor(
    public readonly min: number = 0,
    public readonly max: number = pack7(0x7f7f),
    options?: {
      encodedOffset?: number;
      decodedFactor?: number;
      format?: (value: number) => string;
    }
  ) {
    super(min, max, 2, options);
    this.description = `unsigned word [${this.min}, ${this.max}]`;
  }
  readonly description: string;
}

export class U3BytesField extends UIntBEField {
  constructor(
    public readonly min: number = 0,
    public readonly max: number = pack7(0x7f7f7f),
    options?: {
      encodedOffset?: number;
      decodedFactor?: number;
      format?: (value: number) => string;
    }
  ) {
    super(min, max, 3, options);
    this.description = `unsigned 3-byte int [${this.min}, ${this.max}]`;
  }
  readonly description: string;
}

export class C127Field extends NumericFieldBase implements NumericField {
  readonly size: number;

  encode(
    value: number,
    outBytes: Uint8Array,
    offset: number,
    length: number
  ): void {
    const encoded = Math.round(
      (127 * Math.min(Math.max(this.min, value), this.max)) / 100
    );
    this.rawField.encode(encoded, outBytes, offset, length);
  }

  decode(bytes: Uint8Array, offset: number, length: number): number {
    return Math.round(
      (100 * this.rawField.decode(bytes, offset, length)) / 127
    );
  }

  readonly min = 0;
  readonly max = 100;
  readonly step = 1;
  readonly description = "C127";

  constructor(
    private readonly rawField: FieldType<number> = new UByteField(0, 127),
    options?: { format?: (value: number) => string }
  ) {
    super(options);
    this.size = this.rawField.size;
  }
}

// TODO: The C64Field type doesn't precisely match what the GR-55
// displays throughout the range. Possibly replace this with a lookup table.
// Investigate the other similar types (C63...) as well.
export class C64Field extends NumericFieldBase implements NumericField {
  readonly size = 1;

  encode(
    value: number,
    outBytes: Uint8Array,
    offset: number,
    _length: number
  ): void {
    outBytes[offset] =
      Math.round(
        (127 * (50 + Math.min(Math.max(this.min, value), this.max))) / 100
      ) & 0x7f;
  }

  decode(bytes: Uint8Array, offset: number, _length: number): number {
    return Math.round((100 * bytes[offset]) / 127 - 50);
  }

  readonly min = -50;
  readonly max = 50;
  readonly step = 1;
  readonly description = "C64";
}

export class C63Field extends NumericFieldBase implements NumericField {
  readonly size = 1;

  encode(
    value: number,
    outBytes: Uint8Array,
    offset: number,
    _length: number
  ): void {
    outBytes[offset] =
      Math.round(
        1 + (126 * (50 + Math.min(Math.max(this.min, value), this.max))) / 100
      ) & 0x7f;
  }

  decode(bytes: Uint8Array, offset: number, _length: number): number {
    return Math.round((100 * (bytes[offset] - 1)) / 126 - 50);
  }

  readonly min = -50;
  readonly max = 50;
  readonly step = 1;
  readonly description = "C63";
}

export class C63OffField extends NumericFieldBase implements NumericField {
  readonly size = 1;

  encode(
    value: number,
    outBytes: Uint8Array,
    offset: number,
    _length: number
  ): void {
    outBytes[offset] =
      Math.round(
        1 + (126 * (50 + Math.min(Math.max(this.min, value), this.max))) / 100
      ) & 0x7f;
  }

  decode(bytes: Uint8Array, offset: number, _length: number): number {
    return Math.round((100 * (bytes[offset] - 1)) / 126 - 50);
  }

  readonly min = -51;
  readonly max = 50;
  readonly step = 1;
  readonly description = "C63Off";

  constructor() {
    super({
      format: (value) =>
        value === -51 ? "OFF" : (value > 0 ? "+" : "") + value.toString(),
    });
  }
}

export class USplit8Field extends NumericFieldBase implements NumericField {
  readonly size = 2;
  readonly step = 1;

  encode(
    value: number,
    outBytes: Uint8Array,
    offset: number,
    _length: number
  ): void {
    const val = Math.min(Math.max(this.min, value), this.max) & 0x0ff;
    const aaaa = ((val & 0x0f0) >> 4) & 0x0f; // left nibble of the first byte
    const bbbb = val & 0x00f & 0x0f; // right nibble of the first byte
    outBytes[offset] = aaaa;
    outBytes[offset + 1] = bbbb;
  }

  decode(bytes: Uint8Array, offset: number, _length: number): number {
    const aaaa = bytes[offset] & 0x0f;
    const bbbb = bytes[offset + 1] & 0x0f;
    return ((aaaa << 4) | bbbb) & 0x0ff;
  }

  constructor(
    public readonly min: number = 0,
    public readonly max: number = 127,
    options?: { format?: (value: number) => string }
  ) {
    super(options);
    this.description = `unsigned split 8-bit number [${this.min}, ${this.max}]`;
  }
  readonly description: string;
}

export class USplit12Field extends NumericFieldBase implements NumericField {
  readonly size = 3;
  readonly step: number;

  encode(
    value: number,
    outBytes: Uint8Array,
    offset: number,
    _length: number
  ): void {
    const val =
      Math.round(
        Math.min(Math.max(this.min, value), this.max) / this.decodedFactor +
          this.encodedOffset
      ) & 0x0fff;
    const aaaa = ((val & 0x0f00) >> 8) & 0x0f; // right nibble of the first byte
    const bbbb = ((val & 0x00f0) >> 4) & 0x0f; // left nibble of the second byte
    const cccc = val & 0x000f & 0x0f; // right nibble of the second byte
    outBytes[offset] = aaaa;
    outBytes[offset + 1] = bbbb;
    outBytes[offset + 2] = cccc;
  }

  decode(bytes: Uint8Array, offset: number, _length: number): number {
    const aaaa = bytes[offset] & 0x0f;
    const bbbb = bytes[offset + 1] & 0x0f;
    const cccc = bytes[offset + 2] & 0x0f;
    return (
      ((((aaaa << 8) | (bbbb << 4) | cccc) & 0x0fff) - this.encodedOffset) *
      this.decodedFactor
    );
  }

  constructor(
    public readonly min: number,
    public readonly max: number,
    options?: {
      format?: (value: number) => string;
      encodedOffset?: number;
      decodedFactor?: number;
    }
  ) {
    super(options);
    this.description = `unsigned split 12-bit number [${this.min}, ${this.max}]`;
    this.encodedOffset = options?.encodedOffset ?? 0;
    this.decodedFactor = options?.decodedFactor ?? 1;
    this.step = this.decodedFactor;
  }
  // the offset added to the value before encoding
  readonly encodedOffset: number;
  readonly decodedFactor: number;
  readonly description: string;
}

export function enumField<Labels extends readonly (string | number)[]>(
  labels: Labels,
  rawField?: FieldType<number>
): EnumField<{ [encoded: number]: Labels[number] }> {
  const labelsMap = {} as { [encoded: number]: Labels[number] };
  for (let i = 0; i < labels.length; ++i) {
    labelsMap[i] = labels[i];
  }
  return new EnumField(labelsMap, rawField);
}

export class EnumField<
  LabelsMap extends { [encoded: number]: string | number } = {
    [encoded: number]: string;
  }
> implements FieldType<LabelsMap[number]>
{
  #labelsToEncoded: {
    [label: string | number]: number;
  } = Object.create(null);

  encode(
    value: LabelsMap[number],
    outBytes: Uint8Array,
    offset: number,
    length: number
  ): void {
    const encoded = this.#labelsToEncoded[value];
    if (encoded == null) {
      throw new Error(`Unknown enum value: ${value}`);
    }
    this.rawField.encode(encoded, outBytes, offset, length);
  }

  decode(bytes: Uint8Array, offset: number, length: number): LabelsMap[number] {
    const encoded = this.rawField.decode(bytes, offset, length);
    const label = this.labels[encoded];
    if (label == null) {
      throw new Error(`Unknown enum value: ${encoded}`);
    }
    return label;
  }

  constructor(
    public readonly labels: Readonly<LabelsMap>,
    private readonly rawField: FieldType<number> = new UByteField(0, 127)
  ) {
    this.description = `enum ${this.rawField.description}`;
    this.size = this.rawField.size;
    let minEncoded: number | void;
    let maxEncoded: number | void;
    for (const encoded of Object.keys(labels)) {
      const encodedNumber = Number(encoded);
      if (minEncoded == null || encodedNumber < minEncoded) {
        minEncoded = encodedNumber;
      }
      if (maxEncoded == null || encodedNumber > maxEncoded) {
        maxEncoded = encodedNumber;
      }
      const label = labels[encodedNumber];
      this.emptyValue ??= label;
      if (label in this.#labelsToEncoded) {
        throw new Error(
          `Encountered duplicate label "${label}" in ${this.description}`
        );
      }
      this.#labelsToEncoded[label] = Number(encoded);
    }
    if (Object.keys(labels).length === 0) {
      throw new Error("Cannot define enum type with zero labels");
    }
    this.min = labels[minEncoded!];
    this.max = labels[maxEncoded!];
  }

  description: string;
  readonly size: number;
  readonly emptyValue!: LabelsMap[number];
  readonly min: LabelsMap[number];
  readonly max: LabelsMap[number];
}

export class FieldDefinition<
  Type extends FieldType<any>
> extends AtomDefinition {
  constructor(offset: number, description: string, public readonly type: Type) {
    super(offset, description);
    this.size = type.size;
  }

  readonly isContiguous: boolean = true;
  readonly size: number;
}

export type ParsedAtom<T extends AtomDefinition> = T extends StructDefinition<
  infer MembersMap
>
  ? ParsedStruct<MembersMap>
  : T extends FieldDefinition<infer Type>
  ? ParsedField<Type>
  : never;

export type ParsedStruct<MembersMap extends { [key: string]: AtomDefinition }> =
  {
    readonly [Key in keyof MembersMap]: ParsedAtom<MembersMap[Key]>;
  };

export type ParsedField<Type extends FieldType<any>> = {
  readonly value: ReturnType<Type["decode"]>;
};

export class StructDefinition<
  MembersMap extends { [key: string]: AtomDefinition }
> extends AtomDefinition {
  override readonly isContiguous: boolean;
  override readonly size: number;

  constructor(
    offset: number,
    description: string,
    public readonly $: MembersMap
  ) {
    super(offset, description);
    this.isContiguous = true;
    this.size = 0;
    for (const member of Object.values(this.$)) {
      if (!member.isContiguous) {
        this.isContiguous = false;
      }
      if (this.isContiguous && member.offset !== this.size) {
        this.isContiguous = false;
      }
      if (member.offset < this.size) {
        throw new Error(
          "Members must by ordered by offset and non-overlapping, at " +
            member.description
        );
      }
      this.size = Math.max(this.size, member.offset + member.size);
    }
  }
}

export const booleanField = new BooleanField();

export type ParsedDataBag = {
  [address: number]: ParsedAtom<any>;
};

export type RawDataBag = {
  [address: number]: Uint8Array;
};

export function parse<Definition extends AtomDefinition>(
  data: Uint8Array,
  definition: Definition,
  baseAddress: number
): [ParsedAtom<Definition>, ParsedDataBag] {
  const parsedDataBag: ParsedDataBag = {};
  const structured = parseImpl(data, definition, baseAddress, parsedDataBag, 0);
  return [structured, parsedDataBag];
}

function parseImpl<Definition extends AtomDefinition>(
  data: Uint8Array,
  definition: Definition,
  baseAddress: number,
  parsedDataBag: ParsedDataBag,
  flatAddressOffset: number
): ParsedAtom<Definition> {
  if (definition instanceof StructDefinition) {
    const $ = definition.$ as { [key: string]: AtomDefinition };
    const result: any = {};
    // Store self before children so that the innermost field is returned
    parsedDataBag[baseAddress + flatAddressOffset] = result;
    for (const [key, member] of Object.entries($)) {
      const memberParsed = parseImpl(
        data,
        member,
        baseAddress + member.offset,
        parsedDataBag,
        flatAddressOffset
      );
      result[key] = memberParsed;
    }
    return result;
  } else if (definition instanceof FieldDefinition) {
    const length = definition.type.size;
    if (baseAddress + length > data.length) {
      throw new Error(
        "Data too short, parsing failed at address " +
          data.length +
          " while parsing " +
          definition.description +
          ` (${definition.type.description})`
      );
    }
    const result = {
      value: definition.type.decode(data, baseAddress, length),
    } as ParsedField<FieldType<any>>;
    parsedDataBag[baseAddress + flatAddressOffset] = result;
    return result as any;
  }
  throw new Error(
    "Unknown definition type, parsing failed at address " +
      baseAddress +
      " while parsing " +
      definition.description
  );
}

export function tokenize<Definition extends AtomDefinition>(
  data: Uint8Array,
  definition: Definition,
  baseAddress: number
): RawDataBag {
  const rawDataBag: RawDataBag = {};
  tokenizeImpl(data, definition, baseAddress, rawDataBag, 0);
  return rawDataBag;
}

function tokenizeImpl<Definition extends AtomDefinition>(
  data: Uint8Array,
  definition: Definition,
  baseAddress: number,
  rawDataBag: RawDataBag,
  flatAddressOffset: number
): void {
  // Store self before any children so that the innermost field is returned
  if (definition.isContiguous) {
    if (baseAddress + definition.size > data.length) {
      throw new Error(
        "Data too short, tokenizing failed at address " +
          data.length +
          " while tokenizing " +
          definition.description
      );
    }
    rawDataBag[baseAddress + flatAddressOffset] = data.slice(
      baseAddress,
      baseAddress + definition.size
    );
  }
  if (definition instanceof StructDefinition) {
    const $ = definition.$ as { [key: string]: AtomDefinition };
    for (const member of Object.values($)) {
      tokenizeImpl(
        data,
        member,
        baseAddress + member.offset,
        rawDataBag,
        flatAddressOffset
      );
    }
    return;
  } else if (definition instanceof FieldDefinition) {
    // Already handled above, just here for exhaustiveness
    return;
  }
  throw new Error(
    "Unknown definition type, tokenizing failed at address " +
      baseAddress +
      " while tokenizing " +
      definition.description
  );
}

// TODO: Clean this up and update tests to use fetchAndTokenize instead
export async function fetchAndParse<Definition extends AtomDefinition>(
  definition: Definition,
  baseAddress: number,
  fetchContiguous: (
    absoluteAddress: number,
    length: number
  ) => Promise<Uint8Array>
): Promise<[ParsedAtom<Definition>, ParsedDataBag]> {
  const parsedDataBag: ParsedDataBag = {};
  const structured = await fetchAndParseImpl(
    definition,
    baseAddress,
    fetchContiguous,
    parsedDataBag
  );
  return [structured, parsedDataBag];
}

async function fetchAndParseImpl<Definition extends AtomDefinition>(
  definition: Definition,
  baseAddress: number,
  fetchContiguous: (
    absoluteAddress: number,
    length: number
  ) => Promise<Uint8Array>,
  parsedDataBag: ParsedDataBag
): Promise<ParsedAtom<Definition>> {
  if (definition.isContiguous) {
    const data = await fetchContiguous(baseAddress, definition.size);
    return parseImpl(data, definition, 0, parsedDataBag, baseAddress);
  }
  if (definition instanceof StructDefinition) {
    const $ = definition.$ as { [key: string]: AtomDefinition };

    const result: any = {};
    // Store self before children so that the innermost field is returned
    parsedDataBag[baseAddress] = result;

    // Coalesce contiguous fields into a single fetch
    const promises = [];

    type ContiguousBlock = {
      startOffset: number;
      endOffset: number;
      members: {
        [key: string]: AtomDefinition;
      };
    };

    const fetchBlock = async (block: ContiguousBlock) => {
      const data = await fetchContiguous(
        baseAddress + block.startOffset,
        block.endOffset - block.startOffset
      );
      for (const [key, member] of Object.entries(
        block.members as { [key: string]: AtomDefinition }
      )) {
        const memberParsed = parseImpl(
          data,
          member,
          member.offset - block.startOffset,
          parsedDataBag,
          baseAddress + block.startOffset
        );
        result[key] = memberParsed;
      }
    };

    let currentBlock: ContiguousBlock = {
      startOffset: 0,
      endOffset: 0,
      members: {},
    };
    for (const [key, member] of Object.entries($)) {
      if (member.isContiguous && member.offset === currentBlock.endOffset) {
        currentBlock.endOffset = member.offset + member.size;
        currentBlock.members[key] = member;
      } else {
        // Flush current block
        if (currentBlock.endOffset > currentBlock.startOffset) {
          promises.push(fetchBlock(currentBlock));
        }
        if (member.isContiguous) {
          currentBlock = {
            startOffset: member.offset,
            endOffset: member.offset + member.size,
            members: { [key]: member },
          };
        } else {
          promises.push(
            fetchAndParseImpl(
              member as AtomDefinition,
              baseAddress + member.offset,
              fetchContiguous,
              parsedDataBag
            ).then((parsedMember) => {
              result[key] = parsedMember;
            })
          );
          currentBlock = {
            startOffset: member.offset + member.size,
            endOffset: member.offset + member.size,
            members: {},
          };
        }
      }
    }
    if (currentBlock.endOffset > currentBlock.startOffset) {
      promises.push(fetchBlock(currentBlock));
    }

    await Promise.all(promises);
    return result;
  } else if (definition instanceof FieldDefinition) {
    throw new Error(
      "Cannot fetch non-contiguous field definition " +
        definition.description +
        " for address " +
        baseAddress
    );
  }
  throw new Error(
    "Unknown definition type, fetching failed at address " +
      baseAddress +
      " while fetching " +
      definition.description
  );
}

export async function fetchAndTokenize<Definition extends AtomDefinition>(
  definition: Definition,
  baseAddress: number,
  fetchContiguous: (
    absoluteAddress: number,
    length: number
  ) => Promise<Uint8Array>
): Promise<RawDataBag> {
  const rawDataBag: RawDataBag = {};
  await fetchAndTokenizeImpl(
    definition,
    baseAddress,
    fetchContiguous,
    rawDataBag
  );
  return rawDataBag;
}

async function fetchAndTokenizeImpl<Definition extends AtomDefinition>(
  definition: Definition,
  baseAddress: number,
  fetchContiguous: (
    absoluteAddress: number,
    length: number
  ) => Promise<Uint8Array>,
  rawDataBag: RawDataBag
): Promise<void> {
  if (definition.isContiguous) {
    const data = await fetchContiguous(baseAddress, definition.size);
    tokenizeImpl(data, definition, 0, rawDataBag, baseAddress);
    return;
  }
  if (definition instanceof StructDefinition) {
    const $ = definition.$ as { [key: string]: AtomDefinition };

    // Coalesce contiguous fields into a single fetch
    const promises = [];

    type ContiguousBlock = {
      startOffset: number;
      endOffset: number;
      members: {
        [key: string]: AtomDefinition;
      };
    };

    const fetchBlock = async (block: ContiguousBlock) => {
      const data = await fetchContiguous(
        baseAddress + block.startOffset,
        block.endOffset - block.startOffset
      );
      for (const member of Object.values(
        block.members as { [key: string]: AtomDefinition }
      )) {
        tokenizeImpl(
          data,
          member,
          member.offset - block.startOffset,
          rawDataBag,
          baseAddress + block.startOffset
        );
      }
    };

    let currentBlock: ContiguousBlock = {
      startOffset: 0,
      endOffset: 0,
      members: {},
    };
    for (const [key, member] of Object.entries($)) {
      if (member.isContiguous && member.offset === currentBlock.endOffset) {
        currentBlock.endOffset = member.offset + member.size;
        currentBlock.members[key] = member;
      } else {
        // Flush current block
        if (currentBlock.endOffset > currentBlock.startOffset) {
          promises.push(fetchBlock(currentBlock));
        }
        if (member.isContiguous) {
          currentBlock = {
            startOffset: member.offset,
            endOffset: member.offset + member.size,
            members: { [key]: member },
          };
        } else {
          promises.push(
            fetchAndTokenizeImpl(
              member as AtomDefinition,
              baseAddress + member.offset,
              fetchContiguous,
              rawDataBag
            )
          );
          currentBlock = {
            startOffset: member.offset + member.size,
            endOffset: member.offset + member.size,
            members: {},
          };
        }
      }
    }
    if (currentBlock.endOffset > currentBlock.startOffset) {
      promises.push(fetchBlock(currentBlock));
    }

    await Promise.all(promises);
    return;
  } else if (definition instanceof FieldDefinition) {
    throw new Error(
      "Cannot fetch non-contiguous field definition " +
        definition.description +
        " for address " +
        baseAddress
    );
  }
  throw new Error(
    "Unknown definition type, fetching failed at address " +
      baseAddress +
      " while fetching " +
      definition.description
  );
}

export type AbsoluteAddressMap<T extends AtomDefinition> =
  T extends StructDefinition<infer MembersMap>
    ? {
        [Key in keyof MembersMap]: AbsoluteAddressMap<MembersMap[Key]>;
      } & AtomReference<T>
    : T extends FieldDefinition<any>
    ? AtomReference<T>
    : never;

export function getAddresses<Definition extends AtomDefinition>(
  definition: Definition,
  baseAddress: number
): AbsoluteAddressMap<Definition> {
  if (definition instanceof StructDefinition) {
    const $ = definition.$ as { [key: string]: AtomDefinition };
    const result: any = {
      address: baseAddress,
      definition,
    };
    for (const [key, member] of Object.entries($)) {
      result[key] = getAddresses(
        member as AtomDefinition,
        baseAddress + member.offset
      );
    }
    return result;
  } else if (definition instanceof FieldDefinition) {
    return {
      address: baseAddress,
      definition,
    } as any;
  }
  throw new Error(
    "Unknown definition type, getting addresses failed at address " +
      baseAddress +
      " while getting addresses for " +
      definition.description
  );
}

export function isNumericField(type: FieldType<any>): type is NumericField {
  return type instanceof NumericFieldBase;
}

export function isNumericFieldReference(
  field: FieldReference<FieldType<any>>
): field is FieldReference<NumericField> {
  return isNumericField(field.definition.type);
}

export function isEnumField(type: FieldType<any>): type is EnumField {
  return type instanceof EnumField;
}

export function isEnumFieldReference(
  field: FieldReference<FieldType<any>>
): field is FieldReference<EnumField> {
  return isEnumField(field.definition.type);
}

export function isBooleanField(type: FieldType<any>): type is BooleanField {
  return type instanceof BooleanField;
}

export function isBooleanFieldReference(
  field: FieldReference<FieldType<any>>
): field is FieldReference<BooleanField> {
  return isBooleanField(field.definition.type);
}

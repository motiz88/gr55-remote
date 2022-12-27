import {
  AtomReference,
  EnumField,
  FieldDefinition,
  FieldReference,
  FieldType,
  isBooleanField,
  isEnumField,
  isNumericField,
  NumericField,
} from "./RolandAddressMap";
import { RolandGR55AddressMapAbsolute } from "./RolandGR55AddressMap";

export interface AssignDefinition {
  readonly description: string;
  withAddressOffset(offset: number): AssignDefinition;
  reinterpretAssignValueField(
    minOrMaxField: FieldReference<NumericField>
  ): FieldReference<AssignableFieldType<any>>;
}

// Assignable fields require a "min" and "max" value even if they're not numeric.
export interface AssignableFieldType<Representation>
  extends FieldType<Representation> {
  readonly min: Representation;
  readonly max: Representation;
}

export class FieldAssignDefinition implements AssignDefinition {
  constructor(
    public readonly description: string,
    public readonly field: FieldReference<AssignableFieldType<any>>,
    public readonly customAssignType?: AssignableFieldType<any>
  ) {}

  withAddressOffset(offset: number): FieldAssignDefinition {
    return new FieldAssignDefinition(this.description, {
      ...this.field,
      address: this.field.address + offset,
    });
  }

  reinterpretAssignValueField(
    minOrMaxField: FieldReference<NumericField>
  ): FieldReference<AssignableFieldType<any>> {
    // The point of this function is to try to infer a useful type for the min or max field
    // without having to explicitly specify it in the assign definition. Theoretically,
    // this should work for the vast majority of fields, except where Roland implemented
    // fully custom remapping logic for a field to fit it into the min/max field's range.
    let remappedType;
    if (this.customAssignType) {
      if (minOrMaxField.definition.type.size !== this.customAssignType.size) {
        throw new Error(
          "Custom assign type must have same size as min or max field"
        );
      }
      remappedType = this.customAssignType;
    } else if (isNumericField(this.field.definition.type)) {
      const { type } = this.field.definition;
      const { min, max, encodedOffset, format } = type;
      remappedType = minOrMaxField.definition.type.remapped({
        min,
        max,
        encodedOffset,
        format: format.bind(type),
      });
    } else if (isEnumField(this.field.definition.type)) {
      const { type } = this.field.definition;
      remappedType = new EnumField(type.labels, minOrMaxField.definition.type);
    } else if (isBooleanField(this.field.definition.type)) {
      const { type } = this.field.definition;
      // TODO: Remap to a boolean with USplit12Field storage
      remappedType = new EnumField(
        type.invertedForDisplay
          ? { 0: type.trueLabel, 1: type.falseLabel }
          : { 0: type.falseLabel, 1: type.trueLabel },
        minOrMaxField.definition.type.remapped({ encodedOffset: 0 })
      );
    }
    if (remappedType) {
      return {
        ...minOrMaxField,
        definition: new FieldDefinition(
          minOrMaxField.definition.offset,
          minOrMaxField.definition.description +
            " (" +
            this.field.definition.description +
            ")",
          remappedType
        ),
      };
    }
    throw new Error(
      `Failed to remap field rendering for ${this.description} in ${minOrMaxField.definition.description}`
    );
  }
}

export class VirtualFieldAssignDefinition implements AssignDefinition {
  constructor(
    public readonly description: string,
    public readonly customAssignType: AssignableFieldType<any>
  ) {}
  withAddressOffset(offset: number): VirtualFieldAssignDefinition {
    return this;
  }

  reinterpretAssignValueField(
    minOrMaxField: FieldReference<NumericField>
  ): FieldReference<AssignableFieldType<any>> {
    return {
      ...minOrMaxField,

      definition: new FieldDefinition(
        minOrMaxField.definition.offset,
        minOrMaxField.definition.description + " (" + this.description + ")",
        this.customAssignType
      ),
    };
  }
}

export class MultiFieldAssignDefinition implements AssignDefinition {
  constructor(
    public readonly description: string,
    public readonly fields: readonly FieldReference[],
    public readonly customAssignType: AssignableFieldType<any>
  ) {}

  withAddressOffset(offset: number): AssignDefinition {
    return new MultiFieldAssignDefinition(
      this.description,
      this.fields.map((field) => ({
        ...field,
        address: field.address + offset,
      })),
      this.customAssignType
    );
  }

  reinterpretAssignValueField(
    minOrMaxField: FieldReference<NumericField>
  ): FieldReference<AssignableFieldType<any>> {
    if (minOrMaxField.definition.type.size !== this.customAssignType.size) {
      throw new Error(
        "Custom assign type must have same size as min or max field"
      );
    }
    return {
      ...minOrMaxField,
      definition: new FieldDefinition(
        minOrMaxField.definition.offset,
        minOrMaxField.definition.description + " (" + this.description + ")",
        this.customAssignType
      ),
    };
  }
}

export class AssignsMap {
  private readonly assignIndexByFieldRelativeAddress: ReadonlyMap<
    number,
    number
  >;

  constructor(
    private readonly orderedAssigns: readonly AssignDefinition[],
    private readonly basePatch: AtomReference = RolandGR55AddressMapAbsolute.temporaryPatch
  ) {
    const assignIndexByFieldRelativeAddress = new Map();
    for (let i = 0; i < orderedAssigns.length; i++) {
      const assignDef = orderedAssigns[i];
      if (assignDef instanceof FieldAssignDefinition) {
        assignIndexByFieldRelativeAddress.set(
          assignDef.field.address - basePatch.address,
          i
        );
      } else if (assignDef instanceof MultiFieldAssignDefinition) {
        for (const field of assignDef.fields) {
          assignIndexByFieldRelativeAddress.set(
            field.address - basePatch.address,
            i
          );
        }
      }
    }
    this.assignIndexByFieldRelativeAddress = assignIndexByFieldRelativeAddress;
  }

  private readonly rebasedAssignCacheByPatchBaseAddress: Map<
    number,
    Map<AssignDefinition, AssignDefinition>
  > = new Map();

  getByIndex(
    index: number,
    patch: AtomReference = RolandGR55AddressMapAbsolute.temporaryPatch
  ): AssignDefinition {
    return this.rebaseAssign(this.orderedAssigns[index], patch);
  }

  getFieldByIndex(
    index: number,
    patch: AtomReference = RolandGR55AddressMapAbsolute.temporaryPatch
  ): FieldAssignDefinition | void {
    const assignDef = this.orderedAssigns[index];
    if (assignDef instanceof FieldAssignDefinition) {
      return this.rebaseAssign(assignDef, patch);
    }
  }

  private rebaseAssign<T extends AssignDefinition>(
    assignDef: T,
    patch: AtomReference
  ): T {
    if (
      patch.address === this.basePatch.address ||
      !(assignDef instanceof FieldAssignDefinition)
    ) {
      return assignDef;
    }
    const cachedByPatchBaseAddress =
      this.rebasedAssignCacheByPatchBaseAddress.get(patch.address);
    if (cachedByPatchBaseAddress) {
      const cached = cachedByPatchBaseAddress.get(assignDef);
      if (cached) {
        return cached as any;
      }
    } else {
      this.rebasedAssignCacheByPatchBaseAddress.set(patch.address, new Map());
    }
    const rebasedAssignDef = assignDef.withAddressOffset(
      patch.address - this.basePatch.address
    );
    this.rebasedAssignCacheByPatchBaseAddress
      .get(patch.address)!
      .set(assignDef, rebasedAssignDef);
    return rebasedAssignDef as any;
  }

  getIndexByField(
    field: FieldReference,
    patch: AtomReference = RolandGR55AddressMapAbsolute.temporaryPatch
  ): number | void {
    return this.assignIndexByFieldRelativeAddress.get(
      field.address - patch.address
    );
  }

  reinterpretTargetField(
    targetField: FieldReference<NumericField>
  ): FieldReference<NumericField> {
    return {
      ...targetField,
      definition: new FieldDefinition(
        targetField.definition.offset,
        targetField.definition.description,
        targetField.definition.type.remapped({
          format: (value) => {
            return this.orderedAssigns[value].description;
          },
          // TODO: Test this in bass mode
          max: this.orderedAssigns.length - 1,
        })
      ),
    };
  }
}

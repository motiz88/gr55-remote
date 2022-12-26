import { AtomReference, FieldReference } from "./RolandAddressMap";
import { RolandGR55AddressMapAbsolute } from "./RolandGR55AddressMap";

export interface AssignDefinition {
  readonly description: string;
  withAddressOffset(offset: number): AssignDefinition;
}

export class FieldAssignDefinition implements AssignDefinition {
  constructor(
    public readonly description: string,
    public readonly field: FieldReference
  ) {}

  withAddressOffset(offset: number): FieldAssignDefinition {
    return new FieldAssignDefinition(this.description, {
      ...this.field,
      address: this.field.address + offset,
    });
  }
}

// TODO: Model virtual fields (fields with no address in patch memory).
export class VirtualFieldAssignDefinition implements AssignDefinition {
  constructor(public readonly description: string) {}
  withAddressOffset(offset: number): VirtualFieldAssignDefinition {
    return this;
  }
}

// TODO: Model multi-field assigns (assigns that logically affect multiple fields).
// This may be solved by modeling the respective patch fields as single fields to begin with,
// and deleting this class.
export class MultiFieldAssignDefinition implements AssignDefinition {
  constructor(
    public readonly description: string,
    public readonly fields: readonly FieldReference[]
  ) {}
  withAddressOffset(offset: number): AssignDefinition {
    return new MultiFieldAssignDefinition(
      this.description,
      this.fields.map((field) => ({
        ...field,
        address: field.address + offset,
      }))
    );
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
}

import { useCallback, useContext, useEffect, useMemo } from "react";
import { create, act, ReactTestRenderer } from "react-test-renderer";

import {
  AsciiStringField,
  AtomDefinition,
  FieldDefinition,
  FieldType,
  getAddresses,
  parse,
  ParsedAtom,
  ParsedDataBag,
  StructDefinition,
} from "../RolandAddressMap";
import { RolandDataTransferContext } from "../RolandDataTransferContext";
import { RolandIoSetupContext } from "../RolandIoSetupContext";
import { RolandRemotePatchContext } from "../RolandRemotePatchContext";
import { usePatchField } from "../usePatchField";
import { useRolandRemotePatchState } from "../useRolandRemotePatchState";

function RolandRemotePatchStateContainer({
  children,
}: {
  children?: React.ReactNode;
}) {
  const rolandRemotePatchState = useRolandRemotePatchState();
  return (
    <RolandRemotePatchContext.Provider value={rolandRemotePatchState}>
      {children}
    </RolandRemotePatchContext.Provider>
  );
}

function MockRolandDeviceContainer({
  children,
}: {
  children?: React.ReactNode;
}) {
  const rolandIoSetupContext = useMemo(
    () => ({
      connectedDevices: new Map(),
      selectedDevice: {
        sysExConfig: {
          description: "Mock device",
          manufacturerId: 0,
          addressBytes: 4 as 4,
          modelId: [],
          familyCode: 0,
          modelNumber: 0,
          addressMap: mockAddressMapAbsolute,
        },
        description: "Mock device",
        identity: {
          manufacturerId: 0,
          deviceId: 0,
          deviceFamily: 0,
          deviceModel: 0,
          softwareRevisionLevel: 0,
        },
      },
      selectedDeviceKey: undefined,
      setSelectedDeviceKey: () => {},
      includeFakeDevice: false,
      setIncludeFakeDevice: () => {},
    }),
    []
  );
  return (
    <RolandIoSetupContext.Provider value={rolandIoSetupContext}>
      {children}
    </RolandIoSetupContext.Provider>
  );
}

function MockRolandDataTransferContainer({
  children,
  data,
}: {
  children?: React.ReactNode;
  data: Uint8Array;
}) {
  const requestData = useCallback(
    async function requestData<T extends AtomDefinition>(
      definition: T,
      baseAddress: number = 0
    ): Promise<[ParsedAtom<T>, ParsedDataBag]> {
      return parse(data, definition, baseAddress);
    },
    [data]
  );
  const setField = useCallback(
    function setField<T extends FieldDefinition<any>>(
      field: { address: number; definition: T },
      newValue: ReturnType<T["type"]["decode"]>
    ): void {
      field.definition.type.encode(
        newValue,
        data,
        field.address,
        field.definition.type.size
      );
    },
    [data]
  );
  const mockRolandDataTransferContext = useMemo(
    () => ({
      requestData,
      setField,
    }),
    [requestData, setField]
  );
  return (
    <RolandDataTransferContext.Provider value={mockRolandDataTransferContext}>
      {children}
    </RolandDataTransferContext.Provider>
  );
}

export const mockAddressMap = new StructDefinition(0, "Mock Address Map", {
  temporaryPatch: new StructDefinition(0, "Temporary Patch", {
    field1: new FieldDefinition(0, "Field 1", new AsciiStringField(16)),
  }),
});

export const mockAddressMapAbsolute = getAddresses(mockAddressMap, 0);

function Test({
  data,
  children,
}: {
  data: Uint8Array;
  children: React.ReactNode;
}) {
  return (
    <MockRolandDeviceContainer>
      <MockRolandDataTransferContainer data={data}>
        <RolandRemotePatchStateContainer>
          {children}
        </RolandRemotePatchStateContainer>
      </MockRolandDataTransferContainer>
    </MockRolandDeviceContainer>
  );
}

// Reads a patch field and renders its value as a string.
function Reader<T extends string | number | boolean>({
  field,
  defaultValue,
}: {
  field: { address: number; definition: FieldDefinition<FieldType<T>> };
  defaultValue: T;
}) {
  const [value] = usePatchField(field, defaultValue);
  return <>{"value: " + value.toString()}</>;
}

// Reloads patch data as soon as it is mounted.
function Reloader() {
  const { reloadPatchData } = useContext(RolandRemotePatchContext);
  useEffect(() => {
    reloadPatchData();
  }, [reloadPatchData]);
  return <></>;
}

test("read patch field", async () => {
  const data = new Uint8Array(Buffer.from("remote1".padEnd(16), "ascii"));
  let root: ReactTestRenderer;
  act(() => {
    root = create(
      <Test data={data}>
        <Reader
          field={mockAddressMapAbsolute.temporaryPatch.field1}
          defaultValue="default"
        />
      </Test>
    );
  });

  // Initial render with the default value
  expect(root!.toJSON()).toBe("value: default");
  await act(() => {});

  // Render with the remote value
  expect(root!.toJSON()).toBe("value: remote1");

  // Mutate the data and render a Reloader to trigger a reload
  data.set(Buffer.from("remote2".padEnd(16), "ascii"), 0);
  act(() => {
    root.update(
      <Test data={data}>
        <Reader
          field={mockAddressMapAbsolute.temporaryPatch.field1}
          defaultValue="default"
        />
        <Reloader />
      </Test>
    );
  });

  // The first remote value persists until we receive the new one
  expect(root!.toJSON()).toBe("value: remote1");
  await act(() => {});

  // Render with the new remote value
  expect(root!.toJSON()).toBe("value: remote2");
});

import { createContext, useCallback, useContext, useMemo } from "react";

import { encode } from "./RolandAddressMap";
import { RolandGR55AddressMapAbsolute as GR55 } from "./RolandGR55AddressMap";
import { RolandRemotePatchContext as PATCH } from "./RolandRemotePageContext";
import { useRolandRemotePatchEditHistory } from "./RolandRemotePatchEditHistory";
import { useAssignsMap } from "./useAssignsMap";
import { useRemoteField } from "./useRemoteField";

export function RolandGR55AssignsContainer({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [assign1Target] = useRemoteField(
    PATCH,
    GR55.temporaryPatch.common.assign1.target
  );
  const [assign1Switch, setAssign1Switch] = useRemoteField(
    PATCH,
    GR55.temporaryPatch.common.assign1.switch
  );
  const [assign2Target] = useRemoteField(
    PATCH,
    GR55.temporaryPatch.common.assign2.target
  );
  const [assign2Switch, setAssign2Switch] = useRemoteField(
    PATCH,
    GR55.temporaryPatch.common.assign2.switch
  );
  const [assign3Target] = useRemoteField(
    PATCH,
    GR55.temporaryPatch.common.assign3.target
  );
  const [assign3Switch, setAssign3Switch] = useRemoteField(
    PATCH,
    GR55.temporaryPatch.common.assign3.switch
  );
  const [assign4Target] = useRemoteField(
    PATCH,
    GR55.temporaryPatch.common.assign4.target
  );
  const [assign4Switch, setAssign4Switch] = useRemoteField(
    PATCH,
    GR55.temporaryPatch.common.assign4.switch
  );
  const [assign5Target] = useRemoteField(
    PATCH,
    GR55.temporaryPatch.common.assign5.target
  );
  const [assign5Switch, setAssign5Switch] = useRemoteField(
    PATCH,
    GR55.temporaryPatch.common.assign5.switch
  );
  const [assign6Target] = useRemoteField(
    PATCH,
    GR55.temporaryPatch.common.assign6.target
  );
  const [assign6Switch, setAssign6Switch] = useRemoteField(
    PATCH,
    GR55.temporaryPatch.common.assign6.switch
  );
  const [assign7Target] = useRemoteField(
    PATCH,
    GR55.temporaryPatch.common.assign7.target
  );
  const [assign7Switch, setAssign7Switch] = useRemoteField(
    PATCH,
    GR55.temporaryPatch.common.assign7.switch
  );
  const [assign8Target] = useRemoteField(
    PATCH,
    GR55.temporaryPatch.common.assign8.target
  );
  const [assign8Switch, setAssign8Switch] = useRemoteField(
    PATCH,
    GR55.temporaryPatch.common.assign8.switch
  );
  const { setRemoteField, localOverrides, pageData } = useContext(PATCH);
  const firstAvailableAssignIndex = [
    assign1Switch,
    assign2Switch,
    assign3Switch,
    assign4Switch,
    assign5Switch,
    assign6Switch,
    assign7Switch,
    assign8Switch,
  ].indexOf(false);
  const getAssignsForAssignDef = useCallback(
    (assignDefIndex: number): number[] => {
      const assigns = [];
      if (assign1Target === assignDefIndex && assign1Switch) {
        assigns.push(0);
      }
      if (assign2Target === assignDefIndex && assign2Switch) {
        assigns.push(1);
      }
      if (assign3Target === assignDefIndex && assign3Switch) {
        assigns.push(2);
      }
      if (assign4Target === assignDefIndex && assign4Switch) {
        assigns.push(3);
      }
      if (assign5Target === assignDefIndex && assign5Switch) {
        assigns.push(4);
      }
      if (assign6Target === assignDefIndex && assign6Switch) {
        assigns.push(5);
      }
      if (assign7Target === assignDefIndex && assign7Switch) {
        assigns.push(6);
      }
      if (assign8Target === assignDefIndex && assign8Switch) {
        assigns.push(7);
      }
      return assigns;
    },
    [
      assign1Switch,
      assign1Target,
      assign2Switch,
      assign2Target,
      assign3Switch,
      assign3Target,
      assign4Switch,
      assign4Target,
      assign5Switch,
      assign5Target,
      assign6Switch,
      assign6Target,
      assign7Switch,
      assign7Target,
      assign8Switch,
      assign8Target,
    ]
  );
  const assignsMap = useAssignsMap();
  const editHistory = useRolandRemotePatchEditHistory();
  const startTransaction = editHistory?.startTransaction;
  const endTransaction = editHistory?.endTransaction;
  const setAssignTarget = useCallback(
    (
      assign: typeof GR55.temporaryPatch.common.assign1,
      assignDefIndex: number
    ) => {
      if (!assignsMap) {
        throw new Error("No assigns map available, is a GR-55 connected?");
      }
      startTransaction?.();
      try {
        const assignDef = assignsMap.getByIndex(assignDefIndex);
        // TODO: Ideally this should be encapsulated in PATCH (port this entire handler to useRemoteField?)
        const previousAssignTargetBytes =
          localOverrides?.[assign.target.address] ??
          pageData?.[assign.target.address];
        const previousTargetMinBytes =
          localOverrides?.[assign.targetMin.address] ??
          pageData?.[assign.targetMin.address];
        const previousTargetMaxBytes =
          localOverrides?.[assign.targetMax.address] ??
          pageData?.[assign.targetMax.address];

        setRemoteField(
          assign.target,
          encode(assignDefIndex, assign.target.definition.type),
          previousAssignTargetBytes
        );

        const reinterpretedMin = assignDef.reinterpretAssignValueField(
          assign.targetMin
        );
        const reinterpretedMax = assignDef.reinterpretAssignValueField(
          assign.targetMax
        );
        setRemoteField(
          reinterpretedMin,
          encode(
            reinterpretedMin.definition.type.min,
            reinterpretedMin.definition.type
          ),
          previousTargetMinBytes
        );
        setRemoteField(
          reinterpretedMax,
          encode(
            reinterpretedMax.definition.type.max,
            reinterpretedMax.definition.type
          ),
          previousTargetMaxBytes
        );
      } finally {
        endTransaction?.();
      }
    },
    [
      assignsMap,
      endTransaction,
      localOverrides,
      pageData,
      setRemoteField,
      startTransaction,
    ]
  );
  const createAssign = useCallback(
    (assignDefIndex: number): number => {
      if (!assignsMap) {
        throw new Error("No assigns map available, is a GR-55 connected?");
      }
      startTransaction?.();
      try {
        let assign;
        switch (firstAvailableAssignIndex) {
          case 0:
            setAssign1Switch(true);
            assign = GR55.temporaryPatch.common.assign1;
            break;
          case 1:
            setAssign2Switch(true);
            assign = GR55.temporaryPatch.common.assign2;
            break;
          case 2:
            setAssign3Switch(true);
            assign = GR55.temporaryPatch.common.assign3;
            break;
          case 3:
            setAssign4Switch(true);
            assign = GR55.temporaryPatch.common.assign4;
            break;
          case 4:
            setAssign5Switch(true);
            assign = GR55.temporaryPatch.common.assign5;
            break;
          case 5:
            setAssign6Switch(true);
            assign = GR55.temporaryPatch.common.assign6;
            break;
          case 6:
            setAssign7Switch(true);
            assign = GR55.temporaryPatch.common.assign7;
            break;
          case 7:
            setAssign8Switch(true);
            assign = GR55.temporaryPatch.common.assign8;
            break;
          default:
            throw new Error(
              "No more assign slots available, should not be reachable"
            );
        }
        setAssignTarget(assign, assignDefIndex);
        return firstAvailableAssignIndex;
      } finally {
        endTransaction?.();
      }
    },
    [
      assignsMap,
      endTransaction,
      firstAvailableAssignIndex,
      setAssign1Switch,
      setAssign2Switch,
      setAssign3Switch,
      setAssign4Switch,
      setAssign5Switch,
      setAssign6Switch,
      setAssign7Switch,
      setAssign8Switch,
      setAssignTarget,
      startTransaction,
    ]
  );
  const deleteAssigns = useCallback(
    (assignDefIndex: number) => {
      const assigns = getAssignsForAssignDef(assignDefIndex);
      for (const assign of assigns) {
        switch (assign) {
          case 0:
            setAssign1Switch(false);
            break;
          case 1:
            setAssign2Switch(false);
            break;
          case 2:
            setAssign3Switch(false);
            break;
          case 3:
            setAssign4Switch(false);
            break;
          case 4:
            setAssign5Switch(false);
            break;
          case 5:
            setAssign6Switch(false);
            break;
          case 6:
            setAssign7Switch(false);
            break;
          case 7:
            setAssign8Switch(false);
            break;
        }
      }
    },
    [
      getAssignsForAssignDef,
      setAssign1Switch,
      setAssign2Switch,
      setAssign3Switch,
      setAssign4Switch,
      setAssign5Switch,
      setAssign6Switch,
      setAssign7Switch,
      setAssign8Switch,
    ]
  );
  const context = useMemo(() => {
    return {
      createAssign,
      deleteAssigns,
      getAssignsForAssignDef,
      firstAvailableAssignIndex,
      setAssignTarget,
    };
  }, [
    createAssign,
    deleteAssigns,
    getAssignsForAssignDef,
    firstAvailableAssignIndex,
    setAssignTarget,
  ]);

  return (
    <RolandGR55AssignsContext.Provider value={context}>
      {children}
    </RolandGR55AssignsContext.Provider>
  );
}

const RolandGR55AssignsContext = createContext<{
  createAssign: (assignDefIndex: number) => number;
  deleteAssigns: (assignDefIndex: number) => void;
  getAssignsForAssignDef: (assignDefIndex: number) => number[];
  firstAvailableAssignIndex: number;
  setAssignTarget: (
    assign: typeof GR55.temporaryPatch.common.assign1,
    assignDefIndex: number
  ) => void;
}>({
  createAssign: () => {
    throw new Error("RolandGR55AssignsContext not initialized");
  },
  getAssignsForAssignDef: () => {
    return [];
  },
  deleteAssigns: () => {},
  firstAvailableAssignIndex: -1,
  setAssignTarget: () => {},
});

export function useRolandGR55Assigns() {
  return useContext(RolandGR55AssignsContext);
}

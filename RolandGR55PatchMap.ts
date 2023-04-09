// In the GR-55, the patch display number is a composite of the UI bank number and the patch number within that bank.
// There are 3 patches per UI bank, so the patch display number is 01-1, 01-2, 01-3, 02-1, 02-2, 02-3, etc.
// Each "style" (LEAD, RHYTHM, OTHER or USER) has a sequential range of UI banks.
// So a string like "LEAD 01-1" or "RHYTHM 02-3" uniquely identifies a patch location.

import { pack7 } from "./RolandSysExProtocol";

// Patch contents are fixed in the GR-55's ROM for the LEAD, RHYTHM, and OTHER styles,
// so in particular we need to hardcode the patch names for these styles.
// The USER patches have addresses in the GR-55's memory so we read their names over MIDI.

const GR55_PATCHES_PER_UI_BANK = 3;
const GR55_UI_BANK_NUMBER_WIDTH = 2;

type CompositePatchNumber = [number, number]; // [UI bank, UI patch]

function buildContiguousPatches({
  styleLabel,
  fromPatchNumber,
  toPatchNumber,
  bankMSB,
  fromPC,
  fromUserPatch,
}: {
  styleLabel: string;
  fromPatchNumber: CompositePatchNumber;
  toPatchNumber: CompositePatchNumber;
  bankMSB: number;
  fromPC: number;
  fromUserPatch?: number;
}) {
  const patchMap = [];
  let pc = fromPC;
  let userPatchNumber = fromUserPatch;
  for (let i = fromPatchNumber[0]; i <= toPatchNumber[0]; i++) {
    const startj = i === fromPatchNumber[0] ? fromPatchNumber[1] : 1;
    const endj =
      i === toPatchNumber[0] ? toPatchNumber[1] : GR55_PATCHES_PER_UI_BANK;
    for (let j = startj; j <= endj; j++) {
      patchMap.push({
        styleLabel,
        patchNumberLabel: `${i
          .toString()
          .padStart(GR55_UI_BANK_NUMBER_WIDTH, "0")}-${j}`,
        bankMSB,
        pc,
        userPatch:
          userPatchNumber != null
            ? {
                patchNumber: userPatchNumber,
                baseAddress:
                  pack7(0x20000000) + userPatchNumber * pack7(0x010000),
              }
            : undefined,
      });
      pc++;
      if (typeof userPatchNumber === "number") {
        userPatchNumber++;
      }
    }
  }
  return patchMap;
}

function buildPatchMap(guitarBassSelect: "GUITAR" | "BASS") {
  const patchList = [];
  switch (guitarBassSelect) {
    case "GUITAR":
      patchList.push(
        ...buildContiguousPatches({
          styleLabel: "LEAD",
          fromPatchNumber: [1, 1],
          toPatchNumber: [30, 3],
          bankMSB: 16,
          fromPC: 0,
        }),
        ...buildContiguousPatches({
          styleLabel: "RHYTHM",
          fromPatchNumber: [1, 1],
          toPatchNumber: [13, 2],
          bankMSB: 16,
          fromPC: 90,
        }),
        ...buildContiguousPatches({
          styleLabel: "RHYTHM",
          fromPatchNumber: [13, 3],
          toPatchNumber: [30, 3],
          bankMSB: 17,
          fromPC: 0,
        }),
        ...buildContiguousPatches({
          styleLabel: "OTHER",
          fromPatchNumber: [1, 1],
          toPatchNumber: [26, 1],
          bankMSB: 17,
          fromPC: 52,
        }),
        ...buildContiguousPatches({
          styleLabel: "OTHER",
          fromPatchNumber: [26, 2],
          toPatchNumber: [30, 3],
          bankMSB: 18,
          fromPC: 0,
        })
      );
      break;
    case "BASS":
      patchList.push(
        ...buildContiguousPatches({
          styleLabel: "LEAD",
          fromPatchNumber: [1, 1],
          toPatchNumber: [10, 3],
          bankMSB: 16,
          fromPC: 0,
        }),
        ...buildContiguousPatches({
          styleLabel: "RHYTHM",
          fromPatchNumber: [1, 1],
          toPatchNumber: [10, 3],
          bankMSB: 16,
          fromPC: 30,
        }),
        ...buildContiguousPatches({
          styleLabel: "OTHER",
          fromPatchNumber: [1, 1],
          toPatchNumber: [10, 3],
          bankMSB: 16,
          fromPC: 60,
        })
      );
  }
  patchList.push(
    ...buildContiguousPatches({
      styleLabel: "USER",
      fromPatchNumber: [1, 1],
      toPatchNumber: [43, 2],
      bankMSB: 0,
      fromPC: 0,
      fromUserPatch: 0,
    }),
    ...buildContiguousPatches({
      styleLabel: "USER",
      fromPatchNumber: [43, 3],
      toPatchNumber: [86, 1],
      bankMSB: 1,
      fromPC: 0,
      fromUserPatch: 128,
    }),
    ...buildContiguousPatches({
      styleLabel: "USER",
      fromPatchNumber: [86, 2],
      toPatchNumber: [99, 3],
      bankMSB: 2,
      fromPC: 0,
      fromUserPatch: 256,
    })
  );
  return {
    patchList,
  };
}

export type RolandGR55PatchMap = Readonly<{
  patchList: readonly Readonly<{
    styleLabel: string;
    patchNumberLabel: string;
    bankMSB: number;
    pc: number;
    userPatch:
      | Readonly<{
          patchNumber: number;
          baseAddress: number;
        }>
      | undefined;
  }>[];
}>;

export const RolandGR55PatchMapGuitarMode: RolandGR55PatchMap =
  buildPatchMap("GUITAR");
export const RolandGR55PatchMapBassMode: RolandGR55PatchMap =
  buildPatchMap("BASS");

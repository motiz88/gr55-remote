import { RolandDataTransferContext } from "./RolandDataTransfer";
import { pack7 } from "./RolandSysExProtocol";

export async function saveAndSelectUserPatch(
  userPatchNumber: number,
  dataTransfer: React.ContextType<typeof RolandDataTransferContext>
): Promise<void> {
  const { requestNonDataCommand } = dataTransfer;
  if (requestNonDataCommand == null) {
    return;
  }
  const msb = (userPatchNumber / 128) | 0;
  const pc = (userPatchNumber | 0) % 128;
  await requestNonDataCommand(
    // Command for writing Temporary patch data to User area
    pack7(0x0f000000),
    [msb, 0x00, pc, 0x7f],
    [pack7(0x0f000001), pack7(0x0f000002)]
  );
}

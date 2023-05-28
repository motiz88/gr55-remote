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

  // Notes on how the GR-55 handles this command:
  // 1. The GR-55 will send a patch change message when the patch is saved, *before* sending the
  //    0x0f000002 response. This is fine because our queueing mechanism will ensure that the
  //    patch change message is processed before we send any follow-up messages (e.g. to read
  //    the new temporary patch data from the device).
  // 2. It appears that the separate "Command for storing User data to internal memory" (writing
  //    0x01 to 0x0f000001) is not necessary. It may become necessary if we want to make direct
  //    writes to the User area, instead of (or in addition to) writing to the Temporary area.
}

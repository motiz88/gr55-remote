import { RolandDataTransferContext } from "./RolandDataTransfer";
import { pack7 } from "./RolandSysExProtocol";

export async function saveAndSelectUserPatch(
  userPatchNumber: number,
  dataTransfer: React.ContextType<typeof RolandDataTransferContext>,
  signal?: AbortSignal,
  queueID?: string
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
    [pack7(0x0f000001), pack7(0x0f000002)],
    "RQ1",
    signal,
    queueID
  );

  // Notes on how the GR-55 handles this command:
  // 1. The GR-55 will send a patch change message when the patch is saved, *before* sending the
  //    0x0f000002 response. This is fine because our queueing mechanism will ensure that the
  //    patch change message is processed before we send any follow-up messages (e.g. to read
  //    the new temporary patch data from the device).
  // 2. It is not necessary to call persistUserDataToMemory after this command. TODO: Verify this.
}

export async function persistUserDataToMemory(
  dataTransfer: React.ContextType<typeof RolandDataTransferContext>,
  signal?: AbortSignal,
  queueID?: string
): Promise<void> {
  // TODO: Is it faster to saveAndSelectUserPatch than to persist all patches? Other than speed,
  // are there downsides to either approach? (e.g. the command might reset some ephemeral state)
  const { requestNonDataCommand } = dataTransfer;
  if (requestNonDataCommand == null) {
    return;
  }
  await requestNonDataCommand(
    // Command for storing User data to internal memory
    pack7(0x0f000001),
    [0x01],
    [pack7(0x0f000001), pack7(0x0f000002)],
    "DT1",
    signal,
    queueID
  );
}

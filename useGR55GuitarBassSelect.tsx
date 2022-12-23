import { useContext } from "react";
import usePromise from "react-use-promise";
import { RolandDataTransferContext } from "./RolandDataTransferContext";
import { RolandGR55AddressMapAbsolute as GR55 } from "./RolandGR55AddressMap";

// TODO: Move this to a separate file, prefetch it, make it reloadable
export function useGR55GuitarBassSelect() {
  const { requestData } = useContext(RolandDataTransferContext);
  return usePromise(async (): Promise<"GUITAR" | "BASS"> => {
    if (!requestData) {
      return await new Promise(() => {}); // Never resolves
    }
    const [{ value }] = await requestData(
      GR55.system.common.guitarBassSelect.definition,
      GR55.system.common.guitarBassSelect.address
    );
    return value as any;
  }, [requestData]);
}

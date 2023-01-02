import { FieldRow } from "./FieldRow";

export function FieldPlaceholder({ children }: { children: React.ReactNode }) {
  return <FieldRow description={children} />;
}

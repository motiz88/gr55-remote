import { FieldRow } from "./FieldRow";

export function PatchFieldPlaceholder({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FieldRow description={children} />;
}

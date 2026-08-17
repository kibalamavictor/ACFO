import { formatInline } from "@/lib/cms/formatInline";

export default function FormattedText({ value }: { value: string }) {
  return <>{formatInline(value)}</>;
}

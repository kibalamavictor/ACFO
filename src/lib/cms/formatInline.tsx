import type { ReactNode } from "react";

export function formatInline(value: string): ReactNode[] {
  if (!value) {
    return [];
  }

  const tokens = value.split(/(\*\*[^*]+?\*\*|\*[^*]+?\*)/g);
  return tokens.map((token, index) => {
    if (token.startsWith("**") && token.endsWith("**") && token.length >= 4) {
      return <strong key={index}>{token.slice(2, -2)}</strong>;
    }
    if (token.startsWith("*") && token.endsWith("*") && token.length >= 2) {
      return <em key={index}>{token.slice(1, -1)}</em>;
    }
    return <span key={index}>{token}</span>;
  });
}

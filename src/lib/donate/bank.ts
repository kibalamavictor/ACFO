/** Ecobank South Sudan letter dated 18 June 2026. */
export const ACFO_BANK = {
  accountName: "AFRICAN CHILDRENS FOUNDATION ORGANIZATION",
  accountNumber: "6940060129",
  currency: "United States Dollars (USD)",
  bank: "Ecobank South Sudan Limited",
  branch: "Amarat Branch, P.O. Box 150, Juba",
  swift: "ECOCSSJB",
  correspondent: "Citibank New York",
  beneficiaryBank: "Ecobank South Sudan Ltd",
} as const;

export function donationReference() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  const code = Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
  return `ACFO-${code}`;
}

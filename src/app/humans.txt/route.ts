import { ORG_LEGAL_NAME, getSiteUrl } from "@/lib/seo/config";

export const revalidate = 86400;

export function GET() {
  const body = `/* TEAM */
Organisation: ${ORG_LEGAL_NAME}
Location: Juba, South Sudan
Site: ${getSiteUrl()}

/* SITE */
Standards: Next.js, Schema.org NGO, RSS, llms.txt
Doctype: HTML5
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

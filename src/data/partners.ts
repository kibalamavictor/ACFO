export const defaultPartnerLogos = [
  { src: "/images/partners/unicef.svg", name: "UNICEF" },
  { src: "/images/partners/unhcr.svg", name: "UNHCR" },
  { src: "/images/partners/wfp.svg", name: "World Food Programme" },
  { src: "/images/partners/who.svg", name: "World Health Organization" },
  { src: "/images/partners/save-the-children.svg", name: "Save the Children" },
  { src: "/images/partners/icrc.svg", name: "ICRC" },
  { src: "/images/partners/undp.svg", name: "UNDP" },
  { src: "/images/partners/unmiss.svg", name: "UNMISS" },
  { src: "/images/partners/ssrc.svg", name: "South Sudan Red Cross" },
  { src: "/images/partners/mogei.svg", name: "MoGEI South Sudan" },
  { src: "/images/partners/rss.svg", name: "Republic of South Sudan" },
  { src: "/images/partners/nilepet.svg", name: "Nile Petroleum" },
] as const;

export function isPlaceholderPartnerLogos(
  logos: { src?: string; name?: string }[],
) {
  if (logos.length === 0) {
    return true;
  }

  return logos.every(
    (logo) =>
      !logo.name ||
      logo.name === "Partner" ||
      logo.src === "/images/partner-logo-a.svg" ||
      logo.src === "/images/partner-logo-b.svg",
  );
}

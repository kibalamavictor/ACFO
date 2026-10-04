"use client";

import { createContext, useContext, useMemo } from "react";
import { defaultPages, type PageId } from "@/lib/cms/pages";
import { defaultSettings } from "@/lib/cms/public";
import type { SiteContent } from "@/lib/cms/types";

const FALLBACK: SiteContent = {
  news: [],
  team: [],
  programmes: [],
  projects: [],
  settings: defaultSettings,
  pages: defaultPages,
};

const SiteContentContext = createContext<SiteContent>(FALLBACK);

export function SiteContentProvider({
  initial,
  children,
}: {
  initial: Pick<SiteContent, "settings" | "pages">;
  children: React.ReactNode;
}) {
  const value = useMemo(() => ({ ...FALLBACK, ...initial }), [initial]);

  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  );
}

/** Adds the collections a single page needs on top of the site-wide settings and page copy. */
export function SiteContentScope({
  content,
  children,
}: {
  content: Partial<Pick<SiteContent, "news" | "team" | "programmes" | "projects">>;
  children: React.ReactNode;
}) {
  const parent = useContext(SiteContentContext);
  const value = useMemo(() => ({ ...parent, ...content }), [parent, content]);

  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}

export function usePage<K extends PageId>(id: K) {
  return useSiteContent().pages[id];
}

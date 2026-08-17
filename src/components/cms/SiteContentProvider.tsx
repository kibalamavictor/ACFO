"use client";

import { createContext, useContext } from "react";
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
  initial: SiteContent;
  children: React.ReactNode;
}) {
  return (
    <SiteContentContext.Provider value={initial}>
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

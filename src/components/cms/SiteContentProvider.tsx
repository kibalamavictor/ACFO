"use client";

import { createContext, useContext, useEffect, useState } from "react";
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
  const [content, setContent] = useState(initial);

  useEffect(() => {
    setContent(initial);
  }, [initial]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const response = await fetch("/api/site-content", { cache: "no-store" });
        if (!response.ok) {
          return;
        }
        const next = (await response.json()) as SiteContent;
        if (active && next?.pages) {
          setContent(next);
        }
      } catch {
        // Keep the server-rendered copy if the refresh fails.
      }
    };

    void load();
    const onFocus = () => {
      void load();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);
    window.addEventListener("acfo-cms-updated", onFocus);

    return () => {
      active = false;
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
      window.removeEventListener("acfo-cms-updated", onFocus);
    };
  }, []);

  return (
    <SiteContentContext.Provider value={content}>
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

"use client";

import { createContext, useContext } from "react";
import type { CmsPublicUser } from "@/lib/cms/types";

const CmsSessionContext = createContext<CmsPublicUser | null>(null);

export function CmsSessionProvider({
  user,
  children,
}: {
  user: CmsPublicUser | null;
  children: React.ReactNode;
}) {
  return (
    <CmsSessionContext.Provider value={user}>
      {children}
    </CmsSessionContext.Provider>
  );
}

export function useCmsSession() {
  return useContext(CmsSessionContext);
}

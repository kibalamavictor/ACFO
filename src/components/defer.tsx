"use client";

import dynamic from "next/dynamic";

export const Community = dynamic(() => import("@/components/Community"));
export const Partners = dynamic(() => import("@/components/Partners"));
export const News = dynamic(() => import("@/components/News"));
export const ProgrammesCommunity = dynamic(
  () => import("@/components/programmes/ProgrammesCommunity"),
);

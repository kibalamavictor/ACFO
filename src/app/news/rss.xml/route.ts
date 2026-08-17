import { NextResponse } from "next/server";

export const revalidate = 60;

export function GET(request: Request) {
  return NextResponse.redirect(new URL("/feed.xml", request.url), 308);
}

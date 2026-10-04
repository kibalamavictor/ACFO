import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/cms/session";
import { createUser, getUsers, toPublicUser } from "@/lib/cms/users";

export const runtime = "nodejs";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) {
    return response;
  }

  return NextResponse.json((await getUsers()).map(toPublicUser));
}

export async function POST(request: Request) {
  const { response } = await requireAdmin();
  if (response) {
    return response;
  }

  const body = (await request.json().catch(() => null)) as {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
  } | null;

  if (!body) {
    return NextResponse.json({ error: "Invalid editor." }, { status: 400 });
  }

  const result = await createUser(body);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result.user, { status: 201 });
}

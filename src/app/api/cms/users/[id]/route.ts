import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/cms/session";
import { deleteUser } from "@/lib/cms/users";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  const { user, response } = await requireAdmin();
  if (response) {
    return response;
  }

  const { id } = await context.params;
  const result = deleteUser(id, user.id);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

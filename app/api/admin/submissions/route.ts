import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminClient } from "@/lib/data";
import { isAdmin, adminTokenFrom } from "@/lib/server";
export const dynamic = "force-dynamic";
// GET /api/admin/submissions?kind=sponsor&limit=100  (Authorization: Bearer <admin token>, or the admin cookie)
export async function GET(req: Request) {
  if (!(await isAdmin(adminTokenFrom(req) || cookies().get("smb_admin")?.value))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const u = new URL(req.url), kind = u.searchParams.get("kind"), limit = Math.min(500, Number(u.searchParams.get("limit")) || 100);
  const db = adminClient()!; let q = db.from("form_submissions").select("*").order("created_at", { ascending: false }).limit(limit);
  if (kind) q = q.eq("kind", kind);
  const { data, error } = await q;
  return error ? NextResponse.json({ error: error.message }, { status: 500 }) : NextResponse.json({ submissions: data });
}

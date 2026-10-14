import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { adminClient } from "@/lib/data";
import { isAdmin, adminTokenFrom } from "@/lib/server";
import { SITE_URL } from "@/lib/taxonomy";
export async function POST(req: Request) {
  if (!(await isAdmin(adminTokenFrom(req) || cookies().get("smb_admin")?.value))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const f = await req.formData(); const id = String(f.get("id") || ""), action = String(f.get("action") || "");
  if (!/^[0-9a-f-]{36}$/.test(id) || !["approved", "rejected", "pending"].includes(action)) return NextResponse.json({ error: "Bad request" }, { status: 400 });
  await adminClient()!.from("wins").update({ status: action, approved_at: action === "approved" ? new Date().toISOString() : null }).eq("id", id);
  revalidatePath("/wins");
  return NextResponse.redirect(`${SITE_URL}/admin?tab=wins`, 303);
}

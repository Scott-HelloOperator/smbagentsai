import { NextResponse } from "next/server";
import { isAdmin, ipHash, rateLimit } from "@/lib/server";
import { SITE_URL } from "@/lib/taxonomy";
export async function POST(req: Request) {
  const form = await req.formData().catch(() => null); const t = String(form?.get("token") || "");
  if (!(await rateLimit(`admin-login:${ipHash(req)}`, 10, 900))) return new NextResponse("Too many attempts", { status: 429 });
  if (!(await isAdmin(t))) return NextResponse.redirect(`${SITE_URL}/admin?bad=1`, 303);
  const res = NextResponse.redirect(`${SITE_URL}/admin`, 303);
  res.cookies.set("smb_admin", t, { httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: 60 * 60 * 24 * 30 });
  return res;
}
export async function DELETE() { const res = NextResponse.json({ ok: true }); res.cookies.delete("smb_admin"); return res; }

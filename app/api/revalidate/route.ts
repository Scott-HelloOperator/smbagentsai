import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
// Called by the content engine after inserting new use cases.
export async function POST(req: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || req.headers.get("x-revalidate-secret") !== secret) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  revalidatePath("/", "layout"); // home, landing pages, use-case pages, sitemap
  return NextResponse.json({ ok: true });
}

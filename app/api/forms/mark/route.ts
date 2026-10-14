import { NextResponse } from "next/server";
import { adminClient } from "@/lib/data";
// Marks a stored submission as relayed by the browser to FormSubmit. Only flips rows that were undelivered.
export async function POST(req: Request) {
  const { id } = await req.json().catch(() => ({}));
  if (typeof id !== "string" || !/^[0-9a-f-]{36}$/.test(id)) return NextResponse.json({ ok: false }, { status: 400 });
  const db = adminClient(); if (db) await db.from("form_submissions").update({ delivered_via: "formsubmit-browser", delivery_error: null }).eq("id", id).is("delivered_via", null);
  return NextResponse.json({ ok: true });
}

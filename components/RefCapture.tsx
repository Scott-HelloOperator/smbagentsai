"use client";
import { useEffect } from "react";
// Remembers ?ref=code for 60 days so later signups credit the referrer.
export default function RefCapture() {
  useEffect(() => {
    const r = new URLSearchParams(location.search).get("ref");
    if (r && /^[a-z0-9]{4,16}$/.test(r) && !localStorage.getItem("smb_ref")) localStorage.setItem("smb_ref", JSON.stringify({ r, t: Date.now() }));
  }, []);
  return null;
}
export function getRef(): string | null {
  try { const v = JSON.parse(localStorage.getItem("smb_ref") || "null"); return v && Date.now() - v.t < 60 * 864e5 ? v.r : null; } catch { return null; }
}

import { ImageResponse } from "next/og";
import { getUseCase } from "@/lib/data";
import { Frame, ogFonts, OG_SIZE, B } from "@/lib/og";
export const runtime = "nodejs";
export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "SMB Agents AI use case";
export default async function OG({ params }: { params: { slug: string } }) {
  const u = await getUseCase(params.slug);
  const title = u?.title || "Real AI agent use cases for small businesses";
  const fs = title.length > 70 ? 58 : title.length > 48 ? 66 : 76;
  return new ImageResponse(
    <Frame kicker={u?.category || "Use case"} foot={u ? `${u.difficulty} · ${u.setup_time} setup · ${u.monthly_cost}` : "Plain English. No hype."}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1 }}>
        <div style={{ fontFamily: "Fraunces", fontSize: fs, fontWeight: 600, lineHeight: 1.04, letterSpacing: -1.2, maxWidth: 1000 }}>{title}</div>
        {u && <div style={{ display: "flex", alignItems: "center", marginTop: 30, fontSize: 30, color: B.ink }}>
          <div style={{ width: 12, height: 12, borderRadius: 12, background: B.coral, marginRight: 14 }} />{u.result}</div>}
        {u && <div style={{ display: "flex", gap: 10, marginTop: 26 }}>{u.tools.slice(0, 4).map((t) => <div key={t} style={{ display: "flex", padding: "6px 14px", border: `1px solid ${B.rule}`, borderRadius: 10, background: "#fff", fontSize: 22, color: B.muted }}>{t}</div>)}</div>}
      </div>
    </Frame>, { ...size, fonts: ogFonts() });
}

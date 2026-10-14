import { ImageResponse } from "next/og";
import { getUseCases } from "@/lib/data";
import { find } from "@/lib/finder";
import { Frame, ogFonts, OG_SIZE, B } from "@/lib/og";
export const runtime = "nodejs";
export async function GET(req: Request) {
  const q = (new URL(req.url).searchParams.get("q") || "").slice(0, 280);
  const picks = q.length >= 12 ? find(q, await getUseCases()).picks.slice(0, 5) : [];
  return new ImageResponse(
    <Frame kicker="Agent Finder" foot="Describe your business. Get your top five. No signup.">
      {picks.length ? <div style={{ display: "flex", flex: 1, alignItems: "center", gap: 48 }}>
        <div style={{ display: "flex", flexDirection: "column", width: 380 }}>
          <div style={{ fontFamily: "Fraunces", fontSize: 64, fontWeight: 600, lineHeight: 1.02, letterSpacing: -1.2 }}>My top 5</div>
          <div style={{ display: "flex", fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 400, fontSize: 52, lineHeight: 1.05 }}>AI agents</div>
          <div style={{ display: "flex", fontSize: 22, color: B.muted, marginTop: 18, lineHeight: 1.35 }}>{`“${q.length > 90 ? q.slice(0, 88) + "…" : q}”`}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, borderLeft: `1px solid ${B.rule}`, paddingLeft: 36 }}>
          {picks.map((u, i) => <div key={u.slug} style={{ display: "flex", alignItems: "baseline", padding: "9px 0", borderBottom: i < picks.length - 1 ? `1px solid ${B.rule}` : "none" }}>
            <div style={{ fontFamily: "Fraunces", fontSize: 30, fontWeight: 600, color: B.coral, width: 40 }}>{String(i + 1)}</div>
            <div style={{ fontSize: 24, lineHeight: 1.22, flex: 1 }}>{u.title}</div></div>)}
        </div>
      </div>
      : <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1 }}>
          <div style={{ fontFamily: "Fraunces", fontSize: 80, fontWeight: 600, lineHeight: 1.02, letterSpacing: -1.5, maxWidth: 950 }}>Describe your business.</div>
          <div style={{ display: "flex", fontFamily: "Fraunces", fontStyle: "italic", fontSize: 80, lineHeight: 1.05 }}>Get your top five.</div>
        </div>}
    </Frame>, { ...OG_SIZE, fonts: ogFonts(), headers: { "cache-control": "public, s-maxage=86400, stale-while-revalidate=604800" } });
}

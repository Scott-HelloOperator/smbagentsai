import { ImageResponse } from "next/og";
import { getPack } from "@/lib/packs";
import { getUseCases } from "@/lib/data";
import { Frame, ogFonts, OG_SIZE, B } from "@/lib/og";
export const runtime = "nodejs";
export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "SMB Agents AI industry pack";
export default async function OG({ params }: { params: { slug: string } }) {
  const p = getPack(params.slug); const all = await getUseCases();
  const items = (p?.items || []).slice(0, 4).map((s) => all.find((u) => u.slug === s)?.title).filter(Boolean) as string[];
  return new ImageResponse(
    <Frame kicker="Industry pack" foot={p ? `For ${p.who}` : ""}>
      <div style={{ display: "flex", flex: 1, alignItems: "center", gap: 56 }}>
        <div style={{ display: "flex", flexDirection: "column", width: 470 }}>
          <div style={{ fontFamily: "Fraunces", fontSize: 72, fontWeight: 600, lineHeight: 1.02, letterSpacing: -1.5 }}>{p?.name || "Industry pack"}</div>
          <div style={{ display: "flex", fontSize: 26, color: B.muted, marginTop: 20, lineHeight: 1.35 }}>{p?.line || ""}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, borderLeft: `1px solid ${B.rule}`, paddingLeft: 40 }}>
          {items.map((t, i) => <div key={t} style={{ display: "flex", alignItems: "baseline", padding: "12px 0", borderBottom: i < items.length - 1 ? `1px solid ${B.rule}` : "none" }}>
            <div style={{ fontFamily: "Fraunces", fontSize: 34, fontWeight: 600, color: B.coral, width: 44 }}>{String(i + 1)}</div>
            <div style={{ fontSize: 26, lineHeight: 1.25, flex: 1 }}>{t}</div></div>)}
        </div>
      </div>
    </Frame>, { ...size, fonts: ogFonts() });
}

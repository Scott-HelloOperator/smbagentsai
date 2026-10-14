import { ImageResponse } from "next/og";
import { getQuiz } from "@/lib/quizStore";
import { verdict } from "@/lib/quiz";
import { Frame, ogFonts, OG_SIZE, B } from "@/lib/og";
export const runtime = "nodejs";
export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "AI Readiness Quiz score";
export default async function OG({ params }: { params: { id: string } }) {
  const q = await getQuiz(params.id); const s = q?.score ?? 0; const v = verdict(s);
  const R = 150, C = 2 * Math.PI * R, dash = (s / 100) * C;
  return new ImageResponse(
    <Frame kicker="AI Readiness Quiz" foot="3 minutes · free · for businesses under 200 people">
      <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
          <div style={{ fontFamily: "Fraunces", fontSize: 76, fontWeight: 600, lineHeight: 1.02, letterSpacing: -1.5 }}>{`I scored ${s}/100.`}</div>
          <div style={{ display: "flex", fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 400, fontSize: 60, lineHeight: 1.1, color: B.ink, marginTop: 6 }}>What's yours?</div>
          <div style={{ display: "flex", marginTop: 30, fontSize: 28, color: B.muted }}>{v.label}</div>
        </div>
        <div style={{ display: "flex", position: "relative", width: 340, height: 340, alignItems: "center", justifyContent: "center" }}>
          <svg width="340" height="340" viewBox="0 0 340 340" style={{ position: "absolute", top: 0, left: 0 }}>
            <circle cx="170" cy="170" r={R} fill="#FFFFFF" stroke={B.rule} strokeWidth="14" />
            <circle cx="170" cy="170" r={R} fill="none" stroke={B.coral} strokeWidth="14" strokeLinecap="round" strokeDasharray={`${dash} ${C}`} transform="rotate(-90 170 170)" />
          </svg>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontFamily: "Fraunces", fontSize: 128, fontWeight: 600, lineHeight: 1 }}>{String(s)}</div>
            <div style={{ fontSize: 26, color: B.muted, marginTop: 4 }}>out of 100</div>
          </div>
        </div>
      </div>
    </Frame>, { ...size, fonts: ogFonts() });
}

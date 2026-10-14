import { ImageResponse } from "next/og";
import { getQuiz } from "@/lib/quizStore";
import { verdict } from "@/lib/quiz";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "AI Readiness Quiz score";
export default async function OG({ params }: { params: { id: string } }) {
  const q = await getQuiz(params.id); const s = q?.score ?? 0; const v = verdict(s);
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#FBF7F0", padding: 70, fontFamily: "Georgia, serif", color: "#2B2420" }}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
        <div style={{ fontSize: 30, display: "flex" }}><span style={{ fontWeight: 700 }}>SMB</span><span style={{ color: "#C2552A", fontWeight: 700 }}>Agents</span><span style={{ fontWeight: 700 }}>AI</span></div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 34, color: "#C2552A" }}>AI Readiness Quiz</div>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.1, marginTop: 10, maxWidth: 640 }}>{`I scored ${s}/100 — what's yours?`}</div>
          <div style={{ fontSize: 30, marginTop: 20, color: "#6b5f57" }}>{`${v.label} · 3-minute quiz for small businesses`}</div>
        </div>
        <div style={{ fontSize: 26, color: "#6b5f57" }}>smbagentsai.com/quiz</div>
      </div>
      <div style={{ width: 340, height: 340, borderRadius: 999, alignSelf: "center", display: "flex", alignItems: "center", justifyContent: "center",
        background: "#F3E8DE", border: "22px solid #D9693B" }}>
        <div style={{ width: 250, height: 250, borderRadius: 999, background: "white", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 120, fontWeight: 700 }}>{String(s)}</div><div style={{ fontSize: 32, color: "#6b5f57", marginTop: -10 }}>/ 100</div>
        </div>
      </div>
    </div>, size);
}

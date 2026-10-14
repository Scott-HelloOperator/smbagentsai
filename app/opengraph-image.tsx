import { ImageResponse } from "next/og";
import { Frame, ogFonts, OG_SIZE, B } from "@/lib/og";
export const runtime = "nodejs";
export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "SMB Agents AI: real AI agent use cases, sorted by the problem you actually have";
export default function OG() {
  return new ImageResponse(
    <Frame kicker="For businesses under 200 people" foot="Pick a headache. Flip a card. Copy the prompt.">
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1 }}>
        <div style={{ fontFamily: "Fraunces", fontSize: 84, fontWeight: 600, lineHeight: 1.02, letterSpacing: -2, maxWidth: 1000 }}>Real AI agent use cases, sorted by the problem you</div>
        <div style={{ display: "flex", fontFamily: "Fraunces", fontSize: 84, lineHeight: 1.05, letterSpacing: -2 }}><span style={{ fontStyle: "italic", fontWeight: 400 }}>actually</span><span style={{ fontWeight: 600, marginLeft: 22 }}>have.</span></div>
        <div style={{ display: "flex", width: 120, height: 6, background: B.coral, marginTop: 34, borderRadius: 6 }} />
      </div>
    </Frame>, { ...size, fonts: ogFonts() });
}

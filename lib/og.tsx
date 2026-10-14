import fs from "fs";
import path from "path";
export const OG_SIZE = { width: 1200, height: 630 };
export const B = { cream: "#FBF7F0", ink: "#2B2420", coral: "#ED7347", muted: "#6B5F57", rule: "#E2D8CB" };
let cache: { name: string; data: Buffer; weight: 400 | 500 | 600 | 700; style: "normal" | "italic" }[] | null = null;
export function ogFonts() {
  if (cache) return cache;
  const f = (n: string) => fs.readFileSync(path.join(process.cwd(), "assets/fonts", n));
  cache = [
    { name: "Fraunces", data: f("Fraunces-600.ttf"), weight: 600, style: "normal" },
    { name: "Fraunces", data: f("Fraunces-400i.ttf"), weight: 400, style: "italic" },
    { name: "Figtree", data: f("Figtree-500.ttf"), weight: 500, style: "normal" },
    { name: "Figtree", data: f("Figtree-700.ttf"), weight: 700, style: "normal" },
  ];
  return cache;
}
/** Shared editorial frame: cream paper, hairline rules, wordmark top-left, URL bottom. */
export function Frame({ kicker, children, foot }: { kicker: string; children: React.ReactNode; foot: string }) {
  return (<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: B.cream, color: B.ink, padding: "56px 72px", fontFamily: "Figtree" }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `2px solid ${B.ink}`, paddingBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 18, height: 18, borderRadius: 18, background: B.coral }} />
        <div style={{ display: "flex", alignItems: "baseline", fontFamily: "Fraunces", fontSize: 34, fontWeight: 600 }}>SMB Agents<span style={{ fontFamily: "Figtree", fontWeight: 700, fontSize: 22, letterSpacing: 3, color: B.muted, marginLeft: 10 }}>AI</span></div>
      </div>
      <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: B.muted }}>{kicker}</div>
    </div>
    <div style={{ display: "flex", flex: 1 }}>{children}</div>
    <div style={{ display: "flex", justifyContent: "space-between", borderTop: `1px solid ${B.rule}`, paddingTop: 18, fontSize: 22, color: B.muted }}><span>{foot}</span><span>smbagentsai.com</span></div>
  </div>);
}

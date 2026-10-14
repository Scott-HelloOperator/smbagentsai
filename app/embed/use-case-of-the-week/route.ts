import { getUseCases } from "@/lib/data";
import { ofTheWeek } from "@/lib/week";
import { SITE_URL } from "@/lib/taxonomy";
export const revalidate = 3600;
const e = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));
// Self-contained, framable HTML widget. No JS, no cookies, no tracking.
export async function GET(req: Request) {
  const u = ofTheWeek(await getUseCases());
  const theme = new URL(req.url).searchParams.get("theme") === "dark" ? "dark" : "light";
  const [bg, fg, mut, rule, card] = theme === "dark" ? ["#2B2420", "#FBF7F0", "#C9BFB3", "#4A3F38", "#352D28"] : ["#FBF7F0", "#2B2420", "#6B5F57", "#E2D8CB", "#FFFFFF"];
  const link = `${SITE_URL}/use-case/${u.slug}?utm_source=widget&utm_medium=embed`;
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AI use case of the week</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;600&family=Fraunces:opsz,wght@9..144,600&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box}html,body{margin:0;height:100%}body{background:${bg};color:${fg};font:15px/1.5 Figtree,Helvetica,Arial,sans-serif}
a{color:inherit}.w{height:100%;display:flex;flex-direction:column;padding:18px 20px;border:1px solid ${rule};border-radius:14px;background:${card}}
.k{display:flex;justify-content:space-between;font-size:10.5px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:${mut}}
.d{display:inline-block;width:7px;height:7px;border-radius:7px;background:#ED7347;margin-right:6px;vertical-align:1px}
h1{margin:10px 0 6px;font:600 21px/1.2 Fraunces,Georgia,serif;letter-spacing:-.01em}p{margin:0;color:${mut}}
.m{margin-top:10px;font-size:12.5px;color:${mut}}.c{margin-top:auto;padding-top:12px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid ${rule};font-size:13px}
.b{font-weight:600;text-decoration:underline;text-decoration-color:#ED7347;text-underline-offset:3px}</style></head>
<body><div class="w"><div class="k"><span><span class="d"></span>Use case of the week</span><span>${e(u.category)}</span></div>
<h1><a href="${link}" target="_blank" rel="noopener" style="text-decoration:none">${e(u.title)}</a></h1><p>${e(u.result)}</p>
<div class="m">${e(u.difficulty)} · ${e(u.setup_time)} · ${e(u.monthly_cost)}</div>
<div class="c"><a class="b" href="${link}" target="_blank" rel="noopener">Get the prompt →</a><a href="${SITE_URL}/?utm_source=widget" target="_blank" rel="noopener" style="color:${mut};text-decoration:none">smbagentsai.com</a></div></div></body></html>`;
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, s-maxage=3600, stale-while-revalidate=86400", "content-security-policy": "frame-ancestors *", "x-robots-tag": "noindex" } });
}

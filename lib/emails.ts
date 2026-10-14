import { marked } from "marked";
import { SITE_URL } from "./taxonomy";
import { RATINGS, type Issue } from "./issues";
// Email-safe brand tokens (docs/brand-book.md)
export const C = { cream: "#FBF7F0", ink: "#2B2420", coral: "#ED7347", coralDeep: "#9A3B1C", muted: "#6B5F57", rule: "#E7DED2", paper2: "#F4EDE2" };
const SERIF = "Fraunces, Georgia, 'Times New Roman', serif", SANS = "Figtree, 'Helvetica Neue', Helvetica, Arial, sans-serif", MONO = "'SFMono-Regular', Menlo, Consolas, monospace";
const e = (s: unknown) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));
export const MAILING_ADDRESS = process.env.NEWSLETTER_ADDRESS || "";

export type Personal = { unsubToken?: string | null; refCode?: string | null; refCount?: number | null; web?: boolean };
export const voteUrl = (issue: number, q: string, v: string, t?: string | null) => `${SITE_URL}/api/vote?i=${issue}&q=${q}&v=${v}${t ? `&t=${t}` : ""}`;

function md(body: string, issue: number, p: Personal) {
  const renderer = new marked.Renderer();
  renderer.heading = (text, level) => level === 2
    ? `<h2 style="margin:36px 0 12px;font-family:${SERIF};font-size:24px;line-height:1.25;font-weight:600;color:${C.ink}">${text}</h2>`
    : `<h3 style="margin:24px 0 8px;font-family:${SERIF};font-size:19px;font-weight:600;color:${C.ink}">${text}</h3>`;
  renderer.paragraph = (text) => text.startsWith("<img") ? `<p style="margin:16px 0">${text}</p>` : `<p style="margin:0 0 16px;font-family:${SANS};font-size:16px;line-height:1.65;color:${C.ink}">${text}</p>`;
  renderer.list = (body, ordered) => `<${ordered ? "ol" : "ul"} style="margin:0 0 16px;padding-left:22px;font-family:${SANS};font-size:16px;line-height:1.6;color:${C.ink}">${body}</${ordered ? "ol" : "ul"}>`;
  renderer.listitem = (text) => `<li style="margin:0 0 6px">${text}</li>`;
  renderer.link = (href, _t, text) => `<a href="${e(href)}" style="color:${C.ink};text-decoration:underline;text-decoration-color:${C.coral};text-underline-offset:3px">${text}</a>`;
  renderer.strong = (t) => `<strong style="font-weight:700">${t}</strong>`;
  renderer.hr = () => `<hr style="border:0;border-top:1px solid ${C.rule};margin:32px 0">`;
  renderer.code = (code) => `<pre style="margin:0 0 16px;padding:16px;background:${C.paper2};border:1px solid ${C.rule};border-radius:10px;white-space:pre-wrap;word-break:break-word;font-family:${MONO};font-size:13px;line-height:1.55;color:${C.ink}">${e(code)}</pre>`;
  renderer.image = (href, _t, alt) => `<img src="${e(href)}" alt="${e(alt)}" width="520" style="display:block;width:100%;max-width:520px;height:auto;border:1px solid ${C.rule};border-radius:12px;margin:0 auto">`;
  renderer.codespan = (t) => `<code style="font-family:${MONO};font-size:14px;background:${C.paper2};padding:1px 5px;border-radius:4px">${t}</code>`;
  let src = body.replaceAll("{{site}}", SITE_URL);
  src = src.replace(/\{\{poll:(\w+):([^}]+)\}\}/g, (_, q, opts: string) => {
    const links = opts.split("|").map((o) => { const [v, label] = o.split(":"); return `<a href="${voteUrl(issue, q, v, p.unsubToken)}" style="display:inline-block;margin:0 6px 8px 0;padding:9px 14px;border:1px solid ${C.ink};border-radius:999px;font-family:${SANS};font-size:14px;font-weight:600;color:${C.ink};text-decoration:none">${e(label)}</a>`; }).join("");
    return `\n\n<div style="margin:4px 0 12px">${links}</div>\n\n`;
  });
  src = src.replace("{{referral_box}}", () => {
    const link = p.refCode ? `${SITE_URL}/?ref=${p.refCode}` : `${SITE_URL}/#switchboard`;
    const count = p.refCount ?? 0;
    return `\n\n<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px;border:1px solid ${C.rule};border-radius:12px;background:#ffffff"><tr><td style="padding:18px 20px;font-family:${SANS};font-size:15px;line-height:1.6;color:${C.ink}">
<p style="margin:0 0 10px;font-family:${MONO};font-size:13px;word-break:break-all"><a href="${link}" style="color:${C.ink}">${e(link)}</a></p>
<p style="margin:0 0 4px"><strong>3 referrals</strong> unlock <strong>The Vault</strong>, our pack of copy-paste prompts for quotes, follow-ups, reviews and invoices.</p>
<p style="margin:0 0 10px"><strong>10 referrals</strong> get you a <strong>free written AI audit</strong> of your business, delivered by email as a PDF or short video. No calls. No pitch.</p>
<p style="margin:0;color:${C.muted}">${p.web || !p.refCode ? `<a href="${SITE_URL}/#switchboard" style="color:${C.muted}">Subscribe</a> to get your own link.` : `You're at <strong style="color:${C.ink}">${count}</strong>. <a href="${SITE_URL}/me?code=${p.refCode || ""}" style="color:${C.muted}">Track it here</a>.`}</p></td></tr></table>\n\n`;
  });
  return marked.parse(src, { renderer, async: false }) as string;
}

function rating(issue: number, t?: string | null) {
  const cells = RATINGS.map((r) => `<td align="center" style="padding:0 6px"><a href="${voteUrl(issue, "rating", r.v, t)}" style="display:block;width:96px;padding:12px 0;border:1px solid ${C.rule};border-radius:14px;background:#ffffff;text-decoration:none;font-family:${SANS};font-size:13px;font-weight:600;color:${C.ink}"><span style="display:block;font-size:28px;line-height:1.2">${r.e}</span>${r.label}</a></td>`).join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 0;border-top:1px solid ${C.rule}"><tr><td align="center" style="padding:28px 0 8px">
<p style="margin:0 0 4px;font-family:${SERIF};font-size:22px;font-weight:600;color:${C.ink}">How'd we do?</p>
<p style="margin:0 0 16px;font-family:${SANS};font-size:14px;color:${C.muted}">One tap. The robot is keeping score and he's not impressed either way.</p>
<table role="presentation" cellpadding="0" cellspacing="0"><tr>${cells}</tr></table></td></tr></table>`;
}

export function shell({ preheader, title, content, footer }: { preheader: string; title: string; content: string; footer: string }) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light">
<title>${e(title)}</title>
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;600;700&family=Fraunces:opsz,wght@9..144,600&display=swap" rel="stylesheet">
<style>a{color:${C.ink}} @media (max-width:620px){.px{padding-left:20px!important;padding-right:20px!important}.h1{font-size:30px!important}}</style></head>
<body style="margin:0;padding:0;background:${C.cream};-webkit-text-size-adjust:100%">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.cream}">${e(preheader)}${"&nbsp;&zwnj;".repeat(40)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.cream}"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px">
${content}
<tr><td class="px" style="padding:28px 40px 40px;border-top:1px solid ${C.rule};font-family:${SANS};font-size:12px;line-height:1.6;color:${C.muted}">${footer}</td></tr>
</table></td></tr></table></body></html>`;
}

const masthead = (n: number, date: string) => `<tr><td class="px" style="padding:8px 40px 20px;border-bottom:1px solid ${C.ink}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
<td style="font-family:${SANS};font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:700;color:${C.muted}"><span style="display:inline-block;width:8px;height:8px;border-radius:8px;background:${C.coral};margin-right:6px"></span>SMB Agents AI</td>
<td align="right" style="font-family:${SANS};font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:700;color:${C.muted}">No. ${String(n).padStart(3, "0")} · ${e(date)}</td></tr></table>
<p class="h1" style="margin:18px 0 4px;font-family:${SERIF};font-size:40px;line-height:1.05;font-weight:600;color:${C.ink};letter-spacing:-0.5px">The Switchboard</p>
<p style="margin:0;font-family:${SANS};font-size:14px;color:${C.muted}">Real AI agent use cases for businesses under 200 people. Tuesdays &amp; Fridays.</p></td></tr>`;

export function footerHtml(p: { unsubToken?: string | null; issue?: number }) {
  const unsub = p.unsubToken ? `${SITE_URL}/api/unsubscribe?t=${p.unsubToken}` : `${SITE_URL}/unsubscribe`;
  return `<p style="margin:0 0 8px">You're getting this because you subscribed to The Switchboard at smbagentsai.com.${p.issue ? ` <a href="${SITE_URL}/switchboard/${p.issue}" style="color:${C.muted}">View in browser</a>.` : ""}</p>
<p style="margin:0 0 8px">SMB Agents AI is a free directory of real AI agent use cases, made by the folks at <a href="https://hellooperator.ai" style="color:${C.muted}">Hello Operator</a>. Sponsored content is always labeled.</p>
<p style="margin:0 0 8px">${MAILING_ADDRESS ? e(MAILING_ADDRESS) : "Hello Operator · [MAILING ADDRESS REQUIRED BEFORE LAUNCH]"}</p>
<p style="margin:0"><a href="${unsub}" style="color:${C.ink};font-weight:600">Unsubscribe</a> in one click. No guilt trip, no "are you sure?"</p>`;
}

export function renderIssue(issue: Issue, p: Personal = {}) {
  const body = md(issue.body, issue.number, p);
  const content = `${masthead(issue.number, new Date(issue.date + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }))}
<tr><td class="px" style="padding:28px 40px 8px">${body}${rating(issue.number, p.unsubToken)}</td></tr>`;
  const html = shell({ preheader: issue.preheader, title: issue.subject, content, footer: footerHtml({ unsubToken: p.unsubToken, issue: issue.number }) });
  return { subject: issue.subject, html, body };
}
/** The issue body only (for the web archive page). */
export const renderIssueBody = (issue: Issue) => md(issue.body, issue.number, { web: true });

export function welcomeEmail({ code, confirmToken, unsubToken }: { code: string; confirmToken: string; unsubToken: string }) {
  const confirm = `${SITE_URL}/api/confirm?t=${confirmToken}`, link = `${SITE_URL}/?ref=${code}`;
  const p = (t: string) => `<p style="margin:0 0 16px;font-family:${SANS};font-size:16px;line-height:1.65;color:${C.ink}">${t}</p>`;
  const content = `<tr><td class="px" style="padding:8px 40px 28px">
<p style="margin:0 0 18px;font-family:${SANS};font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:700;color:${C.muted}"><span style="display:inline-block;width:8px;height:8px;border-radius:8px;background:${C.coral};margin-right:6px"></span>The Switchboard</p>
<p class="h1" style="margin:0 0 16px;font-family:${SERIF};font-size:34px;line-height:1.1;font-weight:600;color:${C.ink}">One click and you're on the line.</p>
${p("Confirm your email so we know you're a real person and not a very ambitious spam bot. (We've met them. They're exhausting.)")}
<p style="margin:0 0 24px"><a href="${confirm}" style="display:inline-block;padding:13px 22px;border-radius:999px;background:${C.ink};color:${C.cream};font-family:${SANS};font-size:15px;font-weight:700;text-decoration:none">Confirm my subscription</a></p>
${p(`Your referral link: <a href="${link}" style="color:${C.ink}">${link}</a><br>3 confirmed friends unlock The Vault. 10 get you a free written AI audit, delivered by email.`)}
</td></tr>`;
  return { subject: "Confirm your Switchboard subscription", html: shell({ preheader: "Confirm your email to start getting The Switchboard twice a week.", title: "Confirm", content, footer: footerHtml({ unsubToken }) }) };
}

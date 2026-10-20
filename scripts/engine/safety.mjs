// "Before you switch it on" gate. Every published card must carry a use-case-specific safety box:
// what can go wrong, when to stop it, when a human steps in. Plus a flag for agents that read
// content written by outsiders (email, inboxes, DMs/texts, tickets, reviews, forms, web pages),
// which is where prompt injection comes from.
export const SAFETY_FIELDS = ["whatCanGoWrong", "whenToStop", "humanHandoff"];
export const SAFETY_MIN = 30, SAFETY_MAX = 120; // 120 keeps the box inside the fixed-height flip-card back
// Filler that could sit on any card. Safety text must be about THIS use case.
const GENERIC = /\b(ai can make mistakes|results may vary|use (it )?with caution|always double[- ]check|monitor (it )?closely|use common sense|at your own risk|if something goes wrong|consult (a|an) (professional|expert)|things (can|may) go wrong)\b/i;
const STAT = /\d|%|\b(doubled|tripled|quadrupled|halved|percent)\b/i;
// Signals that the agent ingests text written by people outside the business.
export const UNTRUSTED_HINT = /\b(inbox(es)?|incoming (emails?|messages?|texts?|calls?)|inbound|inquir(y|ies)|(google|customer|online|new) reviews|DMs?|direct messages?|support tickets?|web(site)? (forms?|chat|leads?|visitors?)|form leads?|chatbot|chat widget|missed[- ]calls?|callers?|applicants?|applications?|forward(ed)? [a-z ]{0,20}(bills|emails|invoices) to)\b/i;
const norm = (s) => String(s || "").toLowerCase().replace(/[^a-z ]+/g, " ").replace(/\s+/g, " ").trim();
const words = (s) => new Set(norm(s).split(" ").filter((w) => w.length > 3));
function jaccard(a, b) { const A = words(a), B = words(b); if (!A.size || !B.size) return 0; let i = 0; for (const w of A) if (B.has(w)) i++; return i / (A.size + B.size - i); }

export function safetyErrors(o) {
  const errs = [], s = o?.safety;
  if (!s || typeof s !== "object" || Array.isArray(s)) return ["missing safety {whatCanGoWrong, whenToStop, humanHandoff}"];
  for (const k of SAFETY_FIELDS) {
    const v = typeof s[k] === "string" ? s[k].trim() : "";
    if (!v) { errs.push(`safety.${k} missing`); continue; }
    if (v.length < SAFETY_MIN) errs.push(`safety.${k} too short (${v.length} < ${SAFETY_MIN})`);
    if (v.length > SAFETY_MAX) errs.push(`safety.${k} too long (${v.length} > ${SAFETY_MAX})`);
    if (GENERIC.test(v)) errs.push(`safety.${k} is generic filler`);
    if (STAT.test(v)) errs.push(`safety.${k} contains a number or stat`);
    if ((v.match(/[.!?](\s|$)/g) || []).length > 1) errs.push(`safety.${k} must be one sentence`);
  }
  for (let i = 0; i < SAFETY_FIELDS.length; i++) for (let j = i + 1; j < SAFETY_FIELDS.length; j++) {
    const a = s[SAFETY_FIELDS[i]], b = s[SAFETY_FIELDS[j]];
    if (typeof a !== "string" || typeof b !== "string" || !a.trim() || !b.trim()) continue;
    if (norm(a) === norm(b)) errs.push(`safety.${SAFETY_FIELDS[i]} and safety.${SAFETY_FIELDS[j]} are identical`);
    else if (jaccard(a, b) > 0.6) errs.push(`safety.${SAFETY_FIELDS[i]} and safety.${SAFETY_FIELDS[j]} are near-duplicates`);
  }
  if (typeof o.reads_untrusted_content !== "boolean") errs.push("reads_untrusted_content must be true or false");
  else if (!o.reads_untrusted_content && UNTRUSTED_HINT.test(`${o.summary} ${o.what_they_did}`))
    errs.push("reads_untrusted_content is false but the agent appears to read outside messages/content");
  return errs;
}

export const SAFETY_RULES = `- "safety" is the card's "Before you switch it on" box: three fields, each ONE short plain sentence (${SAFETY_MIN}-${SAFETY_MAX} characters) specific to THIS use case, no numbers, no generic filler ("AI can make mistakes"), no fear-mongering:
  - "whatCanGoWrong": the concrete failure for this workflow (e.g. "It books a showing in a slot you can't make, or tells a lead something untrue about the property.").
  - "whenToStop": the observable signal to pause or turn it off (e.g. "Pause it if showings get double-booked.").
  - "humanHandoff": the point where a person takes over (e.g. "Negotiation and anything it can't answer from the listing go to you.").
  The three must say different things. Ground them in what the post describes.
- "reads_untrusted_content": true if the agent reads text written by people outside the business (email, an inbox, DMs or texts, support tickets, reviews, web forms, chat widgets, applications, callers, web pages); otherwise false. When unsure, true.`;

// Agent Finder: plain keyword scoring, runs in the browser. No AI call, no signup, nothing stored.
export type Slim = { slug: string; title: string; result: string; category: string; industries: string[]; tools: string[]; difficulty: string; setup_time: string; monthly_cost: string };
const IND: [RegExp, string][] = [
  [/plumb|hvac|electric|roof|landscap|clean|pest|handyman|garage door|pool|painter|trade|contractor|install|repair/, "Home services & trades"],
  [/construct|builder|remodel|renovat|concrete|framing|excavat|general contractor/, "Construction"],
  [/agency|marketing|design studio|creative|dev shop|seo|branding|media/, "Agencies"],
  [/account|bookkeep|cpa|law|attorney|legal|consult|advis|insurance broker|financial|architect|engineer/, "Professional services"],
  [/shop|store|e-?commerce|shopify|retail|boutique|online|amazon|etsy/, "Retail & e-commerce"],
  [/restaurant|cafe|coffee|bar\b|bakery|food|catering|kitchen|hotel|hospitality|brewery/, "Restaurants & hospitality"],
  [/dent|clinic|medical|doctor|chiro|physio|therap|vet|optom|health|med ?spa/, "Healthcare & dental"],
  [/real estate|realtor|broker|property|rental|landlord|leasing/, "Real estate"],
  [/salon|barber|gym|fitness|yoga|pilates|spa\b|studio|nail|massage|trainer|beauty/, "Fitness & salons"],
];
const CAT: [RegExp, string][] = [
  [/invoice|paid|payment|overdue|collect|chas|cash ?flow|ar\b|receivable/, "Get paid faster"],
  [/lead|quote|inquir|enquir|missed call|phone|call back|sales|prospect|respond/, "Win more leads"],
  [/review|customer|complain|question|support|faq|retention|repeat/, "Keep customers happy"],
  [/schedul|dispatch|route|booking|appointment|no-?show|calendar|cancel/, "Run the schedule"],
  [/hir|recruit|applicant|onboard|staff|train|turnover|employee/, "Hire & onboard"],
  [/book|receipt|bank|expense|reconcil|tax|cash|finance|quickbooks|xero/, "Cash & books"],
  [/paper|contract|estimate|permit|licen|complian|document|form/, "Paperwork & compliance"],
  [/inbox|email|admin|meeting|notes|sop|process|overwhelm|busy|time/, "Owner's inbox & admin"],
  [/market|social|instagram|facebook|newsletter|content|post|ads?\b|brand/, "Marketing on autopilot"],
];
export function find(text: string, all: Slim[], n = 5) {
  const t = text.toLowerCase();
  const inds = IND.filter(([r]) => r.test(t)).map(([, i]) => i), cats = CAT.filter(([r]) => r.test(t)).map(([, c]) => c);
  const tools = new Set(all.flatMap((u) => u.tools).filter((x) => t.includes(x.toLowerCase())));
  const scored = all.map((u) => {
    let s = 0;
    if (u.industries.some((i) => inds.includes(i))) s += 3;
    const ci = cats.indexOf(u.category); if (ci >= 0) s += 4 - Math.min(ci, 2);
    s += u.tools.filter((x) => tools.has(x)).length * 1.5;
    if (u.difficulty === "No-code") s += 0.5;
    return { u, s };
  }).sort((a, b) => b.s - a.s || a.u.slug.localeCompare(b.u.slug));
  // keep variety: max 2 per category
  const out: Slim[] = [], per = new Map<string, number>();
  for (const { u, s } of scored) { if (s <= 0 && out.length) break; const c = per.get(u.category) || 0; if (c >= 2) continue; per.set(u.category, c + 1); out.push(u); if (out.length === n) break; }
  return { picks: out, matched: { industries: inds, categories: cats, tools: [...tools] } };
}

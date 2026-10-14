// Agent Finder: transparent keyword + synonym scoring. Pure function: runs on the server (shareable URLs, OG) and in the browser.
export type Slim = { slug: string; title: string; result: string; summary?: string; category: string; industries: string[]; tools: string[]; difficulty: string; setup_time: string; monthly_cost: string };
export type Pick = Slim & { why: string[] };

const IND: [RegExp, string][] = [
  [/\b(plumb\w*|hvac|heating|cooling|furnace|air ?con\w*|electric\w*|roof\w*|landscap\w*|lawn|clean\w*|maid|janitor\w*|pest|handyman|garage door|pool|paint\w*|trades?(man|men|people)?|locksmith|appliance|septic|gutter|pressure wash\w*|moving|movers|tree service|home service\w*)\b/, "Home services & trades"],
  [/\b(construct\w*|builder|remodel\w*|renovat\w*|concrete|fram(ing|er)|excavat\w*|general contractor|gc\b|subcontract\w*|drywall|flooring|cabinet\w*|masonry|paving|site visit\w*|job ?site)\b/, "Construction"],
  [/\b(agency|agencies|marketing firm|design studio|creative studio|dev shop|web design|seo|branding|media buying|pr firm|production company|freelanc\w*)\b/, "Agencies"],
  [/\b(account(ant|ing)( firm)?|bookkeep\w*|cpa|tax (prep|firm)|law( firm)?|lawyer|attorney|legal|paralegal|consult\w*|advis\w*|coach(ing)?|insurance (agency|broker)|financial (planner|advisor)|architect\w*|engineering firm|recruit\w* (agency|firm)|staffing)\b/, "Professional services"],
  [/\b(shop\w*|store|e-?commerce|ecom|shopify|woocommerce|retail|boutique|online (store|shop|business)|amazon|etsy|products?|catalog|sku\w*|inventory|wholesale|dtc|d2c)\b/, "Retail & e-commerce"],
  [/\b(restaurant\w*|cafe|caf\u00e9|coffee|bar|pub|bakery|food truck|catering|kitchen|chef|menu|hotel|motel|b&b|bnb|hospitality|brewery|winery|pizzeria|diner)\b/, "Restaurants & hospitality"],
  [/\b(dent\w*|orthodont\w*|clinic|medical|doctor|physician|chiro\w*|physio\w*|physical therap\w*|therap\w*|vet(erinar\w*)?|optom\w*|optician|health ?care|med ?spa|practice|patients?|hygien\w*)\b/, "Healthcare & dental"],
  [/\b(real estate|realtor|broker(age)?|property manag\w*|rental\w*|landlord|leasing|tenants?|listings?|showings?|mortgage)\b/, "Real estate"],
  [/\b(salon|barber\w*|gym|fitness|crossfit|yoga|pilates|spa|studio|nail\w*|massage|personal trainer|trainer|beauty|lash\w*|tattoo|esthetic\w*|dance)\b/, "Fitness & salons"],
];
// Problems people actually describe -> categories, plus a short reason we show back to them.
const CAT: [RegExp, string, string][] = [
  [/\b(invoic\w*|get(ting)? paid|payments?|overdue|late pay\w*|collect\w*|chas(e|ing)|cash ?flow|receivables?|\bar\b|deposits?|billing|unpaid)\b/, "Get paid faster", "getting paid"],
  [/\b(leads?|quotes?|inquir\w*|enquir\w*|missed calls?|phone( calls?)?|call ?backs?|voicemail|sales|prospects?|respon(d|se|sive)\w*|follow[- ]?ups?|web ?form|contact form|estimates? requests?|new customers?|booked jobs)\b/, "Win more leads", "leads and response time"],
  [/\b(reviews?|google reviews?|complain\w*|unhappy|questions?|support|faq|customer service|retention|repeat (business|customers)|churn|referrals?|reputation|yelp)\b/, "Keep customers happy", "customers and reviews"],
  [/\b(schedul\w*|dispatch\w*|routes?|routing|bookings?|appointments?|no[- ]?shows?|calendar|cancel\w*|waitlist|reschedul\w*|technicians?|crews?|shifts?)\b/, "Run the schedule", "scheduling"],
  [/\b(hir(e|ing)|recruit\w*|applicants?|resumes?|cvs?|onboard\w*|new hires?|staff(ing)?|train(ing)? (staff|new)|turnover|employees?|job (posts?|ads?|listings?))\b/, "Hire & onboard", "hiring"],
  [/\b(books|bookkeep\w*|receipts?|bank|expenses?|reconcil\w*|tax(es)?|cash|finances?|quickbooks|xero|month[- ]end|p&l|profit|bills?|suppliers?|vendors? bills?)\b/, "Cash & books", "the books"],
  [/\b(paperwork|contracts?|estimates?|proposals?|permits?|licen[cs]\w*|complian\w*|documents?|forms?|insurance cert\w*|cois?|renewals?|certifications?|bids?)\b/, "Paperwork & compliance", "paperwork"],
  [/\b(inbox|emails?|admin\w*|meetings?|notes|minutes|sops?|process(es)?|procedures?|overwhelm\w*|swamped|drowning|no time|busy|status (reports?|updates?)|client updates?|reports?)\b/, "Owner's inbox & admin", "inbox and admin"],
  [/\b(marketing|social( media)?|instagram|facebook|tiktok|linkedin|newsletters?|content|posts?|posting|ads?|brand\w*|website copy|product descriptions?|captions?|email list)\b/, "Marketing on autopilot", "marketing"],
];
// Specific phrases that point straight at one use case.
const BOOST: [RegExp, string][] = [
  [/\b(waste|spoil\w*|prep lists?|inventory|86'?d|specials)\b/, "prep-daily-specials-and-prep-lists-from-inventory"],
  [/\b(recalls?|hygiene|cleanings? due|patient reminders?)\b/, "write-patient-reminder-and-recall-messages"],
  [/\b(no[- ]?shows?|reminders?|reschedul\w*)\b/, "let-clients-book-reschedule-and-get-reminders-on-their-own"],
  [/\b(cancell?ations?|waitlist|empty (chairs?|slots?|tables?))\b/, "fill-last-minute-cancellations-from-a-waitlist"],
  [/\b(product descriptions?|catalog|listings? copy|skus?)\b/, "write-product-descriptions-for-your-whole-catalog"],
  [/\b(contracts?|terms|leases?|agreements?)\b/, "summarize-contracts-before-you-sign-them"],
  [/\b(routes?|routing|dispatch\w*|technicians?)\b/, "plan-tomorrow-s-technician-routes-in-minutes"],
  [/\b(reviews?|yelp|google rating)\b/, "draft-replies-to-every-google-review"],
  [/\b(missed calls?|voicemail|phone (rings|calls)|on (a )?(job|roof|site)s?)\b/, "turn-missed-calls-into-text-conversations"],
  [/\b(estimates?|quotes?|site visits?|bids?)\b/, "draft-estimates-from-site-visit-notes-and-photos"],
  [/\b(licen[cs]es?|certificat\w*|cois?|insurance (cert\w*|renewals?))\b/, "track-license-insurance-and-certification-renewals"],
  [/\b(meetings?|calls? notes|zoom|recordings?)\b/, "turn-meeting-recordings-into-action-items"],
  [/\b(status (reports?|updates?)|client (reports?|updates?))\b/, "write-weekly-client-status-reports-automatically"],
  [/\b(newsletters?|email list|past customers)\b/, "send-a-monthly-newsletter-customers-actually-open"],
  [/\b(social|instagram|facebook|tiktok|posting|captions?)\b/, "write-a-month-of-social-posts-from-one-batch-of-photos"],
  [/\b(lapsed|win[- ]?back|haven'?t (come back|returned|bought)|repeat (business|customers))\b/, "bring-back-lapsed-customers-with-a-win-back-sequence"],
  [/\b(job (posts?|ads?|listings?)|can'?t find (staff|people|workers))\b/, "write-job-posts-that-actually-attract-tradespeople"],
  [/\b(resumes?|applicants?|applications?|cvs?|candidates?)\b/, "screen-job-applicants-against-a-simple-scorecard"],
  [/\b(onboard\w*|new hires?|training new)\b/, "onboard-new-hires-with-a-day-one-checklist-assistant"],
  [/\b(inbox|emails?|unread)\b/, "triage-the-owner-s-inbox-every-morning"],
  [/\b(sops?|processes|procedures|how we do|in my head)\b/, "keep-a-running-sop-library-from-how-you-already-work"],
  [/\b(faqs?|same questions?|hours\?|questions all day)\b/, "build-a-24-7-faq-assistant-from-your-own-policies"],
  [/\b(invoic\w*|overdue|late pay\w*|unpaid|chas\w+ (money|payments?))\b/, "chase-overdue-invoices-without-awkward-phone-calls"],
  [/\b(payment links?|get paid on the spot|deposits?)\b/, "send-a-payment-link-the-minute-a-job-is-marked-done"],
  [/\b(stripe payouts?|reconcil\w*|payouts?)\b/, "reconcile-stripe-payouts-to-invoices-automatically"],
  [/\b(leads?|inquir\w*|enquir\w*|web ?forms?|contact forms?|respond faster|response time)\b/, "answer-every-web-lead-within-five-minutes-even-after-hours"],
  [/\b(lead scor\w*|hubspot|crm|qualif\w*)\b/, "score-and-route-inbound-leads-in-hubspot"],
  [/\b(rental inquir\w*|showings?|tenants?|buyers?)\b/, "pre-qualify-rental-and-buyer-inquiries"],
  [/\b(bank|transactions?|categori[sz]\w*|bookkeep\w*)\b/, "categorize-bank-transactions-and-flag-the-weird-ones"],
  [/\b(receipts?|supplier (bills?|invoices?)|data entry)\b/, "read-receipts-and-supplier-bills-into-your-books"],
  [/\b(cash ?flow|cash position|how much cash|runway|weekly numbers)\b/, "get-a-plain-english-weekly-cash-summary"],
  [/\b(unhappy|complain\w*|follow[- ]up after|bad experiences?)\b/, "follow-up-after-every-job-and-catch-unhappy-customers-early"],
];
// Tool names that are also everyday words only count when capitalized.
const AMBIGUOUS = new Set(["Make", "Square", "Slack", "Stripe"]);
const STOP = new Set("the and for with that this your you our are from have has into they them their what when then than just like more less about after before every each over under very really also some been were will would could should can cant don dont doesnt isnt its it's get got lot lots".split(" "));
const words = (s: string) => (s.toLowerCase().match(/[a-z][a-z'-]{3,}/g) || []).filter((w) => !STOP.has(w)).map((w) => w.replace(/(ing|ed|es|s)$/, ""));
// Works for nearly any small business: shown when we can't place the description.
export const UNIVERSAL = ["triage-the-owner-s-inbox-every-morning", "chase-overdue-invoices-without-awkward-phone-calls", "answer-every-web-lead-within-five-minutes-even-after-hours", "draft-replies-to-every-google-review", "get-a-plain-english-weekly-cash-summary"];

export function find(text: string, all: Slim[], n = 5) {
  const t = ` ${text.toLowerCase().replace(/[’']/g, "'")} `;
  const inds = IND.filter(([r]) => r.test(t)).map(([, i]) => i);
  const cats = CAT.map(([r, c, label]) => ({ c, label, i: t.search(r) })).filter((x) => x.i >= 0).sort((a, b) => a.i - b.i);
  const esc = (x: string) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const tools = [...new Set(all.flatMap((u) => u.tools))].filter((x) => AMBIGUOUS.has(x) ? new RegExp(`\\b${esc(x)}\\b`).test(text) : new RegExp(`\\b${esc(x.toLowerCase())}\\b`).test(t));
  const boosts = new Set(BOOST.filter(([r]) => r.test(t)).map(([, slug]) => slug));
  const solo = /\b(just me|solo|one[- ]person|myself|sole (trader|proprietor)|by myself)\b/.test(t);
  const tw = new Set(words(t));
  const scored = all.map((u) => {
    let s = 0; const why: string[] = [];
    const ind = u.industries.find((i) => inds.includes(i)); if (ind) { s += 3; why.push(ind.toLowerCase()); }
    const ci = cats.findIndex((x) => x.c === u.category); if (ci >= 0) { s += 5 - Math.min(ci, 3); why.push(cats[ci].label); }
    const tm = u.tools.filter((x) => tools.includes(x)); if (tm.length) { s += 1.5 * tm.length; why.push(`uses ${tm.join(", ")}`); }
    if (boosts.has(u.slug)) { s += 4; why.unshift("you mentioned it"); }
    const overlap = words(`${u.title} ${u.result} ${u.summary || ""}`).filter((w) => tw.has(w)); const ov = new Set(overlap).size;
    if (ov) s += Math.min(4, ov * 1.2);
    if (solo && u.difficulty === "No-code") s += 1; if (solo && u.difficulty === "Needs help") s -= 1;
    return { u, s, why };
  }).sort((a, b) => b.s - a.s || a.u.slug.localeCompare(b.u.slug));
  const matched = inds.length + cats.length + tools.length + boosts.size > 0;
  let picks: Pick[];
  if (!matched || (scored[0]?.s ?? 0) < 2) picks = UNIVERSAL.map((s) => all.find((u) => u.slug === s)).filter(Boolean).map((u) => ({ ...(u as Slim), why: ["works for almost any business"] }));
  else {
    picks = []; const per = new Map<string, number>();
    for (const { u, s, why } of scored) { if (s <= 0) break; const c = per.get(u.category) || 0; if (c >= 2) continue; per.set(u.category, c + 1); picks.push({ ...u, why }); if (picks.length === n) break; }
    for (const s of UNIVERSAL) { if (picks.length >= n) break; const u = all.find((x) => x.slug === s); if (u && !picks.some((p) => p.slug === s)) picks.push({ ...u, why: ["a solid all-rounder"] }); }
  }
  return { picks, matched, industries: inds, problems: cats.map((c) => c.label), tools, solo };
}

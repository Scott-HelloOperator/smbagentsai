// "Goals, not stats" gate. Outcome lines describe what to aim for; numbers only appear when they are
// verbatim in the source AND explicitly attributed to it (e.g. "the owner says", "per the post").
const STATWORDS = /\b(doubled?|tripled?|quadrupled?|halved?|a (third|quarter|half)|\d+x|[a-z]+fold|percent|per ?cent)\b/i;
const NUM = /\d[\d,.]*\s?%?|%/g;
const ATTRIB = /\b(says|said|reports?|reported|according to|per the (post|source|thread|owner)|the (owner|poster|builder) (says|reports|estimates)|claims?)\b/i;
// Numbers that aren't outcome claims (times of day, star ratings, restaurant slang, "24/7").
const BENIGN = /\b\d{1,2}(:\d\d)?\s?(am|pm)\b|\b[1-5]-star\b|\b86'?d\b|\b24\/7\b/gi;
const OUTCOME = /\b(drop|fell|fall|cut|sav|increas|grew|grow|reduc|faster|boost|improv|rais|lift|jump|more|fewer|less)\w*/i;
const sentences = (s) => String(s || "").split(/(?<=[.!?])\s+/).filter(Boolean);
export function goalErrors(o, sourceText) {
  const errs = [], src = String(sourceText || "").toLowerCase().replace(/\s+/g, " ");
  const result = String(o.result || ""), r0 = result.replace(BENIGN, "");
  if (/typical rollout|typically see|on average,/i.test(`${o.summary} ${o.how_it_went}`)) errs.push("implies typical results");
  if (!/^Goal: /.test(result)) errs.push('result must start with "Goal: "');
  if (/\d|%/.test(r0)) errs.push("result contains a number (results are goals, not stats)");
  if (STATWORDS.test(result)) errs.push("result contains a stat-like claim");
  for (const k of ["summary", "how_it_went", "what_they_did", "worth_knowing"]) {
    for (const s of sentences(o[k])) {
      if (!OUTCOME.test(s) && !STATWORDS.test(s) && !/%/.test(s)) continue; // descriptive numbers ("5 bullets", "6+ months") are fine
      const nums = (s.replace(BENIGN, "").match(NUM) || []).map((n) => n.trim().replace(/[.,]+$/, "")).filter((n) => n !== "%");
      const outcomeish = STATWORDS.test(s) || /%/.test(s);
      if (!nums.length && !outcomeish) continue;
      const sourced = nums.every((n) => src.includes(n.replace(/,/g, "")) || src.includes(n));
      if (!sourced) errs.push(`${k}: number not in source: "${s.slice(0, 80)}"`);
      else if (!ATTRIB.test(s)) errs.push(`${k}: unattributed outcome stat: "${s.slice(0, 80)}"`);
    }
  }
  return errs;
}
export const GOALS_RULES = `- "result" is a GOAL, not a stat: start with "Goal: " and describe what the reader should aim for, with NO numbers, percentages, multipliers or words like "doubled"/"a third". Example: "Goal: every overdue invoice gets a polite nudge on schedule".
- Outcome numbers may appear in summary/how_it_went ONLY if copied verbatim from the post AND attributed in the same sentence ("the owner says...", "per the post..."). Otherwise describe the outcome qualitatively.
- Never write "In a typical rollout" or imply typical/expected results.`;

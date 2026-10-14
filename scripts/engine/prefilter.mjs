// Cheap heuristic gate before spending LLM tokens. Scores first-hand SMB + AI/automation usage stories.
const AI = /\b(ai|a\.i\.|chatgpt|gpt-?\d|claude|gemini|copilot|llm|agent|agents|automat\w*|zapier|make\.com|n8n|voice ?bot|chatbot|receptionist)\b/i;
const OWNER = /\b(my (small )?business|my (company|shop|agency|firm|practice|clinic|restaurant|store|salon|gym|team|clients|customers|employees|techs?|crew)|i (own|run)|we (run|own)|our (small )?(business|company|shop|agency|firm|practice|clinic|restaurant|store|clients|customers)|owner|employees)\b/i;
const OUTCOME = /\b(saved?|saves|hours?|per (week|month)|reduced|cut|increase[sd]?|booked|leads?|invoices?|reviews?|follow[- ]?ups?|no[- ]shows?|replies|response time|revenue|\$\d)/i;
const FIRSTHAND = /\b(i (built|set up|setup|use|used|started using|automated|implemented|tried)|we (built|set up|use|used|started using|automated|implemented|tried)|here'?s (how|what)|what worked|results?)\b/i;
const REJECT = /\b(crypto|bitcoin|nft|token sale|airdrop|forex|trading bot|onlyfans|get rich|passive income|dropshipping guru|make \$?\d+k? (a|per) (day|month) with ai|dm me|link in bio|affiliate|course launch|hiring|we'?re hiring|job posting|ama\b|launch hn|show hn|yc [swf]\d\d|i'?m the founder|founder of|we'?re building|our (startup|product|platform) (lets|helps))/i;
const DEVONLY = /\b(kubernetes|langchain|vector database|fine-?tun\w+|pytorch|cuda|embedding model|rag pipeline|benchmark|open[- ]source model|repo|pull request)\b/i;

export function prefilter(c) {
  const t = `${c.title}\n${c.text}`;
  const reasons = [];
  if (t.length < 300) reasons.push("too short");
  if (REJECT.test(t)) reasons.push("spam/hype/crypto");
  if (!AI.test(t)) reasons.push("no AI/automation");
  if (!OWNER.test(t)) reasons.push("no owner/business signal");
  if (!FIRSTHAND.test(t)) reasons.push("not first-hand");
  const dev = (t.match(new RegExp(DEVONLY, "gi")) || []).length;
  if (dev >= 3) reasons.push("dev-only");
  let score = 0;
  score += (t.match(new RegExp(OUTCOME, "gi")) || []).length;
  score += (t.match(new RegExp(OWNER, "gi")) || []).length;
  score += /\?$/.test(c.title.trim()) ? -2 : 0; // questions are usually asks, not stories
  if (score < 3) reasons.push("weak outcome signal");
  return { pass: reasons.length === 0, score, reasons };
}

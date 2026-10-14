// Free, keyless sources. Reddit's JSON API blocks many datacenter IPs, so we use its public Atom (RSS) search feeds.
const UA = "Mozilla/5.0 (compatible; smbagentsai-engine/0.1; +https://smbagentsai.com)";
export const SUBREDDITS = ["smallbusiness", "Entrepreneur", "sweatystartup", "automation", "ChatGPT", "n8n", "zapier", "msp", "Bookkeeping", "realtors", "HVAC", "Plumbing", "restaurantowners", "agency", "AI_Agents"];
const REDDIT_QUERIES = ["AI automated", "chatgpt my business", "AI agent clients", "automation saved hours"];
const HN_QUERIES = ["small business AI", "my business automation", "AI for my company", "AI agent small business", "automated my business with AI", "chatgpt for my small business", "n8n automation business", "AI receptionist", "AI bookkeeping small business"];

const decode = (s) => s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
const strip = (h) => decode(decode(h)).replace(/<[^>]+>/g, " ").replace(/\[link\]|\[comments\]|submitted by\s+\/u\/\S+/g, " ").replace(/\s+/g, " ").trim();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function fetchReddit({ days = 7 } = {}) {
  const out = [];
  // Multi-subreddit feeds (r/a+b+c) keep request count tiny; unauthenticated Reddit rate-limits hard.
  const groups = []; for (let i = 0; i < SUBREDDITS.length; i += 5) groups.push(SUBREDDITS.slice(i, i + 5).join("+"));
  for (const sr of groups) for (const q of REDDIT_QUERIES) {
    const url = `https://www.reddit.com/r/${sr}/search.rss?q=${encodeURIComponent(q)}&restrict_sr=1&sort=top&t=${days <= 7 ? "week" : "month"}&limit=50`;
    try {
      let res = await fetch(url, { headers: { "User-Agent": UA } });
      for (let t = 0; res.status === 429 && t < 3; t++) { await sleep(20000 * (t + 1)); res = await fetch(url, { headers: { "User-Agent": UA } }); }
      if (!res.ok) { console.warn(`[reddit] r/${sr} HTTP ${res.status}`); continue; }
      const xml = await res.text();
      for (const e of xml.split("<entry>").slice(1)) {
        const link = (e.match(/<link href="([^"]+)"/) || [])[1];
        const title = decode((e.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || "");
        const body = strip((e.match(/<content type="html">([\s\S]*?)<\/content>/) || [])[1] || "");
        const date = (e.match(/<published>([^<]+)<\/published>/) || [])[1];
        const sub = (e.match(/<category term="([^"]+)"/) || [])[1] || sr;
        if (link) out.push({ source: `reddit/r/${sub}`, url: link.replace(/\?.*$/, ""), title, text: body, date });
      }
    } catch (err) { console.warn(`[reddit] r/${sr}`, err.message); }
    await sleep(8000); // be polite
  }
  return out;
}

export async function fetchHN({ days = 7 } = {}) {
  const since = Math.floor(Date.now() / 1000) - days * 86400, out = [];
  for (const q of HN_QUERIES) {
    try {
      const r = await fetch(`https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(q)}&tags=(story,comment)&numericFilters=created_at_i>${since}&hitsPerPage=40`);
      const d = await r.json();
      for (const h of d.hits || []) {
        const text = strip(h.story_text || h.comment_text || "");
        out.push({ source: "hackernews", url: `https://news.ycombinator.com/item?id=${h.objectID}`, title: h.title || h.story_title || "", text, date: h.created_at });
      }
    } catch (err) { console.warn("[hn]", err.message); }
  }
  return out;
}

export async function fetchAll(opts) {
  const all = [...(await fetchReddit(opts)), ...(await fetchHN(opts))];
  const seen = new Set();
  return all.filter((x) => !seen.has(x.url) && seen.add(x.url));
}

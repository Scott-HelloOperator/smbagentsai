// Seeds Supabase use_cases from data/use-cases.json via the REST API (no realtime/WebSocket needed).
// Usage: NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run seed
import { readFileSync } from "node:fs";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"); process.exit(1); }
const rows = JSON.parse(readFileSync(new URL("../data/use-cases.json", import.meta.url)));
const res = await fetch(`${url}/rest/v1/use_cases?on_conflict=slug`, {
  method: "POST",
  headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" },
  body: JSON.stringify(rows),
});
if (!res.ok) { console.error(res.status, await res.text()); process.exit(1); }
console.log(`Seeded ${rows.length} use cases`);

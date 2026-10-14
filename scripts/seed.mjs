// Seeds Supabase use_cases from data/use-cases.json. Usage: npm run seed (needs env vars)
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"); process.exit(1); }
const rows = JSON.parse(readFileSync(new URL("../data/use-cases.json", import.meta.url)));
const { error } = await createClient(url, key).from("use_cases").upsert(rows, { onConflict: "slug" });
if (error) { console.error(error); process.exit(1); }
console.log(`Seeded ${rows.length} use cases`);

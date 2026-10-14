// Back-compat alias for the old submit endpoint.
import { POST as forms } from "../forms/route";
export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  return forms(new Request(req.url, { method: "POST", headers: req.headers, body: JSON.stringify({ ...b, kind: "submit" }) }));
}

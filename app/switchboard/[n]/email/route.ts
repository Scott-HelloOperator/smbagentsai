import { getIssue } from "@/lib/issues";
import { renderIssue } from "@/lib/emails";
// Raw email HTML preview (what subscribers receive, minus personal tokens).
export function GET(_: Request, { params }: { params: { n: string } }) {
  const i = getIssue(Number(params.n)); if (!i) return new Response("Not found", { status: 404 });
  return new Response(renderIssue(i, {}).html, { headers: { "content-type": "text/html; charset=utf-8", "x-robots-tag": "noindex" } });
}

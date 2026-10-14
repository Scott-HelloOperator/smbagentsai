import type { MetadataRoute } from "next";
import { getUseCases } from "@/lib/data";
import { PACKS } from "@/lib/packs";
import { getIssues } from "@/lib/issues";
import { MIN_INDEX } from "@/lib/landing";
import { CATEGORIES, TOOLS, INDUSTRIES, slugify, SITE_URL } from "@/lib/taxonomy";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const u = (p: string) => `${SITE_URL}${p}`;
  const all = await getUseCases();
  return [
    ...["", "/quiz", "/finder", "/packs", "/wins", "/switchboard", "/widget", "/about", "/submit", "/sponsor", "/help-me", "/contact"].map((p) => ({ url: u(p || "/") })),
    ...CATEGORIES.filter((c) => all.filter((x) => x.category === c).length >= MIN_INDEX).map((c) => ({ url: u(`/category/${slugify(c)}`) })),
    ...TOOLS.filter((c) => all.filter((x) => x.tools.includes(c)).length >= MIN_INDEX).map((c) => ({ url: u(`/tool/${slugify(c)}`) })),
    ...INDUSTRIES.filter((c) => all.filter((x) => x.industries.includes(c)).length >= MIN_INDEX).map((c) => ({ url: u(`/industry/${slugify(c)}`) })),
    ...PACKS.map((p) => ({ url: u(`/packs/${p.slug}`) })),
    ...getIssues().map((i) => ({ url: u(`/switchboard/${i.number}`), lastModified: i.date })),
    ...all.map((x) => ({ url: u(`/use-case/${x.slug}`), lastModified: x.published_at })),
  ];
}

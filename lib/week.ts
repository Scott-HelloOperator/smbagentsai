import type { UseCase } from "./data";
/** Deterministic "use case of the week": rotates every Monday (UTC), same for everyone. */
export function weekIndex(d = new Date()) { const monday = Date.UTC(2026, 0, 5); return Math.floor((d.getTime() - monday) / (7 * 864e5)); }
export const ofTheWeek = (all: UseCase[], d = new Date()) => { const sorted = [...all].sort((a, b) => a.slug.localeCompare(b.slug)); return sorted[((weekIndex(d) % sorted.length) + sorted.length) % sorted.length]; };

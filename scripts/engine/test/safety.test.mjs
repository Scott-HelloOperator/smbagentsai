import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { safetyErrors } from "../safety.mjs";
import { validate } from "../llm.mjs";
const safety = { whatCanGoWrong: "It books a showing in a slot you can't make.", whenToStop: "Pause it if showings get double-booked or a lead is told something untrue.", humanHandoff: "Negotiation and anything off the listing go straight to you." };
const card = { summary: "An agent drafts listing descriptions.", what_they_did: "Drafts descriptions from notes.", safety, reads_untrusted_content: false };
const SRC = "We set up QuickBooks reminders.";
const rewrite = { accept: true, title: "Chase invoices", category: "Get paid faster", result: "Goal: every overdue invoice gets a nudge", summary: "An owner automated reminders.", what_they_did: "Set up reminders.",
  how_it_went: "Reminders go out on time.", worth_knowing: "Review the tone.", prompt: "Write a reminder for [customer].", steps: ["a", "b", "c"], difficulty: "No-code", evidence: ["We set up QuickBooks reminders"], tools: [], industries: [] };

test("specific safety box passes", () => assert.deepEqual(safetyErrors(card), []));
test("rejects missing safety object", () => assert.ok(safetyErrors({ ...card, safety: undefined })[0].startsWith("missing safety")));
test("rejects empty or blank fields", () => assert.ok(safetyErrors({ ...card, safety: { ...safety, whenToStop: "   " } }).includes("safety.whenToStop missing")));
test("rejects too short and too long fields", () => {
  const e = safetyErrors({ ...card, safety: { ...safety, whatCanGoWrong: "Mistakes.", humanHandoff: "A person takes over ".repeat(10) + "here." } });
  assert.ok(e.some((x) => /whatCanGoWrong too short/.test(x)) && e.some((x) => /humanHandoff too long/.test(x)));
});
test("rejects identical boilerplate across fields", () => {
  const same = "Keep an eye on it and step in when needed.";
  assert.ok(safetyErrors({ ...card, safety: { whatCanGoWrong: same, whenToStop: same, humanHandoff: same } }).some((x) => /identical/.test(x)));
});
test("rejects generic filler and stats", () => {
  const e = safetyErrors({ ...card, safety: { ...safety, whatCanGoWrong: "AI can make mistakes, so results may vary for you.", whenToStop: "Stop it if error rates rise above 5% in a week." } });
  assert.ok(e.some((x) => /generic/.test(x)) && e.some((x) => /number/.test(x)));
});
test("requires a boolean outside-content flag", () => assert.ok(safetyErrors({ ...card, reads_untrusted_content: undefined }).some((x) => /reads_untrusted_content/.test(x))));
test("flags an inbox-reading agent marked as not reading outside content", () =>
  assert.ok(safetyErrors({ ...card, summary: "An agent sorts the shared inbox and drafts replies." }).some((x) => /appears to read outside/.test(x))));
test("validate() rejects a rewrite without a safety box", () => assert.ok(validate({ ...rewrite }, { title: "", text: SRC }).some((x) => /safety/.test(x))));
test("every published seed card passes the safety gate", () => {
  const cards = JSON.parse(readFileSync(new URL("../../../data/use-cases.json", import.meta.url)));
  for (const u of cards) assert.deepEqual(safetyErrors(u), [], u.slug);
});

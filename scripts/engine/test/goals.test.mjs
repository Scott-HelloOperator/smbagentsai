import { test } from "node:test";
import assert from "node:assert/strict";
import { goalErrors } from "../goals.mjs";
import { validate } from "../llm.mjs";
const SRC = "We set up QuickBooks reminders. The owner says overdue invoices went from 40 to 25 in two months.";
const base = { accept: true, title: "Chase invoices", category: "Get paid faster", summary: "An owner automated reminders.", what_they_did: "Set up reminders.", how_it_went: "Reminders go out on time.",
  worth_knowing: "Review the tone.", prompt: "Write a reminder for [customer].", steps: ["a", "b", "c"], difficulty: "No-code", evidence: ["We set up QuickBooks reminders"], tools: [], industries: [],
  safety: { whatCanGoWrong: "It nudges a customer who already paid their invoice.", whenToStop: "Pause it if a customer says they paid and still got a reminder.", humanHandoff: "Any customer who replies to a reminder comes to you." }, reads_untrusted_content: false };
test("goal-phrased result passes", () => assert.deepEqual(goalErrors({ ...base, result: "Goal: every overdue invoice gets a nudge" }, SRC), []));
test("rejects unsourced stat in result", () => assert.ok(goalErrors({ ...base, result: "Overdue invoices drop by about a third in 60 days" }, SRC).length >= 2));
test("rejects percentage in result even if prefixed", () => assert.ok(goalErrors({ ...base, result: "Goal: cut overdue invoices 30%" }, SRC).some((e) => /number/.test(e))));
test("rejects stat words without digits", () => assert.ok(goalErrors({ ...base, result: "Goal: revenue doubled" }, SRC).some((e) => /stat-like/.test(e))));
test("rejects unsourced number in how_it_went", () => assert.ok(goalErrors({ ...base, result: "Goal: x", how_it_went: "Collections improved 50% in a month." }, SRC).some((e) => /not in source/.test(e))));
test("rejects sourced but unattributed outcome", () => assert.ok(goalErrors({ ...base, result: "Goal: x", how_it_went: "Overdue invoices fell from 40 to 25." }, SRC).some((e) => /unattributed/.test(e))));
test("allows sourced + attributed number", () => assert.deepEqual(goalErrors({ ...base, result: "Goal: x", how_it_went: "The owner says overdue invoices went from 40 to 25." }, SRC), []));
test("validate() includes the goals gate", () => assert.ok(validate({ ...base, result: "Overdue invoices drop by 33%" }, { title: "", text: SRC }).some((e) => /Goal/.test(e))));
test("validate() passes a clean rewrite", () => assert.deepEqual(validate({ ...base, result: "Goal: every overdue invoice gets a nudge" }, { title: "", text: SRC }), []));
test("benign numbers in result are fine", () => assert.deepEqual(goalErrors({ ...base, result: "Goal: every lead hears back, even at 9pm, before a 1-star review" }, SRC), []));
test("descriptive numbers in body are fine", () => assert.deepEqual(goalErrors({ ...base, result: "Goal: x", summary: "An agent emails a 5-bullet brief every Monday to customers idle 6+ months." }, SRC), []));
test("rejects typical-results framing", () => assert.ok(goalErrors({ ...base, result: "Goal: x", how_it_went: "In a typical rollout like this, it works." }, SRC).some((e) => /typical/.test(e))));

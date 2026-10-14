/**
 * Hours-saved calculator config. Only for use cases where time saved is a direct function of volume.
 * share = conservative fraction of the manual time the setup removes (a human still reviews).
 */
export type Calc = { unit: string; per: "week" | "month"; qty: number; max: number; minutes: number; share: number; note: string };
export const CALC: Record<string, Calc> = {
  "chase-overdue-invoices-without-awkward-phone-calls": { unit: "overdue invoices you chase", per: "week", qty: 15, max: 200, minutes: 12, share: 0.7, note: "Reminders go out automatically; you still handle the awkward ones." },
  "send-a-payment-link-the-minute-a-job-is-marked-done": { unit: "jobs you invoice", per: "week", qty: 20, max: 300, minutes: 6, share: 0.8, note: "Time spent creating and sending invoices by hand." },
  "reconcile-stripe-payouts-to-invoices-automatically": { unit: "Stripe payouts you match", per: "month", qty: 30, max: 500, minutes: 8, share: 0.75, note: "Matching payouts to invoices; exceptions still need you." },
  "draft-replies-to-every-google-review": { unit: "reviews you reply to", per: "week", qty: 10, max: 150, minutes: 5, share: 0.7, note: "AI drafts, you approve. Approving still takes a few seconds." },
  "screen-job-applicants-against-a-simple-scorecard": { unit: "applications you read", per: "week", qty: 40, max: 500, minutes: 4, share: 0.6, note: "First-pass screening only. You still interview humans." },
  "categorize-bank-transactions-and-flag-the-weird-ones": { unit: "bank transactions", per: "month", qty: 300, max: 5000, minutes: 0.5, share: 0.8, note: "Categorizing; your bookkeeper still reviews the flags." },
  "read-receipts-and-supplier-bills-into-your-books": { unit: "receipts & bills you enter", per: "month", qty: 80, max: 2000, minutes: 3, share: 0.75, note: "Data entry time. Weird bills still get a human look." },
  "draft-estimates-from-site-visit-notes-and-photos": { unit: "estimates you write", per: "week", qty: 6, max: 60, minutes: 45, share: 0.5, note: "AI drafts from your notes; pricing judgment stays yours." },
  "summarize-contracts-before-you-sign-them": { unit: "contracts you review", per: "month", qty: 4, max: 60, minutes: 40, share: 0.5, note: "Reading time. Not legal advice; big ones still go to your lawyer." },
  "triage-the-owner-s-inbox-every-morning": { unit: "workdays", per: "week", qty: 5, max: 7, minutes: 45, share: 0.5, note: "Assumes ~45 min of morning inbox wrangling, halved by a brief." },
  "turn-meeting-recordings-into-action-items": { unit: "meetings", per: "week", qty: 6, max: 60, minutes: 15, share: 0.7, note: "Writing up notes and follow-ups after each meeting." },
  "write-a-month-of-social-posts-from-one-batch-of-photos": { unit: "social posts", per: "month", qty: 12, max: 120, minutes: 20, share: 0.7, note: "Writing captions. Taking decent photos is still on you." },
  "write-product-descriptions-for-your-whole-catalog": { unit: "product descriptions", per: "month", qty: 40, max: 2000, minutes: 15, share: 0.75, note: "First drafts; you edit for accuracy." },
  "write-weekly-client-status-reports-automatically": { unit: "client reports", per: "week", qty: 8, max: 100, minutes: 30, share: 0.7, note: "Pulling updates together into a report." },
  "plan-tomorrow-s-technician-routes-in-minutes": { unit: "workdays you plan routes", per: "week", qty: 5, max: 7, minutes: 50, share: 0.6, note: "Dispatch planning time; last-minute changes still happen." },
  "write-patient-reminder-and-recall-messages": { unit: "reminders & recalls", per: "week", qty: 60, max: 1000, minutes: 2, share: 0.8, note: "Writing and sending messages by hand." },
};

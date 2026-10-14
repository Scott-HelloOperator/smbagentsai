export type Pack = { slug: string; name: string; who: string; line: string; intro: string; start: string; items: string[] };
// Curated starter packs: the first 5-6 agents we'd set up for each kind of business, in order.
export const PACKS: Pack[] = [
  { slug: "trades", name: "The Trades Pack", who: "plumbers, HVAC, electricians, roofers", line: "For crews who are on a roof when the phone rings.",
    intro: "Your best leads call while your hands are full, and your invoices go out when you remember. Start with speed, then cash.", start: "turn-missed-calls-into-text-conversations",
    items: ["turn-missed-calls-into-text-conversations", "answer-every-web-lead-within-five-minutes-even-after-hours", "send-a-payment-link-the-minute-a-job-is-marked-done", "draft-estimates-from-site-visit-notes-and-photos", "plan-tomorrow-s-technician-routes-in-minutes", "follow-up-after-every-job-and-catch-unhappy-customers-early"] },
  { slug: "agencies", name: "The Agency Pack", who: "marketing, creative and dev shops", line: "For people whose clients email at 11pm and expect a reply at 11:01.",
    intro: "Most agency hours leak into status updates, meeting notes and the inbox. Plug those first; they compound.", start: "write-weekly-client-status-reports-automatically",
    items: ["write-weekly-client-status-reports-automatically", "turn-meeting-recordings-into-action-items", "triage-the-owner-s-inbox-every-morning", "score-and-route-inbound-leads-in-hubspot", "get-a-plain-english-weekly-cash-summary", "keep-a-running-sop-library-from-how-you-already-work"] },
  { slug: "salons-and-studios", name: "The Salon & Studio Pack", who: "salons, gyms, spas, studios", line: "For businesses where an empty chair is money walking out the door.",
    intro: "No-shows and last-minute cancellations are the silent killers. Fix the calendar first, then bring people back.", start: "let-clients-book-reschedule-and-get-reminders-on-their-own",
    items: ["let-clients-book-reschedule-and-get-reminders-on-their-own", "fill-last-minute-cancellations-from-a-waitlist", "draft-replies-to-every-google-review", "bring-back-lapsed-customers-with-a-win-back-sequence", "write-a-month-of-social-posts-from-one-batch-of-photos"] },
  { slug: "restaurants", name: "The Restaurant Pack", who: "restaurants, cafes, bars", line: "For owners who do inventory at midnight and reviews at 1am.",
    intro: "Margins are thin and time is thinner. Start where waste and reputation live.", start: "prep-daily-specials-and-prep-lists-from-inventory",
    items: ["prep-daily-specials-and-prep-lists-from-inventory", "draft-replies-to-every-google-review", "read-receipts-and-supplier-bills-into-your-books", "fill-last-minute-cancellations-from-a-waitlist", "screen-job-applicants-against-a-simple-scorecard", "build-a-24-7-faq-assistant-from-your-own-policies"] },
  { slug: "ecommerce", name: "The E-commerce Pack", who: "Shopify and online stores", line: "For stores where the catalog grows faster than the copy.",
    intro: "Product pages, payouts and repeat buyers. The unglamorous stuff that quietly decides your month.", start: "write-product-descriptions-for-your-whole-catalog",
    items: ["write-product-descriptions-for-your-whole-catalog", "reconcile-stripe-payouts-to-invoices-automatically", "bring-back-lapsed-customers-with-a-win-back-sequence", "build-a-24-7-faq-assistant-from-your-own-policies", "send-a-monthly-newsletter-customers-actually-open"] },
  { slug: "professional-services", name: "The Professional Services Pack", who: "accountants, consultants, law and advisory firms", line: "For firms that bill by the hour and lose hours to admin.",
    intro: "Every hour you spend on intake, notes and inbox is an hour you can't bill. Claw them back.", start: "triage-the-owner-s-inbox-every-morning",
    items: ["triage-the-owner-s-inbox-every-morning", "summarize-contracts-before-you-sign-them", "turn-meeting-recordings-into-action-items", "chase-overdue-invoices-without-awkward-phone-calls", "let-clients-book-reschedule-and-get-reminders-on-their-own", "onboard-new-hires-with-a-day-one-checklist-assistant"] },
  { slug: "dental-and-health", name: "The Dental & Clinic Pack", who: "dental offices, clinics, practices", line: "For front desks answering the phone, the door and the fax at once.",
    intro: "Recall, reminders and reviews keep chairs full. Paperwork and renewals keep you out of trouble.", start: "write-patient-reminder-and-recall-messages",
    items: ["write-patient-reminder-and-recall-messages", "let-clients-book-reschedule-and-get-reminders-on-their-own", "answer-every-web-lead-within-five-minutes-even-after-hours", "draft-replies-to-every-google-review", "track-license-insurance-and-certification-renewals"] },
  { slug: "real-estate", name: "The Real Estate Pack", who: "agents, brokers, property managers", line: "For people who get 40 'is this still available?' messages a day.",
    intro: "Qualify fast, follow up faster, and stop reading contracts at red lights.", start: "pre-qualify-rental-and-buyer-inquiries",
    items: ["pre-qualify-rental-and-buyer-inquiries", "answer-every-web-lead-within-five-minutes-even-after-hours", "summarize-contracts-before-you-sign-them", "triage-the-owner-s-inbox-every-morning", "turn-meeting-recordings-into-action-items"] },
];
export const getPack = (slug: string) => PACKS.find((p) => p.slug === slug);

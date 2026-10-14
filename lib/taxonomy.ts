export const CATEGORIES = ["Get paid faster","Win more leads","Keep customers happy","Run the schedule","Hire & onboard","Cash & books","Paperwork & compliance","Owner's inbox & admin","Marketing on autopilot"];
export const INDUSTRIES = ["Home services & trades","Professional services","Agencies","Retail & e-commerce","Restaurants & hospitality","Healthcare & dental","Real estate","Construction","Fitness & salons"];
export const TOOLS = ["QuickBooks","Xero","Jobber","ServiceTitan","Housecall Pro","HubSpot","GoHighLevel","Gmail","Outlook","Google Workspace","Microsoft 365","Square","Shopify","Stripe","Calendly","Slack","Zapier","Make","n8n"];
export const DIFFICULTIES = ["No-code","Light setup","Needs help"] as const;
export const slugify = (s: string) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const fromSlug = (list: string[], slug: string) => list.find((x) => slugify(x) === slug);
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// "Send this to someone who..." lines, by category. Salty, never mean.
export const WHO: Record<string, string> = {
  "Get paid faster": "is still chasing invoices by phone",
  "Win more leads": "lets leads go to voicemail",
  "Keep customers happy": "answers the same question 40 times a week",
  "Run the schedule": "plans tomorrow on a whiteboard at 10pm",
  "Hire & onboard": "is reading 80 resumes this weekend",
  "Cash & books": "does the books on Sunday night",
  "Paperwork & compliance": "is drowning in paperwork",
  "Owner's inbox & admin": "has 4,000 unread emails",
  "Marketing on autopilot": "hasn't posted since 2022",
};
export const whoFor = (category: string) => WHO[category] || "could use an extra pair of hands";

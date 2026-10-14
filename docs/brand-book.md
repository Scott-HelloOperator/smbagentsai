# SMB Agents AI · Brand Book (v2, Oct 2026)

> **One line:** a plain-English field guide to AI agents for small-business owners. Editorial, warm, dry. Made by Hello Operator.

**v2 change log:** v1 went too playful (chunky ink outlines, hard drop shadows, mustard highlighter, cute mascot). v2 is editorial: hairline borders, generous whitespace, restrained coral, and a deadpan robot mascot. **v2.1:** the old meme series name and catchphrase sign-off are retired; memes are now a broader universe of AI and robots being sarcastic and annoyed at their inept human controllers.

---

## 1. The Hello Operator connection

The brand stands on its own, but **two elements carry over** so the family resemblance is visible to anyone who knows Hello Operator:

| Shared element | Hello Operator | SMB Agents AI |
|---|---|---|
| **Operator Coral `#ED7347`** | HO's brand orange (`--base-color-brand--orange`), pills and CTAs | Accent only: the operator dot, the one primary CTA per page (Subscribe), link underlines on hover |
| **The operator dot** | The filled dot that replaces the "O" in **●PERATOR** | A solid coral dot before the wordmark, eyebrows, and the meme footer |

Supporting cue: operator/phone language, used sparingly (**The Switchboard**). *HO reference: pale lime `#EBF2BD`, green-black `#011B17`, lime `#CDE476`, coral `#ED7347`/`#FFA075`, blue `#62A2DB`; PP Neue Machina; stacked `HELLO / ●PERATOR` wordmark (from hellooperator.ai CSS and the Canva "Hello Operator" brand kit).*

---

## 2. Personality

**Editorial, warm, direct, dry.** Think a good business weekly (Morning Brew's readability, Stripe Press's restraint) written by someone who has actually run a company.

- **Is:** plain-spoken, specific, honest about cost and effort, quietly funny.
- **Isn't:** hype, futurism, neon, gradients, glossy 3D, cute, "playful startup", Gumroad brutalism.
- **Test:** if it looks like an AI startup landing page or a kids' app, it's wrong.

---

## 3. Color

Light mode only. Mostly paper and ink. Coral is a spice.

| Token | Name | Hex | Use |
|---|---|---|---|
| `cream` | Paper | `#FBF7F0` | Page background |
| `ink` | Espresso | `#2B2420` | Text; secondary buttons (ink fill, cream text); active filter chip |
| `ink/10–15` | Hairline | — | All borders and rules. 1px only. |
| `ink/55–70` | Muted | — | Secondary copy, eyebrows |
| `clay-500` | **Operator Coral** | `#ED7347` | Dot, one primary CTA per page (ink text on coral, 5.2:1), "Needs help" marker |
| `clay-700` | Coral Ink | `#9A3B1C` | Small coral text on cream (category labels), 6.5:1 |
| `sage-500/600` | Sage | `#7FA07A` / `#4F7A55` | Success, "No-code" marker |
| `#F6F1E8` | Card back | — | Flip-card reverse side |

**Ratio:** ~85% paper/white, ~12% ink, ≤3% coral. **Retired from v1:** mustard highlighter, coral washes on big surfaces, colored pill badges.

---

## 4. Type

| Role | Font | Settings |
|---|---|---|
| Display | **Fraunces** (variable) | Semibold 600, SOFT 30, tracking −0.015 to −0.02em, line-height ~1.05. *Italic regular* for one emphasis word per headline, max. |
| Body / UI | **Figtree** | 16–17px, line-height 1.6–1.7, `ink/65–85` |
| Eyebrow | Figtree semibold, 11px, uppercase, tracking 0.16em, `ink/55` | Led by a 7px coral dot |
| Signature | **Herr Von Muellerhoff** | About-page sign-off only. Never for UI or headlines. |

Loaded via `next/font/google` as `--font-display`, `--font-body`, `--font-sig` → Tailwind `font-serif`, `font-sans`, `font-sig`.

---

## 5. Logo

`● SMB Agents AI`: a solid coral dot, "SMB Agents" in Fraunces semibold, "AI" in small tracked Figtree at 55% ink. AI is the tool, not the headline.
- Favicon: coral dot on an espresso rounded square.
- Don'ts: no outlines on the dot, no pills, no gradients, don't enlarge "AI".

---

## 6. Components & spacing

- **Borders:** 1px `ink/10` hairlines. **No hard drop shadows, no 2px outlines.** Optional soft shadow (`shadow-soft`) only for floating elements.
- **Radius:** 12–16px on cards and inputs; pills for buttons and chips.
- **Buttons:** primary = coral fill, ink text (one per page); secondary = ink fill, cream text; tertiary = underlined text link.
- **Sections:** separated by whitespace and hairline rules (`border-y`), not boxes. Vertical rhythm 80px between major sections on desktop, 64px on mobile.
- **Measure:** long-form copy max 640px.
- Phone-first: design at 390px; tap targets ≥ 44px; one primary action per screen.

---

## 7. Voice

- Direct, dry, genuine. Short sentences. Second person. Concrete nouns (invoices, missed calls, the shoebox of receipts).
- Lead with the problem, then the honest cost: tools, setup time, monthly $, what breaks.
- No cutesy puns in UI. One operator nod per page is plenty.
- Banned: *revolutionary, game-changer, unlock, supercharge, seamless, cutting-edge, leverage, 10x, synergy*.
- Newsletter: **The Switchboard**. CTA: **"Subscribe to The Switchboard."**

---

## 8. The robot mascot & the meme universe (v2.1)

**The universe:** our memes are a broad world of AIs and robots who are sarcastic, unimpressed, and quietly annoyed at the inept humans running them. No series name, no catchphrase sign-off. The mascot is the anchor character, but any deadpan machine (printers, chatbots, smart fridges, agent swarms) can star.

**The mascot (can be called Gary in light copy):** a deadpan, slightly busted robot built from beige 1990s office hardware. Office-printer energy: technically working, spiritually done. He's the honest voice of every over-promised AI tool, and the only one in the room willing to say the quiet part.

**Look (`gary-v2.png`):** beige CRT/fax head with a cracked screen showing flat-line eyes and a flat mouth; vintage switchboard operator headset with coiled cord (the HO nod); paper-tray slot in his chest with a jammed sheet; duct tape, sticky notes, a dented corner; small coral status light; clipboard. Flat editorial illustration with grain, muted putty/grey palette. **Never cute. Never smiling. No big eyes.**

**Humor:** cynical, sarcastic, salty, for jaded owners. Targets, in order of preference:
1. AI hype, "agent swarms", vendor demos, "fully autonomous" claims
2. VCs, AI bros, LinkedIn gurus *as archetypes*
3. The owner's own chaos (shoeboxes, "two weeks", the guy named Dave)
4. The robots themselves

**Hard lines:** no slurs; no punching at protected groups; nothing about real, named people or companies; no jokes that contradict the site's advice (start small, human in the loop).

**Meme format:** text lives in real fonts, rendered in code (`scripts/memes/make_memes.py`), never AI-rendered.
- Paper background, 1080px wide. Setup line: Figtree 50px, muted. Punchline: Fraunces 66px semibold, ink.
- Illustrated robot scene below, no text in the art.
- Footer: coral dot + "Robots, unimpressed." left, "smbagentsai.com" right.
- **Contractor snort test:** if a GC reading it on a job-site break wouldn't snort, cut it.

---

## 9. Assets
- `/workspace/gary-v2.png`: Gary v2 model sheet (front / side / back)
- `/workspace/gary-memes-v2-1..4.png`: meme set v2 (#2 is live on the home page as `public/memes/robot-shoebox.webp`)
- `public/team/scott-mackin.webp|jpg`: Scott's photo, 400px, About sign-off
- Retired: all v1 Gary art (cute coral robot), illustrated portrait

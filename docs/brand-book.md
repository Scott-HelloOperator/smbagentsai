# SMB Agents AI · Light Brand Book (v1, Oct 2026)

> **One line:** SMB Agents AI is the friendly switchboard for small-business AI. We take the noise, find the use case that fits your problem, and patch you straight through.

---

## 1. Where we come from (and how you can tell)

SMB Agents AI is made by **Hello Operator** (hellooperator.ai). The two brands look different on purpose (Hello Operator is a B2B agency; we're a kitchen-table guide for owners), but **two elements carry over** so anyone who knows HO can spot the family resemblance:

| Shared element | Hello Operator | SMB Agents AI |
|---|---|---|
| **Operator Coral** `#ED7347` | HO's brand orange (`--base-color-brand--orange`), used on its pill highlights and CTAs | Our primary color: buttons, the logo jack, highlights |
| **The operator dot / jack** | The filled dot that replaces the "O" in **●PERATOR** | A coral "switchboard jack" (a ringed dot) in front of our wordmark, used as a bullet and status light |

Supporting cues: the operator/phone language ("patched through", "picking up", **The Switchboard**) and rounded pill shapes, which HO also uses. Everything else (cream paper, serif headlines, Gary) is ours.

*HO reference (from hellooperator.ai CSS + the Canva "Hello Operator" brand kit): pale lime `#EBF2BD`, deep green-black ink `#011B17`, lime `#CDE476`, coral `#ED7347` / light coral `#FFA075`, blue `#62A2DB` / `#D6EEF8`; fonts PP Neue Machina (headlines) + system sans; the `HELLO / ●PERATOR` stacked wordmark; collage-style illustration with outlined UI cards.*

---

## 2. Personality

**Warm, human, fun, and honest.** The neighbor who happens to know a lot about AI, not a startup that wants your demo slot.

- **We are:** plain-spoken, practical, upbeat, a little cheeky, honest about cost and effort.
- **We are not:** hype-y, futuristic, "revolutionary", dark-mode neon, gradient-blob, robot-hand-touching-human-hand.
- **Anti-generic test:** if a screen could be any AI startup's landing page, it's wrong. Swap glows for ink outlines, gradients for flat color, stock 3D for Gary.

---

## 3. Color

Light mode only. Cream paper, espresso ink, one loud color, two friends.

| Token (Tailwind) | Name | Hex | Use |
|---|---|---|---|
| `cream` | Paper | `#FBF7F0` | Page background. Always. |
| `ink` | Espresso | `#2B2420` | Text, 2px outlines, the hard "pop" shadow |
| `clay-500` / `coral-500` | **Operator Coral** (shared w/ HO) | `#ED7347` | Primary buttons (with **ink** text, 5.2:1), logo jack, accents |
| `clay-600` | Coral Deep | `#C9502A` | White-on-coral if ever needed (4.5:1), large text |
| `clay-700` | Coral Ink | `#9A3B1C` | Small coral text on cream (eyebrows, links), 6.5:1 |
| `clay-50` | Coral Wash | `#FDF0EA` | Soft card fills (quiz CTA) |
| `mustard-400` | Switchboard Lamp | `#F4B740` | Highlighter swipes, the "AI" pill in the logo, sparing |
| `mustard-50` | Lamp Wash | `#FEF6E2` | Switchboard signup card, Gary callouts |
| `sage-600` | Gary Green | `#4F7A55` | Success states, "Meet the intern" eyebrows (4.6:1 on cream) |
| `sage-100` | Sage Wash | `#E2ECDF` | Calm fills |

**Ratio:** ~70% cream, 20% ink, 7% coral, 3% mustard/sage. One coral button per screen.

---

## 4. Type

| Role | Font | Notes |
|---|---|---|
| Display / headlines | **Fraunces** (Google, variable; SOFT 100, WONK 0, semibold 600) | Soft, bookish, a bit old-timey, a nod to the switchboard era. Tight tracking, line-height ~1.05. |
| Body / UI | **Figtree** (Google) | Friendly geometric sans, very legible on phones. 16–17px body. |
| Eyebrows | Figtree bold, uppercase, tracking 0.12–0.14em, 12px | Coral Ink or Gary Green. Usually led by the jack dot. |

Loaded via `next/font/google` as `--font-display` / `--font-body` → Tailwind `font-serif` / `font-sans`.

---

## 5. Logo

**Wordmark:** `[●] SMB Agents (AI)`
- **Jack** = coral circle, 2px espresso outline, cream center "socket". It's HO's operator dot, plugged in.
- **"SMB Agents"** in Fraunces semibold.
- **"AI"** as a small mustard pill in Figtree extra-bold: AI is the tool, not the headline.
- Min size: jack 16px. Clear space = jack diameter on all sides.
- Favicon/app icon = the jack alone on cream (`app/icon.svg`).
- Don'ts: no gradients, no glow, don't recolor the jack, don't drop the outline, don't set "AI" bigger than "SMB Agents".

---

## 6. Shapes & motifs

- **Ink outline + hard pop shadow** (`border-2 border-ink` + `3px 3px 0 #2B2420`) on hero cards and buttons: the Saturday-morning cartoon cel look.
- **Pills** for buttons, inputs, chips (shared with HO).
- **Highlighter swipe** (mustard, behind 1–3 words of a headline).
- **Switchboard language and motifs:** jacks, cords, "patched through", "picking up". Use as seasoning, max one pun per screen.

---

## 7. Voice

- Write like Scott talking to an owner across the counter: short sentences, second person, concrete nouns (invoices, missed calls, Tuesday).
- Lead with the **problem**, then the honest cost: tools, setup time, monthly $, what can go wrong.
- Banned: *revolutionary, game-changer, unlock, supercharge, seamless, cutting-edge, leverage, 10x*.
- Humor comes from Gary and real small-biz life, never from making fun of the reader.
- Newsletter = **The Switchboard**. CTA: **"Subscribe to The Switchboard."**
- Examples: ✅ "Pick a headache, flip a card, copy the prompt." ❌ "Unlock the power of agentic AI."

---

## 8. Gary the AI Intern: mascot rules

**Who he is:** a small, earnest robot intern. Eager, tireless, slightly overconfident. He's the honest picture of AI tools: genuinely helpful, as long as a human keeps an eye on him. Catchphrase/format: **"Oh, Gary."**

**Look (see `gary-character.png`):**
- Rounded-square TV-style head with a cream face screen, big round eyes, simple smile.
- Single antenna with a mustard ball.
- **Vintage operator headset** (one earpiece + curved mouthpiece): his link to Hello Operator.
- **Clipboard** (sage), "GARY" name badge, coral body, sage segmented arms/legs, mustard joints, coral boots.
- Style: **classic 2D cartoon**. Bold ink outlines, flat colors, no gradients, no 3D, no gloss, no photoreal.

**Rules:**
1. Gary fails at *AI hype*, never at the reader's expense, and never at a real, named business.
2. Gary is always well-meaning. No menace, no "robots are taking your job" jokes.
3. One Gary per page section, max. He supports content; he doesn't replace it.
4. Keep him original: never draw him like Bender, WALL·E, or any existing character. No metallic chrome, no cigars, no visor-eye.
5. Meme format: one scene, one bold caption ("OH GARY."), a background gag (fire, paper avalanche, "TOTALLY FINE" box).
6. Gary never gives advice that contradicts the site (always: start small, human in the loop).

---

## 9. Layout (phone-first)

- Design at 390px first; max content width 72rem; generous 16px side padding.
- One primary action per screen (coral button). Tap targets ≥ 44px.
- Cards: white or wash fill, `rounded-3xl`, ink outline only for hero/feature cards (directory cards stay light to keep scanning easy).
- Light mode only. `theme-color` = Paper `#FBF7F0`.

---

## 10. Asset index
- `/workspace/gary-character.png`: Gary model sheet (front / wave / oops)
- `/workspace/gary-meme-1.png`: "Oh Gary" meme #1 (AI saved 400 hours / coffee machine fire)
- Site copies: `public/gary/*`, headshot `public/team/scott-mackin.png` (Scott's illustrated portrait from hellooperator.ai/about)

# Design System

> **Status: PROPOSAL.** This is a starting point for review, not a locked decision. The one placeholder value in this document (the accent hue) is explicitly marked and should be swapped once brand identity is finalized — everything else is a durable structural decision.

This system is designed for one specific reality: a business owner will look at this product for 8+ hours a day, every working day, for years. It is not designed to impress in a 30-second demo. Every rule below optimizes for the same five outcomes: it feels **premium, fast, minimal, professional, and calm** — and stays that way after the thousandth use, not just the first.

---

## 1. Color Palette

- A large **neutral scale** (10 steps, near-white to near-black) does most of the work. Business tools are read far more than they are decorated — color should recede, not compete for attention.
- Pure black and pure white are never used. Both create harsh contrast that fatigues the eyes over long sessions; the scale starts and ends just short of each extreme.
- **One accent color**, used only for primary actions and active/selected state — never for decoration. A single accent, used sparingly, is what makes an interface feel premium and calm rather than busy.
- **Four semantic colors** (success, warning, danger, info), each desaturated relative to a typical "alert" palette. A tool used all day cannot visually shout at its user dozens of times a day without causing alert fatigue.
- Every token is named by role (`surface`, `text-primary`, `border-subtle`, `accent`), never by raw color name. Components consume roles, never hex values directly — this is what makes dark mode (§11) possible without per-component rework.

| Token                                     | Role                          | Placeholder value                                  |
| ----------------------------------------- | ----------------------------- | -------------------------------------------------- |
| `neutral-0` → `neutral-950`               | Backgrounds, text, borders    | Cool gray scale, e.g. `#FAFAFA` → `#18181B`        |
| `accent`                                  | Primary actions, active state | **Placeholder** — deep indigo/blue, e.g. `#3949AB` |
| `success` / `warning` / `danger` / `info` | Status only                   | Desaturated green / amber / red / blue             |

## 2. Typography Scale

- One typeface family only. Multiple families read as inconsistent, not expressive.
- Default to the operating system's native font stack — zero font-download cost, always renders instantly, and looks native on every platform. A licensed custom typeface is a legitimate future upgrade, not a launch requirement.
- A **modular scale** (7 steps: `xs` → `3xl`), not arbitrary per-screen sizes. Every piece of text in the product maps to one of these seven values.
- Body text is never smaller than 16px. This is the single highest-leverage decision for a product read for 8 hours a day.
- Two line-height rules only: tight for headings, ~1.5 for body/paragraph text.
- A maximum of three font weights in the entire system (regular, medium, semibold). Bold is used, not decorated with.
- No italic or decorative text styles anywhere in the interface.

## 3. Spacing System

- One base unit (4px). Every spacing value in the product is a multiple of it — this single rule is what makes an interface feel deliberately built rather than eyeballed.
- A finite named scale (`space-1` through `space-12`), never a raw pixel value in a component.
- Spacing is tighter between related elements and looser between unrelated groups — a rule applied consistently, not a value chosen per screen.
- Default density leans toward compact, not airy. A tool used all day rewards information density; "minimal" here means no decorative whitespace, not empty screens.

## 4. Border Radius

- One small radius scale: `sm`, `md`, `lg`, and `full` (for circles/pills only).
- Radii stay subtle. Large, "bubbly" rounding reads as consumer/playful, which works against professional and calm.
- `full` (circular) is reserved for avatars, status dots, and icon-only buttons — never for general containers or cards.

## 5. Shadows

- Shadows exist for exactly one purpose: communicating elevation (this is above that). They are never decorative.
- A fixed 3-level scale: resting (no shadow), raised (dropdowns, popovers), overlay (modals). Nothing outside these three.
- Shadows are soft, low-opacity, low-spread. Heavy, dark shadows read as dated rather than premium.
- Where a border or a one-step surface-tone change can communicate the same hierarchy, it is used instead of a shadow — most rows, cards, and panels in a daily-use tool need no shadow at all.

## 6. Icon Strategy

- One icon set, one visual style, used everywhere. Mixing icon families is one of the fastest ways an interface reads as unpolished.
- Outline (stroke-based) icons by default. Filled icons are reserved exclusively for active/selected state — this gives a clear, consistent state signal without relying on color alone (see §12).
- Icon sizes are fixed at three values tied to the spacing scale (16 / 20 / 24px). No arbitrary sizing.
- An icon is never the sole label for a primary action unless its meaning is universal (close, search). Ambiguity has a real cost in a tool where mistakes affect a business.

## 7. Component Naming Convention

- Two tiers only: **primitives** (`Button`, `Input`, `Select`, `Badge` — small, generic, used everywhere) and **patterns** (`FormField`, `DataTable`, `PageHeader` — compositions of primitives, still feature-agnostic).
- Component names are nouns, not actions (`Button`, not `Clickable`).
- Variants are a prop, never a separate component. One `Button` with a `variant` prop — not `PrimaryButton`, `SecondaryButton`, `DangerButton`. This is what keeps the component count sane after years of growth.
- No component name references a specific feature or page (`InvoiceTable` does not belong in the design system). Anything feature-specific is composed in application code, not stored in the shared system.

## 8. Layout Grid

- One grid unit, derived from the spacing scale — not a different grid per screen.
- Two content-width modes: a constrained, readable max-width for text and forms, and full-width for data-dense views (tables, dashboards). Business tools should use available width for data, unlike a marketing site that constrains width for readability everywhere.
- One persistent application shell — navigation region plus content region — defined once. A user builds spatial muscle memory over 8-hour days; the shell must never shift shape between screens.
- Grid gutters and gaps are always spacing-scale values, never bespoke numbers.

## 9. Responsive Breakpoints

- Desktop is the primary target. The people using this product are doing focused, 8-hour daily work — overwhelmingly at a desk, not on a phone. This follows directly from Architecture.md's decision that this is an internal business application, not a public site, and that a native mobile app is a future, not a launch, concern.
- Four breakpoints only: small (up to tablet), medium (tablet), large (desktop), extra-large (wide desktop). More breakpoints than that add maintenance cost without adding real value at this stage.
- Below the minimum supported width, the strategy is graceful degradation — stacking, scrolling, simplifying — not a parallel mobile-optimized redesign. That redesign is a future decision, not a launch requirement.

## 10. Animation Principles

- Animation exists only to communicate feedback or continuity between states. It is never decorative, and never used to "delight" — decorative motion is the opposite of calm once it's been seen a thousand times.
- Micro-interactions run 100–200ms. Anything longer reads as slow in a tool used all day.
- One easing curve for entrances, one for exits, applied everywhere — not a different curve per component.
- The system respects the user's reduced-motion preference by default, with no exceptions.
- Animation never blocks input. It is a cosmetic layer on top of an interaction that has already happened, never a gate the user has to wait through.

## 11. Dark Mode Strategy

- Dark mode is a first-class mode, not an inverted afterthought. Every token in §1 has both a light and a dark value; components reference the token role, never a literal color, which is what makes this possible without touching component code.
- For a tool used 8+ hours a day, dark mode is an ergonomic feature (reduced eye strain in low light), not a cosmetic option — it is built into the token architecture from the start rather than retrofitted later.
- The dark surface is a dark neutral gray, never pure black. True black causes halation and eye strain on most displays, and works against "calm."
- Elevation in dark mode is communicated by lightening the surface tone (higher = lighter), not by shadow — shadows are nearly invisible on dark backgrounds, so §5's shadow-based system does not apply in dark mode.
- The system defaults to the OS-level preference, with a per-user override that is remembered.

## 12. Accessibility Rules

- Every color pairing defined in §1 (text on surface, text on accent) meets WCAG AA contrast at the token level — 4.5:1 for body text, 3:1 for large text and UI components. This is guaranteed by using the tokens correctly; no individual screen has to re-check contrast by hand.
- Every interactive primitive ships with a visible focus state by default. It is not an opt-in that individual screens can forget to add.
- State is never communicated by color alone, at the component level, not just the screen level — every semantic color (§1) pairs with an icon or text label built into the component itself.
- One minimum interactive target size (40×40px), applied to every clickable primitive. Repetitive strain from small click targets compounds over an 8-hour day.
- Text is never baked into an image or icon where it needs to be read by a screen reader or selected by a user. No exceptions.

---

## Review — what was cut for unnecessary complexity

- **No numeric type scale beyond 7 steps.** An earlier pass considered a finer-grained scale (10+ steps, closer to a typical design-tool default). Cut it — a business tool needs enough range to establish hierarchy, not a scale fine enough for a marketing site's typographic flourishes. Fewer steps also means fewer decisions for every future screen.
- **No separate "compact" and "comfortable" density modes.** Considered offering a user-toggleable density setting. Cut it for now — it's a real feature with real maintenance cost (every component needs two sets of measurements), and nothing in this proposal requires it yet. One well-chosen default density, tilted compact, serves the "used all day" goal without doubling the surface area of the system. Worth revisiting only if real usage data asks for it.
- **No 5-level shadow/elevation scale.** Most design systems default to 4–6 elevation levels. Reduced to 3 (resting, raised, overlay) — a business tool has far fewer real elevation states than a consumer app with cards, tooltips, and floating panels everywhere at once.
- **No animation-duration scale with multiple named speeds.** Collapsed to a single micro-interaction range (100–200ms) plus the reduced-motion rule, rather than a named scale (`fast`/`base`/`slow`/`slower`). A tool built for speed doesn't need four ways to be slow.
- **Kept, deliberately, despite the complexity cost:** the dark-mode token architecture (§11) and the two-tier component naming convention (§7). Both look like extra upfront work, but retrofitting either one later — repainting every hardcoded color, or splitting an already-sprawling flat component list into primitives/patterns — is far more expensive than building them correctly now, at zero components.

Nothing in this document depends on a specific library, framework feature, or installed dependency — it describes the system, not its implementation.

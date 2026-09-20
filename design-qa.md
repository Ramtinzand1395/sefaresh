# Design QA — Dashboard Foundation

## Evidence

- Source visual truth: the ten dashboard references in `D:\سفارش\src\docts\`, with the order overview (`ChatGPT Image Sep 20, 2026, 10_33_18 AM.png`, 1536 × 1024) as the primary shell-density reference and the suppliers, spend, notifications, settings, comparison, and modal references as supporting pattern evidence.
- Brand visual truth: `C:\Users\Ramtin\.codex\state\plugins\product-design\assets\sefaresh-brand-identity-guidelines-fa.pdf` (26 A4 pages), visually rendered and inspected at 72 DPI.
- Implementation URL: `http://localhost:3000/dashboard`.
- Implementation screenshots: captured inline from Codex in-app Browser tab 1; this browser surface did not expose a persistent screenshot file path.
- Desktop viewport: 1440 × 1000 CSS px, device scale factor 1.
- Mobile viewport: 390 × 844 CSS px, device scale factor 1.
- State: dashboard overview; mobile navigation open/closed; desktop account menu open/closed.
- Density normalization: the source references are 1× raster exports and the implementation was evaluated at CSS-pixel density. The sources define a visual system rather than an exact overview-page composition, so comparison focused on the shared shell, density, tokens, typography, cards, states, and responsive behavior.

## Full-view comparison evidence

- The implementation preserves the reference composition: fixed right sidebar, compact top utility/search bar, pale neutral canvas, white bordered cards, and RTL content hierarchy.
- Sidebar width, card density, active navigation treatment, icon family, control height, and information rhythm remain visually consistent with the references without implementing their feature pages.
- Brand balance matches the guide: surfaces remain predominantly neutral, blue carries action and selection, and orange is restricted to warning/accent use.
- Desktop document metrics: 1440px viewport and 1440px document width, with no page overflow.
- Mobile post-fix metrics: 390px viewport and 375px content width (scrollbar excluded), with no page overflow.

## Focused region comparison evidence

- Navigation: official wordmark, line icons, 48px navigation rows, pale-blue active state, vertical active marker, disabled future routes, notification badges, and support card were inspected.
- Top bar: search label, compact icon controls, unread indicator, business identity disclosure, and visible focus treatment were inspected.
- Overview cards: typography, semantic icon backgrounds, spacing, radii, borders, and color balance were inspected.
- Table: right-aligned Persian content, status badges, row rhythm, and contained horizontal scrolling were inspected. At 390px the table viewport is 301px wide with a 640px scrollable region, without widening the page.
- Mobile drawer: open state, overlay, close control, disabled routes, support card, and Escape dismissal were tested.

## Findings

- No actionable P0, P1, or P2 findings remain.

## Comparison history

### Iteration 1 — mobile table overflow

- Earlier finding: [P2] the order table's intrinsic 640px width forced its grid parent and the whole mobile document to 698px.
- Fix: added `min-w-0` to the shared Card primitive so wide descendants stay contained by their responsive grid track.
- Post-fix evidence: the 390px viewport now reports a 375px document width, while the table wrapper independently reports `clientWidth: 301`, `scrollWidth: 640`, and `overflow-x: auto`.

## Required fidelity surfaces

- Fonts and typography: Vazirmatn is active with its Next.js fallback; headline, body, label, and small metadata weights follow the reference hierarchy without clipped or awkward wrapping.
- Spacing and layout rhythm: 17rem desktop sidebar, compact sticky top bar, 12–16px radii, restrained borders/shadows, responsive stat grid, and card spacing match the supplied system.
- Colors and visual tokens: official blue, navy, light blue, orange, neutrals, text, and border colors are mapped to semantic tokens; green, warning orange, red, and violet are reserved for state communication.
- Image quality and asset fidelity: the official raster logo is reused through `next/image`; no reference imagery was replaced by CSS art, inline SVG, emoji, or placeholder illustration. Tabler provides the consistent line-icon set.
- Copy and content: Persian B2B purchasing language is concise, operational, and aligned with the brand voice. Unimplemented sections are explicitly disabled instead of leading to broken pages.

## Accessibility and behavior

- Document language is `fa` and direction is `rtl`.
- Search has a programmatic label; icon-only buttons require accessible names; state badges include text; controls meet a 44px target baseline.
- Focus rings are globally visible and the drawer respects reduced-motion preferences.
- Mobile drawer opens correctly and dismisses through the overlay, close control, and Escape key.
- Browser console check returned no warnings or errors on the dashboard route.

## Follow-up polish

- Add a focus trap and focus restoration when the mobile navigation grows beyond this initial shell.
- Replace mock overview values with server data when the first operational flow is implemented.
- Capture matching approved overview mockups if pixel-level regression testing becomes a requirement.

final result: passed

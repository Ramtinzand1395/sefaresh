# Design QA — Settings Page

## Evidence

- Source visual truth: `D:\سفارش\docts\settings.png` (864 × 1222 px).
- Implementation URL: `http://localhost:3000/dashboard/settings`.
- Implementation screenshots: captured inline from Codex in-app Browser tab 1; the browser surface did not expose a persistent local screenshot path.
- Primary comparison viewport: 864 × 1222 CSS px at device scale factor 1, matching the source pixel dimensions at 1× density.
- Responsive verification: 1440 × 1100 desktop, 768 × 1024 tablet, and 390 × 844 mobile.
- State: «ظاهر و تم» active, light theme selected, Persian selected, RTL selected.
- Combined evidence: source and live implementation were rendered side-by-side at equal 864 × 1222 frames in one browser capture before the temporary comparison route was removed.

## Full-view comparison evidence

- Both frames preserve the same RTL composition: fixed right sidebar, compact top search/actions bar, settings title and description, horizontal tab row, bordered settings panel, pale-blue appearance banner, theme previews, language selector, direction options, and blue save action.
- At 864px the implementation keeps the sidebar persistent like the reference. At 768px and below it becomes an accessible drawer so the content remains usable on tablet and mobile.
- The implementation is slightly taller in its inner settings panel because Persian option labels and practical 44px tap targets are retained; all primary controls remain visible without overlap or horizontal page overflow.

## Focused region comparison evidence

- Header and tabs: title hierarchy, muted supporting copy, active blue tab underline, RTL order, and horizontal overflow behavior were inspected.
- Appearance banner: pale-blue surface, right-aligned title/copy, circular palette treatment, radius, and border were inspected.
- Theme controls: three realistic dashboard thumbnails, light/dark/system states, selected border, radio semantics, and mobile one-column reflow were inspected.
- Form controls: language label/select, RTL/LTR choices, save button, keyboard focus styling, loading state, and success toast were inspected.
- Sidebar and top bar: active settings item, search, badges, account controls, mobile menu open/close, and support card were inspected against the existing design system.

## Findings

- No actionable P0, P1, or P2 findings remain.

## Comparison history

### Iteration 1 — active mobile tab visibility

- Earlier finding: [P2] «ظاهر و تم» was selected but initially outside the visible portion of the horizontally scrollable tab list at 390px.
- Fix: the active tab now scrolls into the nearest visible position on load and after tab changes.
- Post-fix evidence: the 390 × 844 capture shows «ظاهر و تم» visible with its blue underline.

### Iteration 2 — thumbnail image sizing

- Earlier finding: [P2] Next.js reported zero-height parents for the dashboard preview images, making thumbnails appear nearly empty.
- Fix: preview frames now have explicit 64px heights while retaining `next/image` fill behavior.
- Post-fix evidence: light, dark, and split system thumbnails render sharply in desktop, tablet, and mobile captures; no new image sizing warnings appeared after reload.

### Iteration 3 — reference-width shell fidelity

- Earlier finding: [P2] the shared dashboard shell switched to the mobile drawer at the 864px reference width, while the source keeps a fixed sidebar.
- Fix: the shared shell breakpoint was aligned to 850px; 864px now matches the source and 768px still uses the drawer.
- Post-fix evidence: the equal-size side-by-side comparison shows persistent right sidebars in both 864 × 1222 frames.

### Iteration 4 — vertical density

- Earlier finding: [P2] direction cards and section gaps made the form visibly taller than the source.
- Fix: the banner, preview cards, direction cards, and section spacing were tightened without reducing practical control targets.
- Post-fix evidence: the save action is visible within the 864 × 1222 frame and the panel rhythm is substantially closer to the reference.

## Required fidelity surfaces

- Fonts and typography: Vazirmatn is active; heavy Persian headings, compact labels, muted supporting text, and line heights match the existing Sefaresh design system and remain readable at all tested widths.
- Spacing and layout rhythm: panel radii, borders, pale canvas, banner height, form width, tab spacing, and responsive breakpoints reproduce the reference hierarchy without collision or clipping.
- Colors and visual tokens: the page uses existing semantic tokens for white/neutral surfaces, navy text, muted copy, brand blue selection/action, border blue-gray, and light-blue emphasis.
- Image quality and asset fidelity: theme previews reuse the existing real dashboard image, including dark and split-system treatments. Brand imagery remains the shared official raster asset, and standard UI icons use the existing Tabler library.
- Copy and content: all settings copy is Persian, concise, and relevant to a cafe/restaurant purchasing account. Non-appearance tabs use realistic mock values and explicitly remain frontend-only.

## Accessibility and behavior

- The document remains `lang="fa"` and `dir="rtl"`.
- Tabs expose tablist/tab/tabpanel semantics and selected state. Theme and layout choices are native radio controls; the language control is a labelled native select.
- Interactive controls retain visible focus indicators and practical touch targets.
- Theme, language, direction, all seven tabs, save/loading/success feedback, and the mobile navigation drawer were exercised in the browser.
- Production build and TypeScript checks pass. The only lint output is a pre-existing unused import warning in `src/components/layout/dashboard-header.tsx`.

## Follow-up polish

- P3: the reference uses a different illustration in the sidebar helper card; the implementation intentionally preserves the existing shared Rosha support card from the product design system.
- P3: theme labels are localized to Persian instead of the English labels shown in the source, matching the requested Persian interface.

final result: passed

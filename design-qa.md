# Design QA — Orders Page

## Evidence

- Source visual truth: `D:\\سفارش\\docts\\orders.png` (1536 × 1024 px) and `D:\\سفارش\\docts\\ordersMOdals.png` (1672 × 941 px).
- Implementation URL: `http://localhost:3000/dashboard/orders`.
- Implementation screenshots: captured inline from Codex in-app Browser tabs 1 and 2; the browser surface did not expose a persistent local screenshot path.
- Primary comparison viewport: 1536 × 1024 CSS px at device scale factor 1, matching the primary source at 1× density.
- Additional responsive viewports: 1536 × 1000 desktop, default 878 × 918 tablet, and 390 × 844 mobile.
- States captured: default orders page, request-price modal, supplier-profile modal, supplier-comparison modal, order-details modal, filtered results, and mock success feedback.
- Combined evidence: the reference was rendered as a 50%-opacity full-viewport overlay on the live 1536 × 1024 implementation, providing a same-frame alignment comparison before the temporary QA overlay was removed.

## Full-view comparison evidence

- The implementation preserves the reference hierarchy and RTL composition: fixed right sidebar, top search/actions bar, title and primary action, four status cards, compact filter row, four-row order table, then the Rosha, active-order, and attention panels.
- The overlay comparison showed close alignment for sidebar width, content margins, card grid, table start/end positions, status colors, control density, and lower-panel ordering.
- At tablet width the dense table intentionally becomes stacked order cards while the fixed sidebar remains available above the existing 850px shell breakpoint. At mobile width the sidebar becomes the existing accessible drawer and all filters, cards, panels, and dialogs reflow without horizontal page overflow.

## Focused region comparison evidence

- Header and summary cards: title weight, muted description, blue action, four equal cards, semantic icon surfaces, and Persian numerals were inspected.
- Filters and order list: search, three native selects, reset state, table headers, supplier marks, product thumbnails, badges, totals, delivery copy, and row menus were inspected.
- Lower panels: reference RTL order, active-order step indicators, attention cards, and the dedicated Rosha mascot asset were inspected after the second iteration.
- Dialogs: request-price, supplier profile, comparison, and order details were opened and inspected against the modal reference for width, backdrop, surface radius, borders, form controls, table density, button hierarchy, and responsive stacking.

## Findings

- No actionable P0, P1, or P2 findings remain.

## Comparison history

### Iteration 1 — reference density and RTL panel order

- Earlier findings: [P2] the table showed six rows instead of the reference’s four, the lower cards were mirrored relative to the RTL source, and the green monthly trend repeated its percentage.
- Fixes: the realistic current-page mock set was reduced to four visible orders, the lower panels were ordered as attention → active tracking → Rosha in RTL grid flow, and the trend copy was normalized.
- Post-fix evidence: the 1536 × 1000 capture shows four table rows and the same right-to-left lower-panel order as the reference; the table now gives the lower panels the intended above-the-fold prominence.

### Iteration 2 — Rosha asset fidelity

- Earlier finding: [P2] the shared marketing image introduced unrelated UI imagery and an incorrect crop inside both helper cards.
- Fix: a dedicated 1145 × 1374 Rosha raster asset was generated from the supplied reference and saved at `D:\\سفارش\\public\\images\\rosha-orders.png`; both helper cards now use responsive object-fit crops of that asset.
- Post-fix evidence: the final lower-panel and sidebar captures show a clean orange fox in royal-blue clothing holding a dark tablet, with no unrelated UI or placeholder artwork.

## Required fidelity surfaces

- Fonts and typography: Vazirmatn remains the active family; black Persian headings, compact table labels, muted supporting copy, numeric weights, wrapping, and line heights match the established Sefaresh dashboard language.
- Spacing and layout rhythm: page margins, section gaps, four-card grid, filter density, four-row table, 12–16px radii, subtle borders, and lower-panel proportions closely follow the source while retaining practical touch targets.
- Colors and visual tokens: all surfaces use the existing semantic white/neutral, navy, brand blue, light blue, orange, success green, warning, violet, border, shadow, and focus-ring tokens.
- Image quality and asset fidelity: product thumbnails use existing local raster assets; Rosha uses the new project-local 3D raster; the official brand mark remains unchanged; standard interface and supplier marks use the existing Tabler icon system.
- Copy and content: all app-specific copy is Persian, concise, realistic for cafe purchasing, and consistent with the supplied references. Data remains mock-only.
- Icons: controls use one icon family with consistent 1.6–1.8 stroke weight, optical sizes, alignment, and accessible labels.

## Accessibility and behavior

- The document remains `lang="fa"` and `dir="rtl"`; desktop tables expose proper row/cell semantics and mobile data uses labelled definition lists.
- Inputs and selects have labels, dialogs expose `role="dialog"`, `aria-modal`, titles/descriptions, Escape handling, focus restoration, and scroll locking.
- Buttons preserve visible focus indicators and practical touch sizes. Status is communicated with text in addition to color.
- Search, status/date/supplier filters, reset behavior, row menus, supplier/profile comparison, radio selection, request quantity controls, mock submission, order details, and mobile layout were exercised in the browser.
- The final browser tab reported no console errors or warnings. TypeScript, lint, production build, and `git diff --check` pass; lint retains one unrelated pre-existing unused import warning in `src/components/layout/dashboard-header.tsx`.

## Follow-up polish

- P3: the generated Rosha asset is a close reference match but is a newly rendered variant rather than the original source character file, which was not present in the repository.
- P3: supplier identities use the existing icon library instead of unique external brand logos because no supplier asset pack was provided.

final result: passed

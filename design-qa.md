# Design QA — Cart and Checkout Flow

## Evidence

- Source visual truth: `D:\سفارش\docts\pay\ChatGPT Image Sep 21, 2026, 09_53_21 AM.png` (1487 × 1058 px, confirmation step) and `D:\سفارش\docts\pay\ChatGPT Image Sep 21, 2026, 09_55_33 AM.png` (1487 × 1058 px, payment step), plus the four modal/request references in the same folder.
- Implementation URL: `http://localhost:3000/dashboard/cart`.
- Implementation screenshots: `D:\سفارش\implementation-cart-step2-final.png`, `D:\سفارش\implementation-cart-step3-final.png`, `D:\سفارش\implementation-cart-success.png`, `D:\سفارش\implementation-cart-mobile.png`, and `D:\سفارش\implementation-cart-tablet.png`.
- Combined comparison evidence: `D:\سفارش\design-qa-cart-step2-final.png` and `D:\سفارش\design-qa-cart-step3-final.png` place the normalized source on the left and implementation on the right.
- Primary viewport: 1536 × 1091 CSS px at device scale factor 1. Source images were normalized from 1487 × 1058 to 1536 × 1091 with high-quality bicubic interpolation; implementation captures are native 1536 × 1091.
- Responsive viewports: 390 × 844 mobile capture and a 768 × 1024 tablet request that produced a 758 × 1011 browser-content capture after the in-app browser scrollbar/chrome adjustment.
- States compared: cart items, confirmation/address/delivery/payment method, online payment/gateway/invoice, add-product modal, edit-address modal, delivery-time modal, and success modal.

## Full-view comparison evidence

- The final implementation preserves the source hierarchy and RTL composition: existing right dashboard shell, page title, three-stage stepper, dominant working column, sticky summary column on the left, semantic white cards, and pale-blue Rosha guidance panel.
- Card proportions, blue selection states, compact summary values, step completion markers, border radii, subdued shadows, and page density align closely with the references.
- Desktop keeps the checkout controls and summary visible together. Tablet stacks the summary under the primary content. Mobile collapses every row into readable cards, preserves touch targets, and has no document-width overflow (`innerWidth` and `scrollWidth` both measured 390 px).

## Focused region comparison evidence

- Stepper: active and completed states, connector colors, Persian labels, supporting copy, and compact mobile labels were inspected.
- Summary: item count, subtotal, shipping, discount, payable amount, primary action, previous-step action, and security note were inspected.
- Confirmation step: address card, delivery-slot radio cards, payment-method cards, Rosha banner, and their spacing/state treatments were inspected.
- Payment step: payment choices, gateway card, generated local gateway mark, invoice switch, Rosha/security banner, and final CTA were inspected.
- Modals: add-product filtering/list, address form, delivery picker, backdrop, close behavior, responsive scrolling, footer actions, and success state were opened and exercised.

## Findings

- No actionable P0, P1, or P2 findings remain.

## Comparison history

### Iteration 1 — visible asset fidelity

- Earlier findings: [P2] the confirmation and payment guidance panels omitted the Rosha character visible in the source, and the gateway tile used a text glyph in place of a proper visual asset.
- Fixes: both guidance panels now use the existing high-resolution `public/images/rosha-orders.png` asset with responsive crops; a dedicated transparent gateway mark was generated from the supplied payment reference and saved at `public/images/payment-zarinpal.png`.
- Post-fix evidence: `design-qa-cart-step2-final.png` and `design-qa-cart-step3-final.png` show the expected character panel and yellow payment mark at the same visual locations as the reference.

## Required fidelity surfaces

- Fonts and typography: Vazirmatn remains active; Persian headings use heavy optical weights, supporting labels stay compact and muted, numerals are localized, and wrapping remains controlled at desktop, tablet, and mobile sizes.
- Spacing and layout rhythm: page insets, stepper tracks, 16px card radii, section gaps, row padding, summary width, control heights, and modal density match the established dashboard system and the supplied checkout compositions.
- Colors and visual tokens: existing semantic white/neutral, navy, brand blue, light-blue selection, green success, red danger, border, focus, and shadow tokens are reused without introducing a competing palette.
- Image quality and asset fidelity: product photos, official dashboard brand artwork, Rosha raster art, and the new transparent payment mark render sharply with `next/image`; no visible reference asset is replaced by CSS art, emoji, or a placeholder.
- Copy and content: all checkout copy is concise Persian, realistic for cafe purchasing, and consistent with the source intent. Prices, address, delivery windows, order number, and products are explicit mock data only.
- Icons: standard interface actions use the existing Tabler icon family with consistent stroke weight, alignment, and accessible names.

## Accessibility and behavior

- RTL structure is inherited from the application layout. Interactive controls retain visible focus states and practical touch sizes.
- Modals expose dialog semantics, titles, descriptions, Escape/backdrop close behavior, focus restoration, and body scroll locking through the shared `Modal` component.
- Product search/filtering, add/remove, quantity changes, address edit, delivery selection, payment selection, invoice switch, back/next navigation, final submission, reset, and success feedback were exercised in the in-app browser.
- Desktop, tablet, and mobile layouts were captured. Browser console logs reported no errors or warnings.
- Targeted ESLint and `git diff --check` pass. The repository-wide TypeScript command is currently blocked by an unrelated in-progress `src/app/dashboard/suppliers/page.tsx` import whose target file is absent; no cart-file lint errors remain.

## Follow-up polish

- P3: the existing application shell is intentionally reused, so the sidebar/account treatment is the production design-system version rather than a pixel-for-pixel copy of the conceptual reference shell.
- P3: the generated gateway mark is a close source-derived asset rather than an official external brand asset, because no gateway asset pack was supplied.

archived result: passed

---

# Design QA — Supplier Dashboard

## Evidence

- Source visual truth: `D:\سفارش\docts\dashboard.png` (1536 × 1024 px) for the established dashboard shell, density, card language, RTL hierarchy, and semantic color treatment; the task brief is authoritative for supplier-specific content and section order.
- Implementation URL: `http://localhost:3000/supplier`.
- Implementation screenshots: `D:\سفارش\implementation-supplier-dashboard-desktop-above-fold.png` (1440 × 1000 px) and `D:\سفارش\implementation-supplier-dashboard-desktop.png` (1440 × 1700 px).
- Combined comparison evidence: `D:\سفارش\design-qa-supplier-dashboard-comparison.png` places the normalized source on the left and the browser-rendered implementation on the right.
- Desktop comparison viewport: 1440 × 1000 CSS px at device scale factor 1. The 1536 × 1024 source was normalized with a high-quality center fit to 1440 × 1000; the implementation is native 1440 × 1000.
- Additional responsive checks: 768 × 900 tablet and 390 × 844 mobile in the Codex in-app browser.
- State: light mode, RTL, supplier account mock, default 30-day chart, populated KPI/action/request/order sections.

## Full-view comparison evidence

- The implementation preserves the production Supplier Layout and matches the source dashboard's white-card-on-neutral-canvas treatment, compact top bar, fixed right sidebar, blue primary actions, restrained shadows, rounded cards, and dense SaaS/B2B composition.
- Supplier-specific hierarchy follows the brief rather than copying buyer-only content: greeting, four KPIs, sales/action split, purchase requests, then recent orders. The source's large Rosha welcome panel, quick actions, suggested suppliers, and product list are intentionally absent.
- At 1440 px the KPIs form one row and the chart/action split uses the requested approximate 60/40 proportion. At 768 px KPIs form a 2 × 2 grid and the chart/action sections stack. At 390 px the dashboard becomes a single readable column, the orders table becomes cards, and measured document width stays below the viewport with no horizontal overflow.

## Focused region comparison evidence

- KPI cards: typography, icon tiles, semantic tones, localized amounts, trends, one-row/2 × 2/single-column behavior, and spacing were inspected.
- Sales/action region: chart density, axis legibility, native period select, keyboard-focusable data points, active-value tooltip, action counts, variants, and explicit CTA links were inspected.
- Purchase requests: buyer initials, city, item count, approximate value, urgency badge, touch-friendly CTA, and three-row limit were inspected.
- Recent orders: desktop table, mobile card conversion, reusable status badges, date/amount readability, and detail actions were inspected.
- No additional asset-focused crop was needed: this screen introduces no new raster imagery, and the existing logo/Rosha assets remain owned by the unchanged shared layout.

## Findings

- No actionable P0, P1, or P2 visual or interaction findings remain.

## Comparison history

- First comparison pass: no P0/P1/P2 mismatch was found. The page intentionally diverges from buyer-only source modules to satisfy the supplier brief while retaining the established visual system.
- Post-implementation browser checks confirmed the same result at desktop, tablet, and mobile widths; no visual-fix iteration was required.

## Required fidelity surfaces

- Fonts and typography: Vazirmatn is inherited from the root layout; heading, value, label, and supporting-copy weights match the existing dashboard hierarchy. Persian numerals and currency grouping follow current project conventions.
- Spacing and layout rhythm: shared 16px card radius, border and shadow tokens, page insets, grid gaps, section paddings, control heights, and vertical rhythm are preserved across breakpoints.
- Colors and visual tokens: existing primary, success, warning, danger, violet, neutral surface, line, ink, and muted-ink tokens are reused; no competing palette or gradient was introduced.
- Image quality and asset fidelity: no new image assets are required. The unchanged Supplier Layout continues to use the official brand and Rosha assets; interface imagery is not replaced with placeholders or CSS art.
- Copy and content: all required supplier KPIs, action items, request examples, order examples, statuses, empty-state copy, Persian localization, and CTA labels are represented. The greeting uses the existing mock supplier account instead of JSX-hardcoded identity data.
- Icons: standard UI actions use the project's existing Tabler family with consistent stroke weight and hidden decorative semantics.

## Accessibility and behavior

- Semantic headings, sections, lists, table headers, native select labelling, keyboard-focusable chart points, focus-visible styles, screen-reader labels, and touch-friendly actions were checked.
- The chart period was changed from 30 days to 7 days and updated its total and accessible chart label.
- Request detail and order detail CTAs were navigated to their new placeholder routes and returned successfully.
- Fresh browser console logs after reload and client-side navigation contained no errors or warnings.
- TypeScript, ESLint, production build, and `git diff --check` pass.

## Open Questions

- None for this stage; real dashboard data and complete request/order detail screens remain intentionally out of scope.

## Implementation Checklist

- [x] Preserve Supplier Layout, Header, Sidebar, and shared visual tokens.
- [x] Implement KPI, chart, action, request, order, loading, empty, and responsive states.
- [x] Add real navigation targets without building out-of-scope detail experiences.
- [x] Verify RTL, overflow, keyboard semantics, console, TypeScript, lint, and build.

## Follow-up Polish

- P3: once the real dashboard endpoint exists, confirm chart bucketing and action priority ordering against production data volume.

final result: passed

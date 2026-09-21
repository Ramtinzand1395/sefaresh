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

final result: passed

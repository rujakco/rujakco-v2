# RUJAK.Co — Commerce Flow Audit
**Baseline:** `rujakco-v2-main (4)` / MASTER DATA 12 SKU
**Date:** 2 August 2026

## Completed in this pass

### 1. Product catalog
- Confirmed exactly 12 product objects in `client/src/data/products.ts`.
- Confirmed the 12 final IDs are present.
- Removed the legacy `Asinan Mahkota` from live product data.
- Final prices and variants are represented in the product catalog.

### 2. Variant → Cart integrity
- Cart identity now includes product + variant + spice level.
- This prevents two variants or spice configurations from being incorrectly merged into one cart line.
- Product detail already exposes size variants and sends the selected variant into the cart.

### 3. Checkout integrity
- Enhanced checkout now uses `cartKey` for React list identity, preventing duplicate-key collisions when the same product appears in multiple variants.
- Checkout summary now displays the selected size/variant.
- Order payload already preserves variant label and selected price.
- Shipping is calculated from the existing distance/provider/tier engine.

### 4. Content cleanup
- Spotlight `chef-choice` was replaced with the final `signature` tag.
- Removed the unused `chef-choice` badge style.
- FAQ no longer describes the deleted Asinan Mahkota; it now describes Rujak Mahkota according to the final MASTER.

## Important remaining items

### A. Custom Bowl is not yet a true configurator
The current UI displays fruit/sauce choices but does not yet capture the customer's exact fruit and sauce selection into the cart/order. This must be implemented before Custom Bowl is treated as fully production-ready.

### B. Tampah preorder date is not yet a structured checkout field
The product is marked `preorderDays: 3`, but checkout does not yet collect/validate a requested delivery date. The H-3 rule should be implemented before Tampah is considered fully production-ready.

### C. Product photography
Only the existing baseline product images are present for several products. New SKUs currently use existing imagery as temporary placeholders. These are not final product photos.

### D. Build verification
The supplied environment does not expose `pnpm`, Vite, or esbuild binaries, and TypeScript checking cannot run because the required type-definition packages are unavailable. Therefore this audit verifies source/data consistency but does not claim a successful production build.

## Current status

**Catalog:** READY

**Variant/cart data path:** READY at source level

**Checkout variant display:** READY

**Custom Bowl:** NOT READY for production configurator

**Tampah preorder:** NOT READY for structured date validation

**Photography:** NOT FINAL

**Production build:** NOT VERIFIED in this environment

## Next execution order

1. Implement Custom Bowl selection state + pricing + cart persistence.
2. Implement Tampah delivery-date field with H-3 validation.
3. Run build/typecheck in the actual project environment/Vercel.
4. Perform a manual mobile checkout test for every variant.
5. Replace placeholder product images with final photography.


## Commerce Phase 2 — Custom Bowl & Tampah
- Custom Bowl: structured configuration added for fruit groups, seasonal slot, sauce choices, 750 ml, starting price Rp35.000.
- Tampah Nusantara: structured configuration added for 40 cm, 8–10 people, Rp200.000, H-3 preorder.
- Added deterministic validation helper for Tampah delivery date and Custom Bowl selections.
- UI wiring still requires a final manual/runtime verification in the project's own dependency environment before launch.

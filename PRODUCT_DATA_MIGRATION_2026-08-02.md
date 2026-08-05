# RUJAK.Co — Product Data Migration

Baseline: `rujakco-v2-main (4).zip`

## Changes
- Replaced legacy 9-product catalog with the final 12-SKU master.
- Removed legacy `Asinan Mahkota`.
- Added Rujak Mangga, Rujak Bangkok, Custom Bowl, Salad Buah.
- Updated all final prices and sizes.
- Added product variants so 750/1000 ml and 500/750 ml products can be represented correctly in cart/checkout.
- Added product ingredients, sauce/kuah, notes, and Custom Bowl option metadata.
- Added Salad as its own menu filter.
- Cart items now use a `cartKey` so two sizes of the same SKU can coexist.
- Checkout/order messages include the selected size.
- Existing visual architecture was not redesigned.

## Important
- New SKUs without final photography temporarily reuse an existing product image URL as a technical placeholder. Replace these before launch photography.
- Build could not be executed in this environment because the ZIP has no installed dependencies and the package registry available to this environment does not contain one required dependency. Source-level changes were inspected manually and TypeScript compilation was attempted but blocked by missing project type dependencies.

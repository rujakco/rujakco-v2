# RUJAK.Co — Next Execution

## Completed in this phase
1. Custom Bowl configuration is centralized in the data layer.
2. Tampah Nusantara configuration is centralized in the data layer.
3. H-3 Tampah validation helper is available.
4. Custom Bowl selection validation helper is available.
5. Custom Bowl UI selections wired to cart line-item metadata (`CartItem.customSelection`).
6. Order/WhatsApp/Supabase/Admin/OrderTracking payloads all carry the Custom Bowl selections.
7. Tampah delivery-date picker + H-3 validation wired into checkout (`CheckoutForm.tsx` + `CheckoutEnhanced.tsx`), using the existing `validateTampahDeliveryDate` helper.
8. `preorder_delivery_date` wired into Supabase order payload, WhatsApp message, Admin dashboard, and customer order-tracking page — and into the checkout confirm-step receipt preview itself (`ReceiptTemplate.tsx` / `UploadReceipt.tsx`), which was the one gap found when reviewing Task 6.
9. Task 6 reviewed: the 3-step checkout's existing confirm step (receipt preview) already covers Fore-style pre-submit confirmation (delivery method, destination, ETA, item breakdown) — no new modal needed.
10. Task 7 (percentage-only vouchers) implemented end-to-end: `pickBestVoucher` helper, auto-applied "1 voucher terbaik untukmu" banner in checkout, discount reflected in Supabase payload, WhatsApp message, receipt/confirm step, Admin dashboard, and customer order-tracking page.
11. Task 8 (loyalty points, phase 1) implemented end-to-end: earn 1 point/Rp1.000 subtotal, redeem entire balance as a checkout discount (opt-in toggle, min. 50 points), atomic Postgres RPC for balance updates, points reflected in Supabase payload, WhatsApp message, receipt/confirm step, Admin dashboard, and customer order-tracking page.

## ⚠️ Database migrations required before this build fully works
Three SQL files were written but never run (this environment has no DB access):
1. `docs/vouchers-table.sql` — creates the `vouchers` table. Without it, the voucher feature silently does nothing (fails soft — checkout still works, just no discount ever applies).
2. `docs/loyalty-points-table.sql` — creates the `loyalty_points` table and the `adjust_loyalty_points` RPC function. Without it, loyalty points silently do nothing (fails soft — checkout still works, balance always reads as 0).
3. `docs/orders-table-new-columns.sql` — adds `preorder_delivery_date`, `voucher_code`, `discount_amount`, `points_earned`, `points_redeemed`, `loyalty_discount_amount` columns to `orders`. **Run this even if you don't care about vouchers/points yet** — `preorder_delivery_date` has been in the `saveOrder()` payload since Task 5, and if `orders` has a fixed schema, every Tampah Nusantara order since then may have silently failed to save to Supabase (degraded to the offline-queue fallback instead — WhatsApp still went through, but check the DB for gaps once this is run).

## Still required before launch
1. **Run the three SQL migrations in `docs/` (see warning above) — do this first, before anything else below.**
2. Run install/build/typecheck in the project's normal environment (`pnpm install && pnpm check && pnpm dev`) — nothing above has been verified against a real build; the sandbox that wrote it has no network access.
3. Mobile checkout test — full flow: add Custom Bowl (pick fruits/sauce) + Tampah Nusantara (pick pre-order date) → cart with an active voucher applied → checkout with a phone number that has loyalty points → toggle "pakai poin" → confirm invalid-date/empty-selection error states block submit, and the voucher + points discount matches on every screen (checkout form, receipt, WhatsApp message, Admin, order tracking).
4. Decide with owner: dynamic pricing for Custom Bowl based on fruit selection (currently still fixed Rp35.000 regardless of picks — out of scope for the cart-wiring task).
5. Decide with owner: any per-date capacity limit on Tampah Nusantara pre-orders (currently unlimited, only the H-3 lead time is enforced).
6. Decide with owner: fixed-amount vouchers, manual voucher code entry, and an admin voucher-management UI — all deliberately out of scope for Task 7 phase 1 (percentage-only, Supabase-dashboard-managed).
7. **Confirm with owner: `pointValueRupiah = 100` in `loyaltyConfig`** (client/src/data/products.ts) — this redemption rate was NOT explicitly confirmed, only the earn rate was. Currently ~10% effective cashback. Also decide: standalone points-balance page, partial redemption, point expiry, loyalty tiers — all out of scope for Task 8 phase 1.
8. Replace placeholder product photos.

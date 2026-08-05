-- RUJAK.Co — New `orders` columns added across this redesign phase
--
-- Three features were wired into the checkout payload without a matching
-- migration ever being written or run:
--   • preorder_delivery_date (Task 5 — H-3 Tampah Nusantara pre-order date)
--   • voucher_code / discount_amount (Task 7 — auto-applied vouchers)
--   • points_earned / points_redeemed / loyalty_discount_amount (Task 8 — loyalty points)
--
-- If `orders` has a fixed column schema (not a free-form jsonb row), the
-- app has been silently failing to save these fields to Supabase since
-- Task 5 — it degrades to the offline-queue fallback (see saveOrder's
-- catch block in CheckoutEnhanced.tsx), so the customer's order and
-- WhatsApp message were never blocked, but the *database record* would
-- be missing the pre-order date until you run this.
--
-- Safe to run even if some/all of these already exist (IF NOT EXISTS).
-- Run this manually in the Supabase SQL Editor — this sandbox has no DB
-- access to verify current schema or run it directly.

alter table orders add column if not exists preorder_delivery_date date;
alter table orders add column if not exists voucher_code text;
alter table orders add column if not exists discount_amount integer;
alter table orders add column if not exists points_earned integer;
alter table orders add column if not exists points_redeemed integer;
alter table orders add column if not exists loyalty_discount_amount integer;

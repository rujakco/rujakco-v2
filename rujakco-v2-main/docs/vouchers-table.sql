-- RUJAK.Co — Vouchers table (Task 7, phase 1: percentage discounts only)
--
-- This has NOT been run against the live database — it was written from a
-- sandbox with no network/DB access. Run this manually in the Supabase
-- SQL Editor for the rujakco-v2 project before the voucher feature will
-- do anything (the app fails soft to "no voucher" if this table doesn't
-- exist yet — see getActiveVouchers() in client/src/lib/supabase-client.ts).

create table if not exists vouchers (
  code text primary key,
  discount_percent integer not null check (discount_percent > 0 and discount_percent <= 100),
  valid_until timestamptz not null,
  min_subtotal integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Row Level Security: the anon key used by the storefront only needs to
-- READ active vouchers. Writing/managing vouchers should happen from the
-- Supabase dashboard (as the table owner / service role), not from the
-- client — mirrors how `orders` is set up elsewhere in this project.
alter table vouchers enable row level security;

create policy "Public can read vouchers"
  on vouchers for select
  using (true);

-- Example seed row — a 10%-off voucher, min. order Rp50.000, valid for 30
-- days from whenever this is run. Delete or edit before going live.
insert into vouchers (code, discount_percent, valid_until, min_subtotal, is_active)
values ('RUJAK10', 10, now() + interval '30 days', 50000, true)
on conflict (code) do nothing;

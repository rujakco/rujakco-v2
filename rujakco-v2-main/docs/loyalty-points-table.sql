-- RUJAK.Co — Loyalty points table (Task 8, phase 1)
--
-- NOT run against the live database — written from a sandbox with no DB
-- access. Run manually in the Supabase SQL Editor.
--
-- Honesty about the security model: there's no real customer login in
-- this app, so customers are identified purely by phone number, and all
-- writes happen from the browser using the public anon key (same trust
-- level as the rest of this project — e.g. `orders` rows are also
-- inserted directly from the client). A technically motivated customer
-- could call adjust_loyalty_points() directly and inflate their own
-- balance. This is acceptable for a small local delivery business but
-- is NOT a real anti-fraud system — if that ever matters, points
-- adjustments need to move behind a server (e.g. a Supabase Edge
-- Function using the service role key) instead of being callable
-- straight from the client.

create table if not exists loyalty_points (
  phone text primary key,
  points integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table loyalty_points enable row level security;

create policy "Public can read loyalty balances"
  on loyalty_points for select
  using (true);

-- Atomic add/subtract — avoids a read-then-write race if a customer
-- somehow submits two orders at once. `p_delta` can be negative
-- (redemption) or positive (earned); the balance is clamped at 0 so a
-- concurrent redemption can't push it negative.
create or replace function adjust_loyalty_points(p_phone text, p_delta integer)
returns integer
language plpgsql
security definer
as $$
declare
  new_balance integer;
begin
  insert into loyalty_points (phone, points, updated_at)
  values (p_phone, greatest(p_delta, 0), now())
  on conflict (phone) do update
    set points = greatest(loyalty_points.points + p_delta, 0),
        updated_at = now()
  returning points into new_balance;

  return new_balance;
end;
$$;

grant execute on function adjust_loyalty_points(text, integer) to anon;

/**
 * RUJAK.Co — Order Validation Rules
 * Commerce rules only; no UI assumptions.
 */

export type DeliveryDateValidation = {
  valid: boolean;
  minDate: string;
  reason?: string;
};

export function validateTampahDeliveryDate(
  requestedDate: Date,
  now: Date = new Date(),
  preorderDays = 3,
): DeliveryDateValidation {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const min = new Date(today);
  min.setDate(min.getDate() + preorderDays);

  const requested = new Date(
    requestedDate.getFullYear(),
    requestedDate.getMonth(),
    requestedDate.getDate(),
  );

  const valid = requested >= min;
  return {
    valid,
    minDate: min.toISOString().slice(0, 10),
    ...(valid ? {} : { reason: `Tampah Nusantara wajib dipesan minimal H-${preorderDays}.` }),
  };
}

export function validateCustomBowlSelection(
  fruits: string[],
  sauce: string,
  allowedFruits: string[],
  allowedSauces: string[],
) {
  return {
    validFruit: fruits.length > 0 && fruits.every((fruit) => allowedFruits.includes(fruit)),
    validSauce: allowedSauces.includes(sauce),
  };
}

// === VOUCHERS ===
// Percentage-only for now (Task 7, phase 1) — `discount_percent` is a
// whole-number percentage (e.g. 10 = 10%). Fixed-amount vouchers can be
// added later as a sibling `discount_amount` field without breaking this
// shape, since `pickBestVoucher` below is the single place that decides
// which one wins.
export type Voucher = {
  code: string;
  discount_percent: number;
  valid_until: string; // ISO date/datetime string
  min_subtotal: number;
  is_active: boolean;
};

export type AppliedVoucher = {
  code: string;
  discountPercent: number;
  discountAmount: number;
};

/**
 * Picks the single best voucher for a given subtotal, mirroring Fore's
 * "1 voucher terbaik untukmu" pattern — auto-applied, no code entry.
 * A voucher qualifies if it's active, not expired, and the subtotal meets
 * its minimum. Among qualifying vouchers, the highest discount percentage
 * wins. Returns null if none qualify.
 */
export function pickBestVoucher(
  vouchers: Voucher[],
  subtotal: number,
  now: Date = new Date(),
): AppliedVoucher | null {
  const eligible = vouchers.filter(
    (v) => v.is_active && subtotal >= v.min_subtotal && new Date(v.valid_until) >= now,
  );
  if (eligible.length === 0) return null;

  const best = eligible.reduce((a, b) => (b.discount_percent > a.discount_percent ? b : a));
  return {
    code: best.code,
    discountPercent: best.discount_percent,
    // Whole-rupiah rounding — avoids a fractional-rupiah total that would
    // never match what the customer transfers via QRIS.
    discountAmount: Math.round((subtotal * best.discount_percent) / 100),
  };
}

// === LOYALTY POINTS ===
// Rates live in `loyaltyConfig` (client/src/data/products.ts) — kept here
// as pure functions so the earn/redeem math has one tested home, same
// pattern as the voucher and pre-order rules above.

export function calculatePointsEarned(subtotal: number, earnPointsPerRupiah: number): number {
  return Math.floor(subtotal * earnPointsPerRupiah);
}

export type RedemptionResult = {
  pointsRedeemed: number;
  redemptionValue: number;
};

/**
 * How many of the customer's points to redeem and for how much, given a
 * cap (the order total that's left to discount after any voucher). Redeems
 * the customer's *entire* balance by default (simplest UX: one toggle,
 * "pakai semua poin saya" — no partial-amount picker) — but never more
 * than fits the cap, and always in whole points so the redeemed value is
 * an exact multiple of `pointValueRupiah` (no fractional-rupiah totals).
 */
export function calculateRedemption(
  availablePoints: number,
  pointValueRupiah: number,
  minPointsToRedeem: number,
  maxRedeemableValue: number,
): RedemptionResult {
  if (availablePoints < minPointsToRedeem || maxRedeemableValue <= 0) {
    return { pointsRedeemed: 0, redemptionValue: 0 };
  }
  const maxPointsByValue = Math.floor(maxRedeemableValue / pointValueRupiah);
  const pointsRedeemed = Math.min(availablePoints, maxPointsByValue);
  return { pointsRedeemed, redemptionValue: pointsRedeemed * pointValueRupiah };
}

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

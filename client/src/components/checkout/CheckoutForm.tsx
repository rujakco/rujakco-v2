/*
 * RUJAK.Co — Checkout: Form Step (step 1 of 3)
 * Customer info, order summary, delivery section, notes, and the
 * "Lanjut ke Konfirmasi Pesanan" submit button.
 * Extracted from CheckoutEnhanced.tsx.
 */

import { AlertCircle, Phone, CalendarClock, Ticket, Star } from "lucide-react";
import { formatCurrency } from "@/data/products";
import type { CartItem } from "@/contexts/CartContext";
import type { AppliedVoucher, RedemptionResult } from "@/data/orderValidation";
import OrderSummary from "@/components/checkout/OrderSummary";
import DeliverySection from "@/components/checkout/DeliverySection";

interface CheckoutFormProps {
  items: CartItem[];
  error: string | null;
  isLoading: boolean;
  total: number;
  appliedVoucher?: AppliedVoucher | null;
  loyaltyBalance?: number;
  minPointsToRedeem?: number;
  redeemPoints?: boolean;
  setRedeemPoints?: (value: boolean) => void;
  redemption?: RedemptionResult;
  pointsEarned?: number;
  customerName: string;
  setCustomerName: (value: string) => void;
  customerPhone: string;
  setCustomerPhone: (value: string) => void;
  notes: string;
  setNotes: (value: string) => void;
  address: string;
  setAddress: (value: string) => void;
  qty: number;
  deliveryOption: string;
  onSelectDeliveryOption: (id: string) => void;
  onSubmit: () => void;
  // Pre-order (H-3) fields — only rendered when the cart contains a
  // product with `preorderDays` set (currently just Tampah Nusantara).
  preorderProductName?: string;
  preorderDays?: number;
  preorderMinDate?: string;
  deliveryDate?: string;
  setDeliveryDate?: (value: string) => void;
  deliveryDateError?: string;
}

export default function CheckoutForm({
  items,
  error,
  isLoading,
  total,
  appliedVoucher,
  loyaltyBalance,
  minPointsToRedeem,
  redeemPoints,
  setRedeemPoints,
  redemption,
  pointsEarned,
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  notes,
  setNotes,
  address,
  setAddress,
  qty,
  deliveryOption,
  onSelectDeliveryOption,
  onSubmit,
  preorderProductName,
  preorderDays,
  preorderMinDate,
  deliveryDate,
  setDeliveryDate,
  deliveryDateError,
}: CheckoutFormProps) {
  return (
    <>
      <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-chili/10 border border-chili/30 rounded-xl flex gap-2 text-sm text-chili">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <OrderSummary items={items} />

        {/* Auto-applied best voucher — Fore-style, no manual code entry */}
        {appliedVoucher && (
          <div className="mb-4 p-3 bg-mango/10 border border-mango/30 rounded-xl flex items-center gap-2 text-sm">
            <Ticket className="w-4 h-4 text-mango flex-shrink-0" />
            <span className="text-ink">
              Voucher <span className="font-semibold text-forest">{appliedVoucher.code}</span> diterapkan otomatis —
              hemat <span className="font-semibold text-forest">{formatCurrency(appliedVoucher.discountAmount)}</span>
            </span>
          </div>
        )}

        {/* Customer Name */}
        <div className="mb-4">
          <label className="flex items-center gap-2 text-sm font-medium text-ink mb-2">
            <Phone className="w-4 h-4 text-forest" />
            Nama Penerima
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Nama lengkap..."
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-xl border border-paper-border text-sm focus:outline-none focus:border-forest/50 focus:ring-2 focus:ring-forest/10 disabled:opacity-50"
          />
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label className="flex items-center gap-2 text-sm font-medium text-ink mb-2">
            <Phone className="w-4 h-4 text-forest" />
            Nomor HP (WhatsApp)
          </label>
          <input
            type="tel"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="08123456789"
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-xl border border-paper-border text-sm focus:outline-none focus:border-forest/50 focus:ring-2 focus:ring-forest/10 disabled:opacity-50"
          />
        </div>

        {/* Loyalty points — balance lookup is debounced on the phone
            number above, so this only appears once a plausible number is
            typed in. Redeem is a single all-or-nothing toggle, capped by
            calculateRedemption() so it can never make the total negative. */}
        {typeof loyaltyBalance === "number" && loyaltyBalance > 0 && setRedeemPoints && (
          <div className="mb-4 p-3 bg-forest/5 border border-forest/20 rounded-xl">
            <label className="flex items-start gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={!!redeemPoints}
                onChange={(e) => setRedeemPoints(e.target.checked)}
                disabled={isLoading || loyaltyBalance < (minPointsToRedeem ?? Infinity)}
                className="mt-0.5 w-4 h-4 accent-forest"
              />
              <span className="text-ink flex items-center gap-1.5">
                <Star className="w-4 h-4 text-forest flex-shrink-0" />
                Kamu punya <span className="font-semibold">{loyaltyBalance} poin</span>.
                {loyaltyBalance < (minPointsToRedeem ?? 0) ? (
                  <span className="text-ink-muted"> Minimal {minPointsToRedeem} poin untuk ditukar.</span>
                ) : redeemPoints && redemption ? (
                  <span className="font-semibold text-forest"> Pakai {redemption.pointsRedeemed} poin — hemat {formatCurrency(redemption.redemptionValue)}</span>
                ) : (
                  <span> Pakai semua poin untuk diskon?</span>
                )}
              </span>
            </label>
          </div>
        )}

        <DeliverySection
          address={address}
          setAddress={setAddress}
          isLoading={isLoading}
          qty={qty}
          deliveryOption={deliveryOption}
          onSelectDeliveryOption={onSelectDeliveryOption}
        />

        {/* Pre-order date (H-3) — only shown when cart has a pre-order item */}
        {preorderProductName && setDeliveryDate && (
          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm font-medium text-ink mb-2">
              <CalendarClock className="w-4 h-4 text-forest" />
              Tanggal Pengiriman {preorderProductName}
            </label>
            <input
              type="date"
              value={deliveryDate || ""}
              min={preorderMinDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              disabled={isLoading}
              className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 disabled:opacity-50 ${
                deliveryDateError ? "border-chili focus:border-chili focus:ring-chili/10" : "border-paper-border focus:border-forest/50 focus:ring-forest/10"
              }`}
            />
            {deliveryDateError ? (
              <p className="text-xs text-chili mt-2">{deliveryDateError}</p>
            ) : (
              <p className="text-xs text-ink-muted mt-2">
                Wajib pre-order minimal H-{preorderDays} ({preorderMinDate ? `mulai ${preorderMinDate}` : ""}).
              </p>
            )}
          </div>
        )}

        {/* Notes */}
        <div className="mb-4">
          <label className="flex items-center gap-2 text-sm font-medium text-ink mb-2">
            <Phone className="w-4 h-4 text-forest" />
            Catatan (Opsional)
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Alergi, preferensi khusus, dll."
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-xl border border-paper-border text-sm focus:outline-none focus:border-forest/50 focus:ring-2 focus:ring-forest/10 disabled:opacity-50"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-paper-border bg-paper">
        {appliedVoucher && (
          <div className="flex justify-between text-sm text-mango mb-1">
            <span>Diskon ({appliedVoucher.code})</span>
            <span>-{formatCurrency(appliedVoucher.discountAmount)}</span>
          </div>
        )}
        {redeemPoints && redemption && redemption.pointsRedeemed > 0 && (
          <div className="flex justify-between text-sm text-forest mb-1">
            <span>Poin dipakai ({redemption.pointsRedeemed})</span>
            <span>-{formatCurrency(redemption.redemptionValue)}</span>
          </div>
        )}
        <div className="flex justify-between text-base font-semibold mb-1">
          <span>Total</span>
          <span className="text-forest">{formatCurrency(total)}</span>
        </div>
        {typeof pointsEarned === "number" && pointsEarned > 0 && (
          <p className="text-xs text-ink-muted mb-3">Kamu akan dapat {pointsEarned} poin dari pesanan ini.</p>
        )}
        <button
          onClick={onSubmit}
          disabled={isLoading}
          className="w-full py-3 bg-forest text-white rounded-full font-semibold hover:bg-forest-light transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          Lanjut ke Konfirmasi Pesanan
        </button>
      </div>
    </>
  );
}

/*
 * RUJAK.Co — Checkout: Receipt Confirm & Upload Step (step 2 of 3)
 * Shows the struk preview (same markup captured to PNG) and, on confirm,
 * triggers receipt generation + best-effort upload to Supabase Storage
 * (handled by the parent's onConfirm — see CheckoutEnhanced's
 * handleConfirmOrder for the generation/upload/Telegram-notify logic).
 * Extracted from CheckoutEnhanced.tsx.
 */

import { Loader2 } from "lucide-react";
import ReceiptTemplate from "@/components/ReceiptTemplate";
import type { CartItem } from "@/contexts/CartContext";

const RECEIPT_ELEMENT_ID = "rujakco-receipt-template";
const RECEIPT_ELEMENT_ID_FALLBACK = "rujakco-receipt-template-fallback";

interface UploadReceiptProps {
  orderCode: string;
  accessPin: string;
  customerName: string;
  customerPhone: string;
  address: string;
  deliveryTime: string;
  preorderDeliveryDate?: string;
  notes: string;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  shippingLabel: string;
  total: number;
  haversineUsed: boolean;
  appliedVoucher?: { code: string; discountAmount: number } | null;
  loyalty?: { pointsEarned: number; pointsRedeemed: number; redemptionValue: number };
  isLoading: boolean;
  onBack: () => void;
  onConfirm: () => void;
}

export { RECEIPT_ELEMENT_ID, RECEIPT_ELEMENT_ID_FALLBACK };

export default function UploadReceipt({
  orderCode,
  accessPin,
  customerName,
  customerPhone,
  address,
  deliveryTime,
  preorderDeliveryDate,
  notes,
  items,
  subtotal,
  shippingCost,
  shippingLabel,
  total,
  haversineUsed,
  appliedVoucher,
  loyalty,
  isLoading,
  onBack,
  onConfirm,
}: UploadReceiptProps) {
  return (
    <>
      {/* Preview Struk — same markup that gets captured to PNG,
          just rendered inline instead of off-screen. */}
      <div className="px-6 py-4 max-h-[60vh] overflow-y-auto bg-paper">
        <ReceiptTemplate
          elementId={RECEIPT_ELEMENT_ID}
          orderCode={orderCode}
          pin={accessPin}
          customerName={customerName}
          customerPhone={customerPhone}
          customerAddress={address}
          deliveryTime={deliveryTime}
          preorderDeliveryDate={preorderDeliveryDate}
          notes={notes}
          items={items}
          subtotal={subtotal}
          shippingCost={shippingCost}
          shippingLabel={shippingLabel}
          total={total}
          haversineUsed={haversineUsed}
          appliedVoucher={appliedVoucher}
          loyalty={loyalty}
          visible
        />
      </div>
      {/* Off-screen text-only fallback, only used if the
          image-embedded capture above fails (CORS). */}
      <ReceiptTemplate
        elementId={RECEIPT_ELEMENT_ID_FALLBACK}
        orderCode={orderCode}
        pin={accessPin}
        customerName={customerName}
        customerPhone={customerPhone}
        customerAddress={address}
        deliveryTime={deliveryTime}
        preorderDeliveryDate={preorderDeliveryDate}
        notes={notes}
        items={items}
        subtotal={subtotal}
        shippingCost={shippingCost}
        shippingLabel={shippingLabel}
        total={total}
        haversineUsed={haversineUsed}
        appliedVoucher={appliedVoucher}
        loyalty={loyalty}
        includeImages={false}
      />
      <div className="px-6 py-4 border-t border-paper-border bg-paper flex gap-3">
        <button
          onClick={onBack}
          disabled={isLoading}
          className="flex-1 py-3 rounded-full border border-paper-border text-sm font-medium text-ink-muted hover:bg-white transition-all disabled:opacity-50"
        >
          Kembali
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="flex-1 py-3 bg-forest text-white rounded-full font-semibold hover:bg-forest-light transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Memproses...
            </>
          ) : (
            "Lanjut ke Pembayaran"
          )}
        </button>
      </div>
    </>
  );
}

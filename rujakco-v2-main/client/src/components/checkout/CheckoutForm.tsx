/*
 * RUJAK.Co — Checkout: Form Step (step 1 of 3)
 * Customer info, order summary, delivery section, notes, and the
 * "Lanjut ke Konfirmasi Pesanan" submit button.
 * Extracted from CheckoutEnhanced.tsx.
 */

import { AlertCircle, Phone } from "lucide-react";
import { formatCurrency } from "@/data/products";
import type { CartItem } from "@/contexts/CartContext";
import OrderSummary from "@/components/checkout/OrderSummary";
import DeliverySection from "@/components/checkout/DeliverySection";

interface CheckoutFormProps {
  items: CartItem[];
  error: string | null;
  isLoading: boolean;
  total: number;
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
}

export default function CheckoutForm({
  items,
  error,
  isLoading,
  total,
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
            className="w-full px-4 py-3 rounded-xl border border-[#E8E5E0] text-sm focus:outline-none focus:border-forest/50 focus:ring-2 focus:ring-forest/10 disabled:opacity-50"
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
            className="w-full px-4 py-3 rounded-xl border border-[#E8E5E0] text-sm focus:outline-none focus:border-forest/50 focus:ring-2 focus:ring-forest/10 disabled:opacity-50"
          />
        </div>

        <DeliverySection
          address={address}
          setAddress={setAddress}
          isLoading={isLoading}
          qty={qty}
          deliveryOption={deliveryOption}
          onSelectDeliveryOption={onSelectDeliveryOption}
        />

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
            className="w-full px-4 py-3 rounded-xl border border-[#E8E5E0] text-sm focus:outline-none focus:border-forest/50 focus:ring-2 focus:ring-forest/10 disabled:opacity-50"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-[#E8E5E0] bg-[#FEFDF8]">
        <div className="flex justify-between text-base font-semibold mb-4">
          <span>Total</span>
          <span className="text-forest">{formatCurrency(total)}</span>
        </div>
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

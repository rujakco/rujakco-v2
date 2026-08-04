/*
 * RUJAK.Co — Checkout: Delivery Section
 * Address input (with autocomplete + "use my location"), distance display,
 * and delivery method selection. Extracted from CheckoutEnhanced.tsx.
 */

import { MapPin, Clock, Loader2, LocateFixed } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/data/products";
import { homepageConfig } from "@/data/homepage";
import { calculateShipping } from "@/lib/shipping-utils";
import { useDelivery } from "@/contexts/DeliveryContext";
import AddressAutocomplete from "@/components/AddressAutocomplete";

// Each delivery option maps to a provider/tier that calculateShipping()
// actually understands. "ekspres" isn't its own pricing model — it's
// Lalamove's priority tier (faster ETA, +25% cost).
// Exported so CheckoutEnhanced can reuse the same mapping when computing
// the active shippingResult for the order total.
export const deliveryOptionToShipping: Record<
  string,
  { provider: "lalamove" | "paxel"; tier: "reguler" | "prioritas" }
> = {
  lalamove: { provider: "lalamove", tier: "reguler" },
  paxel: { provider: "paxel", tier: "reguler" },
  ekspres: { provider: "lalamove", tier: "prioritas" },
};

interface DeliverySectionProps {
  address: string;
  setAddress: (address: string) => void;
  isLoading: boolean;
  qty: number;
  deliveryOption: string;
  onSelectDeliveryOption: (id: string) => void;
}

export default function DeliverySection({
  address,
  setAddress,
  isLoading,
  qty,
  deliveryOption,
  onSelectDeliveryOption,
}: DeliverySectionProps) {
  const deliveryCtx = useDelivery();

  const handleUseMyLocation = async () => {
    const pos = await deliveryCtx.requestLocation();
    if (!pos) {
      toast.error("Tidak bisa mengambil lokasi. Isi alamat manual saja.");
      return;
    }
    await deliveryCtx.resolveDistance(pos.lat, pos.lon);
    toast.success("Jarak & ongkir diperbarui berdasarkan lokasimu.");
  };

  return (
    <>
      {/* Address */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="flex items-center gap-2 text-sm font-medium text-ink">
            <MapPin className="w-4 h-4 text-forest" />
            Alamat Pengantaran
          </label>
          <button
            type="button"
            onClick={handleUseMyLocation}
            disabled={isLoading || deliveryCtx.state.isLoadingLocation}
            className="flex items-center gap-1 text-xs font-medium text-forest hover:underline disabled:opacity-50"
          >
            {deliveryCtx.state.isLoadingLocation ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <LocateFixed className="w-3.5 h-3.5" />
            )}
            Pakai lokasi saya
          </button>
        </div>
        {/* District/address autocomplete — search-as-you-type, fills
            address + resolves distance/ongkir automatically */}
        <div className="mb-2">
          <AddressAutocomplete onSelect={(full) => setAddress(full)} />
        </div>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Masukkan alamat lengkap pengantaran..."
          disabled={isLoading}
          className="w-full px-4 py-3 rounded-xl border border-[#E8E5E0] text-sm focus:outline-none focus:border-forest/50 focus:ring-2 focus:ring-forest/10 resize-none disabled:opacity-50"
          rows={3}
        />
        {deliveryCtx.state.userDistance != null && (
          <p className="text-xs text-ink-muted mt-1">
            Jarak: {deliveryCtx.state.userDistance} km
            {deliveryCtx.state.haversineUsed ? " (estimasi garis lurus)" : ""}
          </p>
        )}
      </div>

      {/* Delivery */}
      <div className="mb-4">
        <label className="flex items-center gap-2 text-sm font-medium text-ink mb-2">
          <Clock className="w-4 h-4 text-forest" />
          Metode Pengantaran
        </label>
        <div className="space-y-2">
          {homepageConfig.delivery.options.map((opt) => {
            const mapping = deliveryOptionToShipping[opt.id] ?? deliveryOptionToShipping.lalamove;
            const optCost =
              deliveryCtx.state.userDistance != null
                ? calculateShipping(deliveryCtx.state.userDistance, qty, mapping.provider, mapping.tier).cost
                : null;
            return (
              <button
                key={opt.id}
                onClick={() => onSelectDeliveryOption(opt.id)}
                disabled={isLoading}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all disabled:opacity-50 ${
                  deliveryOption === opt.id
                    ? "border-forest bg-forest/5"
                    : "border-[#E8E5E0] hover:border-forest/30"
                }`}
              >
                <div>
                  <p className="text-sm font-medium text-ink">{opt.name}</p>
                  <p className="text-xs text-ink-muted">{opt.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{opt.eta}</p>
                  <p className="text-xs text-forest">
                    {optCost != null ? formatCurrency(optCost) : "Isi alamat dulu"}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

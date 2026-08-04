/*
 * RUJAK.Co — Commerce Layer: Checkout Modal
 * WhatsApp-based ordering flow. Collects delivery info, sends order to WhatsApp.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Clock, Phone } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency } from "@/data/products";
import { homepageConfig } from "@/data/homepage";
import { toast } from "sonner";

export default function Checkout() {
  const { state, setCheckout, clearCart } = useCart();
  const [address, setAddress] = useState("");
  const [deliveryOption, setDeliveryOption] = useState(homepageConfig.delivery.options[0].id);
  const [notes, setNotes] = useState("");

  if (!state.checkoutOpen) return null;

  const selectedDelivery = homepageConfig.delivery.options.find(
    (o) => o.id === deliveryOption
  );

  const subtotal = state.items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const delivery = homepageConfig.delivery.cost;
  const total = subtotal + delivery;

  const handleCheckout = () => {
    if (!address.trim()) {
      toast.error("Mohon isi alamat pengantaran");
      return;
    }

    // Build WhatsApp message
    const items = state.items
      .map((i) => `- ${i.product.name}${i.variant ? ` (${i.variant.label})` : ""} x${i.qty}${i.product.spiceLevel ? ` (Pedas ${i.spiceLevel}/5)` : ""}`)
      .join("\n");

    const message = `Halo RUJAK.Co! Saya ingin memesan:\n\n${items}\n\nAlamat: ${address}\nKurir: ${selectedDelivery?.name}\nCatatan: ${notes || "-"}\n\nTotal: ${formatCurrency(total)}`;

    const waUrl = `https://wa.me/${homepageConfig.contact.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");

    toast.success("Pesanan dikirim ke WhatsApp!");
    clearCart();
    setCheckout(false);
  };

  return (
    <AnimatePresence>
      {state.checkoutOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={() => setCheckout(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 top-1/2 -translate-y-1/2 z-50 w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E5E0]">
              <h2 className="font-display text-lg font-semibold text-ink">Checkout</h2>
              <button
                onClick={() => setCheckout(false)}
                className="p-2 rounded-full hover:bg-[#E8E5E0] transition-colors"
              >
                <X className="w-5 h-5 text-ink-muted" />
              </button>
            </div>

            <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
              {/* Order Summary */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-3">
                  Ringkasan Pesanan
                </h3>
                {state.items.map((item) => (
                  <div key={item.product.id} className="flex justify-between py-2 border-b border-[#E8E5E0] last:border-0">
                    <div>
                      <p className="text-sm font-medium text-ink">{item.product.name}</p>
                      <p className="text-xs text-ink-muted">x{item.qty} • Pedas {item.spiceLevel}/5</p>
                    </div>
                    <span className="text-sm font-semibold">{formatCurrency(item.product.price * item.qty)}</span>
                  </div>
                ))}
              </div>

              {/* Address */}
              <div className="mb-4">
                <label className="flex items-center gap-2 text-sm font-medium text-ink mb-2">
                  <MapPin className="w-4 h-4 text-forest" />
                  Alamat Pengantaran
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Masukkan alamat lengkap pengantaran..."
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E5E0] text-sm focus:outline-none focus:border-forest/50 focus:ring-2 focus:ring-forest/10 resize-none"
                  rows={3}
                />
              </div>

              {/* Delivery */}
              <div className="mb-4">
                <label className="flex items-center gap-2 text-sm font-medium text-ink mb-2">
                  <Clock className="w-4 h-4 text-forest" />
                  Metode Pengantaran
                </label>
                <div className="space-y-2">
                  {homepageConfig.delivery.options.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setDeliveryOption(opt.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all ${
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
                        <p className="text-xs text-forest">{formatCurrency(homepageConfig.delivery.cost)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="mb-4">
                <label className="flex items-center gap-2 text-sm font-medium text-ink mb-2">
                  <Phone className="w-4 h-4 text-forest" />
                  Catatan (Opsional)
                </label>
                <input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Alergi, preferensi khusus, dll."
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E5E0] text-sm focus:outline-none focus:border-forest/50 focus:ring-2 focus:ring-forest/10"
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
                onClick={handleCheckout}
                className="w-full py-3 bg-forest text-white rounded-full font-semibold hover:bg-forest-light transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Kirim Pesanan via WhatsApp
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

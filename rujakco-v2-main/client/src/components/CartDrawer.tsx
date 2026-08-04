/*
 * RUJAK.Co — Commerce Layer: Cart Drawer
 * Slide-in drawer with cart items, qty controls, subtotal.
 */

import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useDelivery } from "@/contexts/DeliveryContext";
import { formatCurrency } from "@/data/products";
import { homepageConfig } from "@/data/homepage";
import { calculateShipping } from "@/lib/shipping-utils";

export default function CartDrawer() {
  const { state, removeFromCart, updateQty, clearCart, toggleCart, setCheckout } = useCart();
  const deliveryCtx = useDelivery();

  if (!state.cartOpen) return null;

  // Mirror the same shipping math used at checkout so the total shown here
  // never disagrees with the total the customer sees next. Falls back to the
  // flat estimate until we know their distance (same fallback as checkout).
  const qty = state.items.reduce((s, i) => s + i.qty, 0);
  const shippingResult =
    deliveryCtx.state.userDistance != null
      ? calculateShipping(
          deliveryCtx.state.userDistance,
          qty,
          deliveryCtx.state.shippingProvider,
          deliveryCtx.state.tier
        )
      : null;
  const shippingCost = shippingResult?.cost ?? homepageConfig.delivery.cost;
  const isEstimate = shippingResult == null;

  return (
    <AnimatePresence>
      {state.cartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={() => toggleCart(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E5E0]">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-forest" />
                <h2 className="font-display text-lg font-semibold text-ink">Reservasi</h2>
                <span className="text-xs bg-forest/10 text-forest px-2 py-0.5 rounded-full font-medium">
                  {state.items.length} item
                </span>
              </div>
              <button
                onClick={() => toggleCart(false)}
                className="p-2 rounded-full hover:bg-[#E8E5E0] transition-colors"
                aria-label="Tutup keranjang"
              >
                <X className="w-5 h-5 text-ink-muted" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {state.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-12 h-12 text-[#E8E5E0] mb-4" />
                  <p className="text-ink-muted text-sm">Keranjang masih kosong</p>
                  <p className="text-ink-muted/60 text-xs mt-1">Tambah produk dari menu kami</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {state.items.map((item) => (
                    <div key={item.cartKey} className="flex gap-4 pb-4 border-b border-[#E8E5E0] last:border-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-sm font-semibold text-ink truncate">
                          {item.product.name}
                        </h3>
                        {item.variant && <p className="text-xs text-ink-muted mt-0.5">{item.variant.label}</p>}
                        {item.product.spiceLevel && <p className="text-xs text-ink-muted mt-0.5">Pedas Level {item.spiceLevel}/5</p>}
                        <p className="text-forest font-semibold text-sm mt-1">
                          {formatCurrency(item.product.price)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQty(item.cartKey, Math.max(1, item.qty - 1))}
                            className="w-7 h-7 rounded-full bg-[#E8E5E0] flex items-center justify-center hover:bg-forest/10 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-medium w-6 text-center">{item.qty}</span>
                          <button
                            onClick={() => updateQty(item.cartKey, item.qty + 1)}
                            className="w-7 h-7 rounded-full bg-[#E8E5E0] flex items-center justify-center hover:bg-forest/10 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.cartKey)}
                            className="ml-auto text-ink-muted hover:text-chili transition-colors"
                            aria-label={`Hapus ${item.product.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {state.items.length > 0 && (
              <div className="px-6 py-4 border-t border-[#E8E5E0] bg-[#FEFDF8]">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-ink-muted">Subtotal</span>
                  <span className="font-medium">{formatCurrency(
                    state.items.reduce((s, i) => s + i.product.price * i.qty, 0)
                  )}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-ink-muted">Pengantaran{isEstimate ? " (estimasi)" : ""}</span>
                  <span className="font-medium">{formatCurrency(shippingCost)}</span>
                </div>
                {isEstimate && (
                  <p className="text-xs text-ink-muted/70 mb-3">
                    Ongkir final dihitung di checkout berdasarkan jarak alamatmu.
                  </p>
                )}
                <div className="flex justify-between text-base font-semibold mb-4 mt-3">
                  <span className="text-ink">Total</span>
                  <span className="text-forest">
                    {formatCurrency(
                      state.items.reduce((s, i) => s + i.product.price * i.qty, 0) +
                      shippingCost
                    )}
                  </span>
                </div>
                <button
                  onClick={() => {
                    toggleCart(false);
                    setCheckout(true);
                  }}
                  className="w-full py-3 bg-forest text-white rounded-full font-semibold hover:bg-forest-light transition-all active:scale-[0.98]"
                >
                  Lanjut ke Checkout
                </button>
                <button
                  onClick={clearCart}
                  className="w-full py-2 text-xs text-ink-muted hover:text-chili transition-colors mt-2"
                >
                  Kosongkan keranjang
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

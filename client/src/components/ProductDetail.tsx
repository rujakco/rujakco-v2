/*
 * RUJAK.Co — Commerce Layer: Product Detail Modal
 * Full product detail with spice level selector, quantity control, and add-to-cart action.
 * Opens when clicking a product card from the grid.
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Flame, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency } from "@/data/products";
import type { Product, ProductVariant, CustomBowlSelection } from "@/contexts/CartContext";
import { toast } from "sonner";
import { validateCustomBowlSelection } from "@/data/orderValidation";

interface ProductDetailProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductDetail({ product, isOpen, onClose }: ProductDetailProps) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [spiceLevel, setSpiceLevel] = useState(product?.spiceLevel?.default || 3);
  const [variantId, setVariantId] = useState(product?.variants?.[0]?.id);
  const [selectedFruits, setSelectedFruits] = useState<string[]>([]);
  const [selectedSauce, setSelectedSauce] = useState<string | undefined>(undefined);

  // BUG FIX: this modal is kept mounted (see Products.tsx) and only
  // toggled via `isOpen`, so `useState(product?.foo)` above only runs
  // once on first mount — qty/spiceLevel/variantId from the previously
  // viewed product were leaking into the next product opened (wrong
  // default spice level highlighted, stale quantity, wrong variant
  // pre-selected). Re-sync whenever a different product is opened.
  useEffect(() => {
    if (!product) return;
    setQty(1);
    setSpiceLevel(product.spiceLevel?.default || 3);
    setVariantId(product.variants?.[0]?.id);
    setSelectedFruits([]);
    setSelectedSauce(undefined);
  }, [product]);

  if (!product) return null;

  const selectedVariant: ProductVariant | undefined = product.variants?.find((v) => v.id === variantId) || product.variants?.[0];

  const toggleFruit = (fruit: string) => {
    setSelectedFruits((prev) => (prev.includes(fruit) ? prev.filter((f) => f !== fruit) : [...prev, fruit]));
  };

  // Custom Bowl requires at least one fruit and exactly one sauce picked,
  // and both must be within the product's allowed lists — delegated to the
  // shared commerce rule in orderValidation.ts rather than re-implemented
  // here, so this stays in sync with anything else that validates a bowl
  // (e.g. a future server-side check).
  const customBowlCheck = product.customOptions
    ? validateCustomBowlSelection(selectedFruits, selectedSauce ?? "", product.customOptions.fruits, product.customOptions.sauces)
    : null;
  const isCustomBowlIncomplete = !!customBowlCheck && (!customBowlCheck.validFruit || !customBowlCheck.validSauce);

  const handleAddToCart = () => {
    if (isCustomBowlIncomplete) return;
    const customSelection: CustomBowlSelection | undefined = product.customOptions
      ? { fruits: selectedFruits, sauce: selectedSauce! }
      : undefined;
    addToCart(product, qty, spiceLevel, selectedVariant, customSelection);
    toast.success(`${product.name} ditambahkan ke reservasi`);
    onClose();
    setQty(1);
    setSpiceLevel(product.spiceLevel?.default || 3);
    setVariantId(product.variants?.[0]?.id);
    setSelectedFruits([]);
    setSelectedSauce(undefined);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 top-1/2 -translate-y-1/2 z-50 w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-paper-border sticky top-0 bg-white z-10">
              <h2 className="font-display text-lg font-semibold text-ink">Detail Produk</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-paper transition-colors"
              >
                <X className="w-5 h-5 text-ink-muted" />
              </button>
            </div>

            <div className="px-6 py-6">
              {/* Image */}
              <div className="mb-6">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-80 object-cover rounded-2xl"
                />
              </div>

              {/* Product Info */}
              <div className="mb-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs text-ink-muted uppercase tracking-wider mb-1">
                      {product.category}
                    </p>
                    <h3 className="font-display text-3xl font-semibold text-ink">
                      {product.name}
                    </h3>
                  </div>
                  {product.tag && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-forest/10 text-forest">
                      {product.tag.charAt(0).toUpperCase() + product.tag.slice(1)}
                    </span>
                  )}
                </div>
                <p className="text-ink-muted leading-relaxed mb-4">
                  {product.description}
                </p>
              </div>

              {/* Size / Variant Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-6 p-4 bg-cream rounded-xl">
                  <label className="text-sm font-medium text-ink mb-3 block">Ukuran</label>
                  <div className="grid grid-cols-2 gap-2">
                    {product.variants.map((variant) => (
                      <button key={variant.id} onClick={() => setVariantId(variant.id)} className={`px-4 py-3 rounded-xl border text-left transition-all ${variantId === variant.id ? "border-forest bg-forest/5" : "border-paper-border bg-white hover:border-forest/30"}`}>
                        <span className="block text-sm font-semibold text-ink">{variant.label}</span>
                        <span className="block text-xs text-forest mt-1">{formatCurrency(variant.price)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.ingredients && (
                <div className="mb-6 p-4 rounded-xl border border-paper-border">
                  <p className="text-sm font-medium text-ink mb-2">Isi</p>
                  <p className="text-sm text-ink-muted leading-relaxed">{product.ingredients.join(" · ")}</p>
                  {product.sauce && <p className="text-sm text-ink-muted mt-2"><span className="font-medium text-ink">Sambal/kuah:</span> {product.sauce}</p>}
                  {product.notes?.map((note) => <p key={note} className="text-xs text-ink-muted mt-2">• {note}</p>)}
                </div>
              )}

              {product.customOptions && (
                <div className="mb-6 p-4 rounded-xl border border-paper-border">
                  <label className="text-sm font-medium text-ink mb-1 block">
                    Pilih buah <span className="text-chili">*</span>
                  </label>
                  <p className="text-xs text-ink-muted mb-3">Boleh pilih lebih dari satu</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.customOptions.fruits.map((fruit) => {
                      const active = selectedFruits.includes(fruit);
                      return (
                        <button
                          key={fruit}
                          type="button"
                          onClick={() => toggleFruit(fruit)}
                          className={`px-3 py-2 rounded-full border text-sm transition-all ${
                            active ? "border-forest bg-forest/10 text-forest font-medium" : "border-paper-border bg-white text-ink hover:border-forest/30"
                          }`}
                        >
                          {fruit}
                        </button>
                      );
                    })}
                  </div>

                  <label className="text-sm font-medium text-ink mb-1 block">
                    Pilih sambal <span className="text-chili">*</span>
                  </label>
                  <p className="text-xs text-ink-muted mb-3">Pilih satu</p>
                  <div className="flex flex-wrap gap-2">
                    {product.customOptions.sauces.map((sauce) => {
                      const active = selectedSauce === sauce;
                      return (
                        <button
                          key={sauce}
                          type="button"
                          onClick={() => setSelectedSauce(sauce)}
                          className={`px-3 py-2 rounded-full border text-sm transition-all ${
                            active ? "border-forest bg-forest/10 text-forest font-medium" : "border-paper-border bg-white text-ink hover:border-forest/30"
                          }`}
                        >
                          {sauce}
                        </button>
                      );
                    })}
                  </div>

                  {product.customOptions.pricingNote && (
                    <p className="text-xs text-ink-muted mt-3">{product.customOptions.pricingNote}</p>
                  )}
                  {isCustomBowlIncomplete && (
                    <p className="text-xs text-chili mt-3">Pilih minimal 1 buah dan 1 sambal sebelum menambah ke reservasi.</p>
                  )}
                </div>
              )}

              {/* Spice Level Selector */}
              {product.spiceLevel && (
                <div className="mb-6 p-4 bg-cream rounded-xl">
                  <label className="flex items-center gap-2 text-sm font-medium text-ink mb-3">
                    <Flame className="w-4 h-4 text-chili" />
                    Tingkat Kepedasan
                  </label>
                  <div className="flex items-center gap-3">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <button
                        key={level}
                        onClick={() => setSpiceLevel(level)}
                        className={`w-10 h-10 rounded-full font-semibold text-sm transition-all ${
                          spiceLevel === level
                            ? "bg-chili text-white scale-110"
                            : "bg-white border border-paper-border text-ink hover:border-chili/50"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-ink-muted mt-3">
                    Level {spiceLevel}/5 - {spiceLevel <= 2 ? "Tidak pedas" : spiceLevel === 3 ? "Sedang" : "Sangat pedas"}
                  </p>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-6 p-4 bg-cream rounded-xl">
                <label className="text-sm font-medium text-ink mb-3 block">
                  Jumlah
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-10 h-10 rounded-full bg-white border border-paper-border flex items-center justify-center hover:border-forest/50 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-2xl font-semibold w-12 text-center">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-10 h-10 rounded-full bg-white border border-paper-border flex items-center justify-center hover:border-forest/50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Price and Add to Cart */}
              <div className="flex items-center justify-between p-4 bg-forest/5 rounded-xl mb-6">
                <div>
                  <p className="text-xs text-ink-muted mb-1">Total Harga</p>
                  <p className="font-display text-2xl font-semibold text-forest">
                    {formatCurrency((selectedVariant?.price ?? product.price) * qty)}
                  </p>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={isCustomBowlIncomplete}
                  className="flex items-center gap-2 px-6 py-3 bg-forest text-white rounded-full font-semibold hover:bg-forest-light transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Tambah ke Reservasi
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

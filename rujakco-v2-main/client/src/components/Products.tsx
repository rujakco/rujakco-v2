/*
 * RUJAK.Co — Commerce Layer: Products Section
 * Content from products.ts. Editorial product grid with richer presentation.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Flame, ShoppingCart, Sparkles } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { products, formatCurrency, getBadgeLabel, getProductsByFilter } from "@/data/products";
import type { Product } from "@/contexts/CartContext";
import { toast } from "sonner";
import ProductDetail from "./ProductDetail";

const badgeColors: Record<string, string> = {
  "best-seller": "bg-mango/15 text-mango",
  signature: "bg-forest/10 text-forest",
  sharing: "bg-purple-100 text-purple-700",
  limited: "bg-chili/10 text-chili",
  exclusive: "bg-yellow-100 text-yellow-700",
  new: "bg-emerald-100 text-emerald-700",
  trending: "bg-rose-100 text-rose-600",
};

function ProductCard({ product, index, onDetailClick }: { product: Product; index: number; onDetailClick: (product: Product) => void }) {
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart(product, 1, product.spiceLevel?.default || 3, product.variants?.[0]);
    toast.success(`${product.name} ditambahkan ke reservasi`);
  };

  const handleImageClick = () => {
    onDetailClick(product);
  };

  const isPremium = ["limited", "exclusive"].includes(product.tag);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.23, 1, 0.32, 1] }}
      className={`group relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
        isPremium
          ? "bg-gradient-to-br from-sage/60 to-sage/20 border border-forest/10 shadow-sm hover:shadow-xl hover:border-forest/20"
          : "bg-white border border-[#E8E5E0] hover:border-forest/20 hover:shadow-xl"
      }`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden cursor-pointer" onClick={handleImageClick}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.tag && (
          <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
            badgeColors[product.tag] || "bg-white/90 text-forest"
          }`}>
            {getBadgeLabel(product.tag)}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-ink-muted uppercase tracking-wider">{product.category}</p>
          {isPremium && <Sparkles className="w-3.5 h-3.5 text-mango" />}
        </div>
        <h3 className="font-display text-lg font-semibold text-ink mb-2 cursor-pointer hover:text-forest transition-colors" onClick={handleImageClick}>{product.name}</h3>
        <p className="text-sm text-ink-muted leading-relaxed mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Spice Level */}
        {product.spiceLevel && (
          <div className="flex items-center gap-1.5 mb-4">
            <Flame className="w-3.5 h-3.5 text-chili" />
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`w-2.5 h-2.5 rounded-full ${
                    level <= product.spiceLevel!.default ? "bg-chili" : "bg-[#E8E5E0]"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-ink-muted">
              {product.spiceLevel.default}/5
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E8E5E0]">
          <span className="font-display text-xl font-semibold text-forest">
            {product.variants && product.variants.length > 1
              ? `${formatCurrency(product.variants[0].price)} – ${formatCurrency(product.variants[product.variants.length - 1].price)}`
              : formatCurrency(product.variants?.[0]?.price ?? product.price)}
          </span>
          <button
            onClick={handleAdd}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 active:scale-95 ${
              isPremium
                ? "bg-forest text-white hover:bg-forest-light shadow-sm"
                : "bg-forest/5 text-forest hover:bg-forest hover:text-white border border-forest/15"
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Tambah
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Products() {
  const { state, setFilter } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const filter = state.filter;
  const filters = ["all", "rujak", "asinan", "salad"];
  const filtered = getProductsByFilter(filter);

  return (
    <section id="products" className="section-padding bg-cream">
      <div className="container">
        <div className="text-center mb-12">
          <p className="overline text-center mb-2">Menu Kami</p>
          <h2 className="font-display text-3xl lg:text-4xl font-medium text-ink mb-4">
            Asam, Pedas, Manis, Segar
          </h2>
          <p className="text-ink-muted max-w-lg mx-auto">
            Pilih favorit Anda dari {products.length} varian rujak dan asinan premium
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-10">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                filter === f
                  ? "bg-forest text-white shadow-md"
                  : "bg-white text-ink-soft border border-[#E8E5E0] hover:border-forest/30"
              }`}
            >
              {f === "all" ? "Semua" : f === "rujak" ? "Rujak" : f === "asinan" ? "Asinan" : "Salad"}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {filtered.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} onDetailClick={setSelectedProduct} />
          ))}
        </div>

        <ProductDetail
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      </div>
    </section>
  );
}

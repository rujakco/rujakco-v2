import { useState, useEffect, useMemo, useCallback } from "react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import CartDrawer from "@/components/CartDrawer";
import CheckoutEnhanced from "@/components/CheckoutEnhanced";
import Footer from "@/components/Footer";
import { products, formatCurrency, getProductById } from "@/data/products";
import { homepageConfig } from "@/data/homepage";
import { useCart } from "@/contexts/CartContext";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Plus,
  Bell,
  MessageCircle,
  ChevronRight,
  Blend,
  Users,
  Crown,
  Share2,
  Gift,
  ShieldCheck,
  Search,
  Coins,
  Store,
  Bike,
  Building2,
} from "lucide-react";

// Wrapper tanpa padding – padding diatur manual per elemen
const SECTION_WRAPPER = "w-[calc(100%-24px)] mx-3 md:max-w-2xl md:mx-auto";

const CATEGORIES = [ ... ] as const; // (tidak berubah)

// ... semua konstanta dan hook sama persis seperti sebelumnya ...

export default function Home() {
  // ... semua state dan fungsi sama ...

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-ink font-sans pb-[110px]">
      <Header />
      <main className="md:pt-24">
        {/* ============ HERO (tidak berubah) ============ */}
        {/* ... */}

        {/* GREETING CARD */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="show"
          className={`relative z-20 -mt-11 ${SECTION_WRAPPER} bg-white rounded-2xl shadow-[0_-4px_12px_rgba(0,0,0,0.04)] md:rounded-[20px] md:mt-4 md:shadow-sm px-3 py-4`}
        >
          {/* Konten greeting */}
          <div className="absolute top-5 right-3 ...">...</div>
          <div className="flex items-center justify-between gap-3 pt-4 pb-3">
            <h1 className="text-[17px] font-bold text-ink leading-tight">
              {isLoggedIn ? `Hai ${state.userName}!` : "Welcome to RUJAK.Co!"}
            </h1>
            ...
          </div>
          <div className="border-t border-dashed border-[#D0D0D0] my-3" />
          ...
        </motion.div>

        {/* PESAN SEKARANG – Pick Up & Delivery */}
        <section className={`${SECTION_WRAPPER} mt-7 mb-8`}>
          <h2 className="text-[17px] font-bold text-ink tracking-tight mb-3 px-3">
            Pesan Rujak Sekarang?
          </h2>
          <div className="grid grid-cols-2 gap-3 px-3">
            {quickActions.map((qa) => (
              <button
                key={qa.title}
                onClick={qa.onClick}
                className={`relative text-left rounded-2xl border ${qa.border} ${qa.bg} pl-3 pr-4 py-4 h-[130px] active:scale-[0.98] transition-transform overflow-hidden`}
              >
                {/* Ikon di kanan tetap */}
                <div className="absolute bottom-3 right-3 w-16 h-16 ...">...</div>
                <div className="relative z-10">
                  <p className={`text-[18px] font-bold ${qa.color} leading-tight`}>{qa.title}</p>
                  <p className={`text-[12px] ${qa.colorMuted} mt-1 pr-14 leading-snug`}>{qa.subtitle}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        <div className="h-2 bg-[#EDEDED] mt-6" />

        {/* SPESIAL UNTUKMU */}
        <section className={`${SECTION_WRAPPER} mt-7 mb-8`}>
          <h2 className="text-[19px] font-bold text-ink tracking-tight mb-3 px-3">
            Spesial Untukmu di RUJAK.Co
          </h2>
          <div className="grid grid-cols-2 gap-3 px-3">
            {featureGrid.map((f) => (
              <button
                key={f.key}
                onClick={f.onClick}
                className="relative flex flex-col items-center text-center overflow-hidden rounded-2xl border border-[#ECECEC] bg-white p-4 shadow-sm active:scale-[0.98] transition-transform"
              >
                {/* Ikon & teks fitur – posisinya center, tidak perlu sejajar kiri */}
                ...
              </button>
            ))}
          </div>
        </section>

        {/* PRODUK */}
        <section id="products" className="scroll-mt-24 mb-8">
          {/* Sticky search & kategori – pakai wrapper tanpa padding, tapi kontennya diberi px-3 */}
          <div className={`sticky top-0 z-20 bg-[#F5F5F5] ${SECTION_WRAPPER} pb-3 pt-1 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)]`}>
            <div className="px-3">
              <div className="relative mb-4">... search input ...</div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar">... kategori ...</div>
            </div>
          </div>

          {/* Daftar produk – wrapper tanpa padding, card produk pakai ml-3 dan pl-0 agar teks sejajar */}
          <div className={`${SECTION_WRAPPER} mt-4`}>
            <div className="px-3">
              {filteredProducts.length === 0 ? ... : (
                <div className="grid grid-cols-2 gap-3">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-[16px] border border-[#ECECEC] overflow-hidden shadow-sm ml-3 pl-0 pr-3 py-3"
                    >
                      <div className="h-[115px] bg-sage/30 relative">...</div>
                      <div className="pt-3">
                        <p className="font-bold text-[16px] text-ink truncate">{product.name}</p>
                        <p className="text-[14px] font-medium text-ink-muted mt-0.5 line-clamp-1">
                          {product.category}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-[16px] font-bold text-forest">
                            {formatCurrency(product.price)}
                          </span>
                          <button
                            onClick={() => { addToCart(product); toggleCart(true); }}
                            className="w-[34px] h-[34px] rounded-full bg-forest text-white flex items-center justify-center active:scale-90 transition-transform"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* BUTUH BANTUAN? */}
        <section className={`${SECTION_WRAPPER} mb-8`}>
          <div className="px-3">
            <h2 className="text-[19px] font-bold text-ink mb-3">Butuh Bantuan?</h2>
            <a href={waUrl} ...>...</a>
          </div>
        </section>

        {/* INFORMASI HALAL & KEMENTERIAN */}
        <div className={`${SECTION_WRAPPER} mt-6 mb-8`}>
          <div className="px-3">
            <a href="#" ...>...</a>
            <div className="flex items-start gap-3 py-3 border-t border-gray-200">...</div>
          </div>
        </div>
      </main>

      <Footer />
      <BottomNav />
      <CartDrawer />
      <CheckoutEnhanced />
    </div>
  );
}
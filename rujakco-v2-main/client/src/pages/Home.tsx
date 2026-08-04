import React, { useState } from "react";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import CheckoutEnhanced from "@/components/CheckoutEnhanced";
import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { Sparkles, ArrowRight, ShieldCheck, Truck, Clock, Heart, Star } from "lucide-react";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const { addToCart, toggleCart } = useCart();

  const categories = [
    { id: "all", label: "Semua Menu" },
    { id: "rujak", label: "Rujak Buah Segar" },
    { id: "tampah", label: "Tampah Nusantara" },
    { id: "drink", label: "Artisan Drinks" },
  ];

  const filteredProducts = activeCategory === "all" 
    ? products 
    : products.filter(p => p.category === activeCategory || activeCategory === "rujak");

  return (
    <div className="min-h-screen bg-[#072d25] text-[#faf8f5] selection:bg-[#2e6f5d] selection:text-white font-sans">
      {/* Header Navigasi */}
      <Header />

      {/* Hero Section dengan Nuansa Contemporary Tropical Editorial */}
      <section className="relative pt-8 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#114b3e] text-[#a3e6cb] text-xs font-medium tracking-wide mb-4 border border-[#1f6353]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Contemporary Tropical Editorial</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#faf8f5] mb-4">
            Rasa Indonesia. <br />
            <span className="text-[#a3e6cb] font-serif italic font-normal">Disajikan dengan cara yang modern.</span>
          </h1>
          <p className="text-[#d1cdc7] text-sm md:text-base">
            Pengalaman menikmati buah segar dan bumbu rujak autentik nusantara dalam balutan estetika modern yang bersih dan berkelas.
          </p>
        </div>

        {/* Pill Tabs Navigasi Kategori (Inspirasi UI Modern) */}
        <div className="flex justify-center gap-2 md:gap-3 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                activeCategory === cat.id
                  ? "bg-[#faf8f5] text-[#072d25] shadow-lg scale-105 font-semibold"
                  : "bg-[#0f3d32] text-[#d1cdc7] hover:bg-[#165243] border border-[#19594a]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Showcase Utama: Floating Card ala Referensi UI */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#0b382e] p-6 md:p-10 rounded-3xl border border-[#165243] shadow-2xl relative overflow-hidden">
          
          {/* Kolom Visual / Gambar Produk */}
          <div className="lg:col-span-7 relative flex justify-center items-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#072d25]/50 to-transparent rounded-2xl pointer-events-none" />
            <div className="relative w-full max-w-md h-[380px] md:h-[420px] rounded-2xl overflow-hidden shadow-xl border border-[#1b5e4f] bg-[#09332a]">
              <img
                src={selectedProduct.image || "/assets/products/rujak-gaco-hd.webp"}
                alt={selectedProduct.name}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 bg-[#072d25]/80 backdrop-blur-md px-3 py-1 rounded-full text-xs text-[#a3e6cb] border border-[#1f6353]">
                {selectedProduct.category || "Fresh & Authentic"}
              </div>
            </div>
          </div>

          {/* Kolom Informasi / Floating Card Content (Ivory/White Card) */}
          <div className="lg:col-span-5 bg-[#faf8f5] text-[#1c1917] p-6 md:p-8 rounded-2xl shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#2e6f5d]">
                  Signature Selection
                </span>
                <button className="text-stone-400 hover:text-red-500 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-[#072d25] mb-2">
                {selectedProduct.name}
              </h2>

              <div className="text-xl md:text-2xl font-bold text-[#2e6f5d] mb-4">
                Rp {selectedProduct.price?.toLocaleString("id-ID") || "75.000"}
              </div>

              <p className="text-stone-600 text-sm leading-relaxed mb-6">
                {selectedProduct.description || "Dibuat dari pilihan buah tropis segar harian disandingkan dengan racikan sambal rahasia warisan Nusantara yang menggugah selera."}
              </p>

              {/* Lapisan Cerita Nusantara (Subtle Storytelling) */}
              <div className="bg-stone-100 p-3.5 rounded-xl border border-stone-200 mb-6 text-xs text-stone-600">
                <span className="font-semibold text-[#072d25] block mb-1">🌿 Cerita di Balik Rasa:</span>
                Buah dipetik langsung dari petani lokal pilihan dengan tingkat kematangan optimal untuk menghasilkan sensasi segar maksimal.
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  addToCart(selectedProduct);
                  toggleCart(true);
                }}
                className="w-full py-3.5 px-6 rounded-xl bg-[#072d25] text-white font-medium hover:bg-[#0b4237] transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Pesan Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Carousel / Daftar Pilihan Menu Lainnya */}
        <div className="mt-16">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h3 className="text-xl font-bold text-[#faf8f5]">Pilihan Menu Lainnya</h3>
              <p className="text-xs text-[#d1cdc7]">Eksplorasi ragam kesegaran tropis khas RUJAK.Co</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className={`cursor-pointer bg-[#0b382e] p-4 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
                  selectedProduct.id === product.id
                    ? "border-[#a3e6cb] shadow-lg ring-2 ring-[#a3e6cb]/20"
                    : "border-[#165243] hover:border-[#1f6353]"
                }`}
              >
                <div className="h-36 rounded-xl overflow-hidden mb-3 bg-[#072d25]">
                  <img
                    src={product.image || "/assets/products/rujak-gaco-thumb.webp"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-semibold text-sm text-[#faf8f5] truncate">{product.name}</h4>
                <p className="text-xs text-[#a3e6cb] mt-1 font-medium">
                  Rp {product.price?.toLocaleString("id-ID")}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Keunggulan Layanan (Trust Badges) */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-[#165243]">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#0b382e]/50 border border-[#165243]">
            <div className="p-3 rounded-xl bg-[#114b3e] text-[#a3e6cb]">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-semibold text-sm text-[#faf8f5]">Freshly Made Daily</h5>
              <p className="text-xs text-[#d1cdc7]">Diracik langsung setiap hari setelah pesanan masuk.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#0b382e]/50 border border-[#165243]">
            <div className="p-3 rounded-xl bg-[#114b3e] text-[#a3e6cb]">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-semibold text-sm text-[#faf8f5]">Pengiriman Cepat</h5>
              <p className="text-xs text-[#d1cdc7]">Menjaga kesegaran buah sampai di tangan Anda.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#0b382e]/50 border border-[#165243]">
            <div className="p-3 rounded-xl bg-[#114b3e] text-[#a3e6cb]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-semibold text-sm text-[#faf8f5]">100% Buah Lokal Pilihan</h5>
              <p className="text-xs text-[#d1cdc7]">Mendukung petani buah nusantara berkualitas tinggi.</p>
            </div>
          </div>
        </div>

      </section>

      {/* Cart Drawer & Checkout Modals */}
      <CartDrawer />
      <CheckoutEnhanced />
    </div>
  );
}

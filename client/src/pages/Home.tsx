import { useState } from "react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import CartDrawer from "@/components/CartDrawer";
import CheckoutEnhanced from "@/components/CheckoutEnhanced";
import { products, formatCurrency } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useLocation } from "wouter";
import {
  Sparkles,
  Truck,
  Clock,
  ShieldCheck,
  ChefHat,
  Gift,
  Users,
  Share2,
  PackageSearch,
  Plus,
} from "lucide-react";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");
  const { addToCart, toggleCart, state } = useCart();
  const [, navigate] = useLocation();
  const userName = state.userName && state.userName !== "Tamu" ? state.userName : null;

  const categories = [
    { id: "all", label: "Semua" },
    { id: "rujak", label: "Rujak Buah" },
    { id: "asinan", label: "Asinan" },
    { id: "salad", label: "Salad Buah" },
  ];

  const filteredProducts =
    activeCategory === "all" ? products : products.filter((p) => p.type === activeCategory);

  const featureGrid = [
    {
      icon: ChefHat,
      title: "Custom Bowl",
      subtitle: "Racik bowl rujakmu sendiri",
      onClick: () => {
        const product = products.find((p) => p.id === "custom-bowl");
        if (product) {
          addToCart(product);
          toggleCart(true);
        }
      },
    },
    {
      icon: Users,
      title: "Tampah Nusantara",
      subtitle: "Untuk acara & momen bersama",
      onClick: () => {
        const product = products.find((p) => p.id === "tampah-nusantara");
        if (product) {
          addToCart(product);
          toggleCart(true);
        }
      },
    },
    {
      icon: Share2,
      title: "RUJAKferral",
      subtitle: "Bagikan kode, dapatkan hadiah",
      onClick: () => {},
    },
    {
      icon: Gift,
      title: "RUJAK.Gift",
      subtitle: "Kirim kesegaran ke orang terdekat",
      onClick: () => {},
    },
  ];

  return (
    <div className="min-h-screen bg-cream text-ink font-sans pb-24">
      <Header />

      <main className="pt-20 md:pt-24 max-w-md md:max-w-2xl mx-auto px-4">
        {/* Hero banner ala carousel promo Fore */}
        <section className="mt-2 mb-4">
          <div className="relative rounded-3xl overflow-hidden bg-forest text-white p-6 min-h-[168px] flex flex-col justify-center shadow-sm">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_top_right,white,transparent_60%)]" />
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-wide uppercase text-mango mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Fresh Setiap Hari
              </span>
              <h1 className="font-display text-2xl font-semibold leading-tight mb-1">
                Rujak &amp; asinan buah segar,
                <br />
                diracik saat kamu pesan.
              </h1>
              <p className="text-sm text-white/80">100% buah lokal pilihan, sambal khas Nusantara.</p>
            </div>
          </div>
        </section>

        {/* Greeting card */}
        <section className="mb-6">
          <div className="bg-white rounded-2xl border border-paper-border p-5 shadow-sm">
            <p className="font-display text-lg font-medium text-ink">
              {userName ? `Hai, ${userName}!` : "Selamat datang!"}
            </p>
            <p className="text-sm text-ink-muted mt-0.5">Mau rujak segar yang mana hari ini?</p>
          </div>
        </section>

        {/* Quick actions ala Pick Up / Delivery Fore */}
        <section className="mb-8">
          <h2 className="font-display text-base font-semibold text-ink mb-3">Pesan RUJAK.Co Sekarang?</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
              className="text-left rounded-2xl border border-sage bg-sage/20 p-4 hover:bg-sage/30 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-forest/10 flex items-center justify-center mb-3">
                <Truck className="w-4.5 h-4.5 text-forest" />
              </div>
              <p className="font-semibold text-sm text-ink">Antar ke Rumah</p>
              <p className="text-xs text-ink-muted mt-0.5">Diantar segar &amp; tepat waktu</p>
            </button>
            <button
              onClick={() => navigate("/lacak")}
              className="text-left rounded-2xl border border-paper-border bg-white p-4 hover:bg-paper transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-mango/15 flex items-center justify-center mb-3">
                <PackageSearch className="w-4.5 h-4.5 text-mango" />
              </div>
              <p className="font-semibold text-sm text-ink">Lacak Pesanan</p>
              <p className="text-xs text-ink-muted mt-0.5">Cek status pesananmu</p>
            </button>
          </div>
        </section>

        {/* Spesial Untukmu — feature grid ala Fore */}
        <section className="mb-8">
          <h2 className="font-display text-base font-semibold text-ink mb-3">Spesial Untukmu di RUJAK.Co</h2>
          <div className="grid grid-cols-2 gap-3">
            {featureGrid.map((f) => {
              const Icon = f.icon;
              return (
                <button
                  key={f.title}
                  onClick={f.onClick}
                  className="text-left rounded-2xl border border-paper-border bg-white p-4 hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <div className="w-9 h-9 rounded-full bg-forest/10 flex items-center justify-center mb-3">
                    <Icon className="w-4.5 h-4.5 text-forest" />
                  </div>
                  <p className="font-semibold text-sm text-ink leading-snug">{f.title}</p>
                  <p className="text-xs text-ink-muted mt-0.5 leading-snug">{f.subtitle}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Kategori pill tabs */}
        <section id="products" className="scroll-mt-24">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-base font-semibold text-ink">Menu RUJAK.Co</h2>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-3 mb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? "bg-forest text-white shadow-sm"
                    : "bg-white text-ink-soft border border-paper-border"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Product grid ala kartu Fore */}
          <div className="grid grid-cols-2 gap-3 mt-3 mb-10">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-paper-border overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-28 bg-sage/30">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-3">
                  <p className="font-medium text-sm text-ink truncate">{product.name}</p>
                  <p className="text-xs text-ink-muted mt-0.5 line-clamp-1">{product.category}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-semibold text-forest">{formatCurrency(product.price)}</span>
                    <button
                      onClick={() => {
                        addToCart(product);
                        toggleCart(true);
                      }}
                      aria-label={`Tambah ${product.name} ke keranjang`}
                      className="w-7 h-7 rounded-full bg-forest text-white flex items-center justify-center hover:bg-forest-light transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trust badges */}
        <section className="grid grid-cols-1 gap-3 pb-6">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-paper-border">
            <div className="w-10 h-10 rounded-xl bg-sage/40 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-forest" />
            </div>
            <div>
              <p className="font-semibold text-sm text-ink">Freshly Made Daily</p>
              <p className="text-xs text-ink-muted">Diracik langsung setelah pesanan masuk.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-paper-border">
            <div className="w-10 h-10 rounded-xl bg-sage/40 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-forest" />
            </div>
            <div>
              <p className="font-semibold text-sm text-ink">100% Buah Lokal Pilihan</p>
              <p className="text-xs text-ink-muted">Mendukung petani buah nusantara berkualitas tinggi.</p>
            </div>
          </div>
        </section>
      </main>

      <BottomNav />
      <CartDrawer />
      <CheckoutEnhanced />
    </div>
  );
}

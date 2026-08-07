import { useState, useEffect, useMemo, useCallback } from "react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import CartDrawer from "@/components/CartDrawer";
import CheckoutEnhanced from "@/components/CheckoutEnhanced";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import { products, formatCurrency, getProductById } from "@/data/products";
import { homepageConfig } from "@/data/homepage";
import { useCart } from "@/contexts/CartContext";
import { motion, Variants } from "framer-motion";
import {
  ShieldCheck,
  Clock,
  Plus,
  Bell,
  MessageCircle,
  ChevronRight,
  Coins,
  Star,
  Flame,
  Salad,
  Blend,
  Users,
  Gift,
  Share2,
} from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "Semua" },
  { id: "rujak", label: "Rujak Buah" },
  { id: "asinan", label: "Asinan" },
  { id: "salad", label: "Salad Buah" },
] as const;

// Single, gentle fade — used once on initial mount only. No stagger, no bounce.
const fadeIn: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const heroSlides = [
  { image: getProductById("rujak-segar")?.image, alt: "Rujak Segar", duration: 4000 },
  { image: getProductById("rujak-gaco")?.image, alt: "Rujak Gaco", duration: 4000 },
  { image: getProductById("tampah-nusantara")?.image, alt: "Tampah Nusantara", duration: 4000 },
] as const;

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [heroIndex, setHeroIndex] = useState(0);
  const { addToCart, toggleCart, state } = useCart();
  const userName = state.userName && state.userName !== "Tamu" ? state.userName : null;

  useEffect(() => {
    const id = window.setInterval(
      () => setHeroIndex((i) => (i + 1) % heroSlides.length),
      heroSlides[heroIndex].duration
    );
    return () => window.clearInterval(id);
  }, [heroIndex]);

  const scrollToProducts = useCallback(() => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const featureGrid = useMemo(
    () => [
      {
        icon: Blend,
        title: "Custom Bowl",
        subtitle: "Racik sesuai seleramu",
        iconBg: "bg-mango/10",
        iconColor: "text-mango",
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
        title: "Tampah Rujak",
        subtitle: "Pas untuk 8-10 orang",
        iconBg: "bg-forest/10",
        iconColor: "text-forest",
        badge: "Baru",
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
        subtitle: "Bagi kode, dapat saldo",
        iconBg: "bg-chili/10",
        iconColor: "text-chili",
        onClick: () => {},
      },
      {
        icon: Gift,
        title: "RUJAK.Gift",
        subtitle: "Kirim ke orang spesial",
        iconBg: "bg-sage/40",
        iconColor: "text-forest",
        onClick: () => {},
      },
    ],
    [addToCart, toggleCart]
  );

  const filteredProducts = useMemo(
    () => (activeCategory === "all" ? products : products.filter((p) => p.type === activeCategory)),
    [activeCategory]
  );

  const bestSellers = products.slice(0, 3);
  const waUrl = homepageConfig.social.whatsapp.url + "?text=" + encodeURIComponent("Halo RUJAK.Co, saya butuh bantuan.");

  return (
    <div className="min-h-screen bg-[#F7F7F7] text-ink font-sans pb-[110px]">
      <Header />

      <main className="md:pt-24">
        {/* ============ HERO — 300px, no text overlay, product-first ============ */}
        <section id="hero" className="relative w-full">
          <div className="relative w-full h-[300px] overflow-hidden bg-sage/30 rounded-b-[28px] md:max-w-2xl md:mx-auto md:rounded-[28px]">
            {heroSlides.map((slide, i) => (
              <img
                key={i}
                src={slide.image}
                alt={slide.alt}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                style={{ opacity: i === heroIndex ? 1 : 0 }}
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "auto"}
                decoding="async"
              />
            ))}

            {/* Notification bell — static, no ring animation, no heavy blur */}
            <button
              type="button"
              aria-label="Notifikasi"
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/35 flex items-center justify-center text-white"
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-chili text-white text-[9px] font-bold flex items-center justify-center border border-white/80">
                2
              </span>
            </button>

            {/* Dot indicator — 2px-ish small dots, not a progress bar */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
              {heroSlides.map((_, i) => (
                <span
                  key={i}
                  className={`rounded-full transition-all ${
                    i === heroIndex ? "w-1.5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Greeting card — thin, near-flat, -84px overlap */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="show"
            className="relative z-20 -mt-[84px] max-w-md md:max-w-2xl mx-auto px-4"
          >
            <div className="bg-white rounded-[20px] border border-[#ECECEC] px-[22px] py-[18px] shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[21px] font-[800] tracking-[-0.02em] text-ink leading-tight">
                    {userName ? `Hai ${userName}!` : "Hai Rujakers!"}
                  </p>
                  <p className="text-[13px] text-ink-muted mt-0.5 font-medium">
                    Kumpulkan poin & nikmati kesegarannya.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sage/40 text-[12px] font-bold text-forest shrink-0">
                  <Coins className="w-3.5 h-3.5" /> 120 Poin
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <div className="max-w-md md:max-w-2xl mx-auto px-4">
          {/* ============ Quick Action — Pesan Sekarang, 116px ============ */}
          <section className="mt-6 mb-8">
            <h2 className="text-[16px] font-bold text-ink tracking-tight mb-3">Pesan Sekarang</h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={scrollToProducts}
                className="relative text-left rounded-[16px] border border-[#ECECEC] bg-[#F2F6ED] p-4 h-[116px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] active:scale-[0.98] transition-transform"
              >
                <Salad className="absolute bottom-3 right-3 w-10 h-10 text-forest/25" strokeWidth={1.5} />
                <div className="relative z-10">
                  <p className="font-bold text-[15px] text-forest tracking-tight leading-tight">Rujak Segar</p>
                  <p className="text-[12px] font-medium text-forest/60 mt-1">Ambil di store</p>
                </div>
              </button>

              <button
                type="button"
                onClick={scrollToProducts}
                className="relative text-left rounded-[16px] border border-[#ECECEC] bg-[#FDF4EA] p-4 h-[116px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] active:scale-[0.98] transition-transform"
              >
                <Blend className="absolute bottom-3 right-3 w-10 h-10 text-mango/30" strokeWidth={1.5} />
                <div className="relative z-10">
                  <p className="font-bold text-[15px] text-mango tracking-tight leading-tight">Racik Sendiri</p>
                  <p className="text-[12px] font-medium text-mango/70 mt-1">Custom bowl</p>
                </div>
              </button>
            </div>
          </section>

          {/* ============ Best Seller ============ */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[16px] font-bold text-ink tracking-tight">Paling Disukai</h2>
              <span className="text-[13px] font-semibold text-forest">Lihat Semua</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4">
              {bestSellers.map((product) => (
                <div
                  key={`best-${product.id}`}
                  className="min-w-[150px] bg-white rounded-[18px] border border-[#ECECEC] shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden shrink-0"
                >
                  <div className="h-[120px] bg-sage/20 relative">
                    <div className="absolute top-2 left-2">
                      <span className="bg-white/90 px-2 py-0.5 rounded-full text-[10px] font-bold text-chili flex items-center gap-0.5">
                        <Flame className="w-3 h-3" /> Bestseller
                      </span>
                    </div>
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="p-3.5">
                    <p className="font-bold text-[13.5px] text-ink truncate">{product.name}</p>
                    <div className="flex items-center gap-1 mt-1 text-ink-muted">
                      <Star className="w-3 h-3 fill-mango text-mango" />
                      <span className="text-[11px] font-medium">4.9 • 2.3rb terjual</span>
                    </div>
                    <p className="text-[13.5px] font-bold text-forest mt-2">{formatCurrency(product.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ============ Menu ============ */}
          <section id="products" className="scroll-mt-24 mb-10">
            <h2 className="text-[16px] font-bold text-ink tracking-tight mb-3">Eksplor Menu</h2>
            <div className="flex gap-2 overflow-x-auto pb-3 mb-1 no-scrollbar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-[13px] font-semibold whitespace-nowrap transition-colors ${
                    activeCategory === cat.id
                      ? "bg-forest text-white"
                      : "bg-white text-ink-soft border border-[#ECECEC]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 mt-2">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-[18px] border border-[#ECECEC] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                >
                  <div className="h-[140px] bg-sage/30 relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 right-2">
                      <span className="bg-black/55 px-1.5 py-0.5 rounded-md text-[10px] font-medium text-white flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-mango text-mango" /> 4.9
                      </span>
                    </div>
                  </div>
                  <div className="p-3.5">
                    <p className="font-bold text-[13.5px] text-ink truncate">{product.name}</p>
                    <p className="text-[11.5px] font-medium text-ink-muted mt-0.5 line-clamp-1">{product.category}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-[14px] font-bold text-forest">{formatCurrency(product.price)}</span>
                      <button
                        type="button"
                        onClick={() => {
                          addToCart(product);
                          toggleCart(true);
                        }}
                        aria-label={`Tambah ${product.name}`}
                        className="w-8 h-8 rounded-full bg-forest text-white flex items-center justify-center active:scale-90 transition-transform"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ============ Feature Grid — 16 radius, 22 padding, 56px icon ============ */}
          <section className="mb-10">
            <h2 className="text-[16px] font-bold text-ink tracking-tight mb-3">Spesial di RUJAK.Co</h2>
            <div className="grid grid-cols-2 gap-3">
              {featureGrid.map((f) => (
                <button
                  key={f.title}
                  type="button"
                  onClick={f.onClick}
                  className="relative text-left rounded-[16px] border border-[#ECECEC] bg-white p-[22px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] active:scale-[0.98] transition-transform"
                >
                  {f.badge && (
                    <span className="absolute top-3 right-3 h-5 px-2 rounded-full bg-chili text-white text-[10px] font-bold flex items-center justify-center">
                      {f.badge}
                    </span>
                  )}
                  <div className={`w-14 h-14 rounded-full ${f.iconBg} flex items-center justify-center mb-3`}>
                    <f.icon className={`w-6 h-6 ${f.iconColor}`} strokeWidth={2} />
                  </div>
                  <p className="font-bold text-[15px] text-ink leading-snug tracking-tight">{f.title}</p>
                  <p className="text-[12.5px] font-medium text-ink-muted mt-0.5 leading-snug">{f.subtitle}</p>
                </button>
              ))}
            </div>
          </section>

          {/* ============ Trust rows ============ */}
          <section className="grid grid-cols-1 gap-3 mb-8">
            <div className="flex items-center gap-3.5 p-4 rounded-[16px] bg-white border border-[#ECECEC] shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
              <div className="w-11 h-11 rounded-full bg-sage/40 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-forest" />
              </div>
              <div>
                <p className="font-bold text-[14px] text-ink">Freshly Made Daily</p>
                <p className="text-[12.5px] font-medium text-ink-muted mt-0.5">Diracik langsung setelah pesanan masuk.</p>
              </div>
            </div>
            <div className="flex items-center gap-3.5 p-4 rounded-[16px] bg-white border border-[#ECECEC] shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
              <div className="w-11 h-11 rounded-full bg-sage/40 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-forest" />
              </div>
              <div>
                <p className="font-bold text-[14px] text-ink">100% Buah Lokal Pilihan</p>
                <p className="text-[12.5px] font-medium text-ink-muted mt-0.5">Mendukung petani buah nusantara berkualitas.</p>
              </div>
            </div>
          </section>

          {/* ============ Butuh Bantuan? ============ */}
          <section className="mb-6">
            <h2 className="text-[16px] font-bold text-ink tracking-tight mb-3">Butuh Bantuan?</h2>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3.5 p-4 rounded-[16px] bg-white border border-[#ECECEC] shadow-[0_2px_8px_rgba(0,0,0,0.06)] active:scale-[0.98] transition-transform"
            >
              <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center shrink-0">
                <MessageCircle className="w-4.5 h-4.5 text-[#25D366]" strokeWidth={2} />
              </div>
              <p className="flex-1 font-bold text-[13.5px] text-ink">RUJAK.Co Customer Service</p>
              <ChevronRight className="w-4.5 h-4.5 text-ink-muted shrink-0" />
            </a>
          </section>
        </div>

        <FAQ />
        <Footer />
      </main>

      <BottomNav />
      <CartDrawer />
      <CheckoutEnhanced />
    </div>
  );
}

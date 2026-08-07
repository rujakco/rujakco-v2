import { useState, useEffect, useMemo, useCallback } from "react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import CartDrawer from "@/components/CartDrawer";
import CheckoutEnhanced from "@/components/CheckoutEnhanced";
import Footer from "@/components/Footer";
import { products, formatCurrency } from "@/data/products";
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
  Gift,
  ShieldCheck,
  Search,
  Coins,
} from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "Semua" },
  { id: "rujak", label: "Rujak Buah" },
  { id: "asinan", label: "Asinan" },
  { id: "salad", label: "Salad Buah" },
] as const;

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

// Full-bleed banner images — text/badges are baked into the image itself,
// matching the reference (image carries the promo copy, not an overlay).
const heroSlides = [
  {
    image: "/images/rujak-segar-banner.png",
    alt: "Diskon 25% Rujak Apapun",
  },
  {
    image: "/images/rujak-gaco-banner.png",
    alt: "Gratis Sambal Premium",
  },
  {
    image: "/images/tampah-nusantara-banner.png",
    alt: "Tampah Nusantara",
  },
] as const;

// Character-style illustrations (matches the two-tone flat illustration
// used in the reference Pick Up / Delivery cards).
const PickUpIllustration = () => (
  <svg width="86" height="86" viewBox="0 0 86 86" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="43" cy="43" r="40" fill="#F4E9C1" opacity="0.6" />
    <rect x="26" y="34" width="34" height="30" rx="4" fill="#2F5D42" />
    <rect x="31" y="24" width="24" height="14" rx="6" fill="#2F5D42" opacity="0.85" />
    <circle cx="34" cy="60" r="4" fill="#F4E9C1" />
    <circle cx="52" cy="60" r="4" fill="#F4E9C1" />
  </svg>
);

const DeliveryIllustration = () => (
  <svg width="86" height="86" viewBox="0 0 86 86" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="43" cy="43" r="40" fill="#F6D9C7" opacity="0.6" />
    <circle cx="30" cy="60" r="7" fill="#B5401E" />
    <circle cx="56" cy="60" r="7" fill="#B5401E" />
    <rect x="24" y="42" width="38" height="12" rx="3" fill="#B5401E" />
    <rect x="46" y="30" width="16" height="12" rx="3" fill="#B5401E" opacity="0.85" />
    <path d="M24 42 L14 56" stroke="#B5401E" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

// Flat illustration icons for the "Spesial Untukmu" grid — replaces the
// lucide icon-in-circle treatment so cards match the reference's
// character/illustration style.
const featureIllustrations: Record<string, JSX.Element> = {
  custom: (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <circle cx="28" cy="28" r="26" fill="#F4E9C1" />
      <Blend x={16} y={16} width={24} height={24} color="#C98A1B" strokeWidth={2} />
    </svg>
  ),
};

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [heroIndex, setHeroIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const { addToCart, toggleCart } = useCart();

  useEffect(() => {
    const id = window.setInterval(() => {
      setHeroIndex((v) => (v + 1) % heroSlides.length);
    }, 4000);
    return () => window.clearInterval(id);
  }, []);

  const scrollToProducts = useCallback(() => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const featureGrid = useMemo(
    () => [
      {
        key: "custom-bowl",
        title: "Custom Bowl",
        subtitle: "Racik sesuai seleramu",
        badge: null as string | null,
        onClick: () => {
          const product = products.find((p) => p.id === "custom-bowl");
          if (product) {
            addToCart(product);
            toggleCart(true);
          }
        },
      },
      {
        key: "tampah",
        title: "Tampah Rujak",
        subtitle: "Pas untuk 8-10 orang",
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
        key: "plan",
        title: "RUJAK Plan",
        subtitle: "Langganan, hemat tiap hari",
        badge: null,
        onClick: () => {},
      },
      {
        key: "referral",
        title: "RUJAKferral",
        subtitle: "Bagikan kode, dapatkan hadiah",
        badge: null,
        onClick: () => {},
      },
      {
        key: "gift",
        title: "RUJAK.Gift",
        subtitle: "Berbagi kebahagiaan ke orang terdekat",
        badge: null,
        onClick: () => {},
      },
    ],
    [addToCart, toggleCart]
  );

  const filteredProducts = useMemo(() => {
    const byCategory =
      activeCategory === "all" ? products : products.filter((p) => p.type === activeCategory);
    const q = searchQuery.trim().toLowerCase();
    if (!q) return byCategory;
    return byCategory.filter(
      (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }, [activeCategory, searchQuery]);

  const waUrl =
    homepageConfig.social.whatsapp.url +
    "?text=" +
    encodeURIComponent("Halo RUJAK.Co, saya butuh bantuan.");

  const slide = heroSlides[heroIndex];

  // Placeholder until real auth/user context is wired up.
  const displayName = "SOBAT RUJAK";
  const points = 0;

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-ink font-sans pb-[110px]">
      <Header />

      <main className="md:pt-24">
        {/* ============ HERO — full-bleed banner carousel ============ */}
        <section id="hero" className="relative w-full">
          <div className="relative w-full aspect-[4/3] max-h-[420px] overflow-hidden md:max-w-2xl md:mx-auto md:rounded-b-[28px]">
            <AnimatePresence mode="wait">
              <motion.img
                key={heroIndex}
                src={slide.image}
                alt={slide.alt}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="absolute inset-0 w-full h-full object-cover"
                loading={heroIndex === 0 ? "eager" : "lazy"}
                fetchPriority={heroIndex === 0 ? "high" : "auto"}
                decoding="async"
              />
            </AnimatePresence>

            <button
              type="button"
              aria-label="Notifikasi"
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/25 flex items-center justify-center text-white backdrop-blur-sm"
            >
              <Bell className="w-4.5 h-4.5" />
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
              {heroSlides.map((_, i) => (
                <span
                  key={i}
                  className={`rounded-full transition-all ${
                    i === heroIndex ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Welcome / greeting card — name, points chip, plan chip */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="show"
            className="relative z-20 max-w-md md:max-w-2xl mx-auto px-4 -mt-1"
          >
            <div className="bg-white rounded-b-[20px] border border-t-0 border-[#ECECEC] px-6 pt-5 pb-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h1 className="text-[22px] font-bold tracking-tight text-ink">
                  Hai {displayName}!
                </h1>
                <Coins className="w-6 h-6 text-mango" strokeWidth={2} />
              </div>

              <div className="border-t border-dashed border-[#E2E2E2] my-3" />

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#ECECEC] text-[13px] font-semibold text-ink">
                  <span className="w-4 h-4 rounded-full bg-forest/10 flex items-center justify-center text-forest text-[10px]">
                    ●
                  </span>
                  {points} Poin
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#ECECEC] text-[13px] font-semibold text-ink">
                  <Crown className="w-3.5 h-3.5 text-forest" />
                  RUJAK Plan
                </span>
              </div>
            </div>
          </motion.div>
        </section>

        <div className="max-w-md md:max-w-2xl mx-auto px-4">
          {/* ============ Pesan Sekarang (Quick Action) ============ */}
          <section className="mt-8 mb-8" aria-label="Pesan Sekarang">
            <h2 className="text-[22px] font-bold text-ink tracking-tight mb-4">
              Pesan Rujak Sekarang?
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {/* Pick Up */}
              <button
                type="button"
                onClick={scrollToProducts}
                className="relative text-left rounded-[20px] border border-mango/30 bg-mango/10 p-5 h-[130px] active:scale-[0.98] transition-transform overflow-hidden"
              >
                <div className="relative z-10">
                  <p className="text-[20px] font-bold text-forest leading-tight">Pick Up</p>
                  <p className="text-[13px] text-forest/70 mt-1">Ambil di store tanpa antre</p>
                </div>
                <div className="absolute -bottom-2 -right-2">
                  <PickUpIllustration />
                </div>
              </button>

              {/* Delivery */}
              <button
                type="button"
                onClick={scrollToProducts}
                className="relative text-left rounded-[20px] border border-chili/30 bg-chili/10 p-5 h-[130px] active:scale-[0.98] transition-transform overflow-hidden"
              >
                <div className="relative z-10">
                  <p className="text-[20px] font-bold text-chili leading-tight">Delivery</p>
                  <p className="text-[13px] text-chili/70 mt-1">Diantar sampai rumah</p>
                </div>
                <div className="absolute -bottom-2 -right-2">
                  <DeliveryIllustration />
                </div>
              </button>
            </div>
          </section>

          {/* ============ Spesial Untukmu (Feature Grid, 5 item) ============ */}
          <section className="mb-8" aria-label="Spesial Untukmu">
            <h2 className="text-[22px] font-bold text-ink tracking-tight mb-4">
              Spesial Untukmu di RUJAK.Co
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {featureGrid.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={f.onClick}
                  aria-label={f.title}
                  className="relative text-left rounded-[20px] border border-[#ECECEC] bg-white p-5 shadow-sm active:scale-[0.98] transition-transform overflow-hidden"
                >
                  {f.badge && (
                    <span className="absolute top-0 right-0 bg-chili text-white text-[10px] font-bold px-2 py-1 rounded-bl-[10px]">
                      {f.badge}
                    </span>
                  )}
                  <div className="w-14 h-14 mb-3">
                    {featureIllustrations[f.key] ?? (
                      <div className="w-14 h-14 rounded-full bg-sage/40 flex items-center justify-center">
                        <Users className="w-6 h-6 text-forest" strokeWidth={2} />
                      </div>
                    )}
                  </div>
                  <p className="text-[16px] font-bold text-ink leading-snug tracking-tight">
                    {f.title}
                  </p>
                  <p className="text-[13px] font-normal text-ink-muted mt-1 leading-snug">
                    {f.subtitle}
                  </p>
                </button>
              ))}
            </div>
          </section>

          {/* ============ Search, Kategori, Grid Produk ============ */}
          <section id="products" className="scroll-mt-24 mb-8">
            <div className="sticky top-0 z-20 bg-[#F5F5F5] -mx-4 px-4 pb-3 pt-1">
              <div className="relative mb-4">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari menu..."
                  aria-label="Cari menu"
                  className="w-full h-11 pl-10 pr-4 rounded-full bg-white border border-[#ECECEC] text-[16px] font-medium text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-forest/30"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto no-scrollbar" role="tablist" aria-label="Kategori menu">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={activeCategory === cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-[14px] font-semibold whitespace-nowrap transition-colors ${
                      activeCategory === cat.id
                        ? "bg-forest text-white"
                        : "bg-white text-ink-soft border border-[#ECECEC]"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-[16px] font-medium text-ink-muted">Menu tidak ditemukan.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 mt-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-[16px] border border-[#ECECEC] overflow-hidden shadow-sm"
                  >
                    <div className="h-[115px] bg-sage/30 relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <p className="font-bold text-[16px] text-ink truncate">{product.name}</p>
                      <p className="text-[14px] font-medium text-ink-muted mt-0.5 line-clamp-1">
                        {product.category}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-[16px] font-bold text-forest">
                          {formatCurrency(product.price)}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            addToCart(product);
                            toggleCart(true);
                          }}
                          aria-label={`Tambah ${product.name}`}
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
          </section>

          {/* ============ Butuh Bantuan? ============ */}
          <section className="mb-8">
            <h2 className="text-[22px] font-bold text-ink mb-2">Butuh Bantuan?</h2>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 py-3 border-b border-gray-200 active:bg-gray-50 transition-colors"
            >
              <MessageCircle className="w-5 h-5 text-[#25D366]" strokeWidth={2} />
              <span className="flex-1 text-[15px] font-medium text-ink">
                RUJAK.Co Customer Service (chat only)
              </span>
              <ChevronRight className="w-5 h-5 text-ink-muted" />
            </a>
          </section>

          {/* ============ Informasi Halal & Kementerian ============ */}
          <div className="mb-8">
            <a
              href="#"
              className="flex items-center gap-3 py-3 border-b border-gray-200 active:bg-gray-50 transition-colors"
            >
              <ShieldCheck className="w-6 h-6 text-forest shrink-0" strokeWidth={2} />
              <span className="flex-1 text-[14px] font-medium text-ink">
                RUJAK.Co sudah tersertifikasi halal oleh MUI
              </span>
              <ChevronRight className="w-5 h-5 text-ink-muted shrink-0" />
            </a>

            <div className="flex items-start gap-3 py-4 border-b border-gray-200">
              <ShieldCheck className="w-6 h-6 text-forest shrink-0 mt-0.5" strokeWidth={2} />
              <div className="flex-1">
                <p className="text-[13px] font-medium text-ink leading-snug">
                  Dirjen Perlindungan Konsumen dan Tata Tertib Niaga, Kementerian Perdagangan
                  Republik Indonesia
                </p>
                <p className="text-[13px] font-bold text-ink mt-2">
                  WhatsApp Dirjen PKTN: 0853-1111-1010
                </p>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </main>

      <BottomNav />
      <CartDrawer />
      <CheckoutEnhanced />
    </div>
  );
}

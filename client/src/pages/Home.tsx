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

// Hero pakai foto produk yang sudah ada di data/products.ts (blob storage),
// bukan file gambar khayalan — jadi tidak akan pernah tampil kosong.
const heroSlides = [
  {
    image: getProductById("rujak-segar")?.image,
    alt: "Rujak Segar",
    title: "Beli Rujak Apapun",
    subtitle: "Diskon spesial hari ini",
    badge: "25%",
  },
  {
    image: getProductById("rujak-gaco")?.image,
    alt: "Rujak Gaco",
    title: "Gratis Sambal Premium",
    subtitle: "Setiap pembelian Tampah",
    badge: "FREE",
  },
  {
    image: getProductById("tampah-nusantara")?.image,
    alt: "Tampah Nusantara",
    title: "Tampah Nusantara",
    subtitle: "Pas untuk acara bersama",
    badge: "NEW",
  },
] as const;

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [heroIndex, setHeroIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const { addToCart, toggleCart, state } = useCart();
  const displayName = state.userName && state.userName !== "Tamu" ? state.userName : "Rujakers";
  const points = 0;

  useEffect(() => {
    const id = window.setInterval(() => {
      setHeroIndex((v) => (v + 1) % heroSlides.length);
    }, 4000);
    return () => window.clearInterval(id);
  }, []);

  const scrollToProducts = useCallback(() => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const quickActions = useMemo(
    () => [
      {
        icon: Store,
        title: "Pick Up",
        subtitle: "Ambil di store tanpa antre",
        bg: "bg-mango/10",
        border: "border-mango/30",
        color: "text-forest",
        colorMuted: "text-forest/70",
        onClick: scrollToProducts,
      },
      {
        icon: Bike,
        title: "Delivery",
        subtitle: "Diantar sampai rumah",
        bg: "bg-chili/10",
        border: "border-chili/30",
        color: "text-chili",
        colorMuted: "text-chili/70",
        onClick: scrollToProducts,
      },
    ],
    [scrollToProducts]
  );

  // Ikon lucide (bukan ilustrasi gambar) supaya tidak ada slot kosong —
  // sama seperti pola yang sudah dipakai di Header/BottomNav project ini.
  const featureGrid = useMemo(
    () => [
      {
        key: "custom-bowl",
        icon: Blend,
        iconBg: "bg-mango/10",
        iconColor: "text-mango",
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
        icon: Users,
        iconBg: "bg-forest/10",
        iconColor: "text-forest",
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
        icon: Crown,
        iconBg: "bg-gold/10",
        iconColor: "text-mango",
        title: "RUJAK Plan",
        subtitle: "Langganan, hemat tiap hari",
        badge: null,
        onClick: () => {},
      },
      {
        key: "referral",
        icon: Share2,
        iconBg: "bg-chili/10",
        iconColor: "text-chili",
        title: "RUJAKferral",
        subtitle: "Bagikan kode, dapatkan hadiah",
        badge: null,
        onClick: () => {},
      },
      {
        key: "gift",
        icon: Gift,
        iconBg: "bg-sage/40",
        iconColor: "text-forest",
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

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-ink font-sans pb-[110px]">
      <Header />

      <main className="md:pt-24">
        {/* ============ HERO — foto produk asli + teks overlay ============ */}
        <section id="hero" className="relative w-full">
          <div className="relative w-full h-[300px] overflow-hidden bg-sage/30 rounded-b-[28px] md:max-w-2xl md:mx-auto md:rounded-[28px]">
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

            {/* Gradasi gelap supaya teks tetap terbaca di atas foto apa pun */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/25 pointer-events-none" />

            <div className="absolute left-6 top-10 z-20 max-w-[62%]">
              <p className="text-white text-[22px] font-[800] leading-tight tracking-tight">
                {slide.title}
              </p>
              <p className="text-white/85 text-[13px] font-medium mt-1.5">{slide.subtitle}</p>
              <p className="text-white text-[44px] font-[900] leading-none tracking-tight mt-2">
                {slide.badge}
              </p>
            </div>

            <button
              type="button"
              aria-label="Notifikasi"
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/35 flex items-center justify-center text-white"
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

          {/* Kartu sapaan — nama, poin, plan */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="show"
            className="relative z-20 -mt-[64px] max-w-md md:max-w-2xl mx-auto px-4"
          >
            <div className="bg-white rounded-[20px] border border-[#ECECEC] px-6 pt-5 pb-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h1 className="text-[21px] font-[800] tracking-[-0.02em] text-ink leading-tight">
                  Hai {displayName}!
                </h1>
                <Coins className="w-6 h-6 text-mango" strokeWidth={2} />
              </div>

              <div className="border-t border-dashed border-[#E2E2E2] my-3" />

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sage/40 text-[12px] font-bold text-forest">
                  <Coins className="w-3.5 h-3.5" /> {points} Poin
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-mango/10 text-[12px] font-bold text-mango">
                  <Crown className="w-3.5 h-3.5" /> RUJAK Plan
                </span>
              </div>
            </div>
          </motion.div>
        </section>

        <div className="max-w-md md:max-w-2xl mx-auto px-4">
          {/* ============ Pesan Sekarang (Quick Action) ============ */}
          <section className="mt-8 mb-8" aria-label="Pesan Sekarang">
            <h2 className="text-[18px] font-bold text-ink tracking-tight mb-3">
              Pesan Rujak Sekarang?
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((qa) => (
                <button
                  key={qa.title}
                  type="button"
                  onClick={qa.onClick}
                  className={`relative text-left rounded-[20px] border ${qa.border} ${qa.bg} p-5 h-[130px] active:scale-[0.98] transition-transform overflow-hidden`}
                >
                  <qa.icon className={`absolute bottom-3 right-3 w-12 h-12 ${qa.color} opacity-25`} strokeWidth={1.5} />
                  <div className="relative z-10">
                    <p className={`text-[20px] font-bold ${qa.color} leading-tight`}>{qa.title}</p>
                    <p className={`text-[13px] ${qa.colorMuted} mt-1`}>{qa.subtitle}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* ============ Spesial Untukmu (Feature Grid, 5 item) ============ */}
          <section className="mb-8" aria-label="Spesial Untukmu">
            <h2 className="text-[18px] font-bold text-ink tracking-tight mb-3">
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
                  <div className={`w-14 h-14 rounded-full ${f.iconBg} flex items-center justify-center mb-3`}>
                    <f.icon className={`w-6 h-6 ${f.iconColor}`} strokeWidth={2} />
                  </div>
                  <p className="text-[15px] font-bold text-ink leading-snug tracking-tight">
                    {f.title}
                  </p>
                  <p className="text-[12.5px] font-medium text-ink-muted mt-0.5 leading-snug">
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
            <h2 className="text-[18px] font-bold text-ink mb-2">Butuh Bantuan?</h2>
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

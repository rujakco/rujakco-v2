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

// Margin section (bukan kartu sapaan — itu edge-to-edge, sudah diverifikasi
// lewat pixel-trace: margin 0 dari y=860 s/d bawah kartu, cuma ~40-90px
// paling atas yang punya "margin" karena lengkungan sudut rounded).
const PAGE_PAD = "px-3";
const PAGE_WIDTH = "max-w-md md:max-w-2xl mx-auto";

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
  const { addToCart, toggleCart, state, setUserName } = useCart();

  const isLoggedIn = Boolean(state.userName) && state.userName !== "Tamu";
  const points = 0;

  const handleLogin = useCallback(() => {
    const name = window.prompt("Masukkan nama kamu untuk login:");
    if (name && name.trim()) {
      setUserName(name.trim());
    }
  }, [setUserName]);

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
        illustration: null as string | null, // TODO: ganti dengan ilustrasi Pick Up asli
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
        illustration: null as string | null, // TODO: ganti dengan ilustrasi Delivery asli
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

  const featureGrid = useMemo(
    () => [
      {
        key: "custom-bowl",
        icon: Blend,
        illustration: null as string | null, // TODO: ganti dengan ilustrasi asli
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
        illustration: null as string | null,
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
        illustration: null as string | null,
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
        illustration: null as string | null,
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
        illustration: null as string | null,
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
        {/* ============ HERO — foto asli, edge-to-edge ============ */}
        <section id="hero" className="relative w-full">
          <div className="relative w-full h-[300px] overflow-hidden bg-sage/30 md:max-w-2xl md:mx-auto md:mt-6 md:rounded-[28px]">
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

            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/25 pointer-events-none" />

            <div className={`absolute left-0 top-10 z-20 max-w-[62%] ${PAGE_PAD}`}>
              <p className="text-white text-[22px] font-[800] leading-tight tracking-tight">
                {slide.title}
              </p>
              <p className="text-white/85 text-[13px] font-medium mt-1.5">{slide.subtitle}</p>
              <p className="text-white text-[44px] font-[900] leading-none tracking-tight mt-2">
                {slide.badge}
              </p>
            </div>

            {/* Disclaimer kecil pojok kiri bawah — detail yang ada di hero Fore asli */}
            <p className={`absolute bottom-8 left-0 z-20 text-white/80 text-[10px] font-bold ${PAGE_PAD}`}>
              S&K Berlaku
            </p>

            {/* Badge Halal kecil pojok kanan bawah hero */}
            <div className="absolute bottom-8 right-3 z-20 flex items-center gap-1 bg-black/25 rounded-full px-2 py-1">
              <ShieldCheck className="w-3 h-3 text-white" strokeWidth={2.5} />
              <span className="text-white text-[9px] font-bold">Halal</span>
            </div>

            <button
              type="button"
              aria-label="Notifikasi"
              style={{ top: "max(1rem, env(safe-area-inset-top))" }}
              className="absolute right-4 z-20 w-11 h-11 rounded-full bg-black/70 flex items-center justify-center text-white"
            >
              <Bell className="w-[18px] h-[18px]" />
            </button>

            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
              {heroSlides.map((_, i) => (
                <span
                  key={i}
                  className={`rounded-full transition-all ${
                    i === heroIndex ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Kartu sapaan — dikasih margin 12px kiri-kanan (dikonversi dari
              hasil pixel-scan Fore asli), bukan edge-to-edge, dan overlap
              ~43px ke hero (rounded-2xl di 4 sisi karena udah nggak nempel tepi). */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="show"
            className="relative z-20 -mt-11 w-[calc(100%-24px)] mx-3 bg-white rounded-2xl shadow-[0_-4px_12px_rgba(0,0,0,0.04)] md:max-w-2xl md:mx-auto md:rounded-[20px] md:mt-4 md:shadow-sm"
          >
            <div className="relative">
              {/* Ornamen koin dekoratif — beberapa lingkaran kecil, bukan cuma 1 ikon */}
              <div className="absolute top-5 right-3 flex items-center gap-1 opacity-90 pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-mango/40" />
                <span className="w-2 h-2 rounded-full bg-mango/70 -mt-2" />
                <Coins className="w-5 h-5 text-mango ml-0.5" strokeWidth={2} />
              </div>

              <div className={`flex items-center justify-between gap-3 pt-4 pb-3 ${PAGE_PAD}`}>
                <h1 className="text-[17px] font-bold text-ink leading-tight">
                  {isLoggedIn ? `Hai ${state.userName}!` : "Welcome to RUJAK.Co!"}
                </h1>

                {isLoggedIn ? null : (
                  <button
                    type="button"
                    onClick={handleLogin}
                    className="shrink-0 px-4 py-2 rounded-full bg-forest text-white text-[12px] font-semibold active:scale-95 transition-transform"
                  >
                    Login Sekarang
                  </button>
                )}
              </div>

              {/* Referensi: dashed divider SELALU ada di sini, bukan cuma
                  saat isLoggedIn. Kontennya di bawah yang berganti. */}
              <div className={`border-t border-dashed border-[#E2E2E2] ${PAGE_PAD}`} />

              {isLoggedIn ? (
                <div className={`flex items-center gap-2 py-3 ${PAGE_PAD}`}>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sage/40 text-[12px] font-bold text-forest">
                    <Coins className="w-3.5 h-3.5" /> {points} Poin
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-mango/10 text-[12px] font-bold text-mango">
                    <Crown className="w-3.5 h-3.5" /> RUJAK Plan
                  </span>
                </div>
              ) : (
                <p className={`text-[13px] text-ink-muted py-3 ${PAGE_PAD}`}>
                  Berbagai rasa siap menemani harimu
                </p>
              )}
            </div>
          </motion.div>
        </section>

        <div className={`${PAGE_WIDTH} ${PAGE_PAD}`}>
          {/* ============ Pesan Sekarang (Quick Action) ============ */}
          <section className="mt-7 mb-8" aria-label="Pesan Sekarang">
            <h2 className="text-[17px] font-bold text-ink tracking-tight mb-3">
              Pesan Rujak Sekarang?
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((qa) => (
                <button
                  key={qa.title}
                  type="button"
                  onClick={qa.onClick}
                  className={`relative text-left rounded-2xl border ${qa.border} ${qa.bg} p-4 h-[130px] active:scale-[0.98] transition-transform overflow-hidden`}
                >
                  {/* Referensi map: icon adalah lingkaran SOLID dengan bobot
                      visual jelas. Kalau qa.illustration udah ada asetnya,
                      pakai <img> — sementara fallback ke icon. */}
                  <div className="absolute bottom-3 right-3 w-16 h-16 rounded-full bg-white/70 flex items-center justify-center shadow-sm overflow-hidden">
                    {qa.illustration ? (
                      <img src={qa.illustration} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <qa.icon className={`w-8 h-8 ${qa.color}`} strokeWidth={1.75} />
                    )}
                  </div>
                  <div className="relative z-10">
                    <p className={`text-[18px] font-bold ${qa.color} leading-tight`}>{qa.title}</p>
                    <p className={`text-[12px] ${qa.colorMuted} mt-1 pr-14 leading-snug`}>{qa.subtitle}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Divider abu-abu tebal antar-section — detail yang ada di Fore asli
            (bukan cuma border 1px), full-bleed selebar layar. */}
        <div className="h-2 bg-[#EDEDED] mt-6" />

        <div className={`${PAGE_WIDTH} ${PAGE_PAD}`}>
          {/* ============ Spesial Untukmu (Feature Grid, 5 item) ============ */}
          <section className="mt-7 mb-8" aria-label="Spesial Untukmu">
            <h2 className="text-[19px] font-bold text-ink tracking-tight mb-3">
              Spesial Untukmu di RUJAK.Co
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {featureGrid.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={f.onClick}
                  aria-label={f.title}
                  className="relative flex flex-col items-center text-center overflow-hidden rounded-2xl border border-[#ECECEC] bg-white p-4 shadow-sm active:scale-[0.98] transition-transform"
                >
                  {f.badge && (
                    // Referensi: badge "Baru" rata nempel di pojok kartu
                    // (ribbon terpotong sudut), bukan pill melayang di luar kartu.
                    <span className="absolute top-0 right-0 bg-chili text-white text-[10px] font-semibold px-2 py-1 rounded-bl-xl rounded-tr-2xl">
                      {f.badge}
                    </span>
                  )}
                  {/* Referensi map: slot icon w-14 h-14 (56px), flat. Kalau
                      f.illustration udah ada asetnya, pakai <img> — sementara
                      fallback ke icon. */}
                  <div className="w-14 h-14 flex items-center justify-center mb-2">
                    {f.illustration ? (
                      <img src={f.illustration} alt="" className="w-full h-full object-contain" />
                    ) : (
                      <f.icon className={`w-7 h-7 ${f.iconColor}`} strokeWidth={1.75} />
                    )}
                  </div>
                  <p className="text-[14px] font-bold text-ink leading-snug tracking-tight">
                    {f.title}
                  </p>
                  <p className="text-[11px] font-medium text-ink-muted mt-1 leading-snug">
                    {f.subtitle}
                  </p>
                </button>
              ))}
            </div>
          </section>

          {/* ============ Search, Kategori, Grid Produk ============ */}
          <section id="products" className="scroll-mt-24 mb-8">
            <div className={`sticky top-0 z-20 bg-[#F5F5F5] -mx-3 ${PAGE_PAD} pb-3 pt-1`}>
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
              <div className="grid grid-cols-2 gap-3 mt-4">
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
            <h2 className="text-[19px] font-bold text-ink mb-3">Butuh Bantuan?</h2>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-2xl border border-[#ECECEC] bg-white px-4 py-3.5 active:bg-gray-50 transition-colors"
            >
              <MessageCircle className="w-6 h-6 text-[#25D366]" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-medium text-ink">
                RUJAK.Co Customer Service (chat only)
              </span>
              <ChevronRight className="w-[18px] h-[18px] text-ink-muted" />
            </a>
          </section>

          {/* ============ Informasi Halal & Kementerian ============ */}
          <div className="mt-6 mb-8">
            <a
              href="#"
              className="flex items-center gap-3 py-3 border-t border-gray-200 active:bg-gray-50 transition-colors"
            >
              {/* TODO: ganti fallback ShieldCheck ini dengan <img src="/assets/halal.png" /> begitu asetnya ada */}
              <ShieldCheck className="w-8 h-8 text-forest shrink-0" strokeWidth={1.75} />
              <span className="flex-1 text-[12px] text-ink-muted">
                RUJAK.Co sudah tersertifikasi halal oleh MUI
              </span>
              <ChevronRight className="w-4 h-4 text-ink-muted shrink-0" />
            </a>

            <div className="flex items-start gap-3 py-3 border-t border-gray-200">
              {/* TODO: ganti fallback ShieldCheck ini dengan <img src="/assets/kemendag.png" /> begitu asetnya ada */}
              <ShieldCheck className="w-8 h-8 text-forest shrink-0 mt-0.5" strokeWidth={1.75} />
              <div className="flex-1 text-[11px] text-ink-muted leading-snug">
                <p>
                  Dirjen Perlindungan Konsumen dan Tata Tertib Niaga, Kementerian Perdagangan
                  Republik Indonesia
                </p>
                <p className="font-semibold text-ink mt-1">
                  WhatsApp Dirjen PKTN: 0853-1111-1010
                </p>
              </div>
              {/* Slot foto kanan — di referensi Fore ada foto produk kecil
                  di sini. Ganti bg-sage/40 ini dengan <img> begitu asetnya ada. */}
              <div className="w-14 h-11 rounded-lg bg-sage/40 shrink-0" aria-hidden="true" />
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

import { useState, useEffect, useMemo, useCallback } from "react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import CartDrawer from "@/components/CartDrawer";
import CheckoutEnhanced from "@/components/CheckoutEnhanced";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import { products, formatCurrency, getProductById, getBadgeLabel } from "@/data/products";
import { homepageConfig } from "@/data/homepage";
import { useCart } from "@/contexts/CartContext";
import { getLoyaltyPoints } from "@/lib/supabase-client";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  ShieldCheck,
  Clock,
  Plus,
  Bell,
  MessageCircle,
  ChevronRight,
  Coins,
  Crown,
  Star,
  Flame,
  Blend,
  Users,
  Gift,
  Share2,
  Store,
  Bike,
  Search,
  Ticket,
  Percent,
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

// Brand-color hero slides — solid background, floating product, dominant type.
// Colors are drawn only from the established token set (forest / mango / chili),
// so nothing here depends on an undefined Tailwind class like bg-gold.
const heroSlides = [
  {
    image: getProductById("rujak-segar")?.image,
    alt: "Rujak Segar",
    title: "Beli Rujak Apapun",
    subtitle: "Diskon spesial hari ini",
    badge: "25%",
    bg: "bg-forest",
  },
  {
    image: getProductById("rujak-gaco")?.image,
    alt: "Rujak Gaco",
    title: "Gratis Sambal Premium",
    subtitle: "Setiap pembelian Tampah",
    badge: "FREE",
    bg: "bg-mango",
  },
  {
    image: getProductById("tampah-nusantara")?.image,
    alt: "Tampah Nusantara",
    title: "Tampah Nusantara",
    subtitle: "Pas untuk acara bersama",
    badge: "NEW",
    bg: "bg-chili",
  },
] as const;

const promoStrip = [
  { icon: Bike, label: "Gratis Ongkir" },
  { icon: Crown, label: "Diskon Member" },
  { icon: Percent, label: "Cashback 10%" },
  { icon: Ticket, label: "Voucher Baru" },
] as const;

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [heroIndex, setHeroIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showVoucher, setShowVoucher] = useState(false);
  const [points, setPoints] = useState(0);
  const { addToCart, toggleCart, state } = useCart();
  const userName = state.userName && state.userName !== "Tamu" ? state.userName : null;

  // Real loyalty balance — there's no login, so identity is the phone number
  // remembered from a previous checkout (see CheckoutEnhanced, which writes
  // "rujak-phone" to localStorage after an order goes through). No phone
  // remembered yet just means 0 poin, same as a first-time guest.
  useEffect(() => {
    let phone = "";
    try {
      phone = localStorage.getItem("rujak-phone") || "";
    } catch {
      // private browsing / storage disabled — fall back to 0
    }
    if (!phone) return;
    getLoyaltyPoints(phone).then(setPoints);
  }, []);

  // Fixed interval, no dependency on heroIndex — avoids re-creating the timer every slide.
  useEffect(() => {
    const id = window.setInterval(() => {
      setHeroIndex((v) => (v + 1) % heroSlides.length);
    }, 4000);
    return () => window.clearInterval(id);
  }, []);

  // Floating voucher only appears once the person has scrolled into the page.
  useEffect(() => {
    const onScroll = () => setShowVoucher(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToProducts = useCallback(() => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // Small, static — no useMemo needed.
  const quickActions = [
    {
      icon: Store,
      title: "Pick Up",
      subtitle: "Ambil di store tanpa antre",
      bg: "bg-forest/10",
      iconColor: "text-forest",
      titleColor: "text-forest",
      subtitleColor: "text-forest/60",
    },
    {
      icon: Bike,
      title: "Delivery",
      subtitle: "Diantar sampai rumah",
      bg: "bg-mango/10",
      iconColor: "text-mango",
      titleColor: "text-mango",
      subtitleColor: "text-mango/70",
    },
  ];

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
        icon: Crown,
        title: "RUJAK Plan",
        subtitle: "Langganan, hemat tiap hari",
        iconBg: "bg-mango/10",
        iconColor: "text-mango",
        onClick: () => {},
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
      {
        icon: Users,
        title: "Corporate Order",
        subtitle: "Untuk acara & kantor",
        iconBg: "bg-forest/10",
        iconColor: "text-forest",
        onClick: () => {},
      },
    ],
    [addToCart, toggleCart]
  );

  const filteredProducts = useMemo(() => {
    const byCategory = activeCategory === "all" ? products : products.filter((p) => p.type === activeCategory);
    const q = searchQuery.trim().toLowerCase();
    if (!q) return byCategory;
    return byCategory.filter(
      (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }, [activeCategory, searchQuery]);

  // Data-driven — reads the `tag` that already exists on every product
  // (see data/products.ts / getBadgeLabel) instead of slicing or index math.
  const bestSellers = useMemo(() => products.filter((p) => p.tag === "best-seller"), []);

  const waUrl = homepageConfig.social.whatsapp.url + "?text=" + encodeURIComponent("Halo RUJAK.Co, saya butuh bantuan.");
  const slide = heroSlides[heroIndex];

  return (
    <div className="min-h-screen bg-[#F7F7F7] text-ink font-sans pb-[110px]">
      <Header />

      <main className="md:pt-24">
        {/* ============ HERO — solid brand color, floating product, dominant type ============ */}
        <section id="hero" className="relative w-full">
          <div
            className={`relative w-full h-[280px] overflow-hidden rounded-b-[28px] md:max-w-2xl md:mx-auto md:rounded-[28px] ${slide.bg} transition-colors duration-500`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={heroIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="absolute inset-0 flex items-center justify-between px-6"
              >
                <div className="max-w-[52%] z-10">
                  <p className="text-white text-[21px] font-[800] leading-tight tracking-tight">{slide.title}</p>
                  <p className="text-white/85 text-[13px] font-medium mt-1.5">{slide.subtitle}</p>
                  <p className="text-white text-[46px] font-[900] leading-none tracking-tight mt-2">{slide.badge}</p>
                </div>
                <div className="relative w-[46%] h-full flex items-center justify-center">
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    className="w-full h-[210px] object-contain drop-shadow-[0_12px_20px_rgba(0,0,0,0.25)]"
                    loading={heroIndex === 0 ? "eager" : "lazy"}
                    fetchPriority={heroIndex === 0 ? "high" : "auto"}
                    decoding="async"
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Notification bell — static, no ring animation, no heavy blur */}
            <button
              type="button"
              aria-label="Notifikasi"
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/20 flex items-center justify-center text-white"
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-chili text-white text-[9px] font-bold flex items-center justify-center border border-white/80">
                2
              </span>
            </button>

            {/* Dot indicator */}
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

          {/* Greeting card — points read from real loyalty balance */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="show"
            className="relative z-20 -mt-[84px] max-w-md md:max-w-2xl mx-auto px-4"
          >
            <div className="bg-white rounded-[20px] border border-[#ECECEC] px-[22px] py-[18px] shadow-sm">
              <p className="text-[21px] font-[800] tracking-[-0.02em] text-ink leading-tight">
                {userName ? `Hai ${userName}!` : "Hai Rujakers!"}
              </p>
              <p className="text-[13px] text-ink-muted mt-0.5 font-medium">
                Kumpulkan poin & nikmati kesegarannya.
              </p>
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sage/40 text-[12px] font-bold text-forest">
                  <Coins className="w-3.5 h-3.5" /> {points} Poin
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-mango/10 text-[12px] font-bold text-mango">
                  <Crown className="w-3.5 h-3.5" /> RUJAK Plan
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <div className="max-w-md md:max-w-2xl mx-auto px-4">
          {/* ============ Promo Strip ============ */}
          <section className="mt-5 mb-2" aria-label="Promo aktif">
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {promoStrip.map((p) => (
                <div
                  key={p.label}
                  className="flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-full bg-white border border-[#ECECEC] text-[12px] font-semibold text-ink-soft"
                >
                  <p.icon className="w-3.5 h-3.5 text-forest" />
                  {p.label}
                </div>
              ))}
            </div>
          </section>

          {/* ============ Quick Action — Pick Up / Delivery ============ */}
          <section className="mt-4 mb-8" aria-label="Pilih cara pesan">
            <h2 className="text-[16px] font-bold text-ink tracking-tight mb-3">Pesan Sekarang</h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((qa) => (
                <button
                  key={qa.title}
                  type="button"
                  onClick={scrollToProducts}
                  aria-label={qa.title}
                  className={`relative text-left rounded-[16px] border border-[#ECECEC] ${qa.bg} p-4 h-[116px] shadow-sm active:scale-[0.98] transition-transform`}
                >
                  <qa.icon className={`absolute bottom-3 right-3 w-10 h-10 ${qa.iconColor} opacity-25`} strokeWidth={1.5} />
                  <div className="relative z-10">
                    <p className={`font-bold text-[15px] ${qa.titleColor} tracking-tight leading-tight`}>{qa.title}</p>
                    <p className={`text-[12px] font-medium ${qa.subtitleColor} mt-1`}>{qa.subtitle}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* ============ Best Seller — data-driven from product.tag ============ */}
          {bestSellers.length > 0 && (
            <section className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[16px] font-bold text-ink tracking-tight">Paling Disukai</h2>
                <span className="text-[13px] font-semibold text-forest">Lihat Semua</span>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4">
                {bestSellers.map((product) => (
                  <div
                    key={`best-${product.id}`}
                    className="min-w-[150px] bg-white rounded-[16px] border border-[#ECECEC] shadow-sm overflow-hidden shrink-0"
                  >
                    <div className="h-[120px] bg-sage/20 relative">
                      <div className="absolute top-2 left-2">
                        <span className="bg-white/90 px-2 py-0.5 rounded-full text-[10px] font-bold text-chili flex items-center gap-0.5">
                          <Flame className="w-3 h-3" /> {getBadgeLabel(product.tag)}
                        </span>
                      </div>
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div className="p-3">
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
          )}

          {/* ============ Menu ============ */}
          <section id="products" className="scroll-mt-24 mb-10">
            <h2 className="text-[16px] font-bold text-ink tracking-tight mb-3">Eksplor Menu</h2>

            {/* Sticky search + category so they stay reachable while scrolling the grid.
                Header is `hidden md:block` (mobile has no fixed header), so the sticky
                offset is 0 on mobile and only accounts for Header's height from md up. */}
            <div className="sticky top-0 md:top-16 lg:top-20 z-20 bg-[#F7F7F7] -mx-4 px-4 pb-3 pt-1">
              <div className="relative mb-3">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari menu..."
                  aria-label="Cari menu"
                  className="w-full h-11 pl-10 pr-4 rounded-full bg-white border border-[#ECECEC] text-[13.5px] font-medium text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-forest/30"
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
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-[13.5px] font-medium text-ink-muted">Menu tidak ditemukan.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 mt-3">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-[16px] border border-[#ECECEC] overflow-hidden shadow-sm"
                  >
                    <div className="h-[136px] bg-sage/30 relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                      {product.tag && getBadgeLabel(product.tag) && (
                        <div className="absolute left-2 top-2">
                          <span className="bg-white/90 px-2 py-0.5 rounded-full text-[10px] font-bold text-chili flex items-center gap-0.5">
                            <Flame className="w-3 h-3" /> {getBadgeLabel(product.tag)}
                          </span>
                        </div>
                      )}
                      <div className="absolute bottom-2 right-2">
                        <span className="bg-black/55 px-1.5 py-0.5 rounded-md text-[10px] font-medium text-white flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 fill-mango text-mango" /> 4.9
                        </span>
                      </div>
                    </div>
                    <div className="p-3">
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
            )}
          </section>

          {/* ============ Feature Grid ============ */}
          <section className="mb-10" aria-label="Fitur RUJAK.Co">
            <h2 className="text-[16px] font-bold text-ink tracking-tight mb-3">Spesial di RUJAK.Co</h2>
            <div className="grid grid-cols-2 gap-3">
              {featureGrid.map((f) => (
                <button
                  key={f.title}
                  type="button"
                  onClick={f.onClick}
                  aria-label={f.title}
                  className="relative text-left rounded-[16px] border border-[#ECECEC] bg-white p-[22px] shadow-sm active:scale-[0.98] transition-transform"
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
            <div className="flex items-center gap-3.5 p-4 rounded-[16px] bg-white border border-[#ECECEC] shadow-sm">
              <div className="w-11 h-11 rounded-full bg-sage/40 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-forest" />
              </div>
              <div>
                <p className="font-bold text-[14px] text-ink">Freshly Made Daily</p>
                <p className="text-[12.5px] font-medium text-ink-muted mt-0.5">Diracik langsung setelah pesanan masuk.</p>
              </div>
            </div>
            <div className="flex items-center gap-3.5 p-4 rounded-[16px] bg-white border border-[#ECECEC] shadow-sm">
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
              className="flex items-center gap-3.5 p-4 rounded-[16px] bg-white border border-[#ECECEC] shadow-sm active:scale-[0.98] transition-transform"
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

      {/* ============ Floating Voucher — appears after scrolling past the hero ============ */}
      <AnimatePresence>
        {showVoucher && (
          <motion.button
            type="button"
            aria-label="Voucher saya"
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed right-4 bottom-[104px] z-30 flex items-center gap-1.5 pl-3 pr-3.5 h-11 rounded-full bg-forest text-white shadow-sm active:scale-95"
          >
            <Ticket className="w-4 h-4" />
            <span className="text-[12.5px] font-bold">Voucher</span>
          </motion.button>
        )}
      </AnimatePresence>

      <BottomNav />
      <CartDrawer />
      <CheckoutEnhanced />
    </div>
  );
}

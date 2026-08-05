import { useState, useEffect } from "react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import CartDrawer from "@/components/CartDrawer";
import CheckoutEnhanced from "@/components/CheckoutEnhanced";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import { products, formatCurrency, getProductById } from "@/data/products";
import { homepageConfig } from "@/data/homepage";
import { useCart } from "@/contexts/CartContext";
import { AnimatePresence, motion } from "framer-motion";
import {
  Sparkles,
  Truck,
  Clock,
  ShieldCheck,
  ChefHat,
  Gift,
  Users,
  Share2,
  Plus,
  Bell,
  UtensilsCrossed,
  MessageCircle,
  ChevronRight,
  Coins,
} from "lucide-react";

// Hero carousel — foto produk existing. Struktur mengikuti banner promo
// Fore (full-bleed, copy tebal, dot indicator, bell dekoratif).
// Pakai foto yang sudah terbukti load di product grid (production).
const heroSlides = [
  {
    image: getProductById("rujak-segar")?.image,
    eyebrow: "Fresh Setiap Hari",
    title: "Rujak Buah Segar\nDiracik Saat Pesan",
    caption: "100% buah lokal · sambal khas Nusantara",
  },
  {
    image: getProductById("rujak-gaco")?.image,
    eyebrow: "Signature Andalan",
    title: "Rujak Gaco\nEnam Buah, Sambal Mete",
    caption: "Paling banyak dipesan di RUJAK.Co",
  },
  {
    image: getProductById("tampah-nusantara")?.image,
    eyebrow: "Untuk Acara Bersama",
    title: "Tampah Nusantara\nSatu Nampan untuk Semua",
    caption: "8–10 porsi · delapan buah · dua sambal",
  },
] as const;

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [heroIndex, setHeroIndex] = useState(0);
  const { addToCart, toggleCart, state } = useCart();
  const userName =
    state.userName && state.userName !== "Tamu" ? state.userName : null;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroSlides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  const categories = [
    { id: "all", label: "Semua" },
    { id: "rujak", label: "Rujak Buah" },
    { id: "asinan", label: "Asinan" },
    { id: "salad", label: "Salad Buah" },
  ];

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.type === activeCategory);

  const scrollToProducts = () => {
    document
      .getElementById("products")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const featureGrid = [
    {
      icon: ChefHat,
      title: "Custom Bowl",
      subtitle: "Racik bowl rujakmu sendiri",
      iconBg: "bg-mango/15",
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
      title: "Tampah Nusantara",
      subtitle: "Untuk acara & momen bersama",
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
      subtitle: "Bagikan kode, dapatkan hadiah",
      iconBg: "bg-chili/10",
      iconColor: "text-chili",
      onClick: () => {},
    },
    {
      icon: Gift,
      title: "RUJAK.Gift",
      subtitle: "Kirim kesegaran ke orang terdekat",
      iconBg: "bg-sage",
      iconColor: "text-forest",
      onClick: () => {},
    },
  ];

  const waUrl =
    homepageConfig.social.whatsapp.url +
    "?text=" +
    encodeURIComponent("Halo RUJAK.Co, saya butuh bantuan.");

  return (
    <div className="min-h-screen bg-cream text-ink font-sans pb-24">
      {/* Header desktop only — mobile app-like (tanpa top bar) */}
      <Header />

      <main className="md:pt-24">
        {/* ── Hero FULL-BLEED: tepi kiri–kanan–atas, tanpa radius di mobile (pola Fore) ── */}
        <section id="hero" className="relative scroll-mt-0 w-full">
          <div
            className="relative w-full overflow-hidden bg-forest
              min-h-[300px] sm:min-h-[320px]
              rounded-none
              md:max-w-2xl md:mx-auto md:rounded-[20px] md:shadow-sm"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={heroIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="absolute inset-0"
              >
                {heroSlides[heroIndex].image ? (
                  <img
                    src={heroSlides[heroIndex].image}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-forest/95 via-forest/45 to-forest/15" />
              </motion.div>
            </AnimatePresence>

            <button
              type="button"
              aria-label="Notifikasi"
              className="absolute top-3.5 right-3.5 z-10 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white"
            >
              <Bell className="w-4.5 h-4.5" />
            </button>

            <div className="relative z-[1] px-5 pt-14 pb-[4.5rem] min-h-[300px] sm:min-h-[320px] flex flex-col justify-end text-white">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.08em] uppercase text-mango mb-2 w-fit">
                <Sparkles className="w-3.5 h-3.5" />
                {heroSlides[heroIndex].eyebrow}
              </span>
              <h1 className="font-display text-[26px] sm:text-[28px] font-extrabold leading-[1.15] tracking-tight mb-1.5 whitespace-pre-line drop-shadow-sm">
                {heroSlides[heroIndex].title}
              </h1>
              <p className="text-[13px] font-medium text-white/90 max-w-[92%]">
                {heroSlides[heroIndex].caption}
              </p>

              <div className="flex items-center gap-1.5 mt-5">
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setHeroIndex(i)}
                    aria-label={`Slide ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${
                      i === heroIndex ? "w-5 bg-white" : "w-1.5 bg-white/45"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Greeting — overlap bawah hero, konten tetap max-w seperti body */}
          <div className="relative z-10 -mt-10 max-w-md md:max-w-2xl mx-auto px-4">
            <div className="bg-white rounded-[18px] border border-paper-border px-5 py-4 shadow-[0_10px_28px_-10px_rgba(27,94,32,0.14)]">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-display text-[18px] font-bold text-ink tracking-tight">
                    {userName ? `Hai ${userName.toUpperCase()}!` : "Hai, Selamat datang!"}
                  </p>
                  <p className="text-[13px] text-ink-muted mt-0.5 font-medium">
                    Mau rujak segar yang mana hari ini?
                  </p>
                </div>
                <div className="flex -space-x-1.5 shrink-0 pt-0.5" aria-hidden="true">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-7 h-7 rounded-full bg-mango border-2 border-white flex items-center justify-center shadow-sm"
                      style={{ opacity: 1 - i * 0.08 }}
                    >
                      <Coins className="w-3.5 h-3.5 text-ink" />
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sage/50 text-[12px] font-semibold text-forest border border-forest/10">
                  <Coins className="w-3.5 h-3.5" />
                  Poin &amp; Reward
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-paper-border text-[12px] font-semibold text-ink-soft">
                  <Sparkles className="w-3.5 h-3.5 text-mango" />
                  RUJAK.Plan
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Konten di bawah hero — dibatasi lebar mobile app */}
        <div className="max-w-md md:max-w-2xl mx-auto px-4">
          {/* ── CTA 2 kolom: Pesan Menu + Delivery ── */}
          <section className="mt-6 mb-7">
            <h2 className="font-display text-[16px] font-bold text-ink tracking-tight mb-3">
              Pesan RUJAK.Co Sekarang?
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={scrollToProducts}
                className="relative overflow-hidden text-left rounded-[16px] border border-forest/12 bg-gradient-to-br from-sage/70 to-sage/25 p-4 min-h-[108px] active:scale-[0.98] transition-transform"
              >
                <UtensilsCrossed
                  className="absolute -bottom-2 -right-2 w-14 h-14 text-forest/12"
                  aria-hidden="true"
                />
                <p className="relative font-bold text-[15px] text-forest tracking-tight">
                  Pesan Menu
                </p>
                <p className="relative text-[12px] font-medium text-ink-muted mt-1 leading-snug">
                  Lihat menu &amp; racik pesananmu
                </p>
              </button>

              <button
                type="button"
                onClick={scrollToProducts}
                className="relative overflow-hidden text-left rounded-[16px] border border-chili/15 bg-gradient-to-br from-chili/[0.09] to-mango/20 p-4 min-h-[108px] active:scale-[0.98] transition-transform"
              >
                <Truck
                  className="absolute -bottom-2 -right-2 w-14 h-14 text-chili/15"
                  aria-hidden="true"
                />
                <p className="relative font-bold text-[15px] text-chili tracking-tight">
                  Delivery
                </p>
                <p className="relative text-[12px] font-medium text-ink-muted mt-1 leading-snug">
                  Segar &amp; tepat waktu, dijamin!
                </p>
              </button>
            </div>
          </section>

          {/* ── Spesial Untukmu — grid 2×2 ── */}
          <section className="mb-7">
            <h2 className="font-display text-[16px] font-bold text-ink tracking-tight mb-3">
              Spesial Untukmu di RUJAK.Co
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {featureGrid.map((f) => {
                const Icon = f.icon;
                return (
                  <button
                    key={f.title}
                    type="button"
                    onClick={f.onClick}
                    className="relative text-left rounded-[16px] border border-paper-border bg-white p-4 min-h-[132px] hover:shadow-md active:scale-[0.98] transition-all"
                  >
                    {f.badge && (
                      <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-chili text-white text-[10px] font-bold tracking-wide">
                        {f.badge}
                      </span>
                    )}
                    <div
                      className={`w-11 h-11 rounded-[14px] ${f.iconBg} flex items-center justify-center mb-3`}
                    >
                      <Icon className={`w-5 h-5 ${f.iconColor}`} />
                    </div>
                    <p className="font-bold text-[13px] text-ink leading-snug tracking-tight">
                      {f.title}
                    </p>
                    <p className="text-[12px] font-medium text-ink-muted mt-0.5 leading-snug">
                      {f.subtitle}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ── Butuh Bantuan? — bar WA ala Fore ── */}
          <section className="mb-8">
            <h2 className="font-display text-[16px] font-bold text-ink tracking-tight mb-3">
              Butuh Bantuan?
            </h2>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 w-full rounded-2xl border border-paper-border bg-white px-4 py-3.5 hover:bg-paper/60 active:scale-[0.99] transition-all"
            >
              <span className="w-9 h-9 rounded-full bg-[#25D366]/15 flex items-center justify-center shrink-0">
                <MessageCircle className="w-4.5 h-4.5 text-[#25D366]" />
              </span>
              <span className="flex-1 text-sm font-medium text-ink text-left">
                RUJAK.Co Customer Service
              </span>
              <ChevronRight className="w-4 h-4 text-ink-muted shrink-0" />
            </a>
          </section>

          {/* ── Menu + filter + product grid ── */}
          <section id="products" className="scroll-mt-24">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-[16px] font-bold text-ink tracking-tight">
                Menu RUJAK.Co
              </h2>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-3 mb-1 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
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

            <div className="grid grid-cols-2 gap-3 mt-3 mb-8">
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
                    <p className="font-medium text-sm text-ink truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-ink-muted mt-0.5 line-clamp-1">
                      {product.category}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-semibold text-forest">
                        {formatCurrency(product.price)}
                      </span>
                      <button
                        type="button"
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

          {/* Trust rows */}
          <section className="grid grid-cols-1 gap-3 pb-2">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-paper-border">
              <div className="w-10 h-10 rounded-xl bg-sage/40 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-forest" />
              </div>
              <div>
                <p className="font-semibold text-sm text-ink">Freshly Made Daily</p>
                <p className="text-xs text-ink-muted">
                  Diracik langsung setelah pesanan masuk.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-paper-border">
              <div className="w-10 h-10 rounded-xl bg-sage/40 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-forest" />
              </div>
              <div>
                <p className="font-semibold text-sm text-ink">
                  100% Buah Lokal Pilihan
                </p>
                <p className="text-xs text-ink-muted">
                  Mendukung petani buah nusantara berkualitas tinggi.
                </p>
              </div>
            </div>
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

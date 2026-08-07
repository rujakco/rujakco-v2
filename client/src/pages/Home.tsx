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
  Star,
  Blend,
  Users,
  Crown,
  Gift,
  ShieldCheck,
  Search,
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

const heroSlides = [
  {
    image: "/images/rujak-segar.png", // pastikan path gambar sesuai
    alt: "Rujak Segar",
    title: "Beli Rujak Apapun",
    subtitle: "Diskon spesial hari ini",
    badge: "25%",
    bg: "bg-forest",
  },
  {
    image: "/images/rujak-gaco.png",
    alt: "Rujak Gaco",
    title: "Gratis Sambal Premium",
    subtitle: "Setiap pembelian Tampah",
    badge: "FREE",
    bg: "bg-mango",
  },
  {
    image: "/images/tampah-nusantara.png",
    alt: "Tampah Nusantara",
    title: "Tampah Nusantara",
    subtitle: "Pas untuk acara bersama",
    badge: "NEW",
    bg: "bg-chili",
  },
] as const;

// Ilustrasi sederhana untuk quick action (menggantikan ikon Lucide)
const PickUpIllustration = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="15" y="30" width="50" height="40" rx="4" fill="currentColor" />
    <rect x="25" y="20" width="30" height="15" rx="2" fill="currentColor" />
    <rect x="35" y="50" width="10" height="20" rx="2" fill="white" />
  </svg>
);

const DeliveryIllustration = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="25" cy="60" r="8" fill="currentColor" />
    <circle cx="55" cy="60" r="8" fill="currentColor" />
    <rect x="20" y="40" width="40" height="12" rx="2" fill="currentColor" />
    <rect x="45" y="30" width="15" height="10" rx="2" fill="currentColor" />
    <path d="M20 40 L10 55" stroke="currentColor" strokeWidth="4" />
  </svg>
);

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
        {/* ============ HERO (360px) ============ */}
        <section id="hero" className="relative w-full">
          <div
            className={`relative w-full h-[360px] overflow-hidden rounded-b-[28px] md:max-w-2xl md:mx-auto md:rounded-[28px] ${slide.bg} transition-colors duration-500`}
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
                  <p className="text-white text-[34px] font-[700] leading-tight tracking-tight">
                    {slide.title}
                  </p>
                  <p className="text-white/85 text-[18px] font-medium mt-2">{slide.subtitle}</p>
                  <p className="text-white text-[46px] font-[900] leading-none tracking-tight mt-2">
                    {slide.badge}
                  </p>
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

          {/* Welcome Card — overlap -48px, tanpa poin/plan */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="show"
            className="relative z-20 -mt-[48px] max-w-md md:max-w-2xl mx-auto px-4"
          >
            <div className="bg-white rounded-[20px] border border-[#ECECEC] px-6 py-6 shadow-sm text-center">
              <h1 className="text-[34px] font-[700] tracking-[-0.02em] text-ink leading-tight">
                Welcome to Rujak!
              </h1>
              <p className="text-[18px] text-ink-muted mt-2">Berbagai rasa menemani harimu</p>
              <button
                type="button"
                className="mt-6 w-full py-3 rounded-full bg-forest text-white text-[16px] font-semibold active:scale-[0.98] transition-transform"
              >
                Login
              </button>
            </div>
          </motion.div>
        </section>

        <div className="max-w-md md:max-w-2xl mx-auto px-4">
          {/* ============ Pesan Sekarang (Quick Action) ============ */}
          <section className="mt-8 mb-8" aria-label="Pesan Sekarang">
            <h2 className="text-[34px] font-bold text-ink tracking-tight mb-4">Pesan Sekarang</h2>
            <div className="grid grid-cols-2 gap-4">
              {/* Pick Up */}
              <button
                type="button"
                onClick={scrollToProducts}
                className="relative text-left rounded-[20px] border border-[#ECECEC] bg-white p-6 h-[140px] shadow-sm active:scale-[0.98] transition-transform overflow-hidden"
              >
                <div className="relative z-10">
                  <p className="text-[26px] font-bold text-forest leading-tight">Pick Up</p>
                  <p className="text-[14px] text-forest/70 mt-1">Ambil di store tanpa antre</p>
                </div>
                <div className="absolute bottom-2 right-2 text-forest opacity-25">
                  <PickUpIllustration />
                </div>
              </button>

              {/* Delivery */}
              <button
                type="button"
                onClick={scrollToProducts}
                className="relative text-left rounded-[20px] border border-[#ECECEC] bg-white p-6 h-[140px] shadow-sm active:scale-[0.98] transition-transform overflow-hidden"
              >
                <div className="relative z-10">
                  <p className="text-[26px] font-bold text-mango leading-tight">Delivery</p>
                  <p className="text-[14px] text-mango/70 mt-1">Diantar sampai rumah</p>
                </div>
                <div className="absolute bottom-2 right-2 text-mango opacity-25">
                  <DeliveryIllustration />
                </div>
              </button>
            </div>
          </section>

          {/* ============ Spesial Untukmu (Feature Grid 5 item) ============ */}
          <section className="mb-8" aria-label="Spesial Untukmu">
            <h2 className="text-[34px] font-bold text-ink tracking-tight mb-4">Spesial Untukmu</h2>
            <div className="grid grid-cols-2 gap-4">
              {featureGrid.map((f) => (
                <button
                  key={f.title}
                  type="button"
                  onClick={f.onClick}
                  aria-label={f.title}
                  className="text-left rounded-[20px] border border-[#ECECEC] bg-white p-6 shadow-sm active:scale-[0.98] transition-transform"
                >
                  <div className={`w-14 h-14 rounded-full ${f.iconBg} flex items-center justify-center mb-4`}>
                    <f.icon className={`w-7 h-7 ${f.iconColor}`} strokeWidth={2} />
                  </div>
                  <p className="text-[28px] font-semibold text-ink leading-snug tracking-tight">
                    {f.title}
                  </p>
                  <p className="text-[16px] font-normal text-ink-muted mt-1 leading-snug">
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
                      {/* Rating dihapus sesuai blueprint, tapi jika tetap ingin rating bisa dipertahankan */}
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

          {/* ============ Butuh Bantuan? (dengan divider) ============ */}
          <section className="mb-8">
            <h2 className="text-[34px] font-bold text-ink mb-4">Butuh Bantuan?</h2>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 py-3 border-b border-gray-200 active:bg-gray-50 transition-colors"
            >
              <MessageCircle className="w-5 h-5 text-[#25D366]" strokeWidth={2} />
              <span className="flex-1 text-[16px] font-medium text-ink">
                RUJAK.Co Customer Service
              </span>
              <ChevronRight className="w-5 h-5 text-ink-muted" />
            </a>
          </section>

          {/* ============ Informasi Halal & Kementerian ============ */}
          <div className="mb-8">
            <div className="flex items-center gap-3 py-3 border-b border-gray-200">
              <ShieldCheck className="w-5 h-5 text-forest" strokeWidth={2} />
              <span className="text-[16px] font-medium text-ink">Halal</span>
            </div>
            <div className="flex items-center gap-3 py-3 border-b border-gray-200">
              <ShieldCheck className="w-5 h-5 text-forest" strokeWidth={2} />
              <span className="text-[16px] font-medium text-ink">Kementerian</span>
            </div>
          </div>
        </div>

        <Footer />
      </main>

      {/* Bottom navigation: perlu diubah label & urutan menjadi Home, Voucher, Pesanan, Akun di file BottomNav */}
      <BottomNav />
      <CartDrawer />
      <CheckoutEnhanced />
    </div>
  );
}
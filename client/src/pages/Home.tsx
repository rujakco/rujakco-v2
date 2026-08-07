import { useState, useEffect, useMemo, useCallback, MouseEvent } from "react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import CartDrawer from "@/components/CartDrawer";
import CheckoutEnhanced from "@/components/CheckoutEnhanced";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import { products, formatCurrency, getProductById } from "@/data/products";
import { homepageConfig } from "@/data/homepage";
import { useCart } from "@/contexts/CartContext";
import { 
  AnimatePresence, 
  motion, 
  Variants, 
  useReducedMotion,
  HTMLMotionProps
} from "framer-motion";
import {
  Sparkles,
  Clock,
  ShieldCheck,
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

const pageVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
};

const heroSlides = [
  {
    image: getProductById("rujak-segar")?.image,
    eyebrow: "Fresh Setiap Hari",
    title: "Rujak Buah Segar\nDiracik Saat Pesan",
    caption: "100% buah lokal · sambal khas Nusantara",
    duration: 7000, 
  },
  {
    image: getProductById("rujak-gaco")?.image,
    eyebrow: "Signature Andalan",
    title: "Rujak Gaco\nEnam Buah, Sambal Mete",
    caption: "Paling banyak dipesan di RUJAK.Co",
    duration: 5000,
  },
  {
    image: getProductById("tampah-nusantara")?.image,
    eyebrow: "Untuk Acara Bersama",
    title: "Tampah Nusantara\nSatu Nampan",
    caption: "8–10 porsi · delapan buah · dua sambal",
    duration: 8000,
  },
] as const;

interface RippleButtonProps extends HTMLMotionProps<"button"> {
  rippleColor?: string;
}
const RippleButton = ({ children, onClick, className, rippleColor = "bg-black/10", ...props }: RippleButtonProps) => {
  const [coords, setCoords] = useState({ x: -1, y: -1 });
  const [isRippling, setIsRippling] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (coords.x !== -1 && coords.y !== -1) {
      setIsRippling(true);
      const timer = setTimeout(() => setIsRippling(false), 500);
      return () => clearTimeout(timer);
    }
  }, [coords]);

  return (
    <motion.button
      whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
      onClick={(e: MouseEvent<HTMLButtonElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        if (onClick) onClick(e);
      }}
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      {!shouldReduceMotion && isRippling && (
        <motion.span
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`absolute pointer-events-none rounded-full ${rippleColor}`}
          style={{ left: coords.x, top: coords.y, width: 100, height: 100, marginLeft: -50, marginTop: -50 }}
        />
      )}
      {children}
    </motion.button>
  );
};

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [heroIndex, setHeroIndex] = useState(0);
  const [isRinging, setIsRinging] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const { addToCart, toggleCart, state } = useCart();
  const userName = state.userName && state.userName !== "Tamu" ? state.userName : null;

  useEffect(() => {
    let timeoutId: number;
    let startTime = Date.now();
    let remaining = heroSlides[heroIndex].duration;

    const startTimer = (time: number) => {
      timeoutId = window.setTimeout(() => setHeroIndex((i) => (i + 1) % heroSlides.length), time);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearTimeout(timeoutId);
        remaining -= Date.now() - startTime;
      } else {
        startTime = Date.now();
        startTimer(remaining);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    startTimer(remaining);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [heroIndex]);

  useEffect(() => {
    const ringInterval = setInterval(() => setIsRinging(true), 7000);
    return () => clearInterval(ringInterval);
  }, []);

  const scrollToProducts = useCallback(() => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const featureGrid = useMemo(() => [
    {
      icon: Blend, title: "Custom Bowl", subtitle: "Racik sesuai seleramu",
      iconBg: "bg-mango/10", iconColor: "text-mango",
      onClick: () => {
        const product = products.find((p) => p.id === "custom-bowl");
        if (product) { addToCart(product); toggleCart(true); }
      },
    },
    {
      icon: Users, title: "Tampah Rujak", subtitle: "Pas untuk 8-10 orang",
      iconBg: "bg-forest/10", iconColor: "text-forest", badge: "Baru",
      onClick: () => {
        const product = products.find((p) => p.id === "tampah-nusantara");
        if (product) { addToCart(product); toggleCart(true); }
      },
    },
    {
      icon: Share2, title: "RUJAKferral", subtitle: "Bagi kode, dapat saldo",
      iconBg: "bg-chili/10", iconColor: "text-chili", onClick: () => {},
    },
    {
      icon: Gift, title: "RUJAK.Gift", subtitle: "Kirim ke orang spesial",
      iconBg: "bg-sage/40", iconColor: "text-forest", onClick: () => {},
    },
  ], [addToCart, toggleCart]);

  const filteredProducts = useMemo(() => {
    return activeCategory === "all" ? products : products.filter((p) => p.type === activeCategory);
  }, [activeCategory]);

  const bestSellers = products.slice(0, 3); // Simulasi best seller

  const waUrl = homepageConfig.social.whatsapp.url + "?text=" + encodeURIComponent("Halo RUJAK.Co, saya butuh bantuan.");

  return (
    <div className="min-h-screen bg-[#F5F6F8] text-ink font-sans pb-[120px]">
      <Header />

      <main className="md:pt-24">
        <section id="hero" className="relative scroll-mt-0 w-full">
          <div className="relative w-full overflow-hidden bg-forest min-h-[400px] rounded-none md:max-w-2xl md:mx-auto md:rounded-[32px] md:shadow-lg">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={heroIndex}
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.05 }}
                animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                {heroSlides[heroIndex].image && (
                  <motion.img
                    src={heroSlides[heroIndex].image}
                    alt={heroSlides[heroIndex].title.replace(/\n/g, ' ')}
                    className="absolute inset-0 w-full h-full object-cover object-[50%_45%]"
                    initial={{ scale: 1.04 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: heroSlides[heroIndex].duration / 1000, ease: "linear" }}
                    fetchPriority="high" loading="eager" decoding="async"
                    sizes="(max-width: 768px) 100vw, 42rem"
                  />
                )}
                
                {/* 1. Overlay lebih natural, menonjolkan foto buah */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A3A2A]/60 via-[#0A3A2A]/15 to-transparent pointer-events-none" />
              </motion.div>
            </AnimatePresence>

            <button
              type="button"
              className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center text-white shadow-sm"
            >
              <motion.div animate={isRinging && !shouldReduceMotion ? { rotate: [0, -12, 12, -12, 12, 0] } : { rotate: 0 }} transition={{ duration: 0.6 }} onAnimationComplete={() => setIsRinging(false)} style={{ originX: 0.5, originY: 0.1 }}>
                <Bell className="w-5 h-5" />
              </motion.div>
            </button>

            <div className="relative z-[15] px-6 pt-16 pb-[6.5rem] min-h-[400px] flex flex-col justify-end text-white">
              <AnimatePresence mode="wait">
                <motion.div key={`text-${heroIndex}`} initial="hidden" animate="show" exit="exit" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } }, exit: { opacity: 0, transition: { duration: 0.2 } } }}>
                  {/* 8. Tipografi disesuaikan, 28px font-extrabold */}
                  <motion.span variants={fadeUp} className="inline-flex items-center gap-1.5 text-[11px] font-extrabold tracking-[0.1em] uppercase text-mango mb-2 w-fit drop-shadow-md">
                    <Sparkles className="w-3.5 h-3.5" />
                    {heroSlides[heroIndex].eyebrow}
                  </motion.span>
                  <motion.h1 variants={fadeUp} className="font-display text-[28px] font-extrabold leading-[1.15] tracking-tight mb-2 whitespace-pre-line drop-shadow-lg">
                    {heroSlides[heroIndex].title}
                  </motion.h1>
                  <motion.p variants={fadeUp} className="text-[14px] font-medium text-white/95 max-w-[90%] drop-shadow-md">
                    {heroSlides[heroIndex].caption}
                  </motion.p>
                </motion.div>
              </AnimatePresence>

              {/* 7. Hero Indicator ala Progress Bar App Store */}
              <div className="flex items-center gap-1.5 mt-6">
                {heroSlides.map((slide, i) => (
                  <div key={i} className="h-1 bg-white/30 rounded-full overflow-hidden relative" style={{ width: i === heroIndex ? '32px' : '16px', transition: 'width 0.3s ease' }}>
                    {i === heroIndex && (
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: slide.duration / 1000, ease: "linear" }}
                        className="absolute top-0 left-0 h-full bg-white rounded-full"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Greeting Card (Lebih tipis, radius 20px, shadow halus, iOS glassmorphism) */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="show"
            whileHover={shouldReduceMotion ? {} : { y: -2 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            transition={{ delay: 0.3 }}
            className="relative z-20 -mt-16 max-w-md md:max-w-2xl mx-auto px-4 cursor-default"
          >
            <div className="bg-white/90 backdrop-blur-2xl rounded-[20px] border border-white/60 px-5 py-5 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-display text-[18px] font-extrabold text-ink tracking-tight">
                    {userName ? `Hai ${userName}!` : "Selamat datang, Rujakers!"}
                  </p>
                  <p className="text-[13px] text-ink-muted mt-0.5 font-medium">Kumpulkan poin & nikmati kesegarannya.</p>
                </div>
                <div className="flex -space-x-2 shrink-0">
                   <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sage/40 border border-sage text-[12px] font-extrabold text-forest">
                     <Coins className="w-3.5 h-3.5" /> 120 Poin
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 11. Urutan Hierarki Baru: Promo -> Best Seller -> Menu -> Fitur -> FAQ */}
        <motion.div className="max-w-md md:max-w-2xl mx-auto px-4" variants={pageVariants} initial="hidden" animate="show">
          
          {/* Promo Hari Ini (CTA Actionable & Emosional) */}
          <motion.section variants={fadeUp} className="mt-8 mb-10">
            <h2 className="font-display text-[20px] font-extrabold text-ink tracking-tight mb-4">Promo & Aksi Cepat</h2>
            <div className="grid grid-cols-2 gap-4">
              {/* 5. Copy yang lebih emosional */}
              <RippleButton onClick={scrollToProducts} rippleColor="bg-forest/20" className="relative text-left rounded-[24px] border border-white/80 bg-gradient-to-br from-green-50 to-white shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-5 h-[130px]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/30 blur-2xl rounded-full pointer-events-none" />
                <div className="absolute -bottom-3 -right-3 w-20 h-20 rounded-full bg-forest/10 flex items-center justify-center pointer-events-none">
                  <Salad className="w-9 h-9 text-forest/50" strokeWidth={1.75} />
                </div>
                <div className="relative z-10">
                  <p className="font-extrabold text-[16px] text-forest tracking-tight leading-tight">🥭 Rujak Segar</p>
                  <p className="text-[12px] font-medium text-forest/70 mt-1">Pesan Sekarang</p>
                </div>
              </RippleButton>

              <RippleButton onClick={scrollToProducts} rippleColor="bg-chili/20" className="relative text-left rounded-[24px] border border-white/80 bg-gradient-to-br from-orange-50 to-white shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-5 h-[130px]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200/30 blur-2xl rounded-full pointer-events-none" />
                <div className="absolute -bottom-3 -right-3 w-20 h-20 rounded-full bg-chili/10 flex items-center justify-center pointer-events-none">
                  <Blend className="w-9 h-9 text-chili/50" strokeWidth={1.75} />
                </div>
                <div className="relative z-10">
                  <p className="font-extrabold text-[16px] text-chili tracking-tight leading-tight">Racik Sendiri</p>
                  <p className="text-[12px] font-medium text-chili/70 mt-1">Mulai Racik</p>
                </div>
              </RippleButton>
            </div>
          </motion.section>

          {/* Best Seller Horizontal Scroll (Fokus Makanan) */}
          <motion.section variants={fadeUp} className="mb-10">
            <div className="flex items-center justify-between mb-4">
               <h2 className="font-display text-[20px] font-extrabold text-ink tracking-tight">Paling Disukai 🔥</h2>
               <span className="text-[13px] font-bold text-forest cursor-pointer">Lihat Semua</span>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4">
               {bestSellers.map((product) => (
                  <motion.div key={`best-${product.id}`} className="min-w-[160px] bg-white rounded-[24px] border border-[#ECECEC] shadow-[0_4px_12px_rgba(0,0,0,0.03)] overflow-hidden shrink-0">
                     <div className="h-[140px] bg-sage/20 relative">
                        {/* 4. Overlay Badge Pedas & Rating di foto */}
                        <div className="absolute top-2 left-2">
                           <span className="bg-white/90 backdrop-blur-md px-2 py-1 rounded-full text-[10px] font-extrabold text-chili shadow-sm flex items-center gap-0.5">
                              <Flame className="w-3 h-3" /> Bestseller
                           </span>
                        </div>
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                     </div>
                     <div className="p-4">
                        <p className="font-extrabold text-[14px] text-ink truncate">{product.name}</p>
                        <div className="flex items-center gap-1 mt-1 text-ink-muted">
                           <Star className="w-3 h-3 fill-mango text-mango" />
                           <span className="text-[11px] font-medium">4.9 • 2.3rb terjual</span>
                        </div>
                        <p className="text-[14px] font-extrabold text-forest mt-3">{formatCurrency(product.price)}</p>
                     </div>
                  </motion.div>
               ))}
            </div>
          </motion.section>

          {/* Menu Kategori & Grid */}
          <motion.section id="products" variants={fadeUp} className="scroll-mt-24 mb-12">
            <h2 className="font-display text-[20px] font-extrabold text-ink tracking-tight mb-4">Eksplor Menu</h2>
            <div className="flex gap-2.5 overflow-x-auto pb-4 mb-2 no-scrollbar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id} type="button" onClick={() => setActiveCategory(cat.id)}
                  className={`px-5 py-2.5 rounded-full text-[13px] font-bold whitespace-nowrap transition-all ${activeCategory === cat.id ? "bg-forest text-white shadow-[0_4px_12px_rgba(0,40,20,0.2)]" : "bg-white text-ink-soft border border-[#ECECEC] shadow-sm"}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <motion.div layout className="grid grid-cols-2 gap-4 mt-2">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id} layout="position" variants={fadeUp}
                    initial="hidden" animate="show" exit="exit"
                    whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                    // 9. Product Card - padding 16px, image 160px, button 36px
                    className="bg-white rounded-[24px] border border-[#ECECEC] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.03)]"
                  >
                    <div className="h-[160px] bg-sage/30 relative">
                      <img src={product.image} alt={product.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                      {/* Social proof badge */}
                      <div className="absolute bottom-2 right-2">
                         <span className="bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-medium text-white flex items-center gap-1 shadow-sm">
                           <Star className="w-2.5 h-2.5 fill-mango text-mango" /> 4.9
                         </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="font-extrabold text-[14px] text-ink truncate">{product.name}</p>
                      <p className="text-[12px] font-medium text-ink-muted mt-0.5 line-clamp-1">{product.category}</p>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-[15px] font-extrabold text-forest">{formatCurrency(product.price)}</span>
                        <motion.button
                          type="button"
                          whileTap={shouldReduceMotion ? {} : { scale: 0.82 }}
                          onClick={() => { addToCart(product); toggleCart(true); }}
                          aria-label={`Tambah ${product.name}`}
                          className="w-9 h-9 rounded-full bg-forest text-white flex items-center justify-center shadow-sm"
                        >
                          <Plus className="w-4.5 h-4.5" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </motion.section>

          {/* Feature Grid (Kini di bawah agar makanan tampil lebih dulu) */}
          <motion.section variants={fadeUp} className="mb-12">
            <h2 className="font-display text-[20px] font-extrabold text-ink tracking-tight mb-4">Spesial di RUJAK.Co</h2>
            <div className="grid grid-cols-2 gap-4">
              {featureGrid.map((f) => (
                <RippleButton key={f.title} onClick={f.onClick} className="relative text-left rounded-[24px] border border-[#ECECEC] bg-white p-5 h-[140px] shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
                  {f.badge && <span className="absolute top-4 right-4 h-6 px-2.5 rounded-full bg-chili text-white text-[11px] font-bold tracking-wide flex items-center justify-center shadow-sm">{f.badge}</span>}

                  <div className={`w-12 h-12 rounded-2xl ${f.iconBg} flex items-center justify-center mb-3`}>
                     <f.icon className={`w-6 h-6 ${f.iconColor}`} strokeWidth={2} />
                  </div>
                  <p className="font-extrabold text-[14px] text-ink leading-snug tracking-tight">{f.title}</p>
                  <p className="text-[12px] font-medium text-ink-muted mt-1 leading-snug">{f.subtitle}</p>
                </RippleButton>
              ))}
            </div>
          </motion.section>

          <motion.section variants={fadeUp} className="grid grid-cols-1 gap-4 pb-8 [content-visibility:auto]">
            <div className="flex items-center gap-4 p-5 rounded-[24px] bg-white border border-[#ECECEC] shadow-[0_4px_16px_rgba(0,0,0,0.03)]">
              <div className="w-14 h-14 rounded-2xl bg-sage/40 flex items-center justify-center shrink-0">
                <Clock className="w-7 h-7 text-forest" />
              </div>
              <div>
                <p className="font-extrabold text-[15px] text-ink">Freshly Made Daily</p>
                <p className="text-[13px] font-medium text-ink-muted mt-1">Diracik langsung setelah pesanan masuk.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-5 rounded-[24px] bg-white border border-[#ECECEC] shadow-[0_4px_16px_rgba(0,0,0,0.03)]">
              <div className="w-14 h-14 rounded-2xl bg-sage/40 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-7 h-7 text-forest" />
              </div>
              <div>
                <p className="font-extrabold text-[15px] text-ink">100% Buah Lokal Pilihan</p>
                <p className="text-[13px] font-medium text-ink-muted mt-1">Mendukung petani buah nusantara berkualitas.</p>
              </div>
            </div>
          </motion.section>

          {/* Butuh Bantuan? — WhatsApp CS, ala Fore */}
          <motion.section variants={fadeUp} className="mb-8">
            <h2 className="font-display text-[20px] font-extrabold text-ink tracking-tight mb-4">Butuh Bantuan?</h2>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 rounded-[24px] bg-white border border-[#ECECEC] shadow-[0_4px_16px_rgba(0,0,0,0.03)] active:scale-[0.98] transition-transform"
            >
              <div className="w-11 h-11 rounded-full bg-[#25D366]/10 flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5 text-[#25D366]" strokeWidth={2} />
              </div>
              <p className="flex-1 font-extrabold text-[14px] text-ink">RUJAK.Co Customer Service</p>
              <ChevronRight className="w-5 h-5 text-ink-muted shrink-0" />
            </a>
          </motion.section>
        </motion.div>

        <div className="[content-visibility:auto]">
          <FAQ />
          <Footer />
        </div>
      </main>

      <BottomNav />
      <CartDrawer />
      <CheckoutEnhanced />
    </div>
  );
}

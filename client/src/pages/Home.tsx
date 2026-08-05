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

// 1. Ekstrak konstan statis ke luar komponen (Mencegah re-creation)
const CATEGORIES = [
  { id: "all", label: "Semua" },
  { id: "rujak", label: "Rujak Buah" },
  { id: "asinan", label: "Asinan" },
  { id: "salad", label: "Salad Buah" },
] as const;

const pageVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.14, delayChildren: 0.15 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
};

const heroTextVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

// 10. Tambahkan 'duration' dinamis pada setiap slide
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
    title: "Tampah Nusantara\nSatu Nampan untuk Semua",
    caption: "8–10 porsi · delapan buah · dua sambal",
    duration: 8000,
  },
] as const;

// 9. Komponen Native Ripple Effect (Ringan berbasis Framer Motion)
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
          style={{
            left: coords.x, top: coords.y,
            width: 100, height: 100,
            marginLeft: -50, marginTop: -50,
          }}
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
  
  // 14. Aksesibilitas: Motion Preference
  const shouldReduceMotion = useReducedMotion();
  const { addToCart, toggleCart, state } = useCart();
  const userName = state.userName && state.userName !== "Tamu" ? state.userName : null;

  // 5. Hero Carousel dengan Visibility API & 10. Dynamic Duration
  useEffect(() => {
    let timeoutId: number;
    let startTime = Date.now();
    let remaining = heroSlides[heroIndex].duration;

    const startTimer = (time: number) => {
      timeoutId = window.setTimeout(() => {
        setHeroIndex((i) => (i + 1) % heroSlides.length);
      }, time);
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

  // 6. Bell Animation Trigger
  useEffect(() => {
    const ringInterval = setInterval(() => setIsRinging(true), 7000);
    return () => clearInterval(ringInterval);
  }, []);

  // 4. useCallback untuk fungsi yang dikirim ke child/handler
  const scrollToProducts = useCallback(() => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // 2. useMemo untuk Feature Grid (Mencegah re-render button list)
  const featureGrid = useMemo(() => [
    {
      icon: ChefHat, title: "Custom Bowl", subtitle: "Racik bowl rujakmu sendiri",
      iconBg: "bg-mango/15", iconColor: "text-mango",
      onClick: () => {
        const product = products.find((p) => p.id === "custom-bowl");
        if (product) { addToCart(product); toggleCart(true); }
      },
    },
    {
      icon: Users, title: "Tampah Nusantara", subtitle: "Untuk acara & momen bersama",
      iconBg: "bg-forest/10", iconColor: "text-forest", badge: "Baru",
      onClick: () => {
        const product = products.find((p) => p.id === "tampah-nusantara");
        if (product) { addToCart(product); toggleCart(true); }
      },
    },
    {
      icon: Share2, title: "RUJAKferral", subtitle: "Bagikan kode, dapatkan hadiah",
      iconBg: "bg-chili/10", iconColor: "text-chili", onClick: () => {},
    },
    {
      icon: Gift, title: "RUJAK.Gift", subtitle: "Kirim kesegaran ke orang terdekat",
      iconBg: "bg-sage", iconColor: "text-forest", onClick: () => {},
    },
  ], [addToCart, toggleCart]);

  // 3. useMemo untuk Products Filter
  const filteredProducts = useMemo(() => {
    return activeCategory === "all" ? products : products.filter((p) => p.type === activeCategory);
  }, [activeCategory]);

  const waUrl = homepageConfig.social.whatsapp.url + "?text=" + encodeURIComponent("Halo RUJAK.Co, saya butuh bantuan.");

  return (
    <div className="min-h-screen bg-cream text-ink font-sans pb-24">
      <Header />

      <main className="md:pt-24">
        <section id="hero" className="relative scroll-mt-0 w-full">
          <div className="relative w-full overflow-hidden bg-forest min-h-[300px] sm:min-h-[320px] rounded-none md:max-w-2xl md:mx-auto md:rounded-[20px] md:shadow-sm">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={heroIndex}
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.05, filter: "blur(8px)" }} // 15. Cinematic Transition
                animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.02, filter: "blur(4px)" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                {heroSlides[heroIndex].image && (
                  <motion.img
                    src={heroSlides[heroIndex].image}
                    // 12. Alt text SEO Friendly & Accesibility
                    alt={heroSlides[heroIndex].title.replace(/\n/g, ' ')}
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ scale: 1.06 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: heroSlides[heroIndex].duration / 1000, ease: "linear" }}
                    fetchPriority="high"
                    loading="eager"
                    decoding="async"
                    // 7. Resolusi dinamis via sizes
                    sizes="(max-width: 768px) 100vw, 42rem"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-forest/95 via-forest/45 to-forest/15" />
              </motion.div>
            </AnimatePresence>

            <button
              type="button"
              aria-label="Notifikasi"
              className="absolute top-3.5 right-3.5 z-10 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white"
            >
              {/* 6. Bell dengan onAnimationComplete */}
              <motion.div
                animate={isRinging && !shouldReduceMotion ? { rotate: [0, -12, 12, -12, 12, 0] } : { rotate: 0 }}
                transition={{ duration: 0.6 }}
                onAnimationComplete={() => setIsRinging(false)}
                style={{ originX: 0.5, originY: 0.1 }}
              >
                <Bell className="w-4.5 h-4.5" />
              </motion.div>
            </button>

            <div className="relative z-[1] px-5 pt-14 pb-[4.5rem] min-h-[300px] sm:min-h-[320px] flex flex-col justify-end text-white">
              <AnimatePresence mode="wait">
                <motion.div key={`text-${heroIndex}`} initial="hidden" animate="show" exit="exit" variants={heroTextVariants}>
                  <motion.span variants={fadeUp} className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.08em] uppercase text-mango mb-2 w-fit">
                    <Sparkles className="w-3.5 h-3.5" />
                    {heroSlides[heroIndex].eyebrow}
                  </motion.span>
                  <motion.h1 variants={fadeUp} className="font-display text-[26px] sm:text-[28px] font-extrabold leading-[1.15] tracking-tight mb-1.5 whitespace-pre-line drop-shadow-sm">
                    {heroSlides[heroIndex].title}
                  </motion.h1>
                  <motion.p variants={fadeUp} className="text-[13px] font-medium text-white/90 max-w-[92%]">
                    {heroSlides[heroIndex].caption}
                  </motion.p>
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center gap-1.5 mt-5">
                {heroSlides.map((slide, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setHeroIndex(i)}
                    aria-label={`Lihat slide ${slide.eyebrow}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === heroIndex ? "w-5 bg-white" : "w-1.5 bg-white/45"}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 11. Greeting Card: whileTap & whileHover kombinasi */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            whileHover={shouldReduceMotion ? {} : { y: -2 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.99 }}
            transition={{ delay: 0.3 }}
            className="relative z-10 -mt-10 max-w-md md:max-w-2xl mx-auto px-4 cursor-default"
          >
            <div className="bg-white rounded-[18px] border border-paper-border px-5 py-4 shadow-[0_10px_28px_-10px_rgba(27,94,32,0.14)] transition-shadow hover:shadow-lg">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-display text-[18px] font-bold text-ink tracking-tight">
                    {userName ? `Hai ${userName.toUpperCase()}!` : "Hai, Selamat datang!"}
                  </p>
                  <p className="text-[13px] text-ink-muted mt-0.5 font-medium">Mau rujak segar yang mana hari ini?</p>
                </div>
                <div className="flex -space-x-1.5 shrink-0 pt-0.5" aria-hidden="true">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="w-7 h-7 rounded-full bg-mango border-2 border-white flex items-center justify-center shadow-sm" style={{ opacity: 1 - i * 0.08 }}>
                      <Coins className="w-3.5 h-3.5 text-ink" />
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sage/50 text-[12px] font-semibold text-forest border border-forest/10">
                  <Coins className="w-3.5 h-3.5" /> Poin &amp; Reward
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-paper-border text-[12px] font-semibold text-ink-soft">
                  <Sparkles className="w-3.5 h-3.5 text-mango" /> RUJAK.Plan
                </span>
              </div>
            </div>
          </motion.div>
        </section>

        <motion.div className="max-w-md md:max-w-2xl mx-auto px-4" variants={pageVariants} initial="hidden" animate="show">
          <motion.section variants={fadeUp} className="mt-6 mb-7">
            <h2 className="font-display text-[16px] font-bold text-ink tracking-tight mb-3">Pesan RUJAK.Co Sekarang?</h2>
            <div className="grid grid-cols-2 gap-3">
              {/* 9. Implementasi RippleButton */}
              <RippleButton onClick={scrollToProducts} rippleColor="bg-forest/20" className="text-left rounded-[16px] border border-forest/12 bg-gradient-to-br from-sage/70 to-sage/25 p-4 min-h-[108px] transition-shadow hover:shadow-md">
                <UtensilsCrossed className="absolute -bottom-2 -right-2 w-14 h-14 text-forest/12" aria-hidden="true" />
                <p className="relative font-bold text-[15px] text-forest tracking-tight">Pesan Menu</p>
                <p className="relative text-[12px] font-medium text-ink-muted mt-1 leading-snug">Lihat menu &amp; racik pesananmu</p>
              </RippleButton>
              <RippleButton onClick={scrollToProducts} rippleColor="bg-chili/20" className="text-left rounded-[16px] border border-chili/15 bg-gradient-to-br from-chili/[0.09] to-mango/20 p-4 min-h-[108px] transition-shadow hover:shadow-md">
                <Truck className="absolute -bottom-2 -right-2 w-14 h-14 text-chili/15" aria-hidden="true" />
                <p className="relative font-bold text-[15px] text-chili tracking-tight">Delivery</p>
                <p className="relative text-[12px] font-medium text-ink-muted mt-1 leading-snug">Segar &amp; tepat waktu, dijamin!</p>
              </RippleButton>
            </div>
          </motion.section>

          <motion.section variants={fadeUp} className="mb-7">
            <h2 className="font-display text-[16px] font-bold text-ink tracking-tight mb-3">Spesial Untukmu di RUJAK.Co</h2>
            <div className="grid grid-cols-2 gap-3">
              {featureGrid.map((f) => (
                <RippleButton key={f.title} onClick={f.onClick} className="text-left rounded-[16px] border border-paper-border bg-white p-4 min-h-[132px] hover:shadow-md transition-shadow">
                  {f.badge && <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-chili text-white text-[10px] font-bold tracking-wide">{f.badge}</span>}
                  <div className={`w-11 h-11 rounded-[14px] ${f.iconBg} flex items-center justify-center mb-3`}>
                    <f.icon className={`w-5 h-5 ${f.iconColor}`} />
                  </div>
                  <p className="font-bold text-[13px] text-ink leading-snug tracking-tight">{f.title}</p>
                  <p className="text-[12px] font-medium text-ink-muted mt-0.5 leading-snug">{f.subtitle}</p>
                </RippleButton>
              ))}
            </div>
          </motion.section>

          <motion.section variants={fadeUp} className="mb-8">
            <h2 className="font-display text-[16px] font-bold text-ink tracking-tight mb-3">Butuh Bantuan?</h2>
            <motion.a
              href={waUrl} target="_blank" rel="noopener noreferrer"
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              className="flex items-center gap-3 w-full rounded-2xl border border-paper-border bg-white px-4 py-3.5 hover:bg-paper/60 transition-colors"
            >
              <span className="w-9 h-9 rounded-full bg-[#25D366]/15 flex items-center justify-center shrink-0">
                <MessageCircle className="w-4.5 h-4.5 text-[#25D366]" />
              </span>
              <span className="flex-1 text-sm font-medium text-ink text-left">RUJAK.Co Customer Service</span>
              <ChevronRight className="w-4 h-4 text-ink-muted shrink-0" />
            </motion.a>
          </motion.section>

          <motion.section id="products" variants={fadeUp} className="scroll-mt-24">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-[16px] font-bold text-ink tracking-tight">Menu RUJAK.Co</h2>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-3 mb-1 no-scrollbar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id} type="button" onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${activeCategory === cat.id ? "bg-forest text-white shadow-sm" : "bg-white text-ink-soft border border-paper-border"}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <motion.div layout className="grid grid-cols-2 gap-3 mt-3 mb-8">
              {/* 8. AnimatePresence popLayout untuk transisi filter yang smooth */}
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id} layout="position" variants={fadeUp}
                    initial="hidden" animate="show" exit="exit"
                    whileHover={shouldReduceMotion ? {} : { y: -4 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 320, damping: 22 }}
                    className="bg-white rounded-2xl border border-paper-border overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="h-28 bg-sage/30">
                      <img src={product.image} alt={product.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3">
                      <p className="font-medium text-sm text-ink truncate">{product.name}</p>
                      <p className="text-xs text-ink-muted mt-0.5 line-clamp-1">{product.category}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-semibold text-forest">{formatCurrency(product.price)}</span>
                        <motion.button
                          type="button"
                          whileTap={shouldReduceMotion ? {} : { scale: 0.82 }}
                          whileHover={shouldReduceMotion ? {} : { scale: 1.08 }}
                          onClick={() => { addToCart(product); toggleCart(true); }}
                          aria-label={`Tambah ${product.name} ke keranjang`}
                          className="w-7 h-7 rounded-full bg-forest text-white flex items-center justify-center hover:bg-forest-light transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </motion.section>

          {/* 13. content-visibility: auto (Memangkas render time elemen out-of-viewport) */}
          <motion.section variants={fadeUp} className="grid grid-cols-1 gap-3 pb-2 [content-visibility:auto]">
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
          </motion.section>
        </motion.div>

        {/* 13. FAQ & Footer bisa memanfaatkan CSS content-visibility jika di dalam pembungkusnya atau ditambahkan via parent div */}
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

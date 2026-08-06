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
  MessageCircle,
  ChevronRight,
} from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "Semua" },
  { id: "rujak", label: "Rujak Buah" },
  { id: "asinan", label: "Asinan" },
  { id: "salad", label: "Salad Buah" },
] as const;

const pageVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const heroSlides = [
  {
    image: getProductById("rujak-segar")?.image,
    eyebrow: "Fresh Setiap Hari",
    title: "Beli Rujak Apapun\nDiskon 25%",
    caption: "S&K Berlaku",
    duration: 6000, 
  },
  {
    image: getProductById("rujak-gaco")?.image,
    eyebrow: "Signature Andalan",
    title: "Rujak Gaco Spesial\nGratis Ongkir",
    caption: "Tanpa minimum pembelian",
    duration: 5000,
  },
] as const;

interface RippleButtonProps extends HTMLMotionProps<"button"> {
  rippleColor?: string;
}
const RippleButton = ({ children, onClick, className, rippleColor = "bg-black/5", ...props }: RippleButtonProps) => {
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
      whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
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
  const shouldReduceMotion = useReducedMotion();
  const { addToCart, toggleCart, state } = useCart();
  
  // Menggunakan default user name berdasarkan preferensi lokal jika state kosong
  const userName = state.userName && state.userName !== "Tamu" ? state.userName : "NGOEDIONO";

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

  const scrollToProducts = useCallback(() => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const featureGrid = useMemo(() => [
    {
      image: "/images/icon-plan.webp", title: "RUJAK.Plan", subtitle: "Berlangganan jauh lebih untung",
      onClick: () => {},
    },
    {
      image: "/images/icon-essentials.webp", title: "Rujak Essentials", subtitle: "Bawa kesegaranmu dengan gaya baru",
      badge: "Baru", onClick: () => {},
    },
    {
      image: "/images/icon-catering.webp", title: "Catering", subtitle: "Rayakan momen spesial bareng kami",
      onClick: () => {},
    },
    {
      image: "/images/icon-referral.webp", title: "RUJAKferral", subtitle: "Bagikan kode referral, dapatkan hadiah",
      onClick: () => {},
    },
  ], []);

  const filteredProducts = useMemo(() => {
    return activeCategory === "all" ? products : products.filter((p) => p.type === activeCategory);
  }, [activeCategory]);

  const waUrl = homepageConfig.social.whatsapp.url + "?text=" + encodeURIComponent("Halo RUJAK.Co, saya butuh bantuan.");

  return (
    <div className="min-h-screen bg-white text-ink font-sans pb-[100px]">
      <Header />

      <main className="md:pt-24 bg-[#FAFAFA]">
        {/* HERO SECTION: Latar solid, tanpa gradient gelap, titik indikator klasik */}
        <section id="hero" className="relative scroll-mt-0 w-full bg-[#1A5C4A]">
          <div className="relative w-full h-[320px] md:max-w-2xl md:mx-auto">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={heroIndex}
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.02 }}
                animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                {/* Asumsikan foto ini adalah format PNG cut-out makanan/buah */}
                {heroSlides[heroIndex].image && (
                  <motion.img
                    src={heroSlides[heroIndex].image}
                    alt=""
                    className="absolute inset-0 w-full h-full object-contain object-center scale-110 opacity-90"
                    fetchPriority="high" loading="eager" decoding="async"
                  />
                )}
                
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 px-6 text-center">
                   <h1 className="font-display text-[34px] font-black leading-tight tracking-tight drop-shadow-md whitespace-pre-line">
                     {heroSlides[heroIndex].title}
                   </h1>
                   <p className="text-[12px] font-bold mt-2 opacity-90">
                     {heroSlides[heroIndex].caption}
                   </p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-[3.5rem] left-0 right-0 flex justify-center gap-1.5 z-20">
              {heroSlides.map((_, i) => (
                <button
                  key={i} type="button" onClick={() => setHeroIndex(i)} aria-label={`Slide ${i + 1}`}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === heroIndex ? "bg-white" : "bg-white/40"}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* GREETING CARD: Flat shadow, ornamen emas, border tipis, pil koin */}
        <div className="relative z-20 -mt-8 max-w-md md:max-w-2xl mx-auto px-4 cursor-default">
          <div className="bg-white rounded-[16px] border border-[#F0F0F0] px-5 py-5 shadow-[0_4px_24px_rgba(0,0,0,0.06)] relative overflow-hidden">
            
            {/* Ornamen pojok kanan atas ala Fore */}
            <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none opacity-80" aria-hidden="true">
               <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="80" cy="20" r="8" fill="#FDE047" opacity="0.6"/>
                  <circle cx="60" cy="40" r="12" fill="#FACC15" opacity="0.8"/>
                  <path d="M40 10L42 16L48 18L42 20L40 26L38 20L32 18L38 16L40 10Z" fill="#FEF08A"/>
               </svg>
            </div>

            <h2 className="font-display text-[18px] font-black text-ink tracking-tight relative z-10">
              Hai {userName.toUpperCase()}!
            </h2>
            
            <div className="flex gap-2.5 mt-4 relative z-10">
              <button className="flex items-center gap-1.5 px-3.5 py-1.5 border border-gray-200 rounded-full bg-white hover:bg-gray-50 transition-colors">
                <div className="w-4 h-4 rounded-full bg-[#8CA466] flex items-center justify-center">
                  <span className="text-[9px] text-white font-black">R</span>
                </div>
                <span className="text-[12px] font-black text-ink">0 Poin</span>
              </button>
              <button className="flex items-center gap-1.5 px-3.5 py-1.5 border border-gray-200 rounded-full bg-white hover:bg-gray-50 transition-colors">
                <div className="w-4 h-4 rounded-full bg-[#1A5C4A] flex items-center justify-center">
                  <span className="text-[9px] text-white font-black">Plan</span>
                </div>
                <span className="text-[12px] font-black text-ink">MyRujak Plan</span>
              </button>
            </div>
          </div>
        </div>

        <motion.div className="max-w-md md:max-w-2xl mx-auto px-4 mt-8" variants={pageVariants} initial="hidden" animate="show">
          
          {/* CTA ACTION: Latar putih, border tipis, warna tipografi kontekstual */}
          <motion.section variants={fadeUp} className="mb-8">
            <h2 className="font-display text-[18px] font-bold text-ink tracking-tight mb-4">Pesan RUJAK.Co Sekarang?</h2>
            <div className="grid grid-cols-2 gap-3">
              <RippleButton onClick={scrollToProducts} className="bg-white border border-[#F0F0F0] rounded-[16px] p-4 text-left relative h-[100px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1A5C4A 1px, transparent 1px)', backgroundSize: '12px 12px', maskImage: 'linear-gradient(to bottom right, transparent 40%, black 100%)' }}></div>
                <p className="relative z-10 font-black text-[16px] text-[#2F4F3F] tracking-tight">Pick Up</p>
                <p className="relative z-10 text-[11px] font-medium text-ink-muted mt-1 leading-snug w-[70%]">Ambil di store tanpa antri</p>
                <img src="/images/pickup-illustration.png" alt="" className="absolute -bottom-2 -right-2 w-16 opacity-95 pointer-events-none" />
              </RippleButton>

              <RippleButton onClick={scrollToProducts} className="bg-white border border-[#F0F0F0] rounded-[16px] p-4 text-left relative h-[100px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#C84B31 1px, transparent 1px)', backgroundSize: '12px 12px', maskImage: 'linear-gradient(to bottom right, transparent 40%, black 100%)' }}></div>
                <p className="relative z-10 font-black text-[16px] text-[#C84B31] tracking-tight">Delivery</p>
                <p className="relative z-10 text-[11px] font-medium text-ink-muted mt-1 leading-snug w-[75%]">Garansi tepat waktu, dijamin!</p>
                <img src="/images/delivery-illustration.png" alt="" className="absolute -bottom-2 -right-2 w-[70px] opacity-95 pointer-events-none" />
              </RippleButton>
            </div>
          </motion.section>

          {/* FEATURE GRID: Center aligned text, Lencana "Baru" menjorok keluar memotong sudut */}
          <motion.section variants={fadeUp} className="mb-10">
            <h2 className="font-display text-[18px] font-bold text-ink tracking-tight mb-4">Spesial Untukmu di RUJAK.Co</h2>
            <div className="grid grid-cols-2 gap-3">
              {featureGrid.map((f) => (
                <RippleButton key={f.title} onClick={f.onClick} className="bg-white border border-[#F0F0F0] rounded-[16px] p-5 flex flex-col items-center text-center relative shadow-[0_2px_12px_rgba(0,0,0,0.03)] h-[130px]">
                  {f.badge && (
                    <span className="absolute -top-2 -right-2 bg-[#C84B31] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-sm shadow-sm z-10">
                      {f.badge}
                    </span>
                  )}
                  <div className="w-[50px] h-[50px] mb-2">
                     <img src={f.image} alt="" className="w-full h-full object-contain" />
                  </div>
                  <p className="font-bold text-[13px] text-ink">{f.title}</p>
                  <p className="text-[11px] font-medium text-ink-muted mt-0.5 leading-snug">{f.subtitle}</p>
                </RippleButton>
              ))}
            </div>
          </motion.section>

          {/* CUSTOMER SERVICE: Clean white card */}
          <motion.section variants={fadeUp} className="mb-10">
            <h2 className="font-display text-[18px] font-bold text-ink tracking-tight mb-3">Butuh Bantuan?</h2>
            <motion.a
              href={waUrl} target="_blank" rel="noopener noreferrer"
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              className="flex items-center gap-3 w-full rounded-[16px] border border-[#F0F0F0] bg-white px-4 py-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)]"
            >
              <div className="w-8 h-8 rounded-full border border-green-100 flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5 text-[#25D366]" />
              </div>
              <span className="flex-1 text-[14px] font-bold text-ink text-left">RUJAK.Co Customer Service</span>
              <ChevronRight className="w-5 h-5 text-ink-muted shrink-0" />
            </motion.a>
          </motion.section>

          {/* PRODUCT LISTING */}
          <motion.section id="products" variants={fadeUp} className="scroll-mt-24 mb-10">
            <div className="flex gap-2 overflow-x-auto pb-4 mb-2 no-scrollbar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id} type="button" onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition-colors ${activeCategory === cat.id ? "bg-[#1A5C4A] text-white" : "bg-white text-ink border border-[#F0F0F0]"}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <motion.div layout className="grid grid-cols-2 gap-3">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id} layout="position" variants={fadeUp}
                    initial="hidden" animate="show" exit="exit"
                    whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                    className="bg-white rounded-[16px] border border-[#F0F0F0] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
                  >
                    <div className="h-32 bg-gray-50 relative p-2">
                      <img src={product.image} alt={product.name} loading="lazy" decoding="async" className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                    <div className="p-3">
                      <p className="font-bold text-[14px] text-ink truncate">{product.name}</p>
                      <p className="text-[11px] font-medium text-ink-muted mt-0.5 line-clamp-1">{product.category}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-[14px] font-bold text-[#1A5C4A]">{formatCurrency(product.price)}</span>
                        <motion.button
                          type="button"
                          whileTap={shouldReduceMotion ? {} : { scale: 0.82 }}
                          onClick={() => { addToCart(product); toggleCart(true); }}
                          aria-label={`Tambah ${product.name} ke keranjang`}
                          className="w-7 h-7 rounded-full bg-[#1A5C4A] text-white flex items-center justify-center"
                        >
                          <Plus className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </motion.section>

          {/* FOOTER INFO (CERTIFICATION) */}
          <motion.section variants={fadeUp} className="grid grid-cols-1 gap-4 pb-8 border-t border-[#F0F0F0] pt-6 [content-visibility:auto]">
            <div className="flex items-start gap-3 px-2">
              <ShieldCheck className="w-5 h-5 text-ink-muted shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-[12px] text-ink-muted">RUJAK.Co sudah tersertifikasi Halal oleh MUI</p>
              </div>
              <ChevronRight className="w-4 h-4 text-ink-muted shrink-0 ml-auto mt-0.5" />
            </div>
            <div className="flex items-start gap-3 px-2">
              <Clock className="w-5 h-5 text-ink-muted shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-[12px] text-ink-muted leading-snug">Diracik harian demi menjaga kesegaran buah dan kebersihan operasional.</p>
              </div>
            </div>
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

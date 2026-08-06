import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLocation } from "wouter";
import {
  Bell,
  Bike,
  ChevronRight,
  CircleHelp,
  Gift,
  Home as HomeIcon,
  MapPin,
  MessageCircle,
  Receipt,
  ShieldCheck,
  Sparkles,
  Ticket,
  User,
  UtensilsCrossed,
  Users,
  WalletCards,
} from "lucide-react";
import CartDrawer from "@/components/CartDrawer";
import CheckoutEnhanced from "@/components/CheckoutEnhanced";
import { products, getProductById, formatCurrency } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { homepageConfig } from "@/data/homepage";

const heroSlides = [
  {
    image: "/assets/hero/Banner.webp",
    eyebrow: "Segar setiap hari",
    title: "Indonesia dalam\nsatu wadah",
    caption: "Buah segar, sambal khas, diracik saat kamu pesan.",
  },
  {
    image: getProductById("rujak-gaco")?.image ?? "/assets/products/rujak-gaco-hd.webp",
    eyebrow: "Signature RUJAK.Co",
    title: "Rujak Gaco\nsambal mete spesial",
    caption: "Enam buah pilihan dengan rasa yang berani.",
  },
  {
    image: getProductById("rujak-mahkota")?.image ?? "/assets/products/rujak-mahkota-hd.webp",
    eyebrow: "Limited",
    title: "Rujak Mahkota\nuntuk momen istimewa",
    caption: "Shine Muscat, buah pilihan, sambal mete.",
  },
] as const;

const quickActions = [
  {
    title: "Pick Up",
    description: "Ambil di store\ntanpa antri",
    icon: MapPin,
    tone: "olive",
  },
  {
    title: "Delivery",
    description: "Garansi tepat\nwaktu, dijamin!",
    icon: Bike,
    tone: "orange",
  },
] as const;

export default function Home() {
  const [heroIndex, setHeroIndex] = useState(0);
  const [notificationCount] = useState(2);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const { state, itemCount, toggleCart, addToCart } = useCart();
  const reduceMotion = useReducedMotion();

  const userName = state.userName && state.userName !== "Tamu" ? state.userName : "NGOEDIONO";

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setHeroIndex((current) => (current + 1) % heroSlides.length);
    }, 6500);
    return () => window.clearTimeout(timer);
  }, [heroIndex]);

  const specials = useMemo(
    () => [
      {
        title: "RUJAK Plan",
        subtitle: "Berlangganan jauh lebih untung",
        icon: Sparkles,
        badge: undefined,
        onClick: () => {},
      },
      {
        title: "Tampah Rujak",
        subtitle: "Bawa minumanmu dengan gaya baru",
        icon: Users,
        badge: "Baru",
        onClick: () => {
          const product = products.find((product) => product.id === "tampah-nusantara");
          if (product) {
            addToCart(product);
            toggleCart(true);
          }
        },
      },
      {
        title: "Catering",
        subtitle: "Rayakan momen spesial bareng RUJAK",
        icon: UtensilsCrossed,
        badge: undefined,
        onClick: () => {},
      },
      {
        title: "RUJAKferral",
        subtitle: "Bagikan kode referral, dapatkan hadiah",
        icon: Gift,
        badge: undefined,
        onClick: () => {},
      },
      {
        title: "RUJAK Gift",
        subtitle: "Berbagi kebahagiaan dengan orang terdekat",
        icon: Gift,
        badge: undefined,
        onClick: () => {},
      },
    ],
    [addToCart, toggleCart],
  );

  const waUrl = `${homepageConfig.social.whatsapp.url}?text=${encodeURIComponent("Halo RUJAK.Co, saya butuh bantuan.")}`;

  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="rujak-home min-h-screen bg-white text-[#242424] pb-[88px]">
      {/* Hero Section with Overlapping Profile Card */}
      <section className="relative h-[480px] w-full overflow-visible bg-[#1c8c83] md:mx-auto md:max-w-[480px]">
        <div className="absolute inset-0 overflow-hidden">
          {heroSlides.map((slide, index) => (
            <motion.div
              key={slide.title}
              className="absolute inset-0"
              initial={false}
              animate={{ opacity: index === heroIndex ? 1 : 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.45 }}
            >
              <img
                src={slide.image}
                alt={slide.title.replace("\n", " ")}
                className="h-full w-full object-cover object-center"
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#087d75]/35 via-[#087d75]/10 to-[#087d75]/80" />
            </motion.div>
          ))}

          <div className="absolute left-0 right-0 top-[72px] z-10 px-6 text-white">
            <motion.p
              key={`eyebrow-${heroIndex}`}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-1 text-[13px] font-extrabold tracking-[-0.2px] opacity-90"
            >
              {heroSlides[heroIndex].eyebrow}
            </motion.p>
            <motion.h1
              key={`title-${heroIndex}`}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-[320px] whitespace-pre-line font-display text-[32px] font-extrabold leading-[1.05] tracking-[-1.2px]"
            >
              {heroSlides[heroIndex].title}
            </motion.h1>
            <motion.p
              key={`caption-${heroIndex}`}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduceMotion ? 0 : 0.05 }}
              className="mt-2 max-w-[280px] text-[13px] font-semibold leading-[1.3] text-white/90"
            >
              {heroSlides[heroIndex].caption}
            </motion.p>
          </div>

          <button
            type="button"
            aria-label="Notifikasi"
            className="absolute right-5 top-4 z-20 flex h-[44px] w-[44px] items-center justify-center rounded-full bg-black/40 text-white shadow-md backdrop-blur-md"
          >
            <Bell className="h-[22px] w-[22px] stroke-[2.2]" />
            <span className="absolute -right-1 -top-1 flex h-[20px] min-w-[20px] items-center justify-center rounded-full bg-[#d84b4b] px-1 text-[11px] font-extrabold text-white ring-2 ring-white/70">
              {notificationCount}
            </span>
          </button>
        </div>

        {/* Profile Card Overlapping Hero */}
        <section className="absolute left-5 right-5 top-[320px] z-30 rounded-[18px] border border-[#e9e9e9] bg-white px-[20px] pb-[16px] pt-[18px] shadow-[0_4px_16px_rgba(0,0,0,.08)]">
          <div className="flex items-center justify-between mb-[12px]">
            <div className="text-[20px] font-extrabold leading-none tracking-[-.6px]">Hai {userName}!</div>
            <div className="flex items-center gap-1 opacity-75">
              <span className="h-3 w-3 rounded-full bg-[#fce392]" />
              <span className="h-4 w-4 rounded-full bg-[#f3cb63]" />
              <span className="h-3 w-3 rounded-full bg-[#e0b041]" />
            </div>
          </div>
          <div className="border-t border-dashed border-[#e7e7e7]" />
          <div className="mt-[14px] flex items-center gap-[10px]">
            <button type="button" className="flex h-[38px] items-center gap-[8px] rounded-full border border-[#e6e6e6] px-[14px] text-[14px] font-extrabold text-[#2c2c2c]">
              <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#edf4df] text-[#6d8e57]">
                <Sparkles className="h-[12px] w-[12px]" />
              </span>
              0 Poin
            </button>
            <button type="button" className="flex h-[38px] items-center gap-[8px] rounded-full border border-[#e6e6e6] px-[14px] text-[14px] font-extrabold text-[#2c2c2c]">
              <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#eaf4ff] text-[#2876bc]">
                <WalletCards className="h-[12px] w-[12px]" />
              </span>
              RUJAK Plan
            </button>
          </div>
        </section>
      </section>

      {/* Main Container */}
      <main className="mx-auto w-full max-w-[480px] px-[20px] pt-[90px]">
        {/* Quick Actions (Pick Up / Delivery) */}
        <section className="mt-[16px]">
          <h2 className="mb-[16px] font-display text-[24px] font-extrabold leading-[1.1] tracking-[-.8px]">Pesan RUJAK.Co Sekarang?</h2>
          <div className="grid grid-cols-2 gap-[14px]">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.title}
                  type="button"
                  onClick={() => {
                    setActiveAction(action.title);
                    scrollToProducts();
                  }}
                  className={`relative h-[134px] overflow-hidden rounded-[16px] border text-left transition-transform active:scale-[.985] ${
                    action.tone === "olive"
                      ? "border-[#cbd39d] bg-[#f7f9e9]"
                      : "border-[#d9a267] bg-[#fff8f0]"
                  }`}
                >
                  <div className="absolute right-[-6px] top-[14px] h-[64px] w-[64px] rounded-full bg-white/60" />
                  <div className="absolute bottom-[12px] right-[12px] flex h-[50px] w-[50px] items-center justify-center rounded-full bg-white/90 shadow-sm">
                    <Icon className={`h-[26px] w-[26px] ${action.tone === "olive" ? "text-[#7b8645]" : "text-[#bc6a38]"}`} />
                  </div>
                  <div className="relative z-10 px-[16px] pt-[16px]">
                    <div className={`font-display text-[21px] font-extrabold leading-none tracking-[-.6px] ${action.tone === "olive" ? "text-[#63733f]" : "text-[#a65a35]"}`}>
                      {action.title}
                    </div>
                    <div className="mt-[10px] whitespace-pre-line text-[13px] font-medium leading-[1.25] text-[#666]">{action.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
          {activeAction && <span className="sr-only">{activeAction}</span>}
        </section>

        <div className="my-[26px] h-[8px] -mx-[20px] bg-[#f6f6f6]" />

        {/* Special Section Grid */}
        <section>
          <h2 className="mb-[16px] font-display text-[24px] font-extrabold leading-[1.1] tracking-[-.8px]">Spesial Untukmu di RUJAK.Co</h2>
          <div className="grid grid-cols-2 gap-[14px]">
            {specials.map((special) => {
              const Icon = special.icon;
              return (
                <button
                  key={special.title}
                  type="button"
                  onClick={special.onClick}
                  className="relative flex h-[180px] flex-col items-center rounded-[16px] border border-[#e7e7e7] bg-white px-[12px] pt-[22px] text-center shadow-[0_2px_8px_rgba(0,0,0,.06)] transition-transform active:scale-[.985]"
                >
                  {special.badge && <span className="absolute right-[-1px] top-[-1px] rounded-bl-[6px] rounded-tr-[15px] bg-[#d65a5a] px-[7px] py-[3px] text-[11px] font-extrabold text-white">{special.badge}</span>}
                  <span className="mb-[14px] flex h-[58px] w-[74px] items-center justify-center rounded-[18px] bg-[#f3f7f1] text-[#3f7659]">
                    <Icon className="h-[32px] w-[32px] stroke-[1.7]" />
                  </span>
                  <div className="font-display text-[17px] font-extrabold leading-[1.05] tracking-[-.4px]">{special.title}</div>
                  <div className="mt-[6px] max-w-[145px] text-[12px] font-medium leading-[1.25] text-[#727272]">{special.subtitle}</div>
                </button>
              );
            })}
          </div>
        </section>

        <div className="my-[26px] h-[8px] -mx-[20px] bg-[#f6f6f6]" />

        {/* Help Section */}
        <section className="pb-[4px]">
          <h2 className="mb-[14px] font-display text-[24px] font-extrabold leading-[1.1] tracking-[-.8px]">Butuh Bantuan?</h2>
          <a
            href={waUrl}
            className="flex h-[64px] items-center rounded-[14px] border border-[#ededed] bg-white px-[18px] shadow-[0_2px_8px_rgba(0,0,0,.05)]"
          >
            <MessageCircle className="h-[26px] w-[26px] text-[#25d366] stroke-[1.8]" />
            <span className="ml-[16px] flex-1 text-[15px] font-extrabold tracking-[-.2px]">RUJAK Customer Service (chat only)</span>
            <ChevronRight className="h-[18px] w-[18px] text-[#444]" />
          </a>
        </section>

        {/* Footer Certifications & Info */}
        <section className="mt-[24px] border-t border-dashed border-[#e6e6e6] pt-[20px] pb-[10px]">
          <div className="flex items-center gap-[16px] border-b border-dashed border-[#e6e6e6] pb-[16px]">
            <span className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#f7f7f7] text-[#6b6b6b]">
              <ShieldCheck className="h-[18px] w-[18px]" />
            </span>
            <div className="flex-1 text-[13px] font-medium leading-[1.3] text-[#757575]">RUJAK.Co sudah tersertifikasi halal oleh MUI</div>
            <ChevronRight className="h-[16px] w-[16px] text-[#555]" />
          </div>
          <div className="flex items-start gap-[16px] pt-[16px] text-[#858585]">
            <span className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full bg-[#f7f7f7]">
              <CircleHelp className="h-[18px] w-[18px]" />
            </span>
            <div className="text-[12px] font-medium leading-[1.35]">
              Dirjen Perlindungan Konsumen dan Tertib Niaga, Kementerian Perdagangan Republik Indonesia<br />
              <span className="font-bold text-[#666]">Whatsapp Dirjen PKTN: 0853-1111-1010</span>
            </div>
          </div>
        </section>

        {/* Menu Product Grid */}
        <section id="products" className="mt-[24px] scroll-mt-6 border-t border-[#f0f0f0] pt-[24px]">
          <div className="mb-[14px] flex items-end justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[.12em] text-[#8a8a8a]">Menu</div>
              <h2 className="mt-1 font-display text-[22px] font-extrabold tracking-[-.6px]">Pilih Rujakmu</h2>
            </div>
            <button type="button" onClick={() => toggleCart(true)} className="text-[13px] font-extrabold text-[#145a3a]">
              Keranjang {itemCount > 0 ? `(${itemCount})` : ""}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-[12px]">
            {products.slice(0, 6).map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => {
                  addToCart(product);
                  toggleCart(true);
                }}
                className="overflow-hidden rounded-[14px] border border-[#e9e9e9] bg-white text-left shadow-[0_2px_8px_rgba(0,0,0,.05)]"
              >
                <img src={product.image} alt={product.name} className="h-[140px] w-full object-cover" loading="lazy" />
                <div className="p-[12px]">
                  <div className="truncate text-[13px] font-extrabold">{product.name}</div>
                  <div className="mt-1 text-[12px] font-bold text-[#145a3a]">{formatCurrency(product.price)}</div>
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>

      <BottomNavigation itemCount={itemCount} onCart={() => toggleCart(true)} />
      <CartDrawer />
      <CheckoutEnhanced />
    </div>
  );
}

function BottomNavigation({ itemCount, onCart }: { itemCount: number; onCart: () => void }) {
  const [location, navigate] = useLocation();

  const items = [
    { label: "Home", icon: HomeIcon, active: location === "/", onClick: () => navigate("/") },
    { label: "Voucher", icon: Ticket, active: false, onClick: () => {} },
    { label: "Pesanan", icon: Receipt, active: location === "/lacak", onClick: onCart },
    { label: "Akun", icon: User, active: location === "/akun", onClick: () => {} },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#eeeeee] bg-white/98 backdrop-blur-md" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="mx-auto flex h-[62px] max-w-[480px] items-stretch px-[6px]">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.label} type="button" onClick={item.onClick} className={`relative flex flex-1 flex-col items-center justify-center gap-[3px] ${item.active ? "text-[#116a58]" : "text-[#777]"}`}>
              <span className="relative">
                <Icon className={`h-[22px] w-[22px] ${item.active ? "stroke-[2.7]" : "stroke-[2]"}`} />
                {item.label === "Pesanan" && itemCount > 0 && <span className="absolute -right-[7px] -top-[4px] flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-[#d84b4b] px-1 text-[9px] font-extrabold text-white">{itemCount}</span>}
              </span>
              <span className={`text-[11px] leading-none ${item.active ? "font-extrabold" : "font-semibold"}`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

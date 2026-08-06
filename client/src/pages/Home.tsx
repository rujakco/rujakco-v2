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
    description: "Ambil sendiri,\nlebih praktis",
    icon: MapPin,
    tone: "olive",
    action: "products",
  },
  {
    title: "Delivery",
    description: "Diantar sampai\nke tempatmu",
    icon: Bike,
    tone: "orange",
    action: "products",
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
        title: "Custom Bowl",
        subtitle: "Racik sesuai seleramu",
        icon: UtensilsCrossed,
        badge: undefined,
        onClick: () => {
          const product = products.find((product) => product.id === "custom-bowl");
          if (product) {
            addToCart(product);
            toggleCart(true);
          }
        },
      },
      {
        title: "Tampah Rujak",
        subtitle: "Untuk 8–10 orang",
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
        title: "RUJAKferral",
        subtitle: "Bagikan kode, dapat hadiah",
        icon: Sparkles,
        badge: undefined,
        onClick: () => {},
      },
      {
        title: "RUJAK.Gift",
        subtitle: "Berbagi kebahagiaan",
        icon: Gift,
        badge: undefined,
        onClick: () => {},
      },
      {
        title: "Menu Favorit",
        subtitle: "Lihat semua pilihan buah",
        icon: UtensilsCrossed,
        badge: undefined,
        onClick: () => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }),
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
      {/* Hero — intentionally full-bleed on mobile, matching the supplied reference geometry. */}
      <section className="relative h-[560px] w-full overflow-visible bg-[#1c8c83] md:mx-auto md:max-w-[480px] md:rounded-b-[28px]">
        <div className="absolute inset-0 overflow-hidden rounded-b-[28px]">
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
              <div className="absolute inset-0 bg-gradient-to-b from-[#087d75]/35 via-[#087d75]/10 to-[#087d75]/75" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(255,255,255,.12),transparent_42%)]" />
            </motion.div>
          ))}

          <div className="absolute left-0 right-0 top-[184px] z-10 px-8 text-white">
            <motion.p
              key={`eyebrow-${heroIndex}`}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-2 text-[14px] font-extrabold tracking-[-0.2px]"
            >
              {heroSlides[heroIndex].eyebrow}
            </motion.p>
            <motion.h1
              key={`title-${heroIndex}`}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-[330px] whitespace-pre-line font-display text-[34px] font-extrabold leading-[1.02] tracking-[-1.45px]"
            >
              {heroSlides[heroIndex].title}
            </motion.h1>
            <motion.p
              key={`caption-${heroIndex}`}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduceMotion ? 0 : 0.05 }}
              className="mt-3 max-w-[300px] text-[14px] font-semibold leading-[1.35] text-white/95"
            >
              {heroSlides[heroIndex].caption}
            </motion.p>
          </div>

          <button
            type="button"
            aria-label="Notifikasi"
            className="absolute right-5 top-5 z-20 flex h-[48px] w-[48px] items-center justify-center rounded-full bg-black/45 text-white shadow-[0_4px_18px_rgba(0,0,0,.18)] backdrop-blur-md"
          >
            <Bell className="h-[24px] w-[24px] stroke-[2.3]" />
            <span className="absolute -right-1 -top-1 flex h-[22px] min-w-[22px] items-center justify-center rounded-full bg-[#d84b4b] px-1 text-[12px] font-extrabold text-white ring-2 ring-white/70">
              {notificationCount}
            </span>
          </button>

          <div className="absolute bottom-[57px] left-1/2 z-20 flex -translate-x-1/2 items-center gap-[6px]">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.title}
                type="button"
                aria-label={`Slide ${index + 1}`}
                onClick={() => setHeroIndex(index)}
                className={`h-[7px] rounded-full transition-all ${index === heroIndex ? "w-[24px] bg-white" : "w-[7px] bg-white/60"}`}
              />
            ))}
          </div>
        </div>

        {/* Account card overlaps the hero, as in the reference. */}
        <section className="absolute left-5 right-5 top-[478px] z-30 h-[192px] rounded-[18px] border border-[#e9e9e9] bg-white px-[22px] pb-[18px] pt-[25px] shadow-[0_2px_12px_rgba(0,0,0,.09)]">
          <div className="pointer-events-none absolute right-5 top-5 flex items-end gap-1 opacity-70">
            <span className="h-3 w-3 rounded-full border-[2px] border-[#e7c46c]" />
            <span className="h-5 w-5 rounded-full bg-[#f5d27c]/60" />
            <span className="h-3 w-3 rounded-full bg-[#d7b04e]/70" />
          </div>
          <div className="mb-[20px] text-[22px] font-extrabold leading-none tracking-[-.8px]">Hai {userName}!</div>
          <div className="border-t border-dashed border-[#e7e7e7]" />
          <div className="mt-[18px] flex items-center gap-[10px]">
            <button type="button" className="flex h-[44px] items-center gap-[9px] rounded-full border border-[#e6e6e6] px-[17px] text-[16px] font-extrabold text-[#2c2c2c]">
              <span className="flex h-[27px] w-[27px] items-center justify-center rounded-full bg-[#edf4df] text-[#6d8e57]">
                <Sparkles className="h-[15px] w-[15px]" />
              </span>
              0 Poin
            </button>
            <button type="button" className="flex h-[44px] items-center gap-[9px] rounded-full border border-[#e6e6e6] px-[16px] text-[16px] font-extrabold text-[#2c2c2c]">
              <span className="flex h-[27px] w-[27px] items-center justify-center rounded-full bg-[#eaf4ff] text-[#2876bc]">
                <WalletCards className="h-[15px] w-[15px]" />
              </span>
              RUJAK Plan
            </button>
          </div>
        </section>
      </section>

      <main className="mx-auto w-full max-w-[480px] px-[22px] pt-[151px]">
        <section>
          <h2 className="mb-[18px] font-display text-[27px] font-extrabold leading-[1.08] tracking-[-1px]">Pesan RUJAK.Co Sekarang?</h2>
          <div className="grid grid-cols-2 gap-[22px]">
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
                  className={`relative h-[148px] overflow-hidden rounded-[17px] border text-left transition-transform active:scale-[.985] ${
                    action.tone === "olive"
                      ? "border-[#cbd39d] bg-[#f7f9e9]"
                      : "border-[#d9a267] bg-[#fff8f0]"
                  }`}
                >
                  <div className="absolute right-[-6px] top-[14px] h-[72px] w-[72px] rounded-full bg-white/60" />
                  <div className="absolute bottom-[13px] right-[12px] flex h-[60px] w-[60px] items-center justify-center rounded-full bg-white/80 shadow-sm">
                    <Icon className={`h-[31px] w-[31px] ${action.tone === "olive" ? "text-[#7b8645]" : "text-[#bc6a38]"}`} />
                  </div>
                  <div className="relative z-10 px-[20px] pt-[21px]">
                    <div className={`font-display text-[24px] font-extrabold leading-none tracking-[-.8px] ${action.tone === "olive" ? "text-[#63733f]" : "text-[#a65a35]"}`}>
                      {action.title}
                    </div>
                    <div className="mt-[13px] whitespace-pre-line text-[15px] font-medium leading-[1.2] text-[#777]">{action.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
          {activeAction && <span className="sr-only">{activeAction}</span>}
        </section>

        <div className="my-[31px] h-[8px] -mx-[22px] bg-[#f6f6f6]" />

        <section>
          <h2 className="mb-[20px] font-display text-[27px] font-extrabold leading-[1.08] tracking-[-1px]">Spesial Untukmu di RUJAK.Co</h2>
          <div className="grid grid-cols-2 gap-[24px]">
            {specials.map((special) => {
              const Icon = special.icon;
              return (
                <button
                  key={special.title}
                  type="button"
                  onClick={special.onClick}
                  className="relative flex h-[214px] flex-col items-center rounded-[17px] border border-[#e7e7e7] bg-white px-[15px] pt-[28px] text-center shadow-[0_2px_8px_rgba(0,0,0,.11)] transition-transform active:scale-[.985]"
                >
                  {special.badge && <span className="absolute right-[-1px] top-[-1px] rounded-bl-[7px] rounded-tr-[16px] bg-[#d65a5a] px-[8px] py-[5px] text-[13px] font-extrabold text-white">{special.badge}</span>}
                  <span className="mb-[24px] flex h-[72px] w-[90px] items-center justify-center rounded-[24px] bg-[#f3f7f1] text-[#3f7659]">
                    <Icon className="h-[43px] w-[43px] stroke-[1.7]" />
                  </span>
                  <div className="font-display text-[20px] font-extrabold leading-[1.05] tracking-[-.55px]">{special.title}</div>
                  <div className="mt-[12px] max-w-[155px] text-[15px] font-medium leading-[1.25] text-[#727272]">{special.subtitle}</div>
                </button>
              );
            })}
          </div>
        </section>

        <div className="my-[31px] h-[8px] -mx-[22px] bg-[#f6f6f6]" />

        <section className="pb-[4px]">
          <h2 className="mb-[18px] font-display text-[27px] font-extrabold leading-[1.08] tracking-[-1px]">Butuh Bantuan?</h2>
          <a
            href={waUrl}
            className="flex h-[72px] items-center rounded-[12px] border border-[#ededed] bg-white px-[25px] shadow-[0_2px_8px_rgba(0,0,0,.09)]"
          >
            <MessageCircle className="h-[31px] w-[31px] text-[#25d366] stroke-[1.8]" />
            <span className="ml-[24px] flex-1 text-[17px] font-extrabold tracking-[-.3px]">WhatsApp Customer Service</span>
            <ChevronRight className="h-[23px] w-[23px] text-[#444]" />
          </a>
        </section>

        <section className="mt-[32px] border-t border-dashed border-[#e6e6e6] pt-[28px] pb-[12px]">
          <div className="flex items-center gap-[22px] border-b border-dashed border-[#e6e6e6] pb-[25px]">
            <span className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-[#f7f7f7] text-[#6b6b6b]">
              <CircleHelp className="h-[22px] w-[22px]" />
            </span>
            <div className="flex-1 text-[15px] font-medium leading-[1.35] text-[#757575]">RUJAK.Co menjaga kualitas, kebersihan, dan keamanan produk setiap hari.</div>
            <ChevronRight className="h-[20px] w-[20px] text-[#555]" />
          </div>
          <div className="flex items-start gap-[22px] pt-[24px] text-[#858585]">
            <span className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-[#f7f7f7]">
              <Receipt className="h-[21px] w-[21px]" />
            </span>
            <div className="text-[15px] font-medium leading-[1.35]">Informasi pesanan, pengiriman, dan ketentuan layanan tersedia di proses checkout.</div>
          </div>
        </section>

        {/* Commerce remains available below the reference viewport; the initial Home composition above is intentionally clean. */}
        <section id="products" className="mt-[28px] scroll-mt-6 border-t border-[#f0f0f0] pt-[28px]">
          <div className="mb-[16px] flex items-end justify-between">
            <div>
              <div className="text-[12px] font-bold uppercase tracking-[.12em] text-[#8a8a8a]">Menu</div>
              <h2 className="mt-1 font-display text-[25px] font-extrabold tracking-[-.8px]">Pilih Rujakmu</h2>
            </div>
            <button type="button" onClick={() => toggleCart(true)} className="text-[13px] font-extrabold text-[#145a3a]">
              Keranjang {itemCount > 0 ? `(${itemCount})` : ""}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-[14px]">
            {products.slice(0, 6).map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => {
                  addToCart(product);
                  toggleCart(true);
                }}
                className="overflow-hidden rounded-[16px] border border-[#e9e9e9] bg-white text-left shadow-[0_2px_8px_rgba(0,0,0,.06)]"
              >
                <img src={product.image} alt={product.name} className="h-[150px] w-full object-cover" loading="lazy" />
                <div className="p-[13px]">
                  <div className="truncate text-[14px] font-extrabold">{product.name}</div>
                  <div className="mt-1 text-[13px] font-bold text-[#145a3a]">{formatCurrency(product.price)}</div>
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
      <div className="mx-auto flex h-[64px] max-w-[480px] items-stretch px-[6px]">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.label} type="button" onClick={item.onClick} className={`relative flex flex-1 flex-col items-center justify-center gap-[4px] ${item.active ? "text-[#116a58]" : "text-[#777]"}`}>
              <span className="relative">
                <Icon className={`h-[24px] w-[24px] ${item.active ? "stroke-[2.7]" : "stroke-[2]"}`} />
                {item.label === "Pesanan" && itemCount > 0 && <span className="absolute -right-[8px] -top-[5px] flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#d84b4b] px-1 text-[9px] font-extrabold text-white">{itemCount}</span>}
              </span>
              <span className={`text-[12px] leading-none ${item.active ? "font-extrabold" : "font-semibold"}`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

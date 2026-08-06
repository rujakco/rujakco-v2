import { useLocation } from "wouter";
import { Home as HomeIcon, UtensilsCrossed, ShoppingBag, PackageSearch } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export default function BottomNav() {
  const [location, navigate] = useLocation();
  const { itemCount, toggleCart } = useCart();

  const scrollToProducts = () => {
    if (location !== "/") {
      navigate("/");
      window.setTimeout(() => {
        document.getElementById("products")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
      return;
    }
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const items = [
    {
      id: "home",
      label: "Beranda",
      icon: HomeIcon,
      active: location === "/",
      onClick: () => navigate("/"),
    },
    {
      id: "menu",
      label: "Menu",
      icon: UtensilsCrossed,
      active: false,
      onClick: scrollToProducts,
    },
    {
      id: "cart",
      label: "Keranjang",
      icon: ShoppingBag,
      active: false,
      badge: itemCount > 0 ? itemCount : undefined,
      onClick: () => toggleCart(true),
    },
    {
      id: "lacak",
      label: "Pesanan",
      icon: PackageSearch,
      active: location === "/lacak",
      onClick: () => navigate("/lacak"),
    },
  ];

  return (
    <div
      // Memisahkan safe-area dan padding-bottom menggunakan calc() agar tetap melayang di iPhone/Android modern
      className="fixed bottom-0 left-0 right-0 z-40 px-4 pointer-events-none"
      style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))" }}
    >
      {/* Wrapper premium: glassmorphism, rounded-32px, dan shadow difusi */}
      <div className="max-w-md md:max-w-2xl mx-auto bg-white/90 backdrop-blur-xl border border-white/60 rounded-[32px] shadow-[0_12px_40px_rgba(0,0,0,0.12)] pointer-events-auto">
        <div className="flex items-center justify-around h-[72px] px-2">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = item.active;
            
            return (
              <button
                key={item.id}
                onClick={item.onClick}
                className={`flex flex-col items-center justify-center w-full h-full gap-1.5 transition-colors pt-1 ${
                  isActive ? "text-forest" : "text-ink-muted hover:text-forest"
                }`}
              >
                <div className="relative">
                  <Icon
                    className={`w-[24px] h-[24px] ${
                      isActive ? "fill-forest/20 stroke-forest drop-shadow-sm" : "stroke-[2px]"
                    }`}
                  />
                  {/* Badge notifikasi keranjang dengan gaya aplikasi native */}
                  {item.badge && (
                    <span className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-chili border-[1.5px] border-white text-white text-[10px] font-extrabold flex items-center justify-center shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] ${
                    isActive ? "font-extrabold" : "font-semibold"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

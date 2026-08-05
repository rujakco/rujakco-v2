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
    <nav
      className="bottom-nav fixed bottom-0 left-0 right-0 z-40"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="max-w-md mx-auto grid grid-cols-4 h-full items-center">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = item.active;
          return (
            <button
              key={item.id}
              onClick={item.onClick}
              className="relative flex flex-col items-center justify-center gap-1"
            >
              <span className="relative">
                <Icon
                  className={`bottom-nav-icon ${isActive ? "bottom-nav-active" : "text-ink-muted"}`}
                  strokeWidth={isActive ? 2.4 : 2}
                />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-chili text-white text-[10px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </span>
              <span
                className={`bottom-nav-label ${isActive ? "bottom-nav-active" : "text-ink-muted"}`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
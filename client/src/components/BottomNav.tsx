/*
 * RUJAK.Co — Experience Layer: Bottom Navigation
 * Mobile app-style fixed bottom bar, mirroring the Fore Coffee pattern:
 * Home / Menu / Cart (with live badge) / Lacak Pesanan.
 */

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
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-paper-border"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="max-w-md mx-auto grid grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={item.onClick}
              className="relative flex flex-col items-center justify-center gap-1 py-2.5 min-h-[56px]"
            >
              <span className="relative">
                <Icon
                  className={`w-5 h-5 transition-colors ${item.active ? "text-forest" : "text-ink-muted"}`}
                  strokeWidth={item.active ? 2.4 : 2}
                />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-chili text-white text-[10px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </span>
              <span
                className={`text-[11px] font-medium transition-colors ${item.active ? "text-forest" : "text-ink-muted"}`}
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

import { useLocation } from "wouter";
import { Home as HomeIcon, Ticket, Receipt, User } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export default function BottomNav() {
  const [location, navigate] = useLocation();
  const { itemCount, toggleCart } = useCart();
  const hasItems = itemCount > 0;

  const items = [
    {
      id: "home",
      label: "Home",
      icon: HomeIcon,
      active: location === "/",
      onClick: () => navigate("/"),
    },
    {
      id: "voucher",
      label: "Voucher",
      icon: Ticket,
      active: false,
      onClick: () => {}, // Ganti dengan navigasi halaman voucher jika ada
    },
    {
      id: "pesanan",
      label: "Pesanan",
      icon: Receipt,
      active: location === "/lacak",
      // Badge only renders once the cart actually has items.
      badge: hasItems ? itemCount : undefined,
      onClick: () => toggleCart(true), // Atau navigate("/lacak")
    },
    {
      id: "akun",
      label: "Akun",
      icon: User,
      active: location === "/akun",
      onClick: () => navigate("/akun"),
    },
  ];

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#ECECEC]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="max-w-md md:max-w-2xl mx-auto h-[82px] flex items-center justify-around px-2 pb-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = item.active;

          return (
            <button
              key={item.id}
              onClick={item.onClick}
              aria-label={item.label}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                isActive ? "text-forest" : "text-gray-400"
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? "fill-current stroke-current" : "stroke-[1.8px] fill-transparent"
                  }`}
                />
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 rounded-full bg-chili border border-white text-white text-[9px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[11px] ${isActive ? "font-bold" : "font-medium"}`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

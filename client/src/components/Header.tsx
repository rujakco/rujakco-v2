/*
 * RUJAK.Co â€” Experience Layer: Header
 * Bright, clean, with prominent brand mark.
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { homepageConfig } from "@/data/homepage";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { toggleCart, itemCount, state } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header
      className={`hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-xl shadow-sm" : "bg-cream/60 backdrop-blur-md"
      }`}
    >
      <div className="container flex items-center justify-between h-16 lg:h-20">
        {/* Logo â€” prominent brand mark */}
        <button onClick={() => scrollTo("hero")} className="flex items-center gap-2.5 group">
          <img
            src={homepageConfig.brand.logo}
            alt="RUJAK.Co"
            className="w-9 h-9 rounded-xl object-cover group-hover:scale-105 transition-transform shadow-sm"
          />
          <span className="font-display text-xl font-semibold tracking-tight text-ink">
            RUJAK<span className="text-forest">.Co</span>
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { id: "hero", label: "Beranda" },
            { id: "products", label: "Produk" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-sm font-medium text-ink-soft hover:text-forest transition-colors"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* User Info & Actions */}
        <div className="flex items-center gap-3">
          {state.userName && (
            <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-forest/5 text-sm font-medium text-forest">
              ðŸ‘‹ {state.userName}
            </div>
          )}
          <button
            onClick={() => toggleCart()}
            className="relative flex items-center gap-2 px-4 py-2.5 bg-forest text-white rounded-full text-sm font-medium hover:bg-forest-light transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm shadow-forest/20"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Reservasi</span>
            {itemCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-chili text-white text-xs font-bold rounded-full flex items-center justify-center"
              >
                {itemCount}
              </motion.span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

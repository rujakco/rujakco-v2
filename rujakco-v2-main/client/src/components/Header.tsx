/*
 * RUJAK.Co — Experience Layer: Header
 * Bright, clean, with prominent brand mark.
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { toggleCart, itemCount, state } = useCart();
  const userName = state.userName || 'Tamu';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setMobileOpen(false);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-sm"
            : "bg-cream/60 backdrop-blur-md"
        }`}
      >
        <div className="container flex items-center justify-between h-[68px] lg:h-[76px]">
          {/* Logo — prominent brand mark */}
          <button
            onClick={() => scrollTo("hero")}
            className="flex items-center gap-2.5 group"
          >
            <img
              src="https://dk1tnyskaoive0dn.public.blob.vercel-storage.com/logo.webp"
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
              { id: "fresh-today", label: "Fresh Today" },
              { id: "about", label: "Tentang" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="relative text-sm font-medium text-ink-soft hover:text-forest transition-colors py-1 after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-forest after:transition-all after:duration-300 hover:after:w-full"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* User Info & Actions */}
          <div className="flex items-center gap-3">
            {state.userName && (
              <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-forest/5 text-sm font-medium text-forest">
                👋 {state.userName}
              </div>
            )}
            <button
              onClick={() => toggleCart()}
              className="relative btn-premium-forest !h-10 !px-4 gap-2 text-sm"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Reservasi</span>
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-chili text-white text-xs font-bold rounded-full flex items-center justify-center elevation-1"
                >
                  {itemCount}
                </motion.span>
              )}
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-ink hover:bg-[#E8E5E0] transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-0 z-40 bg-white pt-20"
          >
            <nav className="container flex flex-col gap-6 pt-8">
              {[
                { id: "hero", label: "Beranda" },
                { id: "products", label: "Produk" },
                { id: "spotlight", label: "Pilihan Terbaik" },
                { id: "fresh-today", label: "Fresh Today" },
                { id: "live-kitchen", label: "Behind the Kitchen" },
                { id: "testimonials", label: "Testimoni" },
                { id: "faq", label: "FAQ" },
                { id: "about", label: "Tentang" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="font-display text-2xl text-left text-ink hover:text-forest transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

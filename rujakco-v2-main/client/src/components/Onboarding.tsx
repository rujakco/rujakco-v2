/*
 * RUJAK.Co — Experience Layer: Onboarding
 * First-visit overlay asking for user name. Stores in localStorage.
 * Returning users see a personalized welcome message.
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const STORAGE_KEY = "rujakco-onboarding-done";
const USER_NAME_KEY = "rujakco-user-name";

export default function Onboarding() {
  const { setUserName } = useCart();
  const [name, setName] = useState("");
  const [show, setShow] = useState(false);
  const [isReturning, setIsReturning] = useState(false);

  useEffect(() => {
    const done = localStorage.getItem(STORAGE_KEY);
    const savedName = localStorage.getItem(USER_NAME_KEY);
    
    if (!done) {
      // First time visitor
      setShow(true);
      setIsReturning(false);
    } else if (savedName) {
      // Returning user - show welcome briefly
      setName(savedName);
      setUserName(savedName);
      setIsReturning(true);
      setShow(true);
      // Auto-close after 3 seconds
      setTimeout(() => setShow(false), 3000);
    }
  }, [setUserName]);

  const handleSubmit = () => {
    if (name.trim()) {
      setUserName(name.trim());
      localStorage.setItem(USER_NAME_KEY, name.trim());
      localStorage.setItem(STORAGE_KEY, "true");
    }
    setShow(false);
  };

  const handleSkip = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setShow(false);
  };

  const handleReturningUserContinue = () => {
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 top-1/2 -translate-y-1/2 z-[60] w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8 text-center"
          >
            {!isReturning ? (
              <>
                <div className="w-14 h-14 bg-sage rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Leaf className="w-7 h-7 text-forest" />
                </div>
                <h2 className="font-display text-2xl font-semibold text-ink mb-2">
                  Selamat Datang
                </h2>
                <p className="text-sm text-ink-muted mb-6">
                  Siapa nama kamu? Kami akan menyapamu dengan lebih personal.
                </p>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="Nama kamu..."
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E5E0] text-center text-base focus:outline-none focus:border-forest/50 focus:ring-2 focus:ring-forest/10 mb-4"
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleSkip}
                    className="flex-1 py-2.5 text-sm text-ink-muted hover:text-ink transition-colors rounded-full border border-[#E8E5E0]"
                  >
                    Lewati
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!name.trim()}
                    className="flex-1 py-2.5 bg-forest text-white rounded-full text-sm font-semibold hover:bg-forest-light transition-all disabled:opacity-40 active:scale-[0.98]"
                  >
                    Mulai
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="w-14 h-14 bg-mango/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <span className="text-2xl">👋</span>
                </div>
                <h2 className="font-display text-2xl font-semibold text-ink mb-2">
                  Selamat Datang Kembali!
                </h2>
                <p className="text-sm text-ink-muted mb-6">
                  Senang melihat Anda lagi, <span className="text-forest font-semibold">{name}</span>. Siap memesan rujak segar hari ini?
                </p>
                <button
                  onClick={handleReturningUserContinue}
                  className="w-full py-2.5 bg-forest text-white rounded-full text-sm font-semibold hover:bg-forest-light transition-all active:scale-[0.98]"
                >
                  Lanjutkan
                </button>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

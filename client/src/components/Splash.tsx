/*
 * RUJAK.Co — Experience Layer: Splash Screen
 * First-paint screen ala Fore: full-bleed forest gradient, centered
 * logo + wordmark, auto-dismisses after a short delay. Pure presentation —
 * no routing/auth logic, doesn't gate anything, just an overlay that
 * unmounts itself via the onFinish callback.
 */

import { useEffect } from "react";
import { motion } from "framer-motion";

export default function Splash({ onFinish }: { onFinish: () => void }) {
  useEffect(() => {
    const t = window.setTimeout(onFinish, 1400);
    return () => window.clearTimeout(t);
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[100] bg-gradient-to-b from-forest-light to-forest flex flex-col items-center justify-center"
    >
      <div className="flex flex-col items-center pb-[8vh]">
        <div className="w-24 h-24 rounded-3xl bg-white shadow-lg p-3 flex items-center justify-center overflow-hidden">
          <img
            src="https://dk1tnyskaoive0dn.public.blob.vercel-storage.com/logo.webp"
            alt="RUJAK.Co"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
        <span className="mt-4 font-display text-3xl font-medium tracking-wide text-white">
          RUJAK<span className="opacity-80">.Co</span>
        </span>
      </div>
    </motion.div>
  );
}

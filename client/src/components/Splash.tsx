import { useEffect } from "react";
import { motion } from "framer-motion";

type SplashProps = {
  onFinish: () => void;
};

export default function Splash({ onFinish }: SplashProps) {
  useEffect(() => {
    const timer = window.setTimeout(onFinish, 1800);
    return () => window.clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] overflow-hidden bg-[#082E21] flex items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* Background Glow */}
      <motion.div
        className="absolute w-[420px] h-[420px] rounded-full bg-[#C5A059]/10 blur-[90px]"
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.35, 0.75, 0.35],
        }}
        transition={{
          repeat: Infinity,
          duration: 5,
          ease: "easeInOut",
        }}
      />

      {/* Decorative Ring */}
      <motion.div
        className="absolute w-72 h-72 rounded-full border border-white/10"
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          repeat: Infinity,
          duration: 4,
        }}
      />

      <div className="relative flex flex-col items-center">

        {/* Logo */}
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.8,
            y: 20,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <motion.div
            className="w-28 h-28 rounded-[30px] bg-white shadow-2xl p-4"
            animate={{
              scale: [1, 1.04, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 2.8,
            }}
          >
            <img
              src="/assets/brand/logo.webp"
              alt="RUJAK.CO"
              className="w-full h-full object-contain"
            />
          </motion.div>
        </motion.div>

        {/* Brand */}
        <motion.h1
          className="mt-8 text-white text-4xl font-bold tracking-[0.18em]"
          initial={{
            opacity: 0,
            y: 18,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.35,
            duration: 0.5,
          }}
        >
          RUJAK.CO
        </motion.h1>

        {/* Tagline */}
        <motion.p
          className="mt-3 text-white/70 tracking-[0.2em] uppercase text-xs"
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.55,
            duration: 0.5,
          }}
        >
          Indonesia dalam Satu Wadah
        </motion.p>

      </div>
    </motion.div>
  );
}
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const messages = [
  "Memilih buah terbaik...",
  "Meracik sambal khas...",
  "Menyiapkan pengalaman terbaik...",
];

export default function LoadingExperience() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-[#082E21] flex flex-col items-center justify-center text-white"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.img
        src="/assets/brand/logo.webp"
        alt="Rujak.co"
        className="w-24 h-24 object-contain"
        animate={{
          scale: [1, 1.06, 1],
          rotate: [0, 2, -2, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: "easeInOut",
        }}
      />

      <motion.h1
        className="mt-6 text-2xl font-bold tracking-wide"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        RUJAK.CO
      </motion.h1>

      <p className="text-green-100 mt-2 text-sm">
        Indonesia dalam Satu Wadah
      </p>

      <div className="h-10 mt-10 flex items-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={messages[index]}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.35 }}
            className="text-green-50 text-base"
          >
            {messages[index]}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="w-56 h-1.5 rounded-full bg-white/15 overflow-hidden mt-8">
        <motion.div
          className="h-full bg-[#C5A059]"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{
            duration: 3.8,
            ease: "linear",
          }}
        />
      </div>
    </motion.div>
  );
}
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const steps = [
  {
    title: "Memilih buah terbaik",
    subtitle: "Buah segar dipilih setiap pagi.",
    icon: "🥭",
  },
  {
    title: "Meracik sambal khas",
    subtitle: "Perpaduan pedas, manis, dan asam yang sempurna.",
    icon: "🌶️",
  },
  {
    title: "Menyiapkan pengalaman terbaik",
    subtitle: "Sebentar lagi kamu masuk ke Rujak.co.",
    icon: "✨",
  },
];

export default function LoadingExperience() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) =>
        prev < steps.length - 1 ? prev + 1 : prev
      );
    }, 1200);

    return () => clearInterval(timer);
  }, []);

  const progress = ((index + 1) / steps.length) * 100;

  return (
    <motion.div
      className="fixed inset-0 z-[9998] bg-[#082E21] flex flex-col items-center justify-center px-6"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.img
        src="/assets/brand/logo.webp"
        alt="RUJAK.CO"
        className="w-24 h-24"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 2.5,
        }}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className="mt-10 text-center"
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: -20,
          }}
          transition={{
            duration: 0.35,
          }}
        >
          <div className="text-5xl">
            {steps[index].icon}
          </div>

          <h2 className="mt-6 text-white text-2xl font-semibold">
            {steps[index].title}
          </h2>

          <p className="mt-2 text-white/70">
            {steps[index].subtitle}
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="w-64 mt-12 h-2 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full bg-[#C5A059]"
          animate={{
            width: `${progress}%`,
          }}
          transition={{
            duration: 0.5,
          }}
        />
      </div>

      <p className="text-white/50 text-sm mt-4">
        Menyiapkan aplikasi...
      </p>
    </motion.div>
  );
}
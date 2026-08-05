import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const steps = [
  {
    emoji: "🥭",
    title: "Memilih Mangga Terbaik",
    subtitle: "Buah segar dipilih setiap pagi."
  },
  {
    emoji: "🌶️",
    title: "Meracik Sambal Rahasia",
    subtitle: "Perpaduan pedas, manis, dan asam yang khas."
  },
  {
    emoji: "🥜",
    title: "Menambahkan Kacang Sangrai",
    subtitle: "Aroma gurih untuk rasa yang lebih kaya."
  },
  {
    emoji: "✨",
    title: "Pengalaman Siap Dinikmati",
    subtitle: "Sebentar lagi kamu masuk ke Rujak.co."
  }
];

export default function LoadingExperience() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => Math.min(s + 1, steps.length - 1));
    }, 950);

    return () => clearInterval(interval);
  }, []);

  const progress = ((step + 1) / steps.length) * 100;

  return (
    <motion.div
      className="fixed inset-0 z-[9998] bg-[#082E21] flex flex-col justify-center items-center px-8"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <AnimatePresence mode="wait">

        <motion.div
          key={step}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: .45 }}
          className="text-center"
        >
          <motion.div
            animate={{
              scale: [1, 1.12, 1],
              rotate: [0, 6, -6, 0]
            }}
            transition={{
              repeat: Infinity,
              duration: 2.8
            }}
            className="text-7xl"
          >
            {steps[step].emoji}
          </motion.div>

          <h2 className="mt-8 text-white text-2xl font-bold">
            {steps[step].title}
          </h2>

          <p className="mt-3 text-white/70 max-w-sm">
            {steps[step].subtitle}
          </p>

        </motion.div>

      </AnimatePresence>

      <div className="w-64 mt-16 h-2 rounded-full bg-white/10 overflow-hidden">

        <motion.div
          className="h-full bg-[#C5A059]"
          animate={{
            width: `${progress}%`
          }}
          transition={{
            duration: .7
          }}
        />

      </div>

      <p className="mt-4 text-white/45 text-sm">
        Menyiapkan pengalaman terbaik...
      </p>

    </motion.div>
  );
}
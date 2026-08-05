import { useEffect } from "react";
import { motion } from "framer-motion";

export default function Splash({
  onFinish,
}: {
  onFinish: () => void;
}) {
  useEffect(() => {
    const t = window.setTimeout(onFinish, 1800);
    return () => window.clearTimeout(t);
  }, [onFinish]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] overflow-hidden bg-[#082E21] flex items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: .6,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* Background Glow */}

      <motion.div
        className="absolute w-[420px] h-[420px] rounded-full bg-[#C5A059]/10 blur-[90px]"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [.4, .8, .4],
        }}
        transition={{
          repeat: Infinity,
          duration: 5,
          ease: "easeInOut",
        }}
      />

      {/* Ring */}

      <motion.div
        className="absolute w-72 h-72 rounded-full border border-white/8"
        animate={{
          scale: [1, 1.08, 1],
          opacity: [.15, .35, .15],
        }}
        transition={{
          repeat: Infinity,
          duration: 4,
        }}
      />

      <div className="relative flex flex-col items-center">

        <motion.div
          initial={{
            opacity: 0,
            scale: .75,
            y: 30,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          transition={{
            duration: .8,
            ease: [0.22,1,0.36,1],
          }}
        >
          <motion.div
            animate={{
              scale: [1,1.04,1],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
            }}
            className="w-28 h-28 rounded-[30px] bg-white shadow-2xl flex items-center justify-center p-4"
          >
            <img
              src="/assets/brand/logo.webp"
              alt="RUJAK.Co"
              className="w-full h-full object-contain"
            />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{
            opacity:0,
            y:18,
          }}
          animate={{
            opacity:1,
            y:0,
          }}
          transition={{
            delay:.35,
            duration:.55,
          }}
          className="mt-8 text-4xl font-display text-white tracking-[0.18em]"
        >
          RUJAK.CO
        </motion.h1>

        <motion.p
          initial={{
            opacity:0,
            y:14,
          }}
          animate={{
            opacity:.85,
            y:0,
          }}
          transition={{
            delay:.55,
            duration:.5,
          }}
          className="mt-3 text-white/70 tracking-widest text-sm uppercase"
        >
          Indonesia dalam Satu Wadah
        </motion.p>

      </div>
    </motion.div>
  );
}
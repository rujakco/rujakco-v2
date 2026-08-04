/*
 * RUJAK.Co — Experience Layer: Hero Section
 * Content from hero.ts.
 * Style: Bright editorial, sunlit, fresh — NOT dark/moody.
 * Cream base with fruit-accented highlights.
 */

import { motion } from "framer-motion";
import { Leaf, Timer, Flame } from "lucide-react";
import { heroConfig } from "@/data/hero";

const iconMap: Record<string, React.ElementType> = {
  leaf: Leaf,
  timer: Timer,
  flame: Flame,
};

export default function Hero() {
  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[92vh] lg:min-h-screen flex items-center overflow-hidden bg-cream">
      {/* Background — bright food photography with lighter overlay */}
      <div className="absolute inset-0">
        <img
          src={heroConfig.image}
          alt={heroConfig.tagline}
          className="w-full h-full object-cover opacity-60"
        />
        {/* Bright gradient — cream on left fading to image on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/80 to-cream/20" />
        {/* Subtle depth layer — grounds the composition without darkening the bright palette */}
        <div className="absolute inset-0 bg-gradient-to-t from-cream/40 via-transparent to-transparent" />
      </div>

      {/* Decorative fruit accents */}
      <div className="absolute top-12 right-8 w-20 h-20 bg-mango/20 rounded-full blur-2xl" />
      <div className="absolute bottom-24 left-12 w-32 h-32 bg-forest/10 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-chili/15 rounded-full blur-xl" />

      {/* Content */}
      <div className="container relative z-10 pt-28 pb-20 lg:pt-36 lg:pb-32">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-forest text-sm font-medium tracking-wider uppercase mb-4"
          >
            {heroConfig.tagline}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-ink font-light leading-[1.08] tracking-tight mb-6 whitespace-pre-line"
          >
            {heroConfig.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-ink-soft text-lg lg:text-xl mb-8 max-w-md"
          >
            {heroConfig.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-wrap gap-4 mb-12"
          >
            <button
              onClick={scrollToProducts}
              className="btn-premium-forest text-[15px]"
            >
              {heroConfig.ctaPrimary.text}
            </button>
            <button
              onClick={scrollToProducts}
              className="btn-premium-secondary text-[15px]"
            >
              {heroConfig.ctaSecondary.text}
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="flex gap-8 sm:gap-12"
          >
            {heroConfig.stats.map((stat, i) => {
              const Icon = iconMap[["leaf", "timer", "flame"][i]] || Leaf;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white elevation-1 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-forest" />
                  </div>
                  <div>
                    <div className="text-ink font-display text-2xl font-semibold">{stat.value}</div>
                    <div className="text-ink-muted text-xs">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Fresh Badge Float */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        className="absolute bottom-8 right-4 sm:right-8 lg:right-16 z-10"
      >
        <div className="chip-float px-5 py-3 flex items-center gap-3">
          <div className="w-8 h-8 bg-sage rounded-full flex items-center justify-center">
            <Leaf className="w-4 h-4 text-forest" />
          </div>
          <div>
            <div className="text-xs text-ink-muted font-medium">Fresh-Prep</div>
            <div className="text-sm font-semibold text-ink">Dipotong 15 menit lalu</div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

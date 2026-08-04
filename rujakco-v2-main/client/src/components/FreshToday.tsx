/*
 * RUJAK.Co — Experience Layer: Fresh Today Section
 * Content from fresh.ts. Countdown timer, features, commitment.
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Timer, Package, Snowflake } from "lucide-react";
import { freshConfig } from "@/data/fresh";

function useCountdown() {
  const [time, setTime] = useState({ hours: 2, minutes: 30, seconds: 0 });
  useEffect(() => {
    const id = setInterval(() => {
      setTime((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; minutes = 59; seconds = 59; }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

const iconMap: Record<string, React.ElementType> = {
  timer: Timer,
  package: Package,
  snowflake: Snowflake,
};

export default function FreshToday() {
  const t = useCountdown();
  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <section id="fresh-today" className="section-padding bg-forest text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
      </div>

      <div className="container relative z-10">
        <div className="text-center mb-12">
          <p className="text-white/50 text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            {freshConfig.overline}
          </p>
          <h2 className="font-display text-3xl lg:text-5xl font-light text-white mb-4">
            {freshConfig.title}
          </h2>
          <p className="text-white/70 max-w-md mx-auto">{freshConfig.subtitle}</p>
        </div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex justify-center gap-3 sm:gap-5 mb-16"
        >
          {[
            { value: pad(t.hours), label: "Jam" },
            { value: pad(t.minutes), label: "Menit" },
            { value: pad(t.seconds), label: "Detik" },
          ].map((block, i) => (
            <div key={i} className="flex items-center gap-3 sm:gap-5">
              {i > 0 && <span className="text-white/40 text-3xl font-display">:</span>}
              <div className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mb-2">
                  <span className="font-display text-2xl sm:text-3xl font-semibold tabular-nums">
                    {block.value}
                  </span>
                </div>
                <span className="text-white/50 text-xs">{block.label}</span>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
          {freshConfig.features.map((f, i) => {
            const Icon = iconMap[f.icon] || Timer;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-display text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{f.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Commitment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
        >
          <h4 className="font-display text-xl font-semibold text-white mb-3">
            {freshConfig.commitment.title}
          </h4>
          <p className="text-white/70 leading-relaxed">{freshConfig.commitment.text}</p>
        </motion.div>
      </div>
    </section>
  );
}

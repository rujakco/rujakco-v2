/*
 * RUJAK.Co — Experience Layer: Live Kitchen Section
 * Content from liveKitchen.ts. Behind-the-scenes storytelling.
 */

import { motion } from "framer-motion";
import { Search, Droplets, ChefHat, Package, Play } from "lucide-react";
import { liveKitchenConfig } from "@/data/liveKitchen";

const iconMap: Record<string, React.ElementType> = {
  search: Search,
  droplets: Droplets,
  "chef-hat": ChefHat,
  package: Package,
};

export default function LiveKitchen() {
  return (
    <section id="live-kitchen" className="section-padding bg-paper">
      <div className="container">
        <div className="text-center mb-14">
          <p className="overline text-center mb-2">{liveKitchenConfig.overline}</p>
          <h2 className="font-display text-3xl lg:text-4xl font-medium text-ink mb-4">
            {liveKitchenConfig.title}
          </h2>
          <p className="text-ink-muted max-w-lg mx-auto">{liveKitchenConfig.subtitle}</p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-14">
          {liveKitchenConfig.steps.map((step, i) => {
            const Icon = iconMap[step.icon] || Package;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="relative bg-white rounded-2xl p-6 border border-[#E8E5E0] text-center hover:shadow-lg transition-shadow"
              >
                <span className="absolute -top-3 left-6 px-2 py-0.5 bg-forest text-white text-xs font-bold rounded-full">
                  {step.number}
                </span>
                <div className="w-12 h-12 bg-sage/50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-forest" />
                </div>
                <h3 className="font-display text-lg font-semibold text-ink mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-ink-muted leading-relaxed">{step.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Video / Cover Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto relative rounded-2xl overflow-hidden aspect-video group"
        >
          <img
            src={liveKitchenConfig.coverImage}
            alt="Di balik dapur RUJAK.Co"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6 text-forest ml-1" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

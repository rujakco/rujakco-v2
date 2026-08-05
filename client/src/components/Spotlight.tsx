/*
 * RUJAK.Co — Experience Layer: Spotlight Section
 * Content from spotlight.ts and products.ts.
 * Asymmetrical editorial layout — one large, two stacked.
 */

import { motion } from "framer-motion";
import { Star, ArrowRight, Sparkles } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { products, formatCurrency, getBadgeLabel } from "@/data/products";
import { spotlightConfig } from "@/data/spotlight";
import { toast } from "sonner";

export default function Spotlight() {
  const { addToCart } = useCart();
  const featured = products.filter((p) =>
    spotlightConfig.featuredTags.includes(p.tag)
  );

  if (featured.length < 2) return null;

  const [main, ...others] = featured;

  return (
    <section id="spotlight" className="section-padding bg-white">
      <div className="container">
        <div className="text-center mb-14">
          <p className="overline text-center mb-2">{spotlightConfig.overline}</p>
          <h2 className="font-display text-3xl lg:text-4xl font-medium text-ink mb-4">
            {spotlightConfig.title}
          </h2>
          <p className="text-ink-muted max-w-md mx-auto">
            {spotlightConfig.subtitle}
          </p>
        </div>

        {/* Asymmetrical grid: 1 large + 2 stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
          {/* Main featured — large */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="lg:col-span-3 group relative rounded-2xl overflow-hidden bg-sage/30"
          >
            <div className="flex flex-col sm:flex-row">
              <div className="relative w-full sm:w-64 h-64 sm:h-auto flex-shrink-0">
                <img
                  src={main.image}
                  alt={main.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6 lg:p-8 flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-forest/10 text-forest text-xs font-semibold rounded-full">
                    <Star className="w-3 h-3" />
                    {getBadgeLabel(main.tag)}
                  </span>
                </div>
                <h3 className="font-display text-2xl font-semibold text-ink mb-3">
                  {main.name}
                </h3>
                <p className="text-ink-muted leading-relaxed mb-6">
                  {main.description}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-display text-xl font-semibold text-forest">
                    {formatCurrency(main.price)}
                  </span>
                  <button
                    onClick={() => {
                      addToCart(main, 1, main.spiceLevel?.default || 3);
                      toast.success(`${main.name} ditambahkan`);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-forest text-white rounded-full text-sm font-semibold hover:bg-forest-light transition-all hover:scale-105 active:scale-95 shadow-sm"
                  >
                    Pesan
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Two stacked cards */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {others.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 * (i + 1), ease: [0.23, 1, 0.32, 1] }}
                className="group flex gap-4 bg-sage/20 rounded-2xl p-4 hover:shadow-lg transition-shadow"
              >
                <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <Sparkles className="absolute top-1 right-1 w-3.5 h-3.5 text-mango" />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <span className="text-xs text-ink-muted uppercase tracking-wider mb-1">
                    {getBadgeLabel(product.tag)}
                  </span>
                  <h4 className="font-display text-base font-semibold text-ink mb-1">
                    {product.name}
                  </h4>
                  <p className="text-xs text-ink-muted line-clamp-2 mb-3">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-base font-semibold text-forest">
                      {formatCurrency(product.price)}
                    </span>
                    <button
                      onClick={() => {
                        addToCart(product, 1, product.spiceLevel?.default || 3);
                        toast.success(`${product.name} ditambahkan`);
                      }}
                      className="text-xs font-medium text-forest hover:text-forest-light flex items-center gap-1 transition-colors"
                    >
                      Pesan <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

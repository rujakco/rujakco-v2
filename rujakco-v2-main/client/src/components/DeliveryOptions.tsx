/*
 * RUJAK.Co — Experience Layer: Delivery Options Info (presentational, no transaction logic)
 * Displays delivery partners available for the area.
 */

import { motion } from "framer-motion";
import { Truck, Clock, MapPin } from "lucide-react";
import { homepageConfig } from "@/data/homepage";
import { formatCurrency } from "@/data/products";
import { calculateShipping } from "@/lib/shipping-utils";

// Each option's cheapest possible price (shortest distance, 1 item),
// matching the same formula used at checkout so this promise is never
// broken by the actual charge later. "ekspres" = Lalamove prioritas tier.
const startingCostByOption: Record<string, number> = {
  lalamove: calculateShipping(0, 1, "lalamove", "reguler").cost ?? homepageConfig.delivery.cost,
  paxel: calculateShipping(0, 1, "paxel", "reguler").cost ?? homepageConfig.delivery.cost,
  ekspres: calculateShipping(0, 1, "lalamove", "prioritas").cost ?? homepageConfig.delivery.cost,
};

export default function DeliveryOptions() {
  return (
    <section className="section-padding bg-paper">
      <div className="container">
        <div className="text-center mb-12">
          <p className="overline text-center mb-2">Pengantaran</p>
          <h2 className="font-display text-3xl lg:text-4xl font-medium text-ink mb-4">
            Sampai di Depan Pintumu
          </h2>
          <p className="text-ink-muted max-w-md mx-auto">
            Kami bekerja sama dengan kurir terpercaya untuk memastikan pesananmu sampai dalam kondisi terbaik.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {homepageConfig.delivery.options.map((opt, i) => (
            <motion.div
              key={opt.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="bg-white rounded-2xl p-6 border border-[#E8E5E0] hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-sage/50 rounded-xl flex items-center justify-center">
                  <Truck className="w-5 h-5 text-forest" />
                </div>
                <h3 className="font-display text-lg font-semibold text-ink">{opt.name}</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-ink-muted">
                  <Clock className="w-4 h-4 text-ink-muted/60" />
                  <span>{opt.eta}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-ink-muted">
                  <MapPin className="w-4 h-4 text-ink-muted/60" />
                  <span>{opt.description}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[#E8E5E0]">
                <span className="text-forest font-semibold text-sm">
                  Mulai {formatCurrency(startingCostByOption[opt.id] ?? homepageConfig.delivery.cost)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

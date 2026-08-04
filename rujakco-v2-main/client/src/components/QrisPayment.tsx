/*
 * RUJAK.Co — Commerce Layer: QRIS Payment Screen (Step 3 of 3)
 * Mirrors main's #paymentModal exactly: QRIS frame, total with a gold
 * accent divider, three decorative guide icons (Struk / Bayar / Kabari),
 * and a single CTA — "Validasi Reservasi via WhatsApp" — that opens
 * WhatsApp with the prefilled receipt message and saves the order.
 *
 * Order confirmation (with the full receipt preview + Kembali/Lanjut)
 * happens one step earlier, in CheckoutEnhanced's "confirm" step — by the
 * time this screen renders, the struk has already been generated,
 * downloaded, and sent to Telegram.
 */

import { motion } from "framer-motion";
import { Download, ScanLine, MessageCircle, Loader2, Check } from "lucide-react";
import { formatCurrency } from "@/data/products";

const QRIS_IMAGE_URL = "https://dk1tnyskaoive0dn.public.blob.vercel-storage.com/QrisCrop.webp";

interface QrisPaymentProps {
  total: number;
  isLoading: boolean;
  onValidate: () => void;
}

const GUIDE_STEPS = [
  { icon: Download, label: "1. Struk" },
  { icon: ScanLine, label: "2. Bayar" },
  { icon: MessageCircle, label: "3. Kabari" },
] as const;

export default function QrisPayment({ total, isLoading, onValidate }: QrisPaymentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="px-6 py-5 max-h-[65vh] overflow-y-auto">
        {/* QRIS frame */}
        <div className="flex justify-center mb-4">
          <div className="rounded-2xl border border-[#E8E5E0] p-3 bg-white shadow-sm">
            <img
              src={QRIS_IMAGE_URL}
              alt="QRIS RUJAK.Co"
              width={280}
              height={280}
              className="w-64 h-64 object-contain"
            />
          </div>
        </div>

        {/* Total, set off from the QRIS above by a gold accent line */}
        <div className="text-center pt-4 mb-5 border-t-2 border-mango">
          <p className="text-xs text-ink-muted uppercase tracking-wider mb-1">Total Tagihan</p>
          <p className="font-display text-2xl font-bold text-forest">{formatCurrency(total)}</p>
        </div>

        {/* 3 decorative guide icons — Struk / Bayar / Kabari */}
        <div className="flex justify-center gap-3 mb-2">
          {GUIDE_STEPS.map(({ icon: Icon, label }, i) => {
            const isLast = i === GUIDE_STEPS.length - 1;
            return (
              <div key={label} className="flex-1 flex flex-col items-center gap-1.5 text-center">
                <div
                  className={`w-11 h-11 rounded-full border flex items-center justify-center ${
                    isLast ? "bg-forest/10 border-forest" : "bg-[#FEFDF8] border-[#E8E5E0]"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isLast ? "text-forest" : "text-ink-muted"}`} />
                </div>
                <span className={`text-[11px] ${isLast ? "text-forest font-medium" : "text-ink-muted"}`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer — single CTA, does both the WhatsApp handoff and the DB save */}
      <div className="px-6 py-4 border-t border-[#E8E5E0] bg-[#FEFDF8]">
        <button
          onClick={onValidate}
          disabled={isLoading}
          className="w-full py-3 bg-ink text-white rounded-full font-semibold hover:bg-ink/90 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Memproses...
            </>
          ) : (
            <>
              <Check className="w-5 h-5" />
              Validasi Reservasi via WhatsApp
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}

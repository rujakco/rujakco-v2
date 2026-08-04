/*
 * RUJAK.Co — Receipt Template
 * Rendered off-screen (never visible to the user) purely so html2canvas
 * can capture it into a downloadable/shareable PNG struk. Mirrors main's
 * modules/checkout-receipt.js layout: brand header, "NOTA RESERVASI"
 * stamp, PIN box, itemized sections, trust badge, closing quote, payment
 * guide, and — importantly — the QRIS code embedded directly in the
 * image, so the single downloaded PNG is scan-ready on its own.
 */

import { formatCurrency } from "@/data/products";
import type { CartItem } from "@/contexts/CartContext";

const LOGO_URL = "https://dk1tnyskaoive0dn.public.blob.vercel-storage.com/logo.webp";
const QRIS_URL = "https://dk1tnyskaoive0dn.public.blob.vercel-storage.com/QrisCrop.webp";

interface ReceiptTemplateProps {
  elementId: string;
  orderCode: string;
  pin: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  deliveryTime: string;
  notes: string;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  shippingLabel: string;
  total: number;
  haversineUsed?: boolean;
  /** Set false to render a text-only fallback (no logo/QRIS <img>), used
   * when the CDN doesn't return CORS headers html2canvas needs to export
   * a canvas containing those cross-origin images. */
  includeImages?: boolean;
  /** Set true to render this inline as the actual "Preview Struk" step the
   * customer sees (step 2/3), instead of the default off-screen-only
   * capture target. Same markup either way — what gets shown is exactly
   * what gets captured into the PNG. */
  visible?: boolean;
}

export default function ReceiptTemplate({
  elementId,
  orderCode,
  pin,
  customerName,
  customerPhone,
  customerAddress,
  deliveryTime,
  notes,
  items,
  subtotal,
  shippingCost,
  shippingLabel,
  total,
  haversineUsed,
  includeImages = true,
  visible = false,
}: ReceiptTemplateProps) {
  const now = new Date();
  const dateStr = now.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
  const timeStr = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";

  return (
    <div
      id={elementId}
      style={visible ? { width: "100%", maxWidth: 380, margin: "0 auto" } : { position: "fixed", top: 0, left: -9999, width: 380 }}
      className={`bg-white p-5 font-sans text-ink relative overflow-hidden ${
        visible ? "rounded-2xl border border-[#E8E5E0] shadow-sm" : ""
      }`}
    >
      {/* Watermark stamp */}
      <div
        style={{
          position: "absolute",
          top: 90,
          right: -20,
          transform: "rotate(18deg)",
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: 2,
          color: "rgba(27,94,32,0.12)",
          border: "2px solid rgba(27,94,32,0.15)",
          borderRadius: 6,
          padding: "3px 10px",
        }}
      >
        NOTA RESERVASI
      </div>

      <p className="text-center font-display text-base text-forest mb-2">Struk Reservasi</p>

      {/* Brand header */}
      <div className="text-center mb-3">
        {includeImages ? (
          <img
            src={LOGO_URL}
            alt="RUJAK.Co"
            crossOrigin="anonymous"
            className="w-12 h-12 rounded-xl object-cover mx-auto mb-1.5"
          />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-forest text-white flex items-center justify-center mx-auto mb-1.5 font-display font-bold text-lg">
            R
          </div>
        )}
        <p className="font-display text-lg font-bold text-forest">RUJAK.Co</p>
        <p className="text-[11px] text-ink-muted italic">Indonesia dalam Satu Wadah</p>
        <p className="text-[10px] text-ink-muted tracking-wide mt-1">
          WA: +62 896-7716-1680 · rujakco.biz.id
        </p>
      </div>

      {/* Order code + date/time */}
      <div className="flex justify-between items-center text-xs border-t border-dashed border-[#ccc] pt-2 mb-2">
        <span className="font-semibold text-forest">{orderCode}</span>
        <span className="text-ink-muted">{dateStr} · {timeStr}</span>
      </div>

      {/* PIN box */}
      <div className="text-center bg-[#FAF8F2] border border-dashed border-mango/40 rounded-lg py-2 px-3 mb-3">
        <p className="text-[10px] uppercase tracking-wider text-ink-muted">PIN Lacak Pesanan</p>
        <p className="text-lg font-bold tracking-[0.2em] text-forest">{pin}</p>
        <p className="text-[10px] text-ink-muted mt-0.5">Simpan PIN ini untuk cek status di rujakco.biz.id/lacak</p>
      </div>

      {/* Data Pengantaran */}
      <div className="mb-3">
        <p className="text-[11px] font-bold uppercase tracking-wide text-forest mb-1.5">Data Pengantaran</p>
        <div className="text-xs space-y-1">
          <div className="flex justify-between"><span className="text-ink-muted">Nama Penerima</span><span className="font-medium">{customerName}</span></div>
          <div className="flex justify-between"><span className="text-ink-muted">No. Telepon</span><span className="font-medium">{customerPhone}</span></div>
          <div className="flex justify-between gap-3"><span className="text-ink-muted flex-shrink-0">Alamat Tujuan</span><span className="font-medium text-right">{customerAddress}</span></div>
          <div className="flex justify-between"><span className="text-ink-muted">Waktu Antar</span><span className="font-medium">{deliveryTime}</span></div>
          <div className="flex justify-between"><span className="text-ink-muted">Metode Kurir</span><span className="font-semibold text-forest">{shippingLabel}</span></div>
          {notes ? <div className="flex justify-between gap-3"><span className="text-ink-muted flex-shrink-0">Catatan</span><span className="text-right">{notes}</span></div> : null}
          {haversineUsed ? (
            <p className="text-[10px] text-mango pt-0.5">* Jarak dihitung Haversine, ongkir estimasi.</p>
          ) : null}
        </div>
      </div>

      {/* Items */}
      <div className="mb-3 border-t border-dashed border-[#ccc] pt-2.5">
        <p className="text-[11px] font-bold uppercase tracking-wide text-forest mb-1.5">Rincian Sajian Fresh-Prep</p>
        {items.map((item) => (
          <div key={item.product.id} className="mb-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold">{item.product.name}{item.spiceLevel ? ` [Lv ${item.spiceLevel}]` : ""}</span>
              <span className="font-semibold">{formatCurrency(item.product.price * item.qty)}</span>
            </div>
            <p className="text-[10px] text-ink-muted">{item.qty} pcs x {formatCurrency(item.product.price)}</p>
          </div>
        ))}
      </div>

      {/* Payment breakdown */}
      <div className="border-t border-dashed border-[#ccc] pt-2.5 mb-3">
        <p className="text-[11px] font-bold uppercase tracking-wide text-forest mb-1.5">Rincian Pembayaran</p>
        <div className="text-xs space-y-1">
          <div className="flex justify-between"><span className="text-ink-muted">Subtotal Produk</span><span>{formatCurrency(subtotal)}</span></div>
          <div className="flex justify-between"><span className="text-ink-muted">Ongkos Kirim</span><span>{formatCurrency(shippingCost)}</span></div>
          <div className="flex justify-between border-t border-dashed border-[#ccc] mt-1 pt-1"><span className="text-ink-muted">Metode Bayar</span><span>QRIS Otomatis</span></div>
          <div className="flex justify-between font-bold text-sm pt-1"><span>Total Tagihan</span><span className="text-forest">{formatCurrency(total)}</span></div>
        </div>
      </div>

      {/* Trust badge */}
      <div className="bg-[#FAF8F2] border border-mango/30 rounded-xl p-3 mb-3 text-left">
        <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-forest mb-1">
          🛡 Jaminan Kualitas RUJAK.Co
        </p>
        <p className="text-[10px] text-ink-muted leading-relaxed">
          Buah dipotong segar tepat 15 menit sebelum kurir berangkat. Sambal dikemas terpisah untuk menjaga kerenyahan maksimal.
        </p>
      </div>

      {/* Closing quote */}
      <p className="font-display italic text-center text-xs text-ink-soft mb-3">
        "Asam, pedas, manis, segar — terima kasih telah memilih RUJAK.Co."
      </p>

      {/* Payment guide */}
      <div className="bg-[#FAF8F2] border border-[#E8E5E0] rounded-lg p-3 mb-3 text-left">
        <p className="text-[10px] font-bold uppercase tracking-wide text-forest mb-1.5">
          💡 Panduan Transaksi Instan via Ponsel
        </p>
        <ol className="text-[10px] text-ink-muted leading-relaxed list-decimal list-inside space-y-0.5">
          <li><strong>Simpan Nota:</strong> Gambar struk ini otomatis tersimpan.</li>
          <li><strong>Buka Aplikasi:</strong> Buka m-Banking / E-Wallet pilihan Anda.</li>
          <li><strong>Pindai via Galeri:</strong> Pilih menu QRIS/Scan, tekan ikon galeri, pilih foto struk ini.</li>
          <li><strong>Konfirmasi WhatsApp:</strong> Kirim bukti transfer beserta foto struk ini ke WhatsApp kami.</li>
        </ol>
      </div>

      {/* Embedded QRIS — makes the downloaded PNG scan-ready on its own */}
      {includeImages ? (
        <div className="flex justify-center">
          <img
            src={QRIS_URL}
            alt="Scan QRIS RUJAK.Co"
            crossOrigin="anonymous"
            className="w-40 h-40 object-contain"
          />
        </div>
      ) : (
        <p className="text-center text-[10px] text-mango font-medium">
          Kode QRIS tersedia di layar pembayaran — struk ini versi teks.
        </p>
      )}

      <p className="text-center text-[10px] text-ink-muted mt-3">
        Terima kasih sudah memesan di RUJAK.Co 🌿
      </p>
    </div>
  );
}


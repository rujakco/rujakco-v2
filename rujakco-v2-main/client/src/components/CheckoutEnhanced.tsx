/*
 * RUJAK.Co — Commerce Layer: Enhanced Checkout Modal
 * WhatsApp-based ordering flow with Supabase integration and offline queue.
 *
 * Refactored into checkout/ subcomponents (CheckoutForm, UploadReceipt,
 * PaymentSection, OrderSummary, DeliverySection) — this file is now the
 * orchestrator: it owns all checkout state and the handlers that talk to
 * Supabase/WhatsApp/offline-queue, and renders the right step's UI.
 * Behavior is unchanged from the pre-refactor version; only the JSX was
 * split out into presentational components.
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency } from "@/data/products";
import { homepageConfig } from "@/data/homepage";
import { toast } from "sonner";
import { getSupabaseClient, saveOrder, sendReceiptToTelegram } from "@/lib/supabase-client";
import { queueOfflineOrder } from "@/utils/supabase";
import { generateOrderCode, generatePIN, createWhatsAppMessage, isSubtotalTrustworthy } from "@/lib/order-utils";
import { calculateShipping } from "@/lib/shipping-utils";
import { useDelivery } from "@/contexts/DeliveryContext";
import { generateReceiptPNG } from "@/lib/receipt";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import UploadReceipt, { RECEIPT_ELEMENT_ID, RECEIPT_ELEMENT_ID_FALLBACK } from "@/components/checkout/UploadReceipt";
import PaymentSection from "@/components/checkout/PaymentSection";
import { deliveryOptionToShipping } from "@/components/checkout/DeliverySection";

export default function CheckoutEnhanced() {
  const { state, setCheckout, clearCart } = useCart();
  const deliveryCtx = useDelivery();
  const [address, setAddress] = useState("");
  const [customerName, setCustomerName] = useState(state.userName || "");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryOption, setDeliveryOption] = useState(homepageConfig.delivery.options[0].id);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"form" | "confirm" | "payment">("form");
  const [pendingOrder, setPendingOrder] = useState<{ orderCode: string; accessPin: string } | null>(null);

  // Dynamic shipping: use the real distance once resolved via useDelivery;
  // fall back to the static config cost so checkout still works before the
  // user shares a location (no distance yet).
  // NOTE: kept above the `checkoutOpen` early return below so hook count
  // stays consistent across renders (Rules of Hooks).
  const qty = state.items.reduce((s, i) => s + i.qty, 0);
  const shippingMapping = deliveryOptionToShipping[deliveryOption] ?? deliveryOptionToShipping.lalamove;
  const shippingResult = useMemo(() => {
    if (deliveryCtx.state.userDistance == null) return null;
    return calculateShipping(
      deliveryCtx.state.userDistance,
      qty,
      shippingMapping.provider,
      shippingMapping.tier
    );
  }, [deliveryCtx.state.userDistance, qty, shippingMapping.provider, shippingMapping.tier]);

  if (!state.checkoutOpen) return null;

  const selectedDelivery = homepageConfig.delivery.options.find((o) => o.id === deliveryOption);

  const subtotal = state.items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const shippingCost = shippingResult?.cost ?? homepageConfig.delivery.cost;
  const shippingLabel = shippingResult?.label ?? selectedDelivery?.name ?? "Reguler";
  const total = subtotal + shippingCost;

  const handleSelectDeliveryOption = (id: string) => {
    setDeliveryOption(id);
    const mapping = deliveryOptionToShipping[id] ?? deliveryOptionToShipping.lalamove;
    deliveryCtx.setShippingProvider(mapping.provider);
    deliveryCtx.setTier(mapping.tier);
  };

  const goToConfirm = () => {
    // Validation
    if (!customerName.trim()) {
      setError("Mohon isi nama penerima");
      toast.error("Mohon isi nama penerima");
      return;
    }
    if (!customerPhone.trim()) {
      setError("Mohon isi nomor HP");
      toast.error("Mohon isi nomor HP");
      return;
    }
    if (!address.trim()) {
      setError("Mohon isi alamat pengantaran");
      toast.error("Mohon isi alamat pengantaran");
      return;
    }

    setError(null);
    // Lock in the order code/PIN now so the receipt preview, the QRIS
    // step, and the WhatsApp message that follows it all reference the
    // same order.
    setPendingOrder({ orderCode: generateOrderCode(), accessPin: generatePIN() });
    setStep("confirm");
  };

  // Step 2 → 3: "Lanjut ke Pembayaran" on the receipt preview. Generates
  // the struk PNG (local download + best-effort Supabase Storage upload)
  // and pings Telegram, then moves on to the QRIS screen. Mirrors main's
  // orderConfirmLanjut handler — none of this touches the database yet;
  // that only happens once the customer validates via WhatsApp.
  const handleConfirmOrder = async () => {
    if (!pendingOrder) return;

    setIsLoading(true);
    try {
      const { orderCode } = pendingOrder;

      let receipt = await generateReceiptPNG(RECEIPT_ELEMENT_ID, orderCode);
      if (!receipt.localDownload && (receipt.error === "capture-failed-cors" || receipt.error === "tainted-canvas")) {
        console.warn("[Receipt] Primary (with images) failed, retrying with text-only fallback...");
        receipt = await generateReceiptPNG(RECEIPT_ELEMENT_ID_FALLBACK, orderCode);
        if (receipt.localDownload) {
          toast.info("Struk berhasil diunduh (versi teks — logo & QRIS gagal dimuat).");
        }
      }
      if (!receipt.localDownload) {
        toast.warning("⚠️ Gagal membuat struk, namun pesanan tetap dilanjutkan.");
      }

      // Notify admin via Telegram regardless of whether the receipt PNG
      // upload succeeded — a broken image shouldn't mean the admin never
      // hears about the order. Falls back to a caption-only ping.
      const telegramCaption =
        `🧾 *Order Baru:* ${orderCode}\n👤 ${customerName.trim()}\n📞 ${customerPhone.trim()}\n💰 Total: ${formatCurrency(total)}` +
        (receipt.uploadUrl ? "" : "\n⚠️ _Struk gambar gagal dibuat — cek order ini manual._");
      sendReceiptToTelegram(orderCode, receipt.uploadUrl || "", telegramCaption).then((sent) => {
        if (!sent) console.warn("[Telegram] Notification did not go through for order:", orderCode);
      });

      setStep("payment");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan";
      toast.error(errorMsg);
      console.error("Receipt step error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: "Validasi Reservasi via WhatsApp" on the QRIS screen. This is
  // what actually saves the order to the database and hands the customer
  // off to WhatsApp — mirrors main's confirm-wa handler.
  const handleValidateWhatsApp = async () => {
    if (!pendingOrder) return;

    setIsLoading(true);
    setError(null);

    try {
      const { orderCode, accessPin } = pendingOrder;

      // Sanity check: subtotal must match the trusted product catalog.
      // See computeTrustedSubtotal in order-utils.ts for what this does
      // and doesn't guard against.
      if (!isSubtotalTrustworthy(state.items, subtotal)) {
        const msg = "Ada ketidaksesuaian harga di keranjang. Mohon refresh halaman dan coba lagi.";
        setError(msg);
        toast.error(msg);
        console.error("[Checkout] Subtotal mismatch vs product catalog — refusing to submit order.", {
          statedSubtotal: subtotal,
          items: state.items.map((i) => ({ id: i.product.id, variant: i.variant?.id, price: i.product.price, qty: i.qty })),
        });
        setIsLoading(false);
        return;
      }

      const orderData = {
        order_code: orderCode,
        access_pin: accessPin,
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        customer_address: address.trim(),
        district: deliveryCtx.state.selectedDistrict || "Bekasi",
        distance_km: deliveryCtx.state.userDistance,
        items: state.items.map((item) => ({
          name: `${item.product.name}${item.variant ? ` (${item.variant.label})` : ""}`,
          qty: item.qty,
          spiceLevel: item.spiceLevel,
          price: item.product.price,
        })),
        subtotal,
        shipping_cost: shippingCost,
        total,
        shipping_provider: shippingLabel,
        delivery_time: selectedDelivery?.eta || "Besok Pagi",
        notes: notes.trim() || "",
        status: "pending_payment" as const,
        created_at: new Date().toISOString(),
      } as any;

      // Try to save to Supabase
      let savedToDb = false;
      try {
        const client = await getSupabaseClient();
        if (client) {
          await saveOrder(orderData);
          savedToDb = true;
          console.log("✅ Order saved to Supabase:", orderCode);
        }
      } catch (dbError) {
        console.warn("⚠️ Failed to save to Supabase, queueing offline:", dbError);
        // Queue for offline retry
        queueOfflineOrder(orderData);
      }

      // Format and send WhatsApp message
      const message = createWhatsAppMessage(
        orderCode,
        accessPin,
        orderData.customer_name,
        orderData.customer_phone,
        orderData.customer_address,
        orderData.delivery_time,
        orderData.notes,
        state.items,
        subtotal,
        shippingCost,
        total,
        shippingLabel,
        deliveryCtx.state.userDistance
      );
      const waUrl = `https://wa.me/${homepageConfig.contact.whatsapp}?text=${encodeURIComponent(message)}`;

      // Open WhatsApp — check whether it actually opened, since popup
      // blockers can silently swallow this if it fires too far from the
      // original click.
      const newWindow = window.open(waUrl, "_blank", "noopener");

      if (newWindow) {
        toast.success(`Pesanan ${orderCode} dikirim ke WhatsApp!`);
      } else {
        toast.error("Browser memblokir pembukaan WhatsApp otomatis.", {
          action: {
            label: "Buka WhatsApp",
            onClick: () => window.open(waUrl, "_blank", "noopener"),
          },
          duration: 20000,
        });
      }
      if (savedToDb) {
        toast.success("Pesanan juga tersimpan di database kami");
      } else {
        toast.info("Pesanan akan tersimpan saat koneksi kembali");
      }

      // Clear cart and close modal
      clearCart();
      setCheckout(false);
      setCustomerName("");
      setCustomerPhone("");
      setAddress("");
      setNotes("");
      setStep("form");
      setPendingOrder(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(errorMsg);
      toast.error(errorMsg);
      console.error("Checkout error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    if (isLoading) return;
    setCheckout(false);
    setStep("form");
    setPendingOrder(null);
  };

  return (
    <AnimatePresence>
      {state.checkoutOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 top-1/2 -translate-y-1/2 z-50 w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E5E0]">
              <h2 className="font-display text-lg font-semibold text-ink">
                {step === "form" ? "Checkout" : step === "confirm" ? "Konfirmasi Pesanan" : "Pembayaran QRIS"}
              </h2>
              <button
                onClick={closeModal}
                disabled={isLoading}
                className="p-2 rounded-full hover:bg-[#E8E5E0] transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5 text-ink-muted" />
              </button>
            </div>

            {step === "confirm" && pendingOrder ? (
              <UploadReceipt
                orderCode={pendingOrder.orderCode}
                accessPin={pendingOrder.accessPin}
                customerName={customerName}
                customerPhone={customerPhone}
                address={address}
                deliveryTime={selectedDelivery?.eta || "Besok Pagi"}
                notes={notes}
                items={state.items}
                subtotal={subtotal}
                shippingCost={shippingCost}
                shippingLabel={shippingLabel}
                total={total}
                haversineUsed={deliveryCtx.state.haversineUsed}
                isLoading={isLoading}
                onBack={() => setStep("form")}
                onConfirm={handleConfirmOrder}
              />
            ) : step === "payment" && pendingOrder ? (
              <PaymentSection total={total} isLoading={isLoading} onValidate={handleValidateWhatsApp} />
            ) : (
              <CheckoutForm
                items={state.items}
                error={error}
                isLoading={isLoading}
                total={total}
                customerName={customerName}
                setCustomerName={setCustomerName}
                customerPhone={customerPhone}
                setCustomerPhone={setCustomerPhone}
                notes={notes}
                setNotes={setNotes}
                address={address}
                setAddress={setAddress}
                qty={qty}
                deliveryOption={deliveryOption}
                onSelectDeliveryOption={handleSelectDeliveryOption}
                onSubmit={goToConfirm}
              />
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

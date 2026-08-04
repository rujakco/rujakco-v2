import { SYSTEM } from './config';
import { CartItem } from '@/contexts/CartContext';
import { products } from '@/data/products';

/**
 * Recompute a cart's subtotal from the trusted product catalog
 * (client/src/data/products.ts) rather than trusting item.product.price
 * as carried in cart/component state.
 *
 * This is a sanity check, not a security boundary: it catches state bugs
 * (stale price after a catalog update, a bad merge in CartContext, etc.)
 * and casual tampering, but anyone with devtools access can still edit
 * the running JS. The order is only ever fulfilled after a human admin
 * manually reconciles the actual bank/QRIS transfer against the WhatsApp
 * message (see createWhatsAppMessage below) and the receipt — this check
 * exists to catch the total shown to that admin from silently drifting
 * from the real catalog, not to replace that manual verification. A
 * proper fix would re-price the order server-side (e.g. a Supabase Edge
 * Function) before insert; that's out of scope while orders are written
 * directly from the client.
 */
export function computeTrustedSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => {
    const catalogProduct = products.find((p) => p.id === item.product.id);
    if (!catalogProduct) return sum + item.product.price * item.qty; // unknown product id, fall back rather than crash
    const catalogPrice = item.variant
      ? catalogProduct.variants?.find((v) => v.id === item.variant!.id)?.price ?? catalogProduct.price
      : catalogProduct.price;
    return sum + catalogPrice * item.qty;
  }, 0);
}

/**
 * True if the cart's stated subtotal matches what the catalog says it
 * should be (see computeTrustedSubtotal). Small epsilon to tolerate
 * floating point noise; there's no fractional Rupiah in practice.
 */
export function isSubtotalTrustworthy(items: CartItem[], statedSubtotal: number): boolean {
  return Math.abs(computeTrustedSubtotal(items) - statedSubtotal) < 1;
}

/**
 * Generate a unique order code
 */
export function generateOrderCode(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `RJ-${timestamp}-${random}`;
}

/**
 * Generate a 6-digit PIN for order tracking
 */
export function generatePIN(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Format currency to Indonesian Rupiah
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Create WhatsApp message for order
 */
export function createWhatsAppMessage(
  orderCode: string,
  pin: string,
  customerName: string,
  customerPhone: string,
  customerAddress: string,
  deliveryTime: string,
  notes: string,
  items: CartItem[],
  subtotal: number,
  shippingCost: number,
  total: number,
  shippingProvider: string,
  distance: number | null
): string {
  const distance_str = distance ? `${distance} km` : '—';

  let msg = `🧾 *STRUK PESANAN RUJAK.CO*\n`;
  msg += `🆔 *Order ID:* ${orderCode}\n`;
  msg += `🔑 *PIN Lacak:* ${pin}\n\n`;
  msg += `👤 *Penerima:* ${customerName}\n`;
  msg += `📞 *HP:* ${customerPhone}\n`;
  msg += `📍 *Alamat:* ${customerAddress}\n\n`;
  msg += `🗺️ *Jarak:* ${distance_str}\n`;
  msg += `🕒 *Pengantaran:* ${deliveryTime}\n`;
  msg += `📝 *Catatan:* ${notes || 'Tidak ada catatan'}\n`;
  msg += `🚚 *Kurir:* ${shippingProvider}\n\n`;
  msg += `📦 *Pesanan:*\n`;

  items.forEach((item) => {
    const spiceText = item.spiceLevel ? ` (Lv ${item.spiceLevel})` : '';
    const variantText = item.variant ? ` (${item.variant.label})` : '';
    msg += `• ${item.product.name}${variantText}${spiceText} x${item.qty} = ${formatCurrency(item.product.price * item.qty)}\n`;
  });

  msg += `\n💵 *Subtotal:* ${formatCurrency(subtotal)}\n`;
  msg += `🛵 *Ongkir:* ${formatCurrency(shippingCost)}\n`;
  msg += `💰 *TOTAL TRANSFER:* *${formatCurrency(total)}*\n\n`;
  msg += `📎 _Mohon lampirkan bukti transfer dan struk reservasi Anda._`;

  return msg;
}

/**
 * Generate WhatsApp URL for sending message
 */
export function getWhatsAppUrl(message: string): string {
  return `https://wa.me/${SYSTEM.WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Format order summary for display
 */
export function formatOrderSummary(
  items: CartItem[],
  subtotal: number,
  shippingCost: number,
  total: number
): string {
  let summary = 'Pesanan Anda:\n';
  items.forEach((item) => {
    summary += `• ${item.product.name}${item.variant ? ` (${item.variant.label})` : ''} x${item.qty}\n`;
  });
  summary += `\nSubtotal: ${formatCurrency(subtotal)}\n`;
  summary += `Ongkir: ${formatCurrency(shippingCost)}\n`;
  summary += `Total: ${formatCurrency(total)}`;
  return summary;
}

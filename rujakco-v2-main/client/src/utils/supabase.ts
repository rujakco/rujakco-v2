/*
 * RUJAK.Co — Order Helpers
 * Order code / PIN generation, WhatsApp message formatting, and the
 * offline queue used when Supabase is unreachable at checkout time.
 */

const OFFLINE_QUEUE_KEY = "rujakco_offline_orders";

/** Generates a short, human-friendly order code, e.g. "RJK-7F3K2A". */
export function generateOrderCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I to avoid confusion
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `RJK-${code}`;
}

/** Generates a 4-digit numeric PIN used to look up an order later. */
export function generatePIN(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

/** Formats an order into a readable WhatsApp message. */
export function formatOrderMessage(order: any): string {
  const lines = [
    `*Pesanan Baru — ${order.order_code}*`,
    "",
    `Nama: ${order.customer_name}`,
    `HP: ${order.customer_phone}`,
    `Alamat: ${order.customer_address}`,
    order.district ? `Wilayah: ${order.district}` : null,
    "",
    "*Item:*",
    ...(Array.isArray(order.items)
      ? order.items.map(
          (item: any) =>
            `- ${item.qty}x ${item.name}${item.spiceLevel ? ` (${item.spiceLevel})` : ""}`
        )
      : []),
    "",
    `Subtotal: Rp${Number(order.subtotal || 0).toLocaleString("id-ID")}`,
    `Ongkir (${order.shipping_provider || "-"}): Rp${Number(order.shipping_cost || 0).toLocaleString("id-ID")}`,
    `*Total: Rp${Number(order.total || 0).toLocaleString("id-ID")}*`,
    "",
    `Estimasi: ${order.delivery_time || "-"}`,
    order.notes ? `Catatan: ${order.notes}` : null,
    "",
    `Kode Akses: ${order.order_code} / PIN: ${order.access_pin}`,
  ].filter((line): line is string => line !== null);

  return lines.join("\n");
}

/** Reads all orders currently queued for offline retry. */
function readOfflineQueue(): any[] {
  try {
    const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Persists an order locally so it can be retried once connectivity returns. */
export function queueOfflineOrder(order: any): void {
  try {
    const queue = readOfflineQueue();
    queue.push(order);
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  } catch (err) {
    console.warn("Failed to queue offline order:", err);
  }
}

/** Returns all queued offline orders. */
export function getOfflineOrders(): any[] {
  return readOfflineQueue();
}

/** Removes an order from the offline queue once it has been synced. */
export function clearOfflineOrder(orderCode: string): void {
  try {
    const queue = readOfflineQueue().filter((o) => o.order_code !== orderCode);
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  } catch (err) {
    console.warn("Failed to clear offline order:", err);
  }
}

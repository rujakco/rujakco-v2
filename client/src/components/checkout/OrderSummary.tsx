/*
 * RUJAK.Co — Checkout: Order Summary
 * Read-only list of cart items shown on the checkout form step.
 * Extracted from CheckoutEnhanced.tsx — pure presentational, no logic.
 */

import { formatCurrency } from "@/data/products";
import type { CartItem } from "@/contexts/CartContext";

interface OrderSummaryProps {
  items: CartItem[];
}

export default function OrderSummary({ items }: OrderSummaryProps) {
  return (
    <div className="mb-6">
      <h3 className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-3">
        Ringkasan Pesanan
      </h3>
      {items.map((item) => (
        <div
          key={item.cartKey}
          className="flex justify-between py-2 border-b border-paper-border last:border-0"
        >
          <div>
            <p className="text-sm font-medium text-ink">{item.product.name}</p>
            <p className="text-xs text-ink-muted">
              x{item.qty}
              {item.variant ? ` • ${item.variant.label}` : ""} • Pedas {item.spiceLevel}/5
            </p>
            {item.customSelection && (
              <p className="text-xs text-ink-muted">
                {item.customSelection.fruits.join(", ")} · {item.customSelection.sauce}
              </p>
            )}
          </div>
          <span className="text-sm font-semibold">{formatCurrency(item.product.price * item.qty)}</span>
        </div>
      ))}
    </div>
  );
}

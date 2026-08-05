/*
 * RUJAK.Co — Checkout: Payment Section (step 3 of 3)
 * Thin re-export wrapper around the pre-existing QrisPayment component,
 * kept here for naming consistency with the checkout/ folder split
 * (CheckoutForm, UploadReceipt, OrderSummary, DeliverySection,
 * PaymentSection). The actual QRIS screen markup already lived in its
 * own file (components/QrisPayment.tsx) before this refactor, so this
 * just re-exports it rather than duplicating it.
 */

export { default } from "@/components/QrisPayment";

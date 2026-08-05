/**
 * Analytics Tracking Utilities
 * Track user behavior and conversions
 */

export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp: number;
}

/**
 * Track page view
 */
export function trackPageView(pageName: string, properties?: Record<string, any>): void {
  if (typeof window !== 'undefined' && (window as any).umami) {
    (window as any).umami.trackEvent(pageName, properties);
  }
  console.log(`ðŸ“Š Page view: ${pageName}`, properties);
}

/**
 * Track begin checkout
 */
export function trackBeginCheckout(
  items: any[],
  subtotal: number,
  shippingCost: number,
  total: number
): void {
  if (typeof window !== 'undefined' && (window as any).umami) {
    (window as any).umami.trackEvent('begin_checkout', {
      items_count: items.length,
      subtotal,
      shipping_cost: shippingCost,
      total,
    });
  }
  console.log('ðŸ“Š Begin checkout tracked', { items_count: items.length, total });
}

/**
 * Track purchase
 */
export function trackPurchase(
  orderCode: string,
  total: number,
  paymentMethod: string,
  items: any[]
): void {
  if (typeof window !== 'undefined' && (window as any).umami) {
    (window as any).umami.trackEvent('purchase', {
      order_code: orderCode,
      total,
      payment_method: paymentMethod,
      items_count: items.length,
    });
  }
  console.log('ðŸ“Š Purchase tracked', { order_code: orderCode, total });
}

/**
 * Track add to cart
 */
export function trackAddToCart(productId: string, productName: string, price: number, qty: number): void {
  if (typeof window !== 'undefined' && (window as any).umami) {
    (window as any).umami.trackEvent('add_to_cart', {
      product_id: productId,
      product_name: productName,
      price,
      quantity: qty,
    });
  }
  console.log('ðŸ“Š Add to cart tracked', { product_id: productId, qty });
}

/**
 * Track feature usage
 */
export function trackFeatureUsage(featureName: string, properties?: Record<string, any>): void {
  if (typeof window !== 'undefined' && (window as any).umami) {
    (window as any).umami.trackEvent(`feature_${featureName}`, properties);
  }
  console.log(`ðŸ“Š Feature used: ${featureName}`, properties);
}

/**
 * Track error
 */
export function trackError(errorName: string, errorMessage: string, context?: Record<string, any>): void {
  if (typeof window !== 'undefined' && (window as any).umami) {
    (window as any).umami.trackEvent('error', {
      error_name: errorName,
      error_message: errorMessage,
      ...context,
    });
  }
  console.error(`ðŸ“Š Error tracked: ${errorName}`, errorMessage, context);
}

/**
 * Track custom event
 */
export function trackCustomEvent(eventName: string, properties?: Record<string, any>): void {
  if (typeof window !== 'undefined' && (window as any).umami) {
    (window as any).umami.trackEvent(eventName, properties);
  }
  console.log(`ðŸ“Š Custom event: ${eventName}`, properties);
}

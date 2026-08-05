import { useEffect } from 'react';
import { setupGlobalErrorHandler } from '@/lib/error-utils';
import { trackPageView } from '@/lib/analytics-utils';
import { useLocation } from 'wouter';

/**
 * Hook to initialize app-wide functionality
 * - Global error handler
 * - Analytics tracking
 * - Performance monitoring
 */
export function useAppInitialization() {
  const [location] = useLocation();

  // Effect A: one-time setup (global error handler + performance monitor).
  // This used to live in the same effect as the analytics tracking below,
  // with `[location]` as its dependency array — meaning setupGlobalErrorHandler()
  // and `new PerformanceObserver(...)` ran again on *every route change*.
  // setupGlobalErrorHandler() is now idempotent as a second line of defense,
  // but the observer had no such guard: each navigation created a new
  // PerformanceObserver without disconnecting the previous one, leaking
  // observers and logging the same slow-operation warning multiple times.
  useEffect(() => {
    setupGlobalErrorHandler();

    let perfObserver: PerformanceObserver | undefined;
    if ('PerformanceObserver' in window) {
      try {
        perfObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 3000) {
              console.warn(`⚠️ Slow operation detected: ${entry.name} (${entry.duration.toFixed(2)}ms)`);
            }
          }
        });

        perfObserver.observe({ entryTypes: ['measure', 'navigation'] });
      } catch (error) {
        console.warn('Performance monitoring not available:', error);
      }
    }

    console.log('✅ App initialized');

    return () => {
      perfObserver?.disconnect();
    };
  }, []);

  // Effect B: analytics page view, re-runs on every route change.
  useEffect(() => {
    const pageName = location || '/';
    trackPageView(pageName);
  }, [location]);
}

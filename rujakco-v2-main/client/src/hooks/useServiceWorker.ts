import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { setupOfflineListener, isOnline } from '@/lib/offline-utils';
import { getOfflineOrders, clearOfflineOrder } from '@/utils/supabase';
import { saveOrder } from '@/lib/supabase-client';

export function useServiceWorker() {
  const [isOnlineStatus, setIsOnlineStatus] = useState(isOnline());
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    let updateIntervalId: ReturnType<typeof setInterval> | undefined;
    let registrationRef: ServiceWorkerRegistration | undefined;
    let updateFoundHandler: (() => void) | undefined;

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker registered:', registration);
          setSwRegistration(registration);
          registrationRef = registration;

          // Check for updates periodically
          // BUG FIX: this interval was never cleared, so it kept polling
          // (and, combined with the unmount/remount pattern of hooks in
          // this app, could stack up multiple intervals) after the
          // component using this hook unmounted.
          updateIntervalId = setInterval(() => {
            registration.update();
          }, 60000); // Check every minute

          // Listen for updates
          // BUG FIX: this listener was also never removed on cleanup.
          updateFoundHandler = () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  toast.success('Update tersedia! Refresh halaman untuk mendapatkan versi terbaru.');
                }
              });
            }
          };
          registration.addEventListener('updatefound', updateFoundHandler);
        })
        .catch((error) => {
          console.error('❌ Service Worker registration failed:', error);
        });
    }

    // Setup offline/online listeners
    const unsubscribe = setupOfflineListener(
      () => {
        console.log('🟢 Back online');
        setIsOnlineStatus(true);

        // BUG FIX: this used to call syncOfflineQueue() from offline-utils,
        // which reads/writes a *different* localStorage queue
        // ("rujak_offline_queue") that nothing in the app ever writes to —
        // orders that failed to save during checkout are queued via
        // queueOfflineOrder() into "rujakco_offline_orders" instead (see
        // CheckoutEnhanced.tsx). The old handler was also a no-op stub that
        // just logged and returned true without saving anything. Net
        // effect: orders placed while Supabase was unreachable were queued
        // locally and then silently lost — never actually retried. Retry
        // the real queue here instead.
        const pending = getOfflineOrders();
        if (pending.length === 0) {
          return;
        }

        toast.success('Kembali online! Menyinkronkan pesanan...');
        (async () => {
          let synced = 0;
          for (const order of pending) {
            try {
              await saveOrder(order);
              clearOfflineOrder(order.order_code);
              synced += 1;
            } catch (error) {
              console.error('Failed to sync offline order:', order.order_code, error);
            }
          }
          if (synced > 0) {
            toast.success(`${synced} pesanan tersimpan ke database.`);
          }
          if (synced < pending.length) {
            toast.warning('Sebagian pesanan belum berhasil disinkronkan, akan dicoba lagi.');
          }
        })();
      },
      () => {
        console.log('🔴 Offline');
        setIsOnlineStatus(false);
        toast.error('Anda sedang offline. Beberapa fitur mungkin tidak tersedia.');
      }
    );

    return () => {
      unsubscribe();
      if (updateIntervalId) clearInterval(updateIntervalId);
      if (registrationRef && updateFoundHandler) {
        registrationRef.removeEventListener('updatefound', updateFoundHandler);
      }
    };
  }, []);

  return {
    isOnline: isOnlineStatus,
    swRegistration,
  };
}

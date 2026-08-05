/**
 * Offline Support Utilities
 * Queues actions when offline and syncs when connection returns
 */

export interface OfflineAction {
  id: string;
  type: 'save-order' | 'track-order' | 'update-cart';
  timestamp: number;
  payload: any;
  retries: number;
  maxRetries: number;
}

const STORAGE_KEY = 'rujak_offline_queue';
const MAX_RETRIES = 3;

/**
 * Get all queued offline actions
 */
export function getOfflineQueue(): OfflineAction[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to read offline queue:', error);
    return [];
  }
}

/**
 * Add action to offline queue
 */
export function queueOfflineAction(
  type: OfflineAction['type'],
  payload: any
): OfflineAction {
  const action: OfflineAction = {
    id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    timestamp: Date.now(),
    payload,
    retries: 0,
    maxRetries: MAX_RETRIES,
  };

  try {
    const queue = getOfflineQueue();
    queue.push(action);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
    console.log(`✅ Action queued: ${action.id}`);
  } catch (error) {
    console.error('Failed to queue offline action:', error);
  }

  return action;
}

/**
 * Remove action from queue
 */
export function removeOfflineAction(actionId: string): void {
  try {
    const queue = getOfflineQueue();
    const filtered = queue.filter((a) => a.id !== actionId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    console.log(`✅ Action removed: ${actionId}`);
  } catch (error) {
    console.error('Failed to remove offline action:', error);
  }
}

/**
 * Update action retry count
 */
export function updateActionRetry(actionId: string, retries: number): void {
  try {
    const queue = getOfflineQueue();
    const updated = queue.map((a) => (a.id === actionId ? { ...a, retries } : a));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to update action retry:', error);
  }
}

/**
 * Clear all offline queue
 */
export function clearOfflineQueue(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('✅ Offline queue cleared');
  } catch (error) {
    console.error('Failed to clear offline queue:', error);
  }
}

/**
 * Check if browser is online
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * Setup offline/online event listeners
 */
export function setupOfflineListener(onOnline: () => void, onOffline: () => void): () => void {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);

  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
}

/**
 * Sync offline queue when connection returns
 */
export async function syncOfflineQueue(
  handler: (action: OfflineAction) => Promise<boolean>
): Promise<void> {
  const queue = getOfflineQueue();

  if (queue.length === 0) {
    console.log('No offline actions to sync');
    return;
  }

  console.log(`🔄 Syncing ${queue.length} offline actions...`);

  for (const action of queue) {
    if (action.retries >= action.maxRetries) {
      console.warn(`❌ Max retries exceeded for ${action.id}, removing from queue`);
      removeOfflineAction(action.id);
      continue;
    }

    try {
      const success = await handler(action);
      if (success) {
        removeOfflineAction(action.id);
        console.log(`✅ Synced: ${action.id}`);
      } else {
        updateActionRetry(action.id, action.retries + 1);
        console.warn(`⚠️ Sync failed for ${action.id}, will retry later`);
      }
    } catch (error) {
      updateActionRetry(action.id, action.retries + 1);
      console.error(`❌ Error syncing ${action.id}:`, error);
    }
  }

  console.log('🔄 Offline sync completed');
}

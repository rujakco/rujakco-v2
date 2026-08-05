/**
 * Error Logging and Retry Utilities
 */

export interface ErrorLog {
  id: string;
  category: string;
  message: string;
  context?: Record<string, any>;
  timestamp: number;
  stack?: string;
}

const ERROR_LOG_KEY = 'rujak_error_logs';
const MAX_ERROR_LOGS = 50;

/**
 * Log error with context
 */
export function logError(
  category: string,
  error: Error | string,
  context?: Record<string, any>
): ErrorLog {
  const errorLog: ErrorLog = {
    id: `${category}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    category,
    message: typeof error === 'string' ? error : error.message,
    context,
    timestamp: Date.now(),
    stack: typeof error === 'string' ? undefined : error.stack,
  };

  try {
    const logs = getErrorLogs();
    logs.push(errorLog);

    // Keep only last 50 errors
    if (logs.length > MAX_ERROR_LOGS) {
      logs.splice(0, logs.length - MAX_ERROR_LOGS);
    }

    localStorage.setItem(ERROR_LOG_KEY, JSON.stringify(logs));
    console.error(`❌ [${category}]`, error, context);
  } catch (err) {
    console.error('Failed to log error:', err);
  }

  return errorLog;
}

/**
 * Get all error logs
 */
export function getErrorLogs(): ErrorLog[] {
  try {
    const stored = localStorage.getItem(ERROR_LOG_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to read error logs:', error);
    return [];
  }
}

/**
 * Clear error logs
 */
export function clearErrorLogs(): void {
  try {
    localStorage.removeItem(ERROR_LOG_KEY);
    console.log('✅ Error logs cleared');
  } catch (error) {
    console.error('Failed to clear error logs:', error);
  }
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000,
  backoffMultiplier: number = 2
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < maxRetries - 1) {
        const delay = initialDelay * Math.pow(backoffMultiplier, attempt);
        console.warn(`⚠️ Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`, lastError.message);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('Max retries exceeded');
}

/**
 * Fetch with retry
 */
export async function fetchWithRetry(
  url: string,
  options?: RequestInit,
  maxRetries: number = 3
): Promise<Response> {
  return retryWithBackoff(
    () => fetch(url, options),
    maxRetries,
    1000,
    2
  );
}

/**
 * Handle network errors gracefully
 */
export function handleNetworkError(error: Error, context?: Record<string, any>): void {
  if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
    logError('network', 'Network connection failed', context);
  } else if (error.message.includes('timeout')) {
    logError('timeout', 'Request timeout', context);
  } else {
    logError('unknown', error, context);
  }
}

/**
 * Setup global error handler
 */
let globalErrorHandlerInstalled = false;

export function setupGlobalErrorHandler(): void {
  // Guard against being called from multiple places (e.g. re-renders,
  // multiple components each initializing the app) — without this, every
  // extra call attached another pair of listeners, so a single error was
  // logged N times and the listeners were never removed.
  if (globalErrorHandlerInstalled) {
    return;
  }
  globalErrorHandlerInstalled = true;

  window.addEventListener('error', (event) => {
    logError('global', event.error || event.message, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    logError('unhandled-rejection', event.reason, {
      promise: event.promise,
    });
  });

  console.log('✅ Global error handler setup complete');
}

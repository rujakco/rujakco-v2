/*
 * RUJAK.Co — Supabase Client
 * Initialize Supabase client for order storage and real-time features.
 */

// Supabase credentials.
// BUG FIX: these used to be hardcoded with a comment claiming they came
// from environment variables, which wasn't true. Now read from Vite's
// import.meta.env (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY) so a
// deployer can point this build at a different Supabase project without
// touching source. The previous hardcoded values are kept as fallbacks
// so the app still works out of the box if no .env is configured — this
// is the anon/public key, safe to ship in client bundles, protected by
// Supabase Row Level Security on the server side rather than secrecy.
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "https://ghhnnfrmftttptcejizp.supabase.co";
const SUPABASE_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoaG5uZnJtZnR0dHB0Y2VqaXpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyNjA1ODksImV4cCI6MjA5NzgzNjU4OX0.FM-sPvJJzviX2kA0GEHnznOppivm4JNyC4IPFv_RkdE";

let supabaseClient: any = null;

export async function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;

  try {
    // Dynamically import Supabase client
    const { createClient } = await import("@supabase/supabase-js");
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);
    return supabaseClient;
  } catch (error) {
    console.error("Failed to initialize Supabase client:", error);
    return null;
  }
}

// Order table operations
export async function saveOrder(orderData: any) {
  const client = await getSupabaseClient();
  if (!client) throw new Error("Supabase client not initialized");

  const { data, error } = await client.from("orders").insert([orderData]).select();

  if (error) throw error;
  return data?.[0];
}

export async function getOrderByCode(orderCode: string) {
  const client = await getSupabaseClient();
  if (!client) throw new Error("Supabase client not initialized");

  const { data, error } = await client
    .from("orders")
    .select("*")
    .eq("order_code", orderCode)
    .single();

  if (error) throw error;
  return data;
}

export async function getOrderByCodeAndPin(orderCode: string, accessPin: string) {
  const client = await getSupabaseClient();
  if (!client) throw new Error("Supabase client not initialized");

  const { data, error } = await client
    .from("orders")
    .select("*")
    .eq("order_code", orderCode)
    .eq("access_pin", accessPin)
    .single();

  if (error) throw error;
  return data;
}

export async function updateOrderStatus(orderCode: string, status: string) {
  const client = await getSupabaseClient();
  if (!client) throw new Error("Supabase client not initialized");

  const { data, error } = await client
    .from("orders")
    .update({ status })
    .eq("order_code", orderCode)
    .select();

  if (error) throw error;
  return data?.[0];
}

// Upload receipt to storage
export async function uploadReceipt(fileName: string, blob: Blob) {
  const client = await getSupabaseClient();
  if (!client) throw new Error("Supabase client not initialized");

  const { data, error } = await client.storage
    .from("receipts")
    .upload(fileName, blob, {
      contentType: "image/png",
      upsert: true,
    });

  if (error) throw error;

  const { data: publicData } = client.storage.from("receipts").getPublicUrl(fileName);
  return publicData.publicUrl;
}

// Notify admin via Telegram (Supabase Edge Function `send-telegram`).
// Same Supabase project as the original RUJAK.Co site, so this function
// is already deployed there — this call mirrors main's implementation.
// Best-effort: failures are logged but never block the checkout flow.
export async function sendReceiptToTelegram(orderCode: string, receiptUrl: string, caption: string) {
  const client = await getSupabaseClient();
  if (!client) {
    console.warn("[Telegram] Supabase client not available");
    return false;
  }

  try {
    const { data, error } = await client.functions.invoke("send-telegram", {
      body: { order_code: orderCode, receipt_url: receiptUrl, caption },
    });
    if (error) {
      // This is the case the previous version missed: invoke() resolves
      // (doesn't throw) for function-level errors, it just sets `error`.
      console.warn("[Telegram] Edge Function 'send-telegram' returned an error:", error);
      return false;
    }
    console.log("[Telegram] Notification sent:", data);
    return true;
  } catch (error) {
    // Network-level failure (e.g. function doesn't exist / project unreachable).
    console.warn("[Telegram] Failed to reach 'send-telegram' Edge Function:", error);
    return false;
  }
}

// Get public URL for receipt
// BUG FIX: this previously called a local `createClient(url, key)` stub
// that just returned the module-level `supabaseClient` variable — which
// is null until getSupabaseClient() has resolved at least once, so this
// threw "Cannot read properties of null" if called before that. It also
// shadowed the real `@supabase/supabase-js` createClient import, so even
// after initialization it wasn't actually creating anything. Reuse the
// shared, lazily-initialized client instead.
export async function getReceiptPublicUrl(fileName: string): Promise<string | null> {
  const client = await getSupabaseClient();
  if (!client) return null;
  const { data } = client.storage.from("receipts").getPublicUrl(fileName);
  return data.publicUrl;
}

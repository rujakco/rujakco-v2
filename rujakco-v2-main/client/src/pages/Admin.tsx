/*
 * RUJAK.Co — Admin Dashboard
 * Mirrors main's admin.html core loop: Supabase email/password auth,
 * live order list (realtime subscription for new orders), and status
 * updates. Product CRUD and the Studio/Buku Master tabs from main were
 * intentionally left out — those depend on a `products` DB table and
 * external CDN pages that don't exist in this app's architecture
 * (products here are a static content file, not a database table).
 */

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Loader2, LogOut, RefreshCw, Package, Phone, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";
import type { RealtimeChannel, RealtimePostgresInsertPayload, SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseClient, updateOrderStatus } from "@/lib/supabase-client";
import { formatCurrency } from "@/data/products";

type OrderStatus = "pending_payment" | "paid" | "prepping" | "delivering" | "completed" | "cancelled";

interface Order {
  order_code: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  district: string;
  items: Array<{ name: string; qty: number; spiceLevel: number; price: number }>;
  subtotal: number;
  shipping_cost: number;
  total: number;
  shipping_provider: string;
  delivery_time: string;
  notes: string;
  status: OrderStatus;
  created_at: string;
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending_payment: "Menunggu Pembayaran",
  paid: "Sudah Dibayar",
  prepping: "Disiapkan",
  delivering: "Dalam Pengantaran",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending_payment: "bg-mango/15 text-mango",
  paid: "bg-forest/15 text-forest",
  prepping: "bg-blue-500/15 text-blue-600",
  delivering: "bg-purple-500/15 text-purple-600",
  completed: "bg-forest text-white",
  cancelled: "bg-chili/15 text-chili",
};

const STATUS_FLOW: OrderStatus[] = ["pending_payment", "paid", "prepping", "delivering", "completed", "cancelled"];

export default function Admin() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    (async () => {
      const client = await getSupabaseClient();
      if (!client) {
        setAuthed(false);
        return;
      }
      const { data } = await client.auth.getSession();
      setAuthed(!!data?.session);
    })();
  }, []);

  const loadOrders = useCallback(async () => {
    setLoadingOrders(true);
    try {
      const client = await getSupabaseClient();
      if (!client) return;
      const { data, error } = await client
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error("Failed to load orders:", err);
      toast.error("Gagal memuat pesanan");
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  // Realtime: new order comes in → toast + refresh list (same behavior as
  // main's `orders-admin` channel subscription).
  useEffect(() => {
    if (!authed) return;
    loadOrders();

    let channel: RealtimeChannel | null = null;
    let clientRef: SupabaseClient | null = null;
    (async () => {
      const client = await getSupabaseClient();
      if (!client) return;
      clientRef = client;
      channel = client
        .channel("orders-admin")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "orders" },
          (payload: RealtimePostgresInsertPayload<Order>) => {
            toast.success(`🔔 Pesanan baru dari ${payload.new?.customer_name ?? "pelanggan"}!`);
            // Patch local state instead of refetching the whole order list
            // on every realtime insert — cheaper, and avoids a full-list
            // flash/reorder for admins actively scrolling the dashboard.
            setOrders((prev) => {
              if (prev.some((o) => o.order_code === payload.new.order_code)) return prev;
              return [payload.new, ...prev];
            });
          }
        )
        .subscribe();
    })();

    return () => {
      if (channel && clientRef) clientRef.removeChannel(channel);
    };
  }, [authed, loadOrders]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);
    try {
      const client = await getSupabaseClient();
      if (!client) throw new Error("Supabase belum siap");
      const { error } = await client.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setAuthed(true);
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Login gagal");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    const client = await getSupabaseClient();
    await client?.auth.signOut();
    setAuthed(false);
  };

  const handleStatusChange = async (orderCode: string, status: OrderStatus) => {
    try {
      await updateOrderStatus(orderCode, status);
      setOrders((prev) => prev.map((o) => (o.order_code === orderCode ? { ...o, status } : o)));
      toast.success(`Status ${orderCode} diperbarui`);
    } catch (err) {
      toast.error("Gagal memperbarui status");
    }
  };

  // ── Loading auth state ──────────────────────────────────────────────
  if (authed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <Loader2 className="w-6 h-6 animate-spin text-forest" />
      </div>
    );
  }

  // ── Login screen ─────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream px-4">
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleLogin}
          className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8"
        >
          <h1 className="font-display text-xl font-semibold text-ink mb-1">Admin RUJAK.Co</h1>
          <p className="text-sm text-ink-muted mb-6">Masuk untuk mengelola pesanan.</p>

          <label className="block text-sm font-medium text-ink mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@rujakco.com"
            required
            className="w-full px-4 py-2.5 mb-3 rounded-xl border border-[#E8E5E0] text-sm focus:outline-none focus:border-forest/50 focus:ring-2 focus:ring-forest/10"
          />
          <label className="block text-sm font-medium text-ink mb-1.5">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full px-4 py-2.5 mb-4 rounded-xl border border-[#E8E5E0] text-sm focus:outline-none focus:border-forest/50 focus:ring-2 focus:ring-forest/10"
          />

          {loginError && <p className="text-sm text-chili mb-3">{loginError}</p>}

          <button
            type="submit"
            disabled={loginLoading}
            className="w-full py-3 bg-forest text-white rounded-full font-semibold hover:bg-forest-light transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loginLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Masuk"}
          </button>
        </motion.form>
      </div>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white border-b border-[#E8E5E0] sticky top-0 z-10">
        <div className="container flex items-center justify-between py-4">
          <h1 className="font-display text-lg font-semibold text-ink">🛎️ Admin Panel — RUJAK.Co</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={loadOrders}
              disabled={loadingOrders}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-[#E8E5E0] text-sm text-ink-muted hover:bg-cream transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loadingOrders ? "animate-spin" : ""}`} />
              Muat Ulang
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-[#E8E5E0] text-sm text-chili hover:bg-chili/5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Keluar
            </button>
          </div>
        </div>
      </header>

      <main className="container py-6">
        <p className="text-sm text-ink-muted mb-4">
          {orders.length} pesanan · pembaruan pesanan baru muncul otomatis (realtime)
        </p>

        {loadingOrders && orders.length === 0 ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-forest" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 text-ink-muted">📭 Belum ada pesanan.</div>
        ) : (
          <div className="grid gap-3">
            {orders.map((o) => (
              <div key={o.order_code} className="bg-white rounded-2xl border border-[#E8E5E0] p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="font-semibold text-ink">{o.customer_name}</p>
                    <p className="text-xs text-ink-muted">{o.order_code} · {new Date(o.created_at).toLocaleString("id-ID")}</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS_COLORS[o.status]}`}>
                    {STATUS_LABELS[o.status]}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-ink-muted mb-1">
                  <Package className="w-3.5 h-3.5 flex-shrink-0" />
                  {(o.items || []).map((i) => `${i.name} x${i.qty}`).join(" • ")}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-ink-muted mb-1">
                  <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                  {o.customer_phone}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-ink-muted mb-1">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  {o.customer_address}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-ink-muted mb-3">
                  <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                  {o.delivery_time} · {o.shipping_provider}
                </div>

                <div className="flex items-center justify-between flex-wrap gap-2">
                  <p className="font-display text-lg font-bold text-forest">{formatCurrency(o.total)}</p>
                  <select
                    value={o.status}
                    onChange={(e) => handleStatusChange(o.order_code, e.target.value as OrderStatus)}
                    className="text-sm px-3 py-1.5 rounded-lg border border-[#E8E5E0] bg-white focus:outline-none focus:border-forest/50"
                  >
                    {STATUS_FLOW.map((s) => (
                      <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

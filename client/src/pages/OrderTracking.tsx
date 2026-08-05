/**
 * RUJAK.Co — Order Tracking Page
 * Allows customers to track their orders using order code and PIN
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, MapPin, AlertCircle, Loader2, CheckCircle, ChevronLeft, Store, Bike } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { formatCurrency } from '@/data/products';
import { getOrderByCodeAndPin } from '@/lib/supabase-client';
import StatusStepper from '@/components/StatusStepper';
import BottomNav from '@/components/BottomNav';

interface OrderData {
  order_code: string;
  access_pin: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  district: string;
  distance_km: number | null;
  items: Array<{
    name: string;
    qty: number;
    spiceLevel: number;
    price: number;
    customSelection?: { fruits: string[]; sauce: string };
  }>;
  subtotal: number;
  shipping_cost: number;
  voucher_code?: string;
  discount_amount?: number;
  points_earned?: number;
  points_redeemed?: number;
  loyalty_discount_amount?: number;
  total: number;
  shipping_provider: string;
  delivery_time: string;
  preorder_delivery_date?: string;
  notes: string;
  status: 'pending_payment' | 'paid' | 'prepping' | 'delivering' | 'completed' | 'cancelled';
  created_at: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending_payment: {
    label: 'Menunggu Pembayaran',
    color: 'bg-yellow-100 text-yellow-800',
    icon: <AlertCircle className="w-4 h-4" />,
  },
  paid: {
    label: 'Pembayaran Diterima',
    color: 'bg-blue-100 text-blue-800',
    icon: <CheckCircle className="w-4 h-4" />,
  },
  prepping: {
    label: 'Sedang Disiapkan',
    color: 'bg-purple-100 text-purple-800',
    icon: <Package className="w-4 h-4" />,
  },
  delivering: {
    label: 'Sedang Diantar',
    color: 'bg-orange-100 text-orange-800',
    icon: <MapPin className="w-4 h-4" />,
  },
  completed: {
    label: 'Selesai',
    color: 'bg-green-100 text-green-800',
    icon: <CheckCircle className="w-4 h-4" />,
  },
  cancelled: {
    label: 'Dibatalkan',
    color: 'bg-red-100 text-red-800',
    icon: <AlertCircle className="w-4 h-4" />,
  },
};

export default function OrderTracking() {
  const [orderCode, setOrderCode] = useState('');
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!orderCode.trim() || !pin.trim()) {
      setError('Mohon isi order code dan PIN');
      toast.error('Mohon isi order code dan PIN');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getOrderByCodeAndPin(orderCode.trim().toUpperCase(), pin.trim());
      setOrder(data);
      toast.success('Order ditemukan!');
    } catch (err) {
      // Supabase's .single() throws when no row matches order_code + access_pin,
      // which covers both "not found" and "wrong PIN" cases.
      const message = 'Order tidak ditemukan atau PIN salah';
      setError(message);
      toast.error(message);
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setOrderCode('');
    setPin('');
    setOrder(null);
    setError(null);
  };

  if (order) {
    const statusInfo = STATUS_LABELS[order.status];
    const orderedAt = new Date(order.created_at);
    const totalItems = order.items.reduce((sum, item) => sum + item.qty, 0);

    return (
      <div className="min-h-screen bg-cream pb-28">
        {/* Top bar — back + title, ala "Detail Pesanan" Fore */}
        <div className="sticky top-0 z-10 bg-cream/95 backdrop-blur-md border-b border-paper-border">
          <div className="max-w-2xl mx-auto px-4 h-14 flex items-center">
            <button
              onClick={handleReset}
              aria-label="Kembali"
              className="w-9 h-9 -ml-2 rounded-full flex items-center justify-center text-ink hover:bg-paper transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="flex-1 text-center font-display text-base font-semibold text-ink pr-9">
              Detail Pesanan
            </h1>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4">
          {/* Status stepper */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-5 pb-4"
          >
            <StatusStepper status={order.status} />
          </motion.div>

          {/* Cancelled banner — flat inline pink strip, ala Fore */}
          {order.status === "cancelled" ? (
            <div className="mb-4 px-4 py-3 rounded-xl bg-chili/10 text-center">
              <p className="text-sm text-chili font-medium">Pesanan telah dibatalkan oleh pelanggan</p>
            </div>
          ) : (
            <div className={`mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${statusInfo.color}`}>
              {statusInfo.icon}
              {statusInfo.label}
            </div>
          )}

          <div className="h-2 -mx-4 bg-paper" />

          {/* Lokasi Pengiriman — timeline dua titik, ala Fore */}
          <section className="py-5">
            <h2 className="font-display text-base font-semibold text-ink mb-4">Lokasi Pengiriman</h2>
            <div className="flex gap-3">
              <div className="flex flex-col items-center pt-0.5">
                <div className="w-8 h-8 rounded-full bg-sage/40 flex items-center justify-center shrink-0">
                  <Store className="w-4 h-4 text-forest" />
                </div>
                <div className="w-px flex-1 border-l border-dashed border-paper-border my-1" />
                <div className="w-8 h-8 rounded-full bg-chili/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-chili" />
                </div>
              </div>
              <div className="flex-1 pb-1">
                <p className="font-medium text-sm text-ink">Dapur RUJAK.Co, Bekasi</p>
                <div className="h-6" />
                <p className="font-medium text-sm text-ink">{order.customer_name}</p>
                <p className="text-sm text-ink-muted mt-0.5">
                  {order.customer_address}
                  {order.district ? `, ${order.district}` : ""}
                </p>
                {order.distance_km != null && (
                  <p className="text-xs text-ink-muted mt-1">Jarak: {order.distance_km} km</p>
                )}
              </div>
            </div>
          </section>

          <div className="h-2 -mx-4 bg-paper" />

          {/* Metode Pengiriman */}
          <section className="py-5">
            <h2 className="font-display text-base font-semibold text-ink mb-4">Metode Pengiriman</h2>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-paper flex items-center justify-center shrink-0">
                <Bike className="w-4.5 h-4.5 text-ink-soft" />
              </div>
              <span className="text-sm font-medium text-ink">{order.shipping_provider}</span>
            </div>
            {order.preorder_delivery_date ? (
              <p className="text-xs text-chili font-medium mt-3">
                Tanggal Pre-Order: {order.preorder_delivery_date}
              </p>
            ) : (
              <p className="text-xs text-ink-muted mt-3">Estimasi: {order.delivery_time}</p>
            )}
            {order.notes && (
              <div className="mt-3 p-3 bg-paper rounded-xl">
                <p className="text-xs text-ink-muted mb-1">Catatan:</p>
                <p className="text-sm text-ink">{order.notes}</p>
              </div>
            )}
          </section>

          <div className="h-2 -mx-4 bg-paper" />

          {/* Detail Pesanan — compact item rows, ala Fore */}
          <section className="py-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-base font-semibold text-ink">Detail Pesanan</h2>
              <span className="text-xs text-ink-muted">Total item: {totalItems}</span>
            </div>
            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-sage/30 flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5 text-forest" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-ink truncate">{item.name}</p>
                    <p className="text-xs text-ink-muted mt-0.5 truncate">
                      {item.customSelection
                        ? `${item.customSelection.fruits.join(", ")} · ${item.customSelection.sauce}`
                        : item.spiceLevel
                          ? `Level Pedas ${item.spiceLevel}/5`
                          : "—"}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-medium text-ink">{formatCurrency(item.price)}</p>
                    <p className="text-xs text-ink-muted">{item.qty}×</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="h-2 -mx-4 bg-paper" />

          {/* Rincian Pembayaran */}
          <section className="py-5">
            <h2 className="font-display text-base font-semibold text-ink mb-4">Rincian Pembayaran</h2>
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink-muted">Total Pembayaran</span>
              <span className="font-display text-lg font-semibold text-ink">{formatCurrency(order.total)}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-ink-muted">QRIS</span>
              {!!order.points_earned && (
                <span className="text-sm font-medium text-forest">+{order.points_earned} Poin</span>
              )}
            </div>
            {(order.voucher_code || !!order.points_redeemed) && (
              <div className="mt-3 pt-3 border-t border-paper-border space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-ink-muted">Subtotal</span>
                  <span className="text-ink">{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-ink-muted">Ongkir</span>
                  <span className="text-ink">{formatCurrency(order.shipping_cost)}</span>
                </div>
                {order.voucher_code && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-ink-muted">Voucher ({order.voucher_code})</span>
                    <span className="text-mango">-{formatCurrency(order.discount_amount || 0)}</span>
                  </div>
                )}
                {!!order.points_redeemed && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-ink-muted">Poin Dipakai ({order.points_redeemed})</span>
                    <span className="text-forest">-{formatCurrency(order.loyalty_discount_amount || 0)}</span>
                  </div>
                )}
              </div>
            )}
          </section>

          <div className="h-2 -mx-4 bg-paper" />

          {/* Footer info — ID / waktu / metode pemesanan, ala Fore */}
          <section className="py-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink-muted">ID Pesanan</span>
              <span className="text-sm font-medium text-ink font-mono">#{order.order_code}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink-muted">Waktu Pemesanan</span>
              <span className="text-sm font-medium text-ink">
                {orderedAt.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}{" "}
                {orderedAt.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink-muted">Metode Pemesanan</span>
              <span className="text-sm font-medium text-ink">Delivery via Aplikasi</span>
            </div>
          </section>

          {/* Actions */}
          <div className="pb-8 space-y-3">
            <Button
              onClick={() => window.open("https://wa.me/6289677161680", "_blank")}
              variant="outline"
              className="w-full border-forest text-forest hover:bg-forest/5 rounded-full h-11"
            >
              Butuh Bantuan?
            </Button>
            <Button onClick={handleReset} variant="ghost" className="w-full text-ink-muted hover:text-ink">
              Cari Pesanan Lain
            </Button>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sage/20 to-white py-12 px-4 pb-28">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-3xl lg:text-4xl font-medium text-ink mb-2">
            Lacak Pesananmu
          </h1>
          <p className="text-ink-muted">
            Masukkan Order ID dan PIN yang kamu terima via WhatsApp
          </p>
        </motion.div>

        {/* Search Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-8 bg-white border-sage/20">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-2">Order ID</label>
                <Input
                  placeholder="RJ-XXXXXXXXX-XXXXXX"
                  value={orderCode}
                  onChange={(e) => setOrderCode(e.target.value.toUpperCase())}
                  disabled={isLoading}
                  className="font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-2">PIN (6 digit)</label>
                <Input
                  placeholder="000000"
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  disabled={isLoading}
                  maxLength={6}
                  className="font-mono tracking-widest"
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </motion.div>
              )}

              <Button
                onClick={handleSearch}
                disabled={isLoading || !orderCode.trim() || !pin.trim()}
                className="w-full bg-forest hover:bg-forest/90 text-white font-semibold py-2 h-11"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Mencari...
                  </>
                ) : (
                  'Lacak Pesanan'
                )}
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Help Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8 p-4 bg-sage/10 rounded-lg border border-sage/20"
        >
          <p className="text-sm text-ink-muted">
            <strong>Tidak menemukan Order ID atau PIN?</strong> Periksa pesan WhatsApp dari RUJAK.Co atau hubungi kami di{' '}
            <a href="tel:+6289677161680" className="text-forest font-semibold hover:underline">
              +62 896-7716-1680
            </a>
          </p>
        </motion.div>
      </div>
      <BottomNav />
    </div>
  );
}

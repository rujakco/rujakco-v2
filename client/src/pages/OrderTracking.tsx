/**
 * RUJAK.Co — Order Tracking Page
 * Allows customers to track their orders using order code and PIN
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, MapPin, Clock, Phone, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

    return (
      <div className="min-h-screen bg-gradient-to-b from-sage/20 to-white py-12 px-4 pb-28">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="font-display text-3xl lg:text-4xl font-medium text-ink mb-2">
              Lacak Pesananmu
            </h1>
            <p className="text-ink-muted">Order ID: {order.order_code}</p>
          </motion.div>

          {/* Status Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card className="p-6 md:p-8 bg-gradient-to-br from-white to-sage/10 border-sage/30">
              <div className="mb-5">
                <StatusStepper status={order.status} />
              </div>
              <div className="text-center">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-3 ${statusInfo.color}`}>
                  {statusInfo.icon}
                  <span className="font-semibold">{statusInfo.label}</span>
                </div>
              </div>
              <p className="text-ink-muted text-sm text-center">
                Dipesan pada {new Date(order.created_at).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </Card>
          </motion.div>

          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Recipient Info */}
            <Card className="p-6 border-sage/20">
              <h3 className="font-display text-lg font-semibold text-ink mb-4">Penerima</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-forest mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-ink-muted">Nama</p>
                    <p className="font-medium text-ink">{order.customer_name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-forest mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-ink-muted">Nomor HP</p>
                    <p className="font-medium text-ink">{order.customer_phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-forest mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-ink-muted">Alamat</p>
                    <p className="font-medium text-ink">{order.customer_address}</p>
                    {order.distance_km && (
                      <p className="text-sm text-ink-muted mt-1">Jarak: {order.distance_km} km</p>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Items */}
            <Card className="p-6 border-sage/20">
              <h3 className="font-display text-lg font-semibold text-ink mb-4">Pesanan</h3>
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-sage/10 last:border-0">
                    <div>
                      <p className="font-medium text-ink">{item.name}</p>
                      {item.customSelection && (
                        <p className="text-sm text-ink-muted">
                          {item.customSelection.fruits.join(", ")} · {item.customSelection.sauce}
                        </p>
                      )}
                      {item.spiceLevel && (
                        <p className="text-sm text-ink-muted">Level Pedas: {item.spiceLevel}/5</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-ink">x{item.qty}</p>
                      <p className="text-sm text-ink-muted">{formatCurrency(item.price * item.qty)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Summary */}
            <Card className="p-6 border-sage/20 bg-gradient-to-br from-forest/5 to-sage/10">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-ink-muted">Subtotal</span>
                  <span className="font-medium text-ink">{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ink-muted">Ongkir ({order.shipping_provider})</span>
                  <span className="font-medium text-ink">{formatCurrency(order.shipping_cost)}</span>
                </div>
                {order.voucher_code && (
                  <div className="flex justify-between items-center">
                    <span className="text-ink-muted">Voucher ({order.voucher_code})</span>
                    <span className="font-medium text-mango">-{formatCurrency(order.discount_amount || 0)}</span>
                  </div>
                )}
                {!!order.points_redeemed && (
                  <div className="flex justify-between items-center">
                    <span className="text-ink-muted">Poin Dipakai ({order.points_redeemed})</span>
                    <span className="font-medium text-forest">-{formatCurrency(order.loyalty_discount_amount || 0)}</span>
                  </div>
                )}
                <div className="border-t border-sage/20 pt-3 flex justify-between items-center">
                  <span className="font-semibold text-ink">Total</span>
                  <span className="font-display text-xl font-semibold text-forest">
                    {formatCurrency(order.total)}
                  </span>
                </div>
                {!!order.points_earned && (
                  <p className="text-xs text-forest font-medium mt-2">⭐ Kamu dapat {order.points_earned} poin dari pesanan ini</p>
                )}
              </div>
            </Card>

            {/* Delivery Info */}
            <Card className="p-6 border-sage/20">
              <h3 className="font-display text-lg font-semibold text-ink mb-4">Pengantaran</h3>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-forest flex-shrink-0" />
                <div>
                  <p className="text-sm text-ink-muted">Estimasi Pengantaran</p>
                  <p className="font-medium text-ink">{order.delivery_time}</p>
                </div>
              </div>
              {order.preorder_delivery_date && (
                <div className="flex items-center gap-3 mt-3">
                  <Clock className="w-5 h-5 text-chili flex-shrink-0" />
                  <div>
                    <p className="text-sm text-ink-muted">Tanggal Pengiriman Pre-Order</p>
                    <p className="font-medium text-ink">{order.preorder_delivery_date}</p>
                  </div>
                </div>
              )}
              {order.notes && (
                <div className="mt-4 p-3 bg-sage/10 rounded-lg">
                  <p className="text-sm text-ink-muted mb-1">Catatan:</p>
                  <p className="text-sm text-ink">{order.notes}</p>
                </div>
              )}
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button onClick={handleReset} variant="outline" className="flex-1">
                Cari Pesanan Lain
              </Button>
              <Button className="flex-1 bg-forest hover:bg-forest/90">
                Hubungi Kami
              </Button>
            </div>
          </motion.div>
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

/* RUJAK.Co — MASTER PRODUCT CONTENT / SINGLE SOURCE OF TRUTH */
import type { Product } from "@/contexts/CartContext";

const IMG = "https://dk1tnyskaoive0dn.public.blob.vercel-storage.com";
const existing = (name: string) => `${IMG}/${name}-hd.webp`;

export const products: Product[] = [
  {
    id: "rujak-segar", name: "Rujak Segar", type: "rujak", category: "Rujak Mix", tag: "best-seller",
    price: 30000, variants: [{ id: "750", label: "750 ml", price: 30000 }, { id: "1000", label: "1000 ml", price: 40000 }],
    description: "Mangga muda, kedondong, bengkoang, nanas, timun, dan pepaya dengan sambal rujak khas.", image: existing("rujak-segar"),
    ingredients: ["Mangga muda", "Kedondong", "Bengkoang", "Nanas", "Timun", "Pepaya"], sauce: "Sambal rujak khas (cabai, gula merah, terasi, kacang)", spiceLevel: { min: 1, max: 5, default: 3 },
    notes: ["Komposisi market-proven", "Fresh-prep sebelum pengantaran"],
  },
  {
    id: "rujak-serut", name: "Rujak Serut", type: "rujak", category: "Rujak Serut", tag: "entry",
    price: 30000, variants: [{ id: "750", label: "750 ml", price: 30000 }, { id: "1000", label: "1000 ml", price: 40000 }],
    description: "Mangga muda, bengkoang, dan timun diserut halus agar tekstur menyatu dengan sambal.", image: existing("rujak-serut"),
    ingredients: ["Mangga muda (serut)", "Bengkoang (serut)", "Timun (serut)"], sauce: "Sambal rujak serut", spiceLevel: { min: 1, max: 5, default: 3 },
    notes: ["Ubi merah hanya supporting/novelty dalam porsi kecil"],
  },
  {
    id: "rujak-gaco", name: "Rujak Gaco", type: "rujak", category: "Rujak Premium (Mete)", tag: "signature",
    price: 38000, variants: [{ id: "750", label: "750 ml", price: 38000 }],
    description: "Enam buah pilihan dengan sambal mete sebagai diferensiasi utama RUJAK.Co.", image: existing("rujak-gaco"),
    ingredients: ["Jambu Kristal", "Mangga", "Nanas", "Bengkoang", "Jambu Citra", "Kedondong"], sauce: "Sambal mete (Kacang Atom)", spiceLevel: { min: 1, max: 5, default: 3 },
  },
  {
    id: "rujak-rama", name: "Rujak Rama", type: "rujak", category: "Rujak Jumbo Sharing", tag: "sharing",
    price: 50000, variants: [{ id: "1000", label: "1000 ml", price: 50000 }],
    description: "Campuran buah segar porsi besar dengan dua pilihan sambal untuk momen berbagi.", image: existing("rujak-rama"),
    ingredients: ["Komposisi mirip Rujak Segar, porsi besar"], sauce: "Pedas manis + pedas asin", spiceLevel: { min: 1, max: 5, default: 4 },
    notes: ["Target serving 3–4 orang; wajib divalidasi dengan gramasi aktual"],
  },
  {
    id: "asinan-segar", name: "Asinan Segar", type: "asinan", category: "Asinan Mix", tag: "fresh-alt",
    price: 28000, variants: [{ id: "500", label: "500 ml", price: 28000 }],
    description: "Mangga muda, kedondong, bengkoang, nanas, dan jambu dengan kuah asinan segar.", image: existing("asinan-segar"),
    ingredients: ["Mangga muda", "Kedondong", "Bengkoang", "Nanas", "Jambu Citra/Jambu Air"], sauce: "Kuah asinan (cuka, gula, cabai)", spiceLevel: { min: 1, max: 5, default: 3 },
  },
  {
    id: "asinan-kiamboy", name: "Asinan Kiamboy", type: "asinan", category: "Asinan Kiamboy", tag: "trending",
    price: 45000, variants: [{ id: "500", label: "500 ml", price: 45000 }],
    description: "Mangga muda, kelengkeng, anggur merah, rambutan, nanas, dan salak dengan kuah Kiamboy.", image: existing("asinan-kiamboy"),
    ingredients: ["Mangga muda", "Kelengkeng", "Anggur merah", "Rambutan", "Nanas", "Salak"], sauce: "Kuah Kiamboy", spiceLevel: { min: 1, max: 5, default: 3 },
    notes: ["Potential Hero / Potential Cash Cow — status cash cow menunggu data penjualan riil"],
  },
  {
    id: "rujak-mangga", name: "Rujak Mangga", type: "rujak", category: "Single Fruit", tag: "search-capture",
    price: 25000, variants: [{ id: "500", label: "500 ml", price: 25000 }, { id: "750", label: "750 ml", price: 30000 }],
    description: "±70% mangga muda dengan bengkoang dan nanas untuk tekstur dan keseimbangan rasa.", image: existing("rujak-segar"),
    ingredients: ["±70% Mangga muda", "Bengkoang", "Nanas"], sauce: "Sambal rujak mangga spesial", spiceLevel: { min: 1, max: 5, default: 3 },
    notes: ["Hero: mangga"],
  },
  {
    id: "rujak-bangkok", name: "Rujak Bangkok", type: "rujak", category: "Rujak Bangkok", tag: "trend",
    price: 30000, variants: [{ id: "500", label: "500 ml", price: 30000 }, { id: "1000", label: "1000 ml", price: 55000 }],
    description: "Jambu kristal, kedondong, bengkoang, nanas, dan mangga dengan bumbu khas Rujak Bangkok.", image: existing("rujak-gaco"),
    ingredients: ["Jambu Kristal", "Kedondong", "Bengkoang", "Nanas", "Mangga"], sauce: "Bumbu khas Rujak Bangkok", spiceLevel: { min: 1, max: 5, default: 3 },
    notes: ["Format pasar sudah mapan"],
  },
  {
    id: "custom-bowl", name: "Custom Bowl", type: "rujak", category: "Rakitan Sendiri", tag: "diy",
    price: 35000, variants: [{ id: "750", label: "750 ml", price: 35000 }],
    description: "Rakit bowl sendiri dari pilihan buah dan sambal. Harga mulai Rp35.000 sesuai pilihan.", image: existing("rujak-segar"),
    customOptions: {
      fruits: ["Mangga", "Nanas", "Bengkoang", "Kedondong", "Jambu Air", "Jambu Kristal", "Salak", "Buah musiman"],
      sauces: ["Pedas manis", "Pedas asin", "Sambal mete", "Sambal Kiamboy", "Sambal Bangkok"],
      pricingNote: "Harga mulai Rp35.000 dan dihitung berdasarkan pilihan buah.",
    }, spiceLevel: { min: 1, max: 5, default: 3 },
  },
  {
    id: "salad-buah", name: "Salad Buah", type: "salad", category: "Salad Buah Segar", tag: "non-spicy",
    price: 32000, variants: [{ id: "500", label: "500 ml", price: 32000 }],
    description: "Salad buah segar dengan melon, apel hijau, pir, nanas, jambu kristal, dan anggur merah.", image: existing("rujak-segar"),
    ingredients: ["Melon", "Apel hijau", "Pir", "Nanas", "Jambu Kristal", "Anggur merah"], sauce: "Mayonnaise / Yoghurt / Keju sesuai request", notes: ["Naga merah opsional jika tersedia", "Bengkoang dan jambu air/Citra dihilangkan"],
  },
  {
    id: "rujak-mahkota", name: "Rujak Mahkota", type: "rujak", category: "Premium Rujak (Shine Muscat)", tag: "limited",
    price: 85000, variants: [{ id: "500", label: "500 ml", price: 85000 }],
    description: "Shine Muscat sebagai hero, dipadukan mangga, nanas, jambu kristal, dan sambal mete.", image: existing("rujak-mahkota"),
    ingredients: ["Shine Muscat", "Mangga", "Nanas", "Jambu Kristal"], sauce: "Sambal mete", notes: ["Thinwall standar; tanpa box eksklusif", "Harga ditentukan oleh value of goods, bukan kemasan"], spiceLevel: { min: 1, max: 5, default: 3 },
  },
  {
    id: "tampah-nusantara", name: "Tampah Nusantara", type: "rujak", category: "Event / Hampers", tag: "exclusive",
    price: 200000, variants: [{ id: "40cm", label: "Ø40 cm · 8–10 orang", price: 200000 }],
    description: "Tampah bambu dengan delapan jenis buah segar dan dua sambal untuk acara bersama.", image: existing("tampah-nusantara"),
    ingredients: ["Mangga", "Nanas", "Bengkoang", "Jambu", "Kedondong", "Pepaya", "Ubi", "Buah premium/seasonal sesuai SOP"], sauce: "Pedas manis + sambal mete", preorderDays: 3,
    notes: ["Pre-order H-3 wajib", "Target serving 8–10 orang; wajib divalidasi dengan gramasi aktual"],
  },
];

export const rujakProducts = products.filter((p) => p.type === "rujak");
export const asinanProducts = products.filter((p) => p.type === "asinan");
export const saladProducts = products.filter((p) => p.type === "salad");
export function getProductsByFilter(filter: string): Product[] { if (filter === "all") return products; if (filter === "rujak") return rujakProducts; if (filter === "asinan") return asinanProducts; if (filter === "salad") return saladProducts; return products; }
export function getProductById(id: string): Product | undefined { return products.find((p) => p.id === id); }
export function formatCurrency(amount: number): string { return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount); }
export function getBadgeLabel(tag: string): string {
  const labels: Record<string, string> = { "best-seller": "Best Seller", entry: "Entry", signature: "Signature", sharing: "Sharing", "fresh-alt": "Fresh Alt", trending: "Trending", "search-capture": "Search Capture", trend: "Trend", diy: "DIY", "non-spicy": "Non-Spicy", limited: "Limited", exclusive: "Event" };
  return labels[tag] || "";
}


// === ORDER CONFIGURATION RULES ===
// Structured configuration used by the Commerce layer. Keep this separate from
// marketing copy so checkout/order payloads remain deterministic.
export const customBowlConfig = {
  sizeMl: 750,
  startingPrice: 35000,
  fruitGroups: {
    rekomendasi: ["Mangga", "Nanas", "Bengkoang"],
    asam: ["Kedondong", "Jambu Air"],
    manis: ["Jambu Kristal", "Salak"],
    musiman: [],
  },
  sauces: ["Pedas Manis", "Pedas Asin", "Sambal Mete", "Sambal Kiamboy", "Sambal Bangkok"],
  seasonalSlot: true,
} as const;

export const tampahNusantaraConfig = {
  diameterCm: 40,
  serving: "8-10 orang",
  preorderDays: 3,
  price: 200000,
} as const;

// Loyalty points (Task 8, phase 1). Customers are identified by phone
// number — there's no real customer login/auth in this app yet, so this
// is the same trust level as the rest of checkout (see docs/loyalty-points-table.sql
// for the honesty caveat: an anon Supabase key can't cryptographically
// prevent a determined client from tampering with its own balance).
//
// earnRatePerRupiah: owner-confirmed — 1 point per Rp1.000 of subtotal.
// pointValueRupiah / minPointsToRedeem: NOT explicitly confirmed with the
// owner — defaulted to a ~10% effective cashback rate (1 point = Rp100)
// with a Rp5.000-worth minimum before redemption is offered, so a single
// small order can't be redeemed away to nothing. Adjust here if the owner
// wants a different rate; every screen that shows points reads from this
// one config object.
export const loyaltyConfig = {
  earnPointsPerRupiah: 1 / 1000, // 1 point per Rp1.000 spent (subtotal)
  pointValueRupiah: 100, // 1 point = Rp100 when redeemed
  minPointsToRedeem: 50, // = Rp5.000 worth, so redemption isn't trivial
} as const;

# rujakco-v2

RUJAK.Co V2 — E-commerce Platform (rujak buah, asinan, dan produk segar lainnya).

Stack: Vite + React 19 + TypeScript (client), Express + tRPC + Drizzle/MySQL
(server scaffold — auth/OAuth only), dan **Supabase** untuk data komersial
(products browsed dari file statis `client/src/data/products.ts`, sedangkan
orders/realtime disimpan di Supabase langsung dari browser).

## Install

Butuh Node.js 20+ dan `pnpm`.

```bash
pnpm install
```

## Menjalankan secara lokal

```bash
pnpm dev      # dev server (Vite + Express via tsx watch), lihat "scripts" di package.json untuk port
pnpm check    # type-check (tsc --noEmit)
pnpm lint     # ESLint
pnpm format   # Prettier
pnpm test     # Vitest
```

## Environment Variables

Tidak ada file `.env.example` di repo ini — daftar berikut dikumpulkan dari
pemakaian aktual di kode (`grep` untuk `process.env.*` / `import.meta.env.*`).
Buat file `.env` di root sebelum menjalankan `pnpm dev` / build produksi.

### Server (`server/`) — auth & OAuth scaffold
| Variable | Dipakai untuk |
|---|---|
| `DATABASE_URL` | Koneksi MySQL via Drizzle (`server/db.ts`). Opsional untuk tooling lokal — kalau kosong, fitur yang butuh DB akan melempar `DatabaseUnavailableError` alih-alih gagal diam-diam. |
| `JWT_SECRET` | Verifikasi session/JWT di `server/_core`. |
| `OAUTH_SERVER_URL` | Endpoint OAuth server. |
| `OWNER_OPEN_ID` | OpenID akun owner/admin default. |
| `PORT` | Port server Express (opsional, ada default). |
| `NODE_ENV` | `development` / `production`. |
| `BUILT_IN_FORGE_API_KEY`, `BUILT_IN_FORGE_API_URL` | Integrasi platform bawaan (Manus/Forge runtime). |

### Client (`client/`, prefix wajib `VITE_`)
| Variable | Dipakai untuk |
|---|---|
| `VITE_APP_ID` | ID aplikasi untuk platform runtime. |
| `VITE_FRONTEND_FORGE_API_KEY`, `VITE_FRONTEND_FORGE_API_URL` | Integrasi Forge API dari sisi client. |
| `VITE_OAUTH_PORTAL_URL` | URL portal OAuth untuk login. |

### Supabase (commerce data — checkout, orders, admin dashboard)
`client/src/lib/supabase-client.ts` reads `VITE_SUPABASE_URL` /
`VITE_SUPABASE_ANON_KEY` from the environment, falling back to the
original project's URL/anon key if unset so the app still runs out of
the box. Set both in `.env` if you want to point a build at a different
Supabase project (e.g. separate staging/production). This isn't a secret
credential either way — Supabase anon keys are meant to be public and are
protected by Row Level Security on the Supabase side — so make sure the
RLS policies on your project (`orders`, `receipts` storage bucket) are
correctly locked down before going to production; this repo can't audit
those since they live in the Supabase project, not in this codebase.

**Note:** the checkout flow (`CheckoutEnhanced.tsx`) computes order totals
client-side and writes them straight to the `orders` table with the anon
key — there is no server-side re-pricing step. `order-utils.ts` now
cross-checks the cart subtotal against the product catalog
(`computeTrustedSubtotal`) before submission, which catches state bugs
and casual tampering, but is not a security boundary — anyone with
devtools can still edit running JS. Actual payment is settled manually
(admin reconciles the QRIS/bank transfer against the WhatsApp message and
receipt), so this doesn't let anyone get free orders, but the `orders`
row itself isn't a trustworthy record of what was actually paid unless
you add server-side re-pricing (e.g. a Supabase Edge Function) in front
of the insert.

## Database

Ada **dua** sumber data terpisah di proyek ini — penting untuk tidak tertukar:

1. **Supabase** (Postgres) — tabel `orders`, dipakai untuk checkout
   (`CheckoutEnhanced.tsx`), tracking pesanan (`OrderTracking.tsx`), dan
   dashboard admin realtime (`pages/Admin.tsx`). Ini yang perlu kamu setup
   kalau mau menjalankan alur commerce (checkout → order → admin).
2. **MySQL via Drizzle** (`server/db.ts`, `drizzle/schema.ts`) — dipakai
   untuk data user/auth (`users` table) lewat OAuth scaffold di
   `server/_core`. Jalankan migrasi dengan:
   ```bash
   pnpm db:push
   ```
   Butuh `DATABASE_URL` di `.env`. Kalau `DATABASE_URL` tidak diset, fungsi
   yang bergantung padanya (`upsertUser`, `getUserByOpenId`) akan melempar
   `DatabaseUnavailableError` yang jelas alih-alih gagal diam-diam — cek log
   server untuk `[Database]` / `[Auth]` prefix kalau login tidak berfungsi.

Produk (menu, harga, varian) **bukan** data dari database — didefinisikan
statis di `client/src/data/products.ts`. Untuk menambah/mengubah produk,
edit file itu langsung (lihat `PRODUCT_DATA_MIGRATION_2026-08-02.md` untuk
konteks kenapa keputusan ini diambil).

## Deploy

```bash
pnpm build   # vite build (client) + esbuild bundle server ke dist/
pnpm start   # jalankan dist/index.js (production)
```

Build menghasilkan aset client (dari Vite) dan server bundle (dari esbuild)
di `dist/`. Pastikan semua environment variable di atas sudah diset di
environment production sebelum `pnpm start`.

Catatan arsitektur: kalau frontend dan backend di-deploy ke **domain yang
berbeda** (umum untuk setup static-host + API terpisah), cookie session
di-set dengan `sameSite: "none"` (lihat `server/_core/cookies.ts`) agar
cookie tetap terkirim lintas origin. Kalau kamu deploy keduanya di domain
yang sama, ubah ke `"lax"` untuk postur CSRF yang lebih baik.

## Troubleshooting

- **Login/auth gagal tanpa pesan jelas**: cek log server untuk baris
  `[Auth] authenticateRequest failed:` — sebelumnya error auth ditelan diam-diam
  jadi `user = null` tanpa log sama sekali; sekarang selalu di-log.
- **Order "hilang" saat customer checkout offline**: sistem antrian offline
  ada di `client/src/utils/supabase.ts` (`queueOfflineOrder` /
  `getOfflineOrders`), disimpan di `localStorage` key `rujakco_offline_orders`,
  dan otomatis di-retry ke Supabase saat koneksi kembali (lihat
  `useServiceWorker.ts`). Kalau order masih tidak muncul di dashboard admin
  setelah online kembali, cek console browser untuk `Failed to sync offline
  order:`.
- **`pnpm check` gagal / error TypeScript**: environment development ini
  belum tentu punya akses registry npm yang sama dengan CI — jalankan
  `pnpm install` dulu sebelum `pnpm check` / `pnpm build`.
- **Dashboard admin (`/admin`) tidak menampilkan order baru secara realtime**:
  pastikan Row Level Security + Realtime replication sudah diaktifkan untuk
  tabel `orders` di project Supabase kamu (Supabase dashboard → Database →
  Replication).
- Lihat `COMMERCE_AUDIT_2026-08-02.md`, `NEXT_EXECUTION.md`, dan `todo.md`
  untuk riwayat audit dan item pekerjaan yang belum selesai (mis. Custom Bowl
  configurator dan Tampah Nusantara H-3 date picker belum wired ke checkout).

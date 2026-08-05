# RUJAK.Co — Rencana Kerja: Redesign "Ala Fore Coffee"

Dokumen ini untuk AI/developer lain yang melanjutkan pekerjaan. Baca seluruhnya
sebelum menyentuh kode — banyak keputusan sudah diambil dan alasannya dijelaskan
di sini supaya tidak diulang/dibalik tanpa sadar.

## 0. Konteks Proyek

- **Stack:** Vite + React 19 + TypeScript (client). Express + tRPC + Drizzle/MySQL
  di `server/` hanya scaffold auth/OAuth — **tidak dipakai untuk data komersial**.
  Produk, order, dan admin dashboard pakai **Supabase** langsung dari browser.
- **Data produk:** file statis `client/src/data/products.ts` (single source of truth,
  12 SKU). Order/checkout ditulis ke Supabase lewat `client/src/lib/supabase-client.ts`.
- **Referensi desain:** aplikasi mobile Fore Coffee (screenshot dikumpulkan owner) —
  gaya app-mobile-first: latar krem/putih, kartu rounded, bottom nav tetap, alur
  checkout terstruktur (upsell → voucher → kurir → pembayaran → ringkasan → konfirmasi
  modal → tracking pakai stepper).
- **Jangan bangun ulang dari nol.** Audit sebelumnya (`COMMERCE_AUDIT_2026-08-02.md`,
  `NEXT_EXECUTION.md`) mengonfirmasi fondasi cart/checkout/admin sudah jalan. Kerjakan
  di atas fondasi ini.

## 1. Environment & Verifikasi (WAJIB paling pertama)

Sandbox tempat rencana ini disusun **tidak punya akses jaringan**, jadi belum ada
satupun perubahan di bawah yang diverifikasi lewat build sungguhan. Sebelum
mengerjakan task apapun:

```bash
pnpm install
pnpm check    # tsc --noEmit
pnpm lint
pnpm dev      # buka di browser, cek console error
```

Jika `pnpm install` gagal atau ada error TypeScript nyata (bukan sekadar "Cannot find
module" karena belum install), **laporkan dan perbaiki dulu** sebelum lanjut ke task
lain — jangan menumpuk fitur baru di atas build yang belum tentu jalan.

## 2. Design tokens — pakai yang sudah ada, jangan bikin baru

Sudah didefinisikan di `client/src/index.css` (`@theme inline`):

| Token | Kegunaan |
|---|---|
| `--color-cream` | Latar utama (pengganti dark green lama) |
| `--color-forest` / `--color-forest-light` | Warna aksen utama, tombol primer |
| `--color-mango` | Aksen sekunder/highlight (badge "Baru", promo) |
| `--color-chili` | Error/destructive/badge angka |
| `--color-sage` | Latar lembut untuk kartu terpilih |
| `--color-paper` / `--color-paper-border` | Latar kartu & border tipis |
| `--color-ink` / `--color-ink-soft` / `--color-ink-muted` | Teks |
| `--font-display` (Fraunces) | Judul |
| `--font-sans` (DM Sans) | Body |

Semua styling baru harus pakai token ini via kelas Tailwind (`bg-cream`, `text-ink`,
`border-paper-border`, dst) — **jangan** hardcode hex baru seperti gaya lama
(`#072d25`, `#faf8f5`, dst yang masih ada di file lain yang belum disentuh).

## 3. Yang SUDAH selesai (jangan dikerjakan ulang)

- `client/src/components/BottomNav.tsx` — bottom nav tetap 4 tab (Beranda, Menu,
  Keranjang dengan badge jumlah, Pesanan → `/lacak`).
- `client/src/components/StatusStepper.tsx` — stepper horizontal 4 tahap
  (Pembayaran → Diproses → Dikirim → Selesai), menerima prop `status` dari tipe
  order Supabase, menangani state `cancelled` terpisah.
- `client/src/pages/Home.tsx` — redesign penuh dari tema gelap ke gaya Fore: hero
  banner promo, kartu sapaan `Hai, [nama]!`, dua tombol aksi cepat, grid "Spesial
  Untukmu" (Custom Bowl / Tampah Nusantara / Referral / Gift), pill kategori, grid
  produk, bottom nav terpasang.
- `client/src/pages/OrderTracking.tsx` — `StatusStepper` dan `BottomNav` sudah
  disisipkan di kedua state (hasil pencarian & form pencarian).

## 4. Backlog — urutkan sesuai nomor, jangan lompat kecuali task sebelumnya blocked

### Task 1 — Redesign CartDrawer.tsx ✅ SELESAI (sesi lanjutan)
**File:** `client/src/components/CartDrawer.tsx`
Setelah dicek, drawer ini **sudah** gaya Fore sejak awal (qty stepper +/-, subtotal
+ ongkir + total berlapis, tombol full-width). Yang dikerjakan sesi ini hanya
mengganti semua warna hex hardcoded (`#E8E5E0`, `#FEFDF8`) jadi token
(`border-paper-border`, `bg-paper`) supaya konsisten dengan bagian 2. Tidak ada
perubahan struktur/logic.

### Task 2 — Alur CheckoutEnhanced.tsx ✅ SUDAH SESUAI POLA FORE, tinggal polish token
**File:** `client/src/components/CheckoutEnhanced.tsx` + subkomponen di
`client/src/components/checkout/` (`CheckoutForm.tsx`, `UploadReceipt.tsx`,
`PaymentSection.tsx` → re-export dari `QrisPayment.tsx`, `DeliverySection.tsx`).

**Temuan penting (koreksi dari rencana kerja versi pertama):** alur ini **bukan**
submit-langsung seperti dugaan awal. Sudah 3 langkah: `form` (data pelanggan + pilih
kurir) → `confirm` (preview struk, generate PNG, kirim ke Telegram) → `payment`
(layar QRIS + validasi via WhatsApp). Ini sudah setara pola Fore (isi data → ringkasan
→ pembayaran). **Jangan bikin ulang step confirm terpisah (Task 6 lama) — sudah ada.**

Yang dikerjakan sesi ini: bersihkan semua warna hex hardcoded di
`CheckoutEnhanced.tsx`, `CheckoutForm.tsx`, `DeliverySection.tsx`,
`OrderSummary.tsx`, `UploadReceipt.tsx` → jadi token bagian 2. Tidak ada perubahan
urutan/logic.

**Belum dikerjakan (masih valid sebagai task lanjutan):** restyle visual
`DeliverySection.tsx` (pilihan kurir) dan `CheckoutForm.tsx` supaya betul-betul
terlihat seperti list bottom-sheet Fore (radio besar + harga di kanan) — saat ini
sudah pakai token warna yang benar tapi belum dicek apakah layout list-nya sudah
sepadat/serapi referensi Fore. **Cek dulu tampilan aktual di browser (`pnpm dev`)
sebelum putuskan perlu redesign layout lebih lanjut atau tidak** — jangan ubah tanpa
melihat hasil render sungguhan.

### Task 3 — QRIS payment screen ala Fore ✅ SEBAGIAN SELESAI
**File:** `client/src/components/QrisPayment.tsx`
Sudah ada QR besar di tengah, total, 3 langkah panduan (Struk/Bayar/Kabari), tombol
CTA. **Ditambahkan sesi ini:** banner countdown "Selesaikan pembayaran dalam MM:SS"
(15 menit, lewat hook `useCountdown` baru di file yang sama) — pola persis dari
screenshot Fore. Alur pembayarannya **manual** (upload bukti via WhatsApp, bukan
QRIS dinamis dengan callback), jadi timer ini murni UX urgency, tidak menghanguskan
order otomatis — **jangan tambahkan logic auto-cancel saat timer habis kecuali
diminta eksplisit**, karena order tetap valid selama customer belum menutup modal.

Belum dikerjakan: tombol "Unduh QR" terpisah (saat ini gambar QRIS statis, unduh
manual lewat long-press/screenshot seperti kebanyakan situs — cek dengan owner apakah
tombol unduh eksplisit dibutuhkan).

### Task 4 — Selesaikan Custom Bowl configurator ✅ SELESAI (sesi lanjutan)
Sudah tercatat di `NEXT_EXECUTION.md` sebelum redesign ini dimulai:
- Struktur data ada di `client/src/data/products.ts` field `customOptions` pada
  produk `id: "custom-bowl"`.
- UI pemilihan (buah/sambal) sudah ada di komponen produk, tapi **belum**
  menyimpan pilihan aktual ke cart line-item metadata.
- Kerjakan: sambungkan state pilihan user → `addToCart()` di `CartContext.tsx`
  (cek signature `addToCart(product, qty?, spiceLevel?, variant?)` — mungkin perlu
  field metadata tambahan untuk custom selection, cek `CartItem` interface di
  `client/src/contexts/CartContext.tsx`) → pastikan tampil benar di ringkasan
  checkout dan di payload WhatsApp/Telegram (`createWhatsAppMessage` di
  `lib/order-utils.ts`).

**Yang dikerjakan sesi ini:**
- `CartContext.tsx`: tipe baru `CustomBowlSelection { fruits: string[]; sauce: string }`,
  field `customSelection?` di `CartItem`, ikut masuk ke `cartKey` (dua Custom
  Bowl beda pilihan sekarang jadi baris cart terpisah, bukan digabung
  qty-nya), dan ditambahkan sebagai parameter ke-5 opsional di `addToCart()`.
- `ProductDetail.tsx`: blok `customOptions` yang tadinya cuma teks read-only
  diganti jadi picker interaktif (chip toggle multi-select buah, chip
  single-select sambal). Validasi pakai helper `validateCustomBowlSelection`
  yang **sudah ada** di `client/src/data/orderValidation.ts` (sebelumnya belum
  dipakai di mana pun) — bukan re-implementasi manual. Tombol "Tambah ke
  Reservasi" disabled sampai minimal 1 buah + 1 sambal valid dipilih.
- Ditampilkan di semua tempat cart item dirender: `CartDrawer.tsx`,
  `checkout/OrderSummary.tsx`, `ReceiptTemplate.tsx` (struk PNG).
- `order-utils.ts`: `createWhatsAppMessage` dan `formatOrderSummary` sekarang
  mencantumkan pilihan buah/sambal per baris.
- `CheckoutEnhanced.tsx`: `customSelection` ikut ke payload `saveOrder()` ke
  Supabase.
- `Admin.tsx` & `OrderTracking.tsx`: tipe item order diperluas +
  ditampilkan di dashboard admin dan halaman lacak pelanggan.
- **Bug tambahan yang ketemu & dibenerin:** `ReceiptTemplate.tsx` pakai
  `key={item.product.id}` di `.map()` — collision begitu ada 2 baris Custom
  Bowl beda pilihan di cart yang sama (sama-sama `product.id: "custom-bowl"`).
  Diganti ke `key={item.cartKey}` yang unik per baris.

**Sengaja TIDAK dikerjakan (di luar scope):** pricing dinamis berdasarkan
jumlah/jenis buah dipilih. Deskripsi produk bilang "harga dihitung
berdasarkan pilihan buah" tapi itu perubahan **logic harga**, bukan sekadar
nyambungin state ke cart — harga Custom Bowl tetap fixed Rp35.000 seperti
sebelumnya. **Cek dulu dengan owner** apakah pricing dinamis ini memang
dibutuhkan sebelum dikerjakan.

### Task 5 — Validasi H-3 preorder Tampah Nusantara ✅ SELESAI (sesi lanjutan)
- Produk `id: "tampah-nusantara"` punya field `preorderDays: 3` di
  `products.ts`, tapi checkout belum punya field tanggal pengiriman terstruktur.
- `NEXT_EXECUTION.md` menyebut sudah ada "deterministic validation helper" untuk
  ini — cari dan cek apakah masih ada/valid, atau buat baru: date picker di
  checkout khusus saat cart berisi produk dengan `preorderDays`, validasi tanggal
  yang dipilih ≥ H+3 dari sekarang, tolak submit kalau tidak valid dengan pesan
  jelas.

**Temuan:** helper-nya **sudah ada** dan valid — `validateTampahDeliveryDate()`
di `client/src/data/orderValidation.ts` (belum pernah dipanggil dari mana pun
sebelum sesi ini). Cukup di-wire, tidak perlu dibuat ulang.

**Yang dikerjakan sesi ini:**
- `CheckoutForm.tsx`: date picker (`<input type="date">`) muncul kondisional
  hanya kalau cart punya item dengan `preorderDays` — generik berdasarkan
  field produk, bukan hardcode nama "Tampah Nusantara", jadi otomatis berlaku
  untuk SKU pre-order lain di masa depan. Pakai atribut `min` dari
  `validateTampahDeliveryDate(...).minDate` supaya browser sendiri block
  tanggal < H-3. Tampilkan pesan error inline kalau tanggal dipilih tapi invalid.
- `CheckoutEnhanced.tsx`: state `deliveryDate`, deteksi `hasPreorderItem` +
  `preorderDays` (ambil lead time terpanjang kalau ada >1 item pre-order),
  validasi di `goToConfirm()` — block lanjut ke step "confirm" kalau tanggal
  belum dipilih atau kurang dari H-3, dengan `toast.error` + pesan dari
  `validateTampahDeliveryDate().reason`.
- `preorder_delivery_date` ikut ke payload Supabase (`saveOrder`) dan ke pesan
  WhatsApp (`createWhatsAppMessage`, parameter baru opsional di akhir —
  dicek dulu, hanya satu call site jadi aman ditambah tanpa breaking apa pun).
- `Admin.tsx` & `OrderTracking.tsx`: tampilkan tanggal pre-order kalau ada
  (badge warna chili di admin card, baris terpisah di halaman lacak).

**Belum dikerjakan (di luar scope Task 5):** validasi kapasitas dapur per
tanggal (mis. maksimal N Tampah per hari) — saat ini tidak ada limit jumlah
pre-order per tanggal, hanya validasi H-3. Tanyakan ke owner apakah perlu.

### Task 6 — Modal konfirmasi pesanan sebelum submit ✅ SELESAI (ternyata sudah ada, 1 celah ditutup)
Deskripsi asli task ini ("RUJAK.Co saat ini submit langsung dari tombol
'Pesan Sekarang', tambahkan step konfirmasi") **sudah tidak akurat** —
sudah dicatat di Task 2 kalau alur checkout memang 3 langkah (form →
konfirmasi/preview struk → QRIS+WhatsApp), bukan submit-langsung.

**Dicek ulang sesi ini:** step konfirmasi (`UploadReceipt.tsx` →
`ReceiptTemplate.tsx`) sudah menampilkan semua yang biasanya ada di
bottom-sheet konfirmasi ala Fore — metode kurir, alamat tujuan, waktu antar,
rincian item + harga. Bikin modal konfirmasi baru di titik ini akan
duplikat, jadi **tidak dikerjakan**.

**Celah yang ketemu & ditutup:** `preorder_delivery_date` (ditambahkan Task 5
sesi sebelumnya) sudah masuk ke payload Supabase & pesan WhatsApp, tapi
**belum** ditampilkan di step konfirmasi/struk itu sendiri — jadi pelanggan
yang pesan Tampah Nusantara tidak melihat tanggal pengirimannya sebelum
submit. Ditambahkan prop `preorderDeliveryDate` di sepanjang alur
`CheckoutEnhanced.tsx` → `UploadReceipt.tsx` → `ReceiptTemplate.tsx`,
tampil sebagai baris "Tanggal Pre-Order" di bagian Data Pengantaran.

### Task 7 — Voucher sederhana ✅ SELESAI (persentase saja, fase 1)
Owner mengkonfirmasi: jenis diskon persentase dulu (bukan nominal tetap).

**Yang dikerjakan sesi ini:**
- `orderValidation.ts`: tipe `Voucher`/`AppliedVoucher` + fungsi murni
  `pickBestVoucher(vouchers, subtotal, now)` — pola "1 voucher terbaik
  untukmu" ala Fore: auto-apply, tanpa input kode manual. Voucher lolos
  kalau `is_active`, belum `valid_until`, dan subtotal ≥ `min_subtotal`;
  di antara yang lolos, `discount_percent` tertinggi yang menang.
- `supabase-client.ts`: `getActiveVouchers()` — **gagal-lembut**, kalau
  tabel `vouchers` belum ada di Supabase, checkout tetap jalan normal
  tanpa diskon (bukan error).
- `CheckoutEnhanced.tsx`: fetch voucher saat modal checkout dibuka,
  `total = subtotal + shippingCost - discountAmount`. Diskon ikut ke
  payload Supabase (`voucher_code`, `discount_amount`) dan pesan WhatsApp.
- `CheckoutForm.tsx`: banner "Voucher X diterapkan otomatis — hemat Rp..."
  + baris diskon di footer sebelum Total.
- `ReceiptTemplate.tsx` + `UploadReceipt.tsx`: baris diskon di struk/step
  konfirmasi.
- `Admin.tsx` + `OrderTracking.tsx`: tampilkan kode voucher & nominal
  diskon di dashboard admin dan halaman lacak pelanggan.
- `order-utils.ts`: `createWhatsAppMessage` nampilin baris
  "🎟️ Voucher X: -Rp..." kalau ada.

**⚠️ WAJIB dijalankan sebelum fitur ini aktif — 2 migrasi SQL baru di
`docs/`, belum pernah dijalankan (sandbox ini tanpa akses DB):**
1. `docs/vouchers-table.sql` — bikin tabel `vouchers` + contoh seed
   voucher `RUJAK10` (10%, min Rp50rb).
2. `docs/orders-table-new-columns.sql` — **temuan penting saat sesi ini**:
   kolom `preorder_delivery_date` (Task 5) dan `voucher_code` /
   `discount_amount` (Task 7) ternyata **belum pernah ada migrasi ALTER
   TABLE-nya** sejak ditambahkan ke payload `saveOrder()`. Kalau tabel
   `orders` di Supabase punya skema kolom tetap (bukan jsonb bebas),
   insert-nya kemungkinan diam-diam gagal sejak Task 5 — checkout tetap
   sukses (fallback ke `queueOfflineOrder`, WhatsApp tetap kekirim), tapi
   baris di database bisa kosong/tidak konsisten. **Cek riwayat pesanan di
   Supabase dashboard setelah run migrasi ini untuk pastikan gak ada
   pesanan Tampah Nusantara yang datanya bolong.**

**Sengaja TIDAK dikerjakan (di luar scope fase 1):** diskon nominal tetap
(`discount_amount`), input kode voucher manual oleh pelanggan, dan halaman
admin untuk CRUD voucher (saat ini kelola voucher lewat Supabase dashboard
langsung, sesuai desain RLS read-only di `vouchers-table.sql`).

### Task 8 — Sistem poin & loyalti ✅ SELESAI (fase 1: kumpul + tukar otomatis)
Owner mengkonfirmasi: fase 1 langsung termasuk redeem di checkout (bukan cuma
kumpul poin), dengan aturan 1 poin per Rp1.000 belanja (subtotal).

**Yang dikerjakan sesi ini:**
- `products.ts`: `loyaltyConfig` — `earnPointsPerRupiah` (owner-confirmed:
  1 poin/Rp1.000), `pointValueRupiah` (100 — **default saya, BELUM
  dikonfirmasi owner**, setara ~10% cashback efektif), `minPointsToRedeem`
  (50 poin = Rp5rb, biar order kecil gak bisa nge-redeem jadi nyaris gratis).
- `orderValidation.ts`: fungsi murni `calculatePointsEarned()` dan
  `calculateRedemption()` — redemption pakai seluruh saldo poin pelanggan
  (toggle satu tombol "pakai semua poin", bukan slider partial), dibatasi
  gak boleh bikin total jadi negatif.
- `supabase-client.ts`: `getLoyaltyPoints(phone)` dan
  `adjustLoyaltyPoints(phone, delta)` — yang kedua manggil RPC Postgres
  `adjust_loyalty_points` biar atomik (gak race condition kalau 2 order
  masuk bersamaan), gagal-lembut kalau tabel belum ada.
- Identifikasi pelanggan pakai nomor HP (sesuai catatan task asli — belum
  ada login/auth pelanggan asli).
- `CheckoutEnhanced.tsx`: saldo poin di-fetch (debounced 500ms) begitu
  nomor HP diisi ≥10 digit. Redeem opsional (toggle), otomatis dibatalkan
  kalau saldo di bawah minimum. `total` sekarang
  `subtotal + shippingCost - voucherDiscount - loyaltyRedemption`. Poin
  didapat dihitung dari `subtotal` (bukan setelah diskon).
- Diskon poin + info "poin didapat" tampil konsisten di: `CheckoutForm.tsx`
  (toggle + baris footer), `ReceiptTemplate.tsx`/`UploadReceipt.tsx` (struk
  konfirmasi), pesan WhatsApp (`order-utils.ts`), `Admin.tsx`, dan
  `OrderTracking.tsx`.
- Poin di-adjust (net: earned − redeemed) via `adjustLoyaltyPoints()`
  setelah order berhasil disimpan — best-effort, gak pernah blokir/batalin
  order kalau gagal (sama seperti notifikasi Telegram).
- **Bug tambahan yang ketemu & dibenerin:** `deliveryDate` (dari Task 5) dan
  `redeemPoints` (fitur ini) ternyata gak pernah di-reset setelah order
  sukses — kalau pelanggan checkout lagi di sesi yang sama, tanggal
  pre-order lama & toggle redeem lama masih nyangkut. Ditambahkan reset-nya.

**⚠️ Migrasi SQL baru — WAJIB dijalankan sebelum fitur ini aktif:**
- `docs/loyalty-points-table.sql` (baru) — tabel `loyalty_points` + fungsi
  RPC `adjust_loyalty_points`. **Catatan jujur soal keamanan** ada di
  komentar file ini: karena app ini belum punya login pelanggan asli, semua
  penyesuaian poin lewat anon key Supabase — sama level kepercayaan dengan
  bagian lain aplikasi ini (`orders` juga di-insert langsung dari client),
  bukan sistem anti-fraud sungguhan. Cukup aman untuk skala bisnis lokal
  saat ini, tapi kalau nanti jadi masalah, perlu dipindah ke belakang
  server (Supabase Edge Function + service role key).
- `docs/orders-table-new-columns.sql` (diupdate) — sekarang juga nambahin
  `points_earned`, `points_redeemed`, `loyalty_discount_amount` ke tabel
  `orders`, selain `preorder_delivery_date`/`voucher_code`/`discount_amount`
  dari sesi-sesi sebelumnya.

**Sengaja TIDAK dikerjakan (di luar scope fase 1):** halaman "cek saldo
poin saya" mandiri (saldo cuma kelihatan pas lagi checkout atau di halaman
lacak pesanan setelah order), redemption partial/custom jumlah poin,
expiry poin, dan tier/level loyalti. `pointValueRupiah = 100` **perlu
dikonfirmasi ke owner** — kalau mau diubah, cukup edit satu angka di
`loyaltyConfig`, semua tempat yang nampilkan nilai poin otomatis ikut.

### Task 9 — Foto produk final (Prioritas rendah, bukan tugas coding)
Beberapa produk masih pakai placeholder foto produk lain (lihat
`COMMERCE_AUDIT_2026-08-02.md` bagian C). Ini tugas konten/fotografi, tandai saja
kalau ketemu saat kerja di `products.ts`, jangan coba "perbaiki" dengan generate
gambar AI kecuali diminta eksplisit oleh owner.

### Task 10 — Testing manual mobile (Prioritas tinggi, lakukan di akhir tiap task besar)
Setelah Task 1–6: buka `pnpm dev`, resize browser ke lebar mobile (375px), coba
alur penuh: tambah produk → buka cart → checkout → pilih kurir → pilih pembayaran →
submit → cek halaman `/lacak`. Semua breakpoint `max-w-md` di Home.tsx/komponen baru
sudah didesain mobile-first, tapi tetap wajib dicek manual karena belum pernah
dijalankan di browser sungguhan oleh sesi manapun sejauh ini.

## 5. Aturan kerja untuk AI/dev yang melanjutkan

1. **Baca todo.md dan NEXT_EXECUTION.md** yang sudah ada di root repo sebelum mulai —
   mungkin sudah diupdate sejak dokumen ini ditulis.
2. **Satu task besar = satu sesi/PR.** Jangan gabung Task 2 (checkout redesign) dengan
   Task 4 (Custom Bowl logic) dalam satu perubahan besar — keduanya saling lepas dan
   lebih mudah direview terpisah.
3. **Jangan ubah logic Supabase/order-utils/shipping-utils** kecuali task eksplisit
   memintanya (Task 4, 5, 7, 8 butuh sedikit perubahan logic; Task 1, 2, 3, 6 murni
   UI di atas logic yang sudah ada).
4. **Pakai token desain di bagian 2**, jangan hardcode warna baru.
5. **Update `todo.md` dan `NEXT_EXECUTION.md`** setiap menyelesaikan satu task supaya
   sesi berikutnya tahu progres tanpa harus membaca ulang seluruh riwayat chat.
6. **Jalankan `pnpm check` sebelum menganggap task selesai** — bukan sekadar "kode
   terlihat benar".

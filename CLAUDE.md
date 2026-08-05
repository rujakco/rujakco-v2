# RUJAK.Co — Panduan Kerja untuk Claude

Project: `rujakco-v2` — React + TypeScript + Tailwind (v4)
Konteks: Redesign visual/UI premium (Apple × Starbucks Reserve × Fore Coffee), tanpa mengubah logika aplikasi.

## Aturan Kerja (WAJIB DIPATUHI)

### Boleh diubah
- HTML / struktur visual (JSX markup, bila diperlukan untuk tujuan visual)
- CSS / Tailwind class
- Animasi (Framer Motion transition, easing, duration — untuk tujuan visual)
- Icon, typography, layout, spacing, warna
- Responsive behavior
- Shadow, border radius
- Urutan visual section — HANYA jika tidak mengubah alur fungsi

### TIDAK BOLEH diubah
- JavaScript / React logic (state, effect, handler behavior)
- API calls
- Supabase queries / schema
- Database
- Routing
- State management (Context, reducers, dsb.)
- Validasi
- Alur checkout
- Perhitungan (harga, ongkir, dsb.)
- Fungsi apa pun yang sudah berjalan

### Metode Kerja
Kerjakan bertahap. Setelah tiap tahap, pastikan tidak ada fungsi yang rusak sebelum lanjut ke tahap berikutnya. Prioritaskan perubahan yang benar-benar meningkatkan kualitas, bukan sekadar banyak.

Roadmap tahap:
1. Design System (warna, font, spacing, radius, shadow) — **SELESAI**
2. Header + Hero — **SELESAI**
3. Card Produk + Menu — **SELESAI**
4. Story, FAQ, Footer — **BELUM**
5. Mobile optimization — **BELUM**
6. Finishing, micro interaction, audit visual — **BELUM**

---

## Design System — Token Reference (Tahap 1)

Lokasi: `client/src/index.css`

### Radius
```
--r-sm: 12px
--r-md: 18px
--r-lg: 24px   ← dipakai di semua product card & modal
--r-xl: 32px
--r-full: 999px ← dipakai di semua button pill
```

### Elevation (shadow bertingkat, tonal forest — bukan hitam datar)
```
--shadow-1  → resting card         (.elevation-1)
--shadow-2  → active/hover, button (.elevation-2)
--shadow-3  → dropdown/product-card hover (.elevation-3)
--shadow-4  → modal/drawer         (.elevation-4)
```

### Warna
- Warna eksisting (forest, cream, mango, chili, sage, ink, dll.) TIDAK diganti/di-rename — tetap dipakai apa adanya.
- Tambahan baru, dipakai HANYA untuk CTA/badge penting:
```
--color-gold: oklch(0.78 0.11 75)
--color-gold-deep: oklch(0.62 0.13 65)
```

### Motion
```
--ease-premium: cubic-bezier(0.22, 1, 0.36, 1)  ← satu easing untuk semua
--dur-fast: 200ms
--dur-base: 300ms   ← default untuk hover/transition
--dur-slow: 450ms
```

### Component classes siap pakai (di `@layer components`)
- `.btn-premium-primary` — tombol pill emas (gold), tinggi 48px
- `.btn-premium-forest` — tombol pill forest, tinggi 48px, dipakai untuk CTA utama (Hero, Header, ProductDetail)
- `.btn-premium-secondary` — tombol outline
- `.card-premium` — card generik, radius 24px + elevation-1→3 saat hover
- `.product-card` — khusus product grid, radius 24px, hover shadow via CSS `:hover` asli (BUKAN `hover:elevation-3` — itu tidak berfungsi karena bukan utility Tailwind resmi)
- `.chip-float` — untuk badge/chip mengambang (contoh: "Fresh-Prep" di Hero), pakai backdrop-blur + elevation-3

**Penting:** semua class di atas murni CSS tambahan (additive). Tidak ada token/class lama yang dihapus atau di-rename.

---

## Progress Log

### Tahap 1 — Design Tokens (`client/src/index.css`)
Menambahkan radius scale, elevation scale, gold accent, motion tokens, dan component-layer utility classes di atas. Tidak ada breaking change — semua class lama tetap ada.

### Tahap 2 — Header + Hero
File: `client/src/components/Header.tsx`, `client/src/components/Hero.tsx`

- Hero: tinggi disesuaikan (`min-h-[92vh] lg:min-h-screen`), CTA pakai `.btn-premium-forest` / `.btn-premium-secondary`, headline tracking lebih rapat (`leading-[1.08] tracking-tight`), stat icon & floating badge "Fresh-Prep" pakai token elevation/chip-float, tambah layer gradient tipis untuk depth.
- Header: tinggi disesuaikan mendekati 72px (`h-[68px] lg:h-[76px]`), tombol Reservasi pakai `.btn-premium-forest`, **fix bug visual**: badge jumlah item cart sebelumnya `absolute` tanpa parent `relative` (posisi berpotensi meleset) — ditambahkan `relative` pada tombol (CSS-only fix, tidak menyentuh `itemCount` atau state cart), nav link desktop dapat underline hover halus (pure CSS `::after`).

Semua `onClick`, `scrollToProducts`, `toggleCart`, `itemCount` — tidak disentuh.

### Tahap 3 — Card Produk + Menu
File: `client/src/components/Products.tsx`, `client/src/components/ProductDetail.tsx`

- `ProductCard`: radius & hover shadow disatukan lewat class `.product-card` (radius 24px, shadow-1 → shadow-3 real CSS `:hover`). Badge tag padding dilebarkan sedikit (tetap pakai `badgeColors` map yang sama, tidak ada tag/kategori baru). Tombol "Tambah" & filter pill pakai `--ease-premium` + elevation token. Grid gap diperbesar (`gap-6` → `gap-7 lg:gap-8`).
- `ProductDetail` (modal): radius modal disamakan (`rounded-[24px]`), shadow modal pakai `.elevation-4`. Tombol "Tambah ke Reservasi" diganti ke `.btn-premium-forest`.

Semua `addToCart`, `setFilter`, `useState`/`useEffect` di ProductDetail (termasuk bug-fix sinkronisasi state qty/spiceLevel/variant saat ganti produk yang sudah ada sebelumnya) — **tidak disentuh**.

---

## Yang Belum Dikerjakan (Tahap 4–6)

- **Story, FAQ, Footer**: belum disentuh sama sekali. Terapkan token yang sama (radius, elevation, `--ease-premium`, `.btn-premium-*`) untuk konsistensi.
- **Mobile optimization**: belum ada audit responsive khusus di luar yang otomatis mengikuti dari perubahan Tahap 1–3.
- **Finishing / micro-interaction / audit visual akhir**: belum dimulai.

## Preferensi Kerja Owner (Ngoedi)
- Perubahan konservatif, berbasis diff, tetap di dalam design token yang sudah ada.
- Tunjukkan rencana perubahan sebelum diterapkan bila memungkinkan.
- Detail tinggi diharapkan — cek balance brace/paren, pastikan tidak ada class Tailwind palsu (seperti `hover:custom-class` yang tidak akan ter-compile).
- Solo operator, prioritas: eksekusi cepat, tidak banyak opsi tanpa rekomendasi jelas.
- Setelah tiap tahap, verifikasi dulu (build & cek manual) sebelum lanjut tahap berikutnya.

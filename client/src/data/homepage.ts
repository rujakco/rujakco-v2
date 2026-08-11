/*
 * RUJAK.Co — Content Layer: Homepage Configuration
 * Single source of truth for site-wide branding, hours, social, delivery.
 * Change this file to update homepage content without touching components.
 */

export const homepageConfig = {
  brand: {
    name: "RUJAK.Co",
    tagline: "Indonesia dalam Satu Wadah",
    subtitle: "Pengalaman Rasa Nusantara",
    description: "Rujak buah premium segar dengan sambal mete premium. Disiapkan seketika sebelum pengantaran untuk menjaga kesegaran.",
    established: "2024",
    location: "Bekasi, Indonesia",
    // Single source of truth for the in-app logo (used post-load, e.g.
    // Header/Footer/receipts). Splash/Onboarding/LoadingExperience
    // intentionally use a local /assets/brand/logo.webp copy instead, so
    // the very first paint doesn't depend on the CDN being reachable yet.
    logo: "https://dk1tnyskaoive0dn.public.blob.vercel-storage.com/logo.webp",
  },

  contact: {
    phone: "+62 896-7716-1680",
    email: "halo@rujakco.biz.id",
    whatsapp: "6289677161680",
  },

  hours: {
    weekday: { open: "10:00", close: "20:00", label: "Sen–Jum" },
    weekend: { open: "09:00", close: "18:00", label: "Sab–Min" },
  },

  social: {
    instagram: { url: "https://www.instagram.com/rujakco.id", label: "Instagram" },
    tiktok: { url: "https://www.tiktok.com/@rujakco", label: "TikTok" },
    whatsapp: { url: "https://wa.me/6289677161680", label: "WhatsApp" },
  },

  delivery: {
    cost: 8000,
    options: [
      { id: "lalamove", name: "Lalamove", eta: "30-60 menit", description: "Pengantaran internal Bekasi & Jakarta Selatan" },
      { id: "paxel", name: "Paxel", eta: "60-90 menit", description: "Jangkauan luas Jabodetabek" },
      { id: "ekspres", name: "Ekspres", eta: "90-120 menit", description: "Pengantaran same-day untuk area jauh" },
    ],
  },
};

export type HomepageConfig = typeof homepageConfig;

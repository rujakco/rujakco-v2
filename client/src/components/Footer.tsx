/*
 * RUJAK.Co — Experience Layer: Footer
 * Content from homepage.ts.
 * Mobile: ringkas ala info bar Fore (kontak + sosial + copyright).
 * Desktop: grid 4 kolom tetap.
 */

import { homepageConfig } from "@/data/homepage";
import { Instagram, Music, MessageCircle } from "lucide-react";

export default function Footer() {
  const { brand, contact, hours } = homepageConfig;

  return (
    <footer id="about" className="bg-ink text-white">
      {/* Mobile compact strip */}
      <div className="md:hidden max-w-md mx-auto px-4 py-8">
        <div className="flex items-center gap-2.5 mb-4">
          <img
            src="https://dk1tnyskaoive0dn.public.blob.vercel-storage.com/logo.webp"
            alt="RUJAK.Co"
            className="w-9 h-9 rounded-xl object-cover"
          />
          <span className="font-display text-lg font-semibold">
            RUJAK<span className="text-mango">.Co</span>
          </span>
        </div>
        <p className="text-white/50 text-xs leading-relaxed mb-5">
          {brand.tagline} · {brand.location}
        </p>

        <div className="space-y-3 text-sm text-white/70 mb-6">
          <div className="flex justify-between gap-4">
            <span className="text-white/40">Jam</span>
            <span className="text-right">
              {hours.weekday.label} {hours.weekday.open}–{hours.weekday.close}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-white/40">Kontak</span>
            <span className="text-right">{contact.phone}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <a
            href={homepageConfig.social.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center text-white/70 hover:bg-white/20 transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="w-4 h-4" />
          </a>
          <a
            href={homepageConfig.social.tiktok.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center text-white/70 hover:bg-white/20 transition-colors"
            aria-label="TikTok"
          >
            <Music className="w-4 h-4" />
          </a>
          <a
            href={homepageConfig.social.whatsapp.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 h-9 px-3.5 bg-white/10 rounded-full text-xs font-medium text-white/80 hover:bg-white/20 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            WhatsApp
          </a>
        </div>

        <p className="text-white/35 text-[11px]">
          © {new Date().getFullYear()} {brand.name}. Hak cipta dilindungi.
        </p>
      </div>

      {/* Desktop grid */}
      <div className="hidden md:block">
        <div className="container py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <img
                  src="https://dk1tnyskaoive0dn.public.blob.vercel-storage.com/logo.webp"
                  alt="RUJAK.Co"
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <span className="font-display text-xl font-semibold">
                  RUJAK<span className="text-mango">.Co</span>
                </span>
              </div>
              <p className="text-white/50 text-sm leading-relaxed mb-5">
                {brand.description}
              </p>
              <div className="flex gap-3">
                <a
                  href={homepageConfig.social.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center text-white/60 hover:bg-white/20 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href={homepageConfig.social.tiktok.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center text-white/60 hover:bg-white/20 hover:text-white transition-colors"
                  aria-label="TikTok"
                >
                  <Music className="w-4 h-4" />
                </a>
                <a
                  href={homepageConfig.social.whatsapp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center text-white/60 hover:bg-white/20 hover:text-white transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-display text-base font-semibold mb-4">
                Jam Operasional
              </h4>
              <div className="space-y-3 text-sm text-white/60">
                <div>
                  <p className="text-white/80 font-medium">
                    {hours.weekday.label}
                  </p>
                  <p>
                    {hours.weekday.open} – {hours.weekday.close}
                  </p>
                </div>
                <div>
                  <p className="text-white/80 font-medium">
                    {hours.weekend.label}
                  </p>
                  <p>
                    {hours.weekend.open} – {hours.weekend.close}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-display text-base font-semibold mb-4">
                Pengantaran
              </h4>
              <div className="space-y-2 text-sm text-white/60">
                {homepageConfig.delivery.options.map((opt) => (
                  <div key={opt.id}>
                    <p className="text-white/80">{opt.name}</p>
                    <p>{opt.eta}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-white/60 mt-3">
                Biaya mulai{" "}
                <span className="text-mango font-semibold">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(homepageConfig.delivery.cost)}
                </span>
              </p>
            </div>

            <div>
              <h4 className="font-display text-base font-semibold mb-4">
                Kontak
              </h4>
              <div className="space-y-2 text-sm text-white/60">
                <p>{contact.phone}</p>
                <p>{contact.email}</p>
                <p>{brand.location}</p>
              </div>
              <a
                href={`https://wa.me/${contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-white/10 rounded-full text-sm hover:bg-white/20 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Chat WhatsApp
              </a>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-xs">
              © {new Date().getFullYear()} {brand.name}. Hak cipta dilindungi.
            </p>
            <p className="text-white/30 text-xs">
              Dibuat dengan 🍃 di {brand.location}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

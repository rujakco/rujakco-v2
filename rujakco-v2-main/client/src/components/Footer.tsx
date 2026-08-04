/*
 * RUJAK.Co — Experience Layer: Footer
 * Content from homepage.ts. Dark footer with prominent brand.
 */

import { homepageConfig } from "@/data/homepage";
import { Leaf, Instagram, Music } from "lucide-react";

export default function Footer() {
  const { brand, contact, hours } = homepageConfig;

  return (
    <footer id="about" className="bg-ink text-white">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
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
            <p className="text-white/50 text-sm leading-relaxed mb-5">{brand.description}</p>
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
                <Leaf className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-display text-base font-semibold mb-4">Jam Operasional</h4>
            <div className="space-y-3 text-sm text-white/60">
              <div>
                <p className="text-white/80 font-medium">{hours.weekday.label}</p>
                <p>{hours.weekday.open} – {hours.weekday.close}</p>
              </div>
              <div>
                <p className="text-white/80 font-medium">{hours.weekend.label}</p>
                <p>{hours.weekend.open} – {hours.weekend.close}</p>
              </div>
            </div>
          </div>

          {/* Delivery */}
          <div>
            <h4 className="font-display text-base font-semibold mb-4">Pengantaran</h4>
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

          {/* Contact */}
          <div>
            <h4 className="font-display text-base font-semibold mb-4">Kontak</h4>
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
              <Leaf className="w-3.5 h-3.5" />
              Chat WhatsApp
            </a>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} {brand.name}. Hak cipta dilindungi.
          </p>
          <p className="text-white/30 text-xs flex items-center gap-1.5">
            Dibuat dengan <Leaf className="w-3 h-3 text-forest" /> di {brand.location}
          </p>
        </div>
      </div>
    </footer>
  );
}

import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { InstagramIcon, FacebookIcon } from "@/components/ui/SocialIcons";
import { business, contact, brand } from "@/lib/content";

/** Underline-wipe link, gold wipe left→right on hover (docs/01 §12). */
function FooterLink({ href, children, external = false }: { href: string; children: React.ReactNode; external?: boolean }) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group relative inline-block text-sm text-white/60 transition-colors hover:text-white"
    >
      {children}
      <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:scale-x-100" />
    </a>
  );
}

const exploreLinks = [
  { label: "Packages", href: "#packages" },
  { label: "Regions", href: "#regions" },
  { label: "Why Us", href: "#why-us" },
  { label: "Gallery", href: "#gallery" },
];

const serviceLinks = [
  { label: "Trekking", href: "#packages" },
  { label: "Helicopter Tours", href: "#packages" },
  { label: "Mountain Flights", href: "#packages" },
  { label: "Jungle Safari", href: "#packages" },
];

export function Footer() {
  return (
    <footer id="contact" className="bg-navy-deep text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Logo onDark className="text-2xl" />
            <p className="mt-4 text-sm text-white/50">{brand.tagline}</p>
            <p className="mt-2 text-sm text-white/40">{business.base}</p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href={contact.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-white/50 transition-colors hover:text-gold"
              >
                <InstagramIcon />
              </a>
              <a
                href={contact.facebook.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-white/50 transition-colors hover:text-gold"
              >
                <FacebookIcon />
              </a>
            </div>
          </div>

          {/* Explore */}
          <nav aria-label="Explore">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-light">Explore</h3>
            <ul className="mt-4 space-y-3">
              {exploreLinks.map((l) => (
                <li key={l.label}><FooterLink href={l.href}>{l.label}</FooterLink></li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <nav aria-label="Services">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-light">Services</h3>
            <ul className="mt-4 space-y-3">
              {serviceLinks.map((l) => (
                <li key={l.label}><FooterLink href={l.href}>{l.label}</FooterLink></li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-light">Get in touch</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/60">
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <FooterLink href={contact.whatsapp} external>{contact.phone}</FooterLink>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <FooterLink href={`mailto:${contact.email}`}>{contact.email}</FooterLink>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>{contact.hours}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>{business.registeredAddress}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center">
          <p>
            © {business.touristDotCom.since} {business.name}. Also trading as {business.alsoTradesAs}.
          </p>
          <FooterLink href={business.touristDotCom.listing} external>
            {business.touristDotCom.status} · verified on Tourist.com
          </FooterLink>
        </div>
      </div>
    </footer>
  );
}

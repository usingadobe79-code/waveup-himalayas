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
      className="type-small group relative inline-block text-on-dark/80 transition-colors hover:text-on-dark"
    >
      {children}
      <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:scale-x-100" />
    </a>
  );
}

// Absolute "/#section" so these resolve from sub-pages too (detail / index):
// on the homepage SmoothScroll intercepts + smooth-scrolls; off-home they
// navigate home first, then land on the section. (Bare "#x" would be dead on
// sub-pages that have no such section.)
const exploreLinks = [
  { label: "Packages", href: "/#packages" },
  { label: "Regions", href: "/#regions" },
  { label: "Why Us", href: "/#why-us" },
  { label: "Gallery", href: "/#gallery" },
];

// Point at /packages pre-filtered to each service (PackagesBrowser reads the
// hash), matching the clickable service cards on the home page.
const serviceLinks = [
  { label: "Trekking", href: "/packages/#trekking" },
  { label: "Helicopter Tours", href: "/packages/#heli-tours" },
  { label: "Mountain Flights", href: "/packages/#mountain-flights" },
  { label: "Jungle Safari", href: "/packages/#jungle-safari" },
];

export function Footer() {
  return (
    <footer id="contact" className="bg-surface-darker text-on-dark">
      <div className="container-page py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            {/* Half the previous size (was text-2xl) — the lockup was dominating
                the footer's brand column. */}
            <Logo onDark className="text-xs" />
            <p className="type-small mt-4 text-on-dark/75">{brand.tagline}</p>
            <p className="type-small mt-2 text-on-dark/75">{business.base}</p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href={contact.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-on-dark/70 transition-colors hover:text-accent"
              >
                <InstagramIcon />
              </a>
              <a
                href={contact.facebook.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-on-dark/70 transition-colors hover:text-accent"
              >
                <FacebookIcon />
              </a>
            </div>
          </div>

          {/* Explore */}
          <nav aria-label="Explore">
            <h3 className="type-eyebrow text-accent">Explore</h3>
            <ul className="mt-4 space-y-3">
              {exploreLinks.map((l) => (
                <li key={l.label}><FooterLink href={l.href}>{l.label}</FooterLink></li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <nav aria-label="Services">
            <h3 className="type-eyebrow text-accent">Services</h3>
            <ul className="mt-4 space-y-3">
              {serviceLinks.map((l) => (
                <li key={l.label}><FooterLink href={l.href}>{l.label}</FooterLink></li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className="type-eyebrow text-accent">Get in touch</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <FooterLink href={contact.whatsapp} external>{contact.phone}</FooterLink>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <FooterLink href={`mailto:${contact.email}`}>{contact.email}</FooterLink>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span className="type-small text-on-dark/75">{contact.hours}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span className="type-small text-on-dark/75">{business.registeredAddress}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-on-dark/10 pt-6 sm:flex-row sm:items-center">
          <p className="type-small text-on-dark/75">
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

import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { JsonLd, WebsiteJsonLd } from "@/components/seo/JsonLd";
import { Analytics } from "@/components/seo/Analytics";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { business, brand, siteUrl } from "@/lib/content";

// Display: aspirational editorial serif (docs/04 suggests Fraunces).
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
});

// Body: clean neutral sans.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  // Absolute base so relative canonical / OG image URLs resolve site-wide.
  metadataBase: new URL(siteUrl),
  title: {
    default: `${business.name} — Rise Above the Ordinary`,
    // Sub-pages set just their own title; this appends the brand.
    template: `%s — ${business.name}`,
  },
  description: brand.hero.sub,
  applicationName: business.name,
  alternates: { canonical: "/" },
  // Sitewide OG/Twitter defaults so link shares (WhatsApp/Facebook/Instagram/X)
  // get a proper preview. metadataBase makes the relative image absolute.
  // Sub-pages override title/description/url/images with their own.
  openGraph: {
    type: "website",
    siteName: business.name,
    url: "/",
    title: `${business.name} — Rise Above the Ordinary`,
    description: brand.hero.sub,
    locale: "en_US",
    images: [{ url: "/images/hero.jpg", alt: `${business.name} — ${brand.tagline}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${business.name} — Rise Above the Ordinary`,
    description: brand.hero.sub,
    images: ["/images/hero.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface text-ink">
        <JsonLd />
        <WebsiteJsonLd />
        <MotionProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </MotionProvider>
        <WhatsAppButton />
        <Analytics />
      </body>
    </html>
  );
}

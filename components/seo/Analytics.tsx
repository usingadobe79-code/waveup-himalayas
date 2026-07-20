import Script from "next/script";

/**
 * GA4 measurement ID. Public by design — it ships in the page source of every
 * site that uses it, so there is nothing to protect here. Overridable per build
 * via NEXT_PUBLIC_GA_ID, matching how siteUrl is handled in lib/content.
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-DJGG3LQXX2";

/**
 * Google Analytics 4.
 *
 * Google's own snippet says to paste this immediately after <head>, which would
 * put a blocking third-party request ahead of the page's own content. next/script
 * with `afterInteractive` loads it once the page is usable instead. Nothing is
 * lost: gtag queues the initial page_view and sends it when the library arrives.
 *
 * SPA navigations are covered by GA4's enhanced measurement, which listens for
 * History API changes — so moving between package pages is tracked without a
 * manual pageview call here.
 */
export function Analytics() {
  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}

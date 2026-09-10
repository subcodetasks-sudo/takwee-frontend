import Script from "next/script";

type GoogleAnalyticsProps = {
  measurementId: string;
};

/**
 * Loads gtag when settings expose a non-empty `google_analytics_id`.
 */
export function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  const id = measurementId.trim();
  if (!id) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="linen-line-ga4" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${id}');
        `}
      </Script>
    </>
  );
}

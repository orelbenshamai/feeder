"use client";

import Script from "next/script";

/**
 * Load GTM after the page is idle so it doesn't compete with LCP.
 * Events still queue on `dataLayer` via sendGTMEvent before the script loads.
 */
export default function DeferredGTM({ gtmId }: { gtmId: string }) {
  return (
    <>
      <Script id="_deferred-gtm-init" strategy="lazyOnload">
        {`(function(w,l){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});})(window,'dataLayer');`}
      </Script>
      <Script
        id="_deferred-gtm"
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtm.js?id=${gtmId}`}
      />
    </>
  );
}

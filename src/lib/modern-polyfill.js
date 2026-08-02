/**
 * Replaces Next.js `polyfill-module` (unconditionally bundled ~14KB).
 * Those polyfills target browsers older than Next's own baseline
 * (Chrome/Edge/Firefox 111+, Safari 16.4+). Lighthouse flags them as waste.
 *
 * Keep only URL.canParse — still needed on Safari 16.4 (Next's floor).
 * Safe to drop once Next gates polyfills on browserslist (vercel/next.js#86785).
 */
if (!("canParse" in URL)) {
  URL.canParse = function canParse(url, base) {
    try {
      return !!new URL(url, base);
    } catch {
      return false;
    }
  };
}

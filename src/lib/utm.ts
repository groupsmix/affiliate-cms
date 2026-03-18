/**
 * Append UTM tracking parameters to an affiliate URL.
 *
 * @param baseUrl   The raw affiliate URL
 * @param source    Site identifier (defaults to "adawat-albarid")
 * @param medium    Traffic medium, e.g. "affiliate"
 * @param campaign  Content slug or page identifier
 * @param content   Placement label, e.g. "product-card", "cta-button"
 */
export function appendUtm(
  baseUrl: string,
  {
    source = 'adawat-albarid',
    medium = 'affiliate',
    campaign = '',
    content = '',
  }: {
    source?: string;
    medium?: string;
    campaign?: string;
    content?: string;
  } = {},
): string {
  try {
    const url = new URL(baseUrl);
    if (source) url.searchParams.set('utm_source', source);
    if (medium) url.searchParams.set('utm_medium', medium);
    if (campaign) url.searchParams.set('utm_campaign', campaign);
    if (content) url.searchParams.set('utm_content', content);
    return url.toString();
  } catch {
    // If the URL is malformed, return it as-is
    return baseUrl;
  }
}

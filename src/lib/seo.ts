/**
 * SEO helper for dynamic client-side metadata and canonical synchronization.
 * Enhances search engine discoverability and social share previews across all views.
 */

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl: string;
  ogImage?: string;
  type?: string;
}

export function updatePageSEO({
  title,
  description,
  canonicalUrl,
  ogImage = 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&w=1200&q=80',
  type = 'website',
}: SEOProps) {
  if (typeof document === 'undefined') return;

  // 1. Page Title
  document.title = title;

  // 2. Meta Helper
  const setMeta = (attr: 'name' | 'property', key: string, val: string) => {
    let el = document.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', val);
  };

  // 3. Primary Meta Tags
  setMeta('name', 'description', description);

  // 4. Canonical Link
  let canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', canonicalUrl);

  // 5. Open Graph Meta Tags
  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', description);
  setMeta('property', 'og:url', canonicalUrl);
  setMeta('property', 'og:type', type);
  setMeta('property', 'og:image', ogImage);

  // 6. Twitter Card Meta Tags
  setMeta('name', 'twitter:title', title);
  setMeta('name', 'twitter:description', description);
  setMeta('name', 'twitter:url', canonicalUrl);
  setMeta('name', 'twitter:image', ogImage);
}

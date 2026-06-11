import { useEffect } from 'react';

interface SEOOptions {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
}

const DEFAULT_IMAGE = 'https://slim-file.com/lovable-uploads/logo.png';

export function useSEO({ title, description, canonical, ogImage, ogType = 'website' }: SEOOptions) {
  useEffect(() => {
    // Page title
    document.title = title;

    // Helper to upsert a <meta> tag
    const setMeta = (selector: string, attr: string, value: string) => {
      let el = document.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement('meta');
        const [attrName, attrValue] = attr.split('=');
        el.setAttribute(attrName, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    };

    // Helper to upsert a <link> tag
    const setLink = (rel: string, href: string) => {
      let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    const image = ogImage || DEFAULT_IMAGE;
    const canonicalUrl = canonical || `https://slim-file.com${window.location.pathname}${window.location.hash}`;

    // Standard meta tags
    setMeta('meta[name="description"]', 'name=description', description);

    // Open Graph meta tags
    setMeta('meta[property="og:title"]', 'property=og:title', title);
    setMeta('meta[property="og:description"]', 'property=og:description', description);
    setMeta('meta[property="og:url"]', 'property=og:url', canonicalUrl);
    setMeta('meta[property="og:image"]', 'property=og:image', image);
    setMeta('meta[property="og:image:width"]', 'property=og:image:width', '1200');
    setMeta('meta[property="og:image:height"]', 'property=og:image:height', '630');
    setMeta('meta[property="og:type"]', 'property=og:type', ogType);
    setMeta('meta[property="og:site_name"]', 'property=og:site_name', 'SlimFile');

    // Twitter Card meta tags
    setMeta('meta[name="twitter:card"]', 'name=twitter:card', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'name=twitter:title', title);
    setMeta('meta[name="twitter:description"]', 'name=twitter:description', description);
    setMeta('meta[name="twitter:image"]', 'name=twitter:image', image);
    setMeta('meta[name="twitter:site"]', 'name=twitter:site', '@SlimFile');

    setLink('canonical', canonicalUrl);
  }, [title, description, canonical, ogImage, ogType]);
}

// src/components/seo/SEO.jsx
// Reusable SEO component that injects per-page meta tags, Open Graph, Twitter cards,
// canonical URLs, and JSON-LD structured data.

import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://openaether.saadasim.me';
const SITE_NAME = 'OpenAether';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image-openaether.png`;
const TWITTER_HANDLE = '@openaether';

/**
 * SEO component
 * @param {Object} props
 * @param {string} props.title - Page title (will be suffixed with "| OpenAether")
 * @param {string} props.description - Meta description (max ~160 chars)
 * @param {string} [props.keywords] - Comma-separated keywords
 * @param {string} [props.path] - Page path like "/docs" (used for canonical + og:url)
 * @param {string} [props.image] - Absolute URL to social share image
 * @param {string} [props.type] - og:type (default: "website")
 * @param {Object|Array} [props.structuredData] - JSON-LD object OR array of objects
 * @param {boolean} [props.noindex] - Set true to noindex this page
 * @param {string} [props.author] - Author override
 */
export function SEO({
  title,
  description,
  keywords,
  path = '/',
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  structuredData,
  noindex = false,
  author = 'OpenAether Team',
}) {
  const fullTitle = title
    ? title.includes('OpenAether')
      ? title
      : `${title} | ${SITE_NAME}`
    : 'OpenAether | Free AI Model Aggregator - Access Multiple AI Models';

  const fullUrl = `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;

  // Default keywords blend (helps target "OpenAether" and "OpenAether CLI" searches)
  const defaultKeywords = [
    'OpenAether',
    'openaether cli',
    'openaether npm',
    'OpenAether CLI',
    'Free AI',
    'AI Models',
    'OpenRouter',
    'GPT-4o Mini',
    'Gemma',
    'GLM',
    'AI Chat',
    'Open Source AI',
    'Free AI Platform',
    'AI Aggregator',
    'Multiple AI Models',
    'AI CLI',
    'AI Terminal',
    'AI in Terminal',
    'Free AI Chat',
  ];

  const finalKeywords = keywords
    ? `${keywords}, ${defaultKeywords.join(', ')}`
    : defaultKeywords.join(', ');

  // Normalize structured data: always render as array of <script> tags
  const ldJsonArray = Array.isArray(structuredData)
    ? structuredData
    : structuredData
      ? [structuredData]
      : [];

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <html lang="en" />
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="author" content={author} />
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}
      <meta name="language" content="English" />
      <meta name="theme-color" content="#6c5ce7" />
      <meta name="application-name" content={SITE_NAME} />
      <meta name="generator" content="OpenAether" />

      {/* Canonical */}
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={fullTitle} />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:creator" content={TWITTER_HANDLE} />

      {/* Mobile / PWA hints */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content={SITE_NAME} />
      <meta name="format-detection" content="telephone=no" />

      {/* JSON-LD Structured Data */}
      {ldJsonArray.map((data, i) => (
        <script key={`ld-${i}`} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
}

export default SEO;
// src/components/seo/structuredData.js
// JSON-LD structured data builders for OpenAether.
// Use these with the <SEO structuredData={...} /> prop.

const SITE_URL = 'https://openaether.saadasim.me';
const SITE_NAME = 'OpenAether';
const LOGO_URL = `${SITE_URL}/openaether-abstract.png`;

export const organizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: LOGO_URL,
  description:
    'OpenAether is an open-source platform that aggregates free AI models from multiple providers into a single, unified interface.',
  sameAs: [
    'https://github.com/Muhammad-Saad-786/openaether',
    'https://www.npmjs.com/package/openaether',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'support',
    url: `${SITE_URL}/contact`,
  },
});

export const softwareApplicationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: SITE_NAME,
  url: SITE_URL,
  applicationCategory: 'DeveloperApplication',
  applicationSubCategory: 'AI Chat Aggregator',
  operatingSystem: 'Web, macOS, Windows, Linux',
  description:
    'OpenAether is a free, open-source platform that unifies multiple free AI models (GPT-4o Mini, Gemma, GLM, etc.) through a single interface and CLI.',
  image: `${SITE_URL}/og-image-openaether.png`,
  softwareVersion: '1.0.0',
  downloadUrl: 'https://www.npmjs.com/package/openaether',
  softwareRequirements: 'Node.js 18+',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '120',
    bestRating: '5',
    worstRating: '1',
  },
  author: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
  },
});

export const cliSoftwareSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'OpenAether CLI',
  alternateName: 'openaether cli',
  url: `${SITE_URL}/cli`,
  applicationCategory: 'DeveloperApplication',
  applicationSubCategory: 'Command Line AI Tool',
  operatingSystem: 'Windows, macOS, Linux',
  description:
    'OpenAether CLI is a free command-line tool that brings multiple AI models (GPT-4o Mini, Gemma, GLM, MiniMax) to your terminal. Install via npm and chat with AI without opening a browser.',
  image: `${SITE_URL}/og-image-openaether.png`,
  softwareVersion: '2.0.1',
  downloadUrl: 'https://www.npmjs.com/package/openaether',
  installUrl: 'https://www.npmjs.com/package/openaether',
  softwareRequirements: 'Node.js 18+',
  commandLineInstall: 'npm install -g openaether',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
  },
  author: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
  },
});

export const websiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  description:
    'OpenAether aggregates free AI models from OpenRouter, Groq, and Gemini into one unified interface.',
  publisher: {
    '@type': 'Organization',
    name: SITE_NAME,
    logo: LOGO_URL,
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/models?search={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
});

export const faqSchema = (faqs = []) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

export const breadcrumbSchema = (items = []) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
  })),
});
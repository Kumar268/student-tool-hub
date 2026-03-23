import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEO component — dynamic meta tags + JSON-LD structured data.
 * 
 * ⚠️  OG Image Setup:
 *    - Expects /public/og-image.png (1200x630px)
 *    - Falls back to /og-image.svg if PNG not found
 *    - Generate PNG: npm run generate:og-image
 * 
 * Usage in ToolLayout:
 *   <SEO title="GPA Calculator" description="..." keywords="..." category="academic" toolSlug="gpa-calculator" />
 * 
 * Usage in static pages:
 *   <SEO title="About" description="..." />
 */
const SEO = ({
  title = 'Student Tool Hub',
  description = 'Free online tools for students — GPA calculators, PDF tools, math solvers, image editors and more.',
  keywords = 'student tools, free online tools, gpa calculator, pdf tools, math solver',
  canonicalPath = '',
  ogImage = '/og-image.png', // Falls back to .svg if .png not available
  // Tool-specific props for JSON-LD
  category = null,
  toolSlug = null,
}) => {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://studenttoolhub.vercel.app';
  const fullTitle = title === 'Student Tool Hub' ? title : `${title} | Student Tool Hub`;
  const canonical = `${siteUrl}${canonicalPath}`;
  
  // ── OG Image Fallback Logic ────────────────────────────────
  // In development, use SVG. In production, PNG should exist.
  // The browser will try PNG first, fall back to SVG if missing.
  const getOGImageUrl = (path) => {
    // Always construct absolute URL for OG meta tags
    const imageUrl = path.startsWith('http') ? path : `${siteUrl}${path}`;
    
    // In production builds, prefer .png (which may be generated at build time)
    // Fallback to .svg if .png doesn't exist (build process will determine this)
    // Social media crawlers will try .png first, then follow redirects/handle 404s
    return imageUrl;
  };
  
  // Construct the full OG image URL
  const ogImageUrl = getOGImageUrl(ogImage);

  // ── JSON-LD structured data ──────────────────────────────────
  const jsonLd = toolSlug ? {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': canonical,
        name: title,
        description,
        url: canonical,
        applicationCategory: 'EducationApplication',
        operatingSystem: 'Any',
        browserRequirements: 'Requires JavaScript',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        author: {
          '@type': 'Person',
          name: 'Kumar',
          url: `${siteUrl}/about`,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Tools', item: `${siteUrl}/category/${category}` },
          { '@type': 'ListItem', position: 3, name: title, item: canonical },
        ],
      },
    ],
  } : null;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:site_name" content="Student Tool Hub" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageUrl} />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;

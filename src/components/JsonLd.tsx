import { siteConfig } from '@/lib/site-config';

interface JsonLdProps {
  content: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    body: string | null;
    author: string | null;
    published_at: string | null;
    updated_at: string;
    meta_description: string | null;
    cover_image_url: string | null;
  };
  contentType: string;
  slug: string;
  linkedProducts: Array<Record<string, unknown>>;
}

export default function JsonLd({
  content,
  contentType,
  slug,
  linkedProducts,
}: JsonLdProps) {
  const url = `${siteConfig.url}/${contentType}/${slug}`;

  // Article schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': contentType === 'review' ? 'Review' : 'Article',
    headline: content.title,
    description: content.meta_description || content.excerpt || '',
    url,
    datePublished: content.published_at || content.updated_at,
    dateModified: content.updated_at,
    author: {
      '@type': 'Organization',
      name: content.author || siteConfig.name,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
    },
    ...(content.cover_image_url && {
      image: content.cover_image_url,
    }),
    ...(contentType === 'review' && linkedProducts.length > 0 && {
      itemReviewed: {
        '@type': 'SoftwareApplication',
        name: (linkedProducts[0].products as Record<string, unknown> | null)?.name || '',
        applicationCategory: 'BusinessApplication',
      },
      ...(typeof (linkedProducts[0].products as Record<string, unknown> | null)?.rating === 'number' && {
        reviewRating: {
          '@type': 'Rating',
          ratingValue: (linkedProducts[0].products as Record<string, unknown>).rating,
          bestRating: 5,
          worstRating: 1,
        },
      }),
    }),
    inLanguage: siteConfig.lang,
  };

  // BreadcrumbList schema
  const sectionLabel = siteConfig.sectionLabels[contentType] || contentType;
  const sectionLink = siteConfig.sectionLinks[contentType] || '/';

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: siteConfig.article.breadcrumbHome,
        item: siteConfig.url,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: sectionLabel,
        item: `${siteConfig.url}${sectionLink}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: content.title,
        item: url,
      },
    ],
  };

  // Product schemas for linked products
  const productSchemas = linkedProducts
    .filter((lp) => lp.products)
    .map((lp) => {
      const product = lp.products as Record<string, string | number | boolean | null>;
      return {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: product.name,
        description: product.tagline || product.description || '',
        url: product.website_url,
        applicationCategory: 'BusinessApplication',
        ...(typeof product.rating === 'number' && {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            bestRating: 5,
            ratingCount: 1,
          },
        }),
        ...(product.pricing_model && {
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            description: product.pricing_model,
          },
        }),
      };
    });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {productSchemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}

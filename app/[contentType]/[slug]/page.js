import { notFound } from 'next/navigation';
import { getContentBySlug, getProductsByContentId } from '../../../lib/queries.js';
import ReviewTemplate from '../../../components/templates/ReviewTemplate.js';
import BestTemplate from '../../../components/templates/BestTemplate.js';
import ComparisonTemplate from '../../../components/templates/ComparisonTemplate.js';
import AlternativeTemplate from '../../../components/templates/AlternativeTemplate.js';
import ProblemTemplate from '../../../components/templates/ProblemTemplate.js';

const VALID_CONTENT_TYPES = new Set([
  'best',
  'review',
  'comparison',
  'problem',
  'alternative',
]);

/**
 * Generate page metadata from content fields.
 */
export async function generateMetadata({ params }) {
  const { contentType, slug } = await params;

  if (!VALID_CONTENT_TYPES.has(contentType)) {
    return {};
  }

  const content = await getContentBySlug(slug, contentType);

  if (!content) {
    return {};
  }

  const title = content.meta_title ?? content.title;
  const description = content.meta_description ?? content.excerpt ?? '';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: content.published_at ?? undefined,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

/**
 * Dynamic content page — fetches content + linked products by slug and content type.
 */
export default async function ContentPage({ params }) {
  const { contentType, slug } = await params;

  if (!VALID_CONTENT_TYPES.has(contentType)) {
    notFound();
  }

  const content = await getContentBySlug(slug, contentType);

  if (!content) {
    notFound();
  }

  const products = await getProductsByContentId(content.id);

  // Article JSON-LD for all content pages
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: content.title,
    description: content.meta_description ?? content.excerpt ?? '',
    datePublished: content.published_at ?? undefined,
    inLanguage: content.language ?? 'ar',
  };

  // Review JSON-LD for review pages with a primary product
  let reviewJsonLd = null;
  if (content.content_type === 'review') {
    const primaryProduct =
      products.find((p) => p.placement === 'primary') || products[0] || null;
    if (primaryProduct) {
      reviewJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Review',
        itemReviewed: {
          '@type': 'SoftwareApplication',
          name: primaryProduct.name,
        },
      };
      if (primaryProduct.rating != null) {
        reviewJsonLd.reviewRating = {
          '@type': 'Rating',
          ratingValue: primaryProduct.rating,
          bestRating: 5,
        };
      }
    }
  }

  const jsonLdScripts = (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {reviewJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewJsonLd) }}
        />
      )}
    </>
  );

  if (content.content_type === 'review') {
    return (
      <>
        {jsonLdScripts}
        <ReviewTemplate
          content={content}
          products={products}
          relatedContent={[]}
          faqItems={[]}
          pros={[]}
          cons={[]}
          subRatings={[]}
        />
      </>
    );
  }

  if (content.content_type === 'best') {
    return (
      <>
        {jsonLdScripts}
        <BestTemplate
          content={content}
          products={products}
          relatedContent={[]}
          faqItems={[]}
        />
      </>
    );
  }

  if (content.content_type === 'comparison') {
    return (
      <>
        {jsonLdScripts}
        <ComparisonTemplate
          content={content}
          products={products}
          relatedContent={[]}
          faqItems={[]}
        />
      </>
    );
  }

  if (content.content_type === 'alternative') {
    return (
      <>
        {jsonLdScripts}
        <AlternativeTemplate
          content={content}
          products={products}
          relatedContent={[]}
          faqItems={[]}
        />
      </>
    );
  }

  if (content.content_type === 'problem') {
    return (
      <>
        {jsonLdScripts}
        <ProblemTemplate
          content={content}
          products={products}
          relatedContent={[]}
          faqItems={[]}
        />
      </>
    );
  }

  return (
    <pre>{JSON.stringify({ content, products }, null, 2)}</pre>
  );
}

import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  fetchContentByTypeAndSlug,
  fetchProductsForPublicContent,
  fetchRelatedContent,
} from '@/app/_actions/public';
import type { ContentType } from '@/types/index';
import { siteConfig } from '@/lib/site-config';
import { renderMarkdown } from '@/lib/markdown';
import StarRating from '@/components/StarRating';
import { appendUtm } from '@/lib/utm';
import JsonLd from '@/components/JsonLd';
import styles from './page.module.css';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const VALID_TYPES: ContentType[] = [
  'best',
  'review',
  'comparison',
  'problem',
  'alternative',
];


export async function generateMetadata({
  params,
}: {
  params: { contentType: string; slug: string };
}): Promise<Metadata> {
  if (!VALID_TYPES.includes(params.contentType as ContentType)) {
    return { title: siteConfig.article.notFound };
  }
  const content = await fetchContentByTypeAndSlug(
    params.contentType as ContentType,
    params.slug,
  );
  if (!content) {
    return { title: siteConfig.article.notFound };
  }
  const title = content.meta_title || content.title;
  const description =
    content.meta_description || content.excerpt || undefined;
  const url = `/${params.contentType}/${params.slug}`;

  return {
    title,
    description,
    openGraph: {
      type: 'article',
      title,
      description,
      url,
      ...(content.published_at && {
        publishedTime: content.published_at,
      }),
      ...(content.cover_image_url && {
        images: [{ url: content.cover_image_url }],
      }),
    },
    twitter: {
      card: content.cover_image_url ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(content.cover_image_url && {
        images: [content.cover_image_url],
      }),
    },
  };
}

export default async function ContentPage({
  params,
}: {
  params: { contentType: string; slug: string };
}) {
  const { contentType, slug } = params;

  if (!VALID_TYPES.includes(contentType as ContentType)) {
    notFound();
  }

  const content = await fetchContentByTypeAndSlug(
    contentType as ContentType,
    slug,
  );

  if (!content) {
    notFound();
  }

  const [linkedProducts, relatedArticles] = await Promise.all([
    fetchProductsForPublicContent(content.id),
    fetchRelatedContent(
      content.id,
      contentType as ContentType,
      content.category_id ?? null,
    ),
  ]);
  const sectionLabel = siteConfig.sectionLabels[contentType] || contentType;
  const sectionLink = siteConfig.sectionLinks[contentType] || '/';

  return (
    <div className={styles.container}>
      {/* JSON-LD Structured Data */}
      <JsonLd
        content={content}
        contentType={contentType}
        slug={slug}
        linkedProducts={linkedProducts}
      />

      {/* Breadcrumb */}
      <nav className={styles.breadcrumb} aria-label="التنقل">
        <Link href="/" className={styles.breadcrumbLink}>
          {siteConfig.article.breadcrumbHome}
        </Link>
        <span className={styles.breadcrumbSep} aria-hidden="true">
          ‹
        </span>
        <Link href={sectionLink} className={styles.breadcrumbLink}>
          {sectionLabel}
        </Link>
        <span className={styles.breadcrumbSep} aria-hidden="true">
          ‹
        </span>
        <span className={styles.breadcrumbCurrent}>{content.title}</span>
      </nav>

      <article className={styles.article}>
        {/* Header */}
        <header className={styles.articleHeader}>
          <span className={styles.badge}>
            {siteConfig.typeLabels[contentType] || contentType}
          </span>
          <h1 className={styles.articleTitle}>{content.title}</h1>
          <div className={styles.meta}>
            {content.published_at && (
              <time>
                {new Date(content.published_at).toLocaleDateString('ar', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            )}
            {content.author && <span>{content.author}</span>}
          </div>
          {content.excerpt && (
            <p className={styles.excerpt}>{content.excerpt}</p>
          )}
        </header>

        {/* Affiliate disclosure */}
        <div className={styles.disclosure}>
          {siteConfig.article.disclosure}{' '}
          <Link href="/disclosure" className={styles.disclosureLink}>
            {siteConfig.article.disclosureLink}
          </Link>
        </div>

        {/* Body (supports Markdown) */}
        {content.body && (
          <div
            className={styles.body}
            dangerouslySetInnerHTML={{ __html: renderMarkdown(content.body) }}
          />
        )}

        {/* Products */}
        {linkedProducts.length > 0 && (
          <section className={styles.productsSection}>
            <h2 className={styles.productsTitle}>
              {siteConfig.article.productsTitle}
            </h2>
            <div className={styles.productsGrid}>
              {linkedProducts.map(
                (lp: Record<string, unknown>) => {
                  const product = lp.products as Record<
                    string,
                    string | boolean | number | null
                  > | null;
                  if (!product) return null;
                  const rawAffiliateUrl =
                    (lp.custom_affiliate_url as string) ||
                    (product.affiliate_url as string);
                  const affiliateUrl = rawAffiliateUrl
                    ? appendUtm(rawAffiliateUrl, {
                        campaign: slug,
                        content: `product-card-${product.name}`,
                      })
                    : null;
                  return (
                    <div
                      key={lp.id as string}
                      className={styles.productCard}
                    >
                      <div className={styles.productInfo}>
                        <h3 className={styles.productName}>
                          {product.name}
                        </h3>
                        {product.tagline && (
                          <p className={styles.productTagline}>
                            {product.tagline}
                          </p>
                        )}
                        {typeof product.rating === 'number' && (
                          <div className={styles.productRating}>
                            <StarRating rating={product.rating as number} />
                          </div>
                        )}
                        {product.pricing_model && (
                          <span className={styles.productPricing}>
                            {product.pricing_model}
                          </span>
                        )}
                      </div>
                      {affiliateUrl && (
                        <a
                          href={`/api/click?url=${encodeURIComponent(affiliateUrl)}&product=${encodeURIComponent(product.slug as string || '')}&content=${encodeURIComponent(slug)}`}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className={styles.productCta}
                        >
                          {siteConfig.article.tryCta}
                        </a>
                      )}
                    </div>
                  );
                },
              )}
            </div>
          </section>
        )}
      </article>

      {/* Related Articles */}
      {relatedArticles && relatedArticles.length > 0 && (
        <section className={styles.relatedSection}>
          <h2 className={styles.relatedTitle}>{siteConfig.article.relatedTitle}</h2>
          <div className={styles.relatedGrid}>
            {relatedArticles.map(
              (ra: {
                id: string;
                title: string;
                slug: string;
                content_type: string;
                excerpt: string | null;
              }) => (
                <Link
                  key={ra.id}
                  href={`/${ra.content_type}/${ra.slug}`}
                  className={styles.relatedCard}
                >
                  <span className={styles.relatedBadge}>
                    {siteConfig.typeLabels[ra.content_type] || ra.content_type}
                  </span>
                  <h3 className={styles.relatedCardTitle}>{ra.title}</h3>
                  {ra.excerpt && (
                    <p className={styles.relatedCardExcerpt}>{ra.excerpt}</p>
                  )}
                </Link>
              ),
            )}
          </div>
        </section>
      )}
    </div>
  );
}

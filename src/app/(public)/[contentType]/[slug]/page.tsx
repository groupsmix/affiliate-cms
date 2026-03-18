import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  fetchContentByTypeAndSlug,
  fetchProductsForPublicContent,
  fetchRelatedContent,
} from '@/app/_actions/public';
import type { ContentType } from '@/types/index';
import StarRating from '@/components/StarRating';
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

const TYPE_AR: Record<string, string> = {
  review: 'مراجعة',
  comparison: 'مقارنة',
  best: 'الأفضل',
  problem: 'حلول',
  alternative: 'بدائل',
};

const SECTION_AR: Record<string, string> = {
  review: 'المراجعات',
  comparison: 'المقارنات',
  best: 'الأدلة',
  problem: 'الأدلة',
  alternative: 'الأدلة',
};

const SECTION_LINKS: Record<string, string> = {
  review: '/reviews',
  comparison: '/comparisons',
  best: '/guides',
  problem: '/guides',
  alternative: '/guides',
};

export async function generateMetadata({
  params,
}: {
  params: { contentType: string; slug: string };
}): Promise<Metadata> {
  if (!VALID_TYPES.includes(params.contentType as ContentType)) {
    return { title: 'غير موجود' };
  }
  const content = await fetchContentByTypeAndSlug(
    params.contentType as ContentType,
    params.slug,
  );
  if (!content) {
    return { title: 'غير موجود' };
  }
  return {
    title: content.meta_title || content.title,
    description: content.meta_description || content.excerpt || undefined,
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
  const sectionLabel = SECTION_AR[contentType] || contentType;
  const sectionLink = SECTION_LINKS[contentType] || '/';

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb} aria-label="التنقل">
        <Link href="/" className={styles.breadcrumbLink}>
          الرئيسية
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
            {TYPE_AR[contentType] || contentType}
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
          يحتوي هذا المقال على روابط تسويقية. عند الشراء من خلالها قد نحصل على
          عمولة دون تكلفة إضافية عليك.{' '}
          <Link href="/disclosure" className={styles.disclosureLink}>
            اقرأ المزيد
          </Link>
        </div>

        {/* Body */}
        {content.body && (
          <div
            className={styles.body}
            dangerouslySetInnerHTML={{ __html: content.body }}
          />
        )}

        {/* Products */}
        {linkedProducts.length > 0 && (
          <section className={styles.productsSection}>
            <h2 className={styles.productsTitle}>
              الأدوات المذكورة في هذا المقال
            </h2>
            <div className={styles.productsGrid}>
              {linkedProducts.map(
                (lp: Record<string, unknown>) => {
                  const product = lp.products as Record<
                    string,
                    string | boolean | number | null
                  > | null;
                  if (!product) return null;
                  const affiliateUrl =
                    (lp.custom_affiliate_url as string) ||
                    (product.affiliate_url as string);
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
                          href={affiliateUrl}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className={styles.productCta}
                        >
                          جرّب الأداة
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
          <h2 className={styles.relatedTitle}>مقالات ذات صلة</h2>
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
                    {TYPE_AR[ra.content_type] || ra.content_type}
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

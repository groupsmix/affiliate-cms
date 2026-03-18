import { notFound } from 'next/navigation';
import Link from 'next/link';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';
import SchemaMarkup from '@/components/SchemaMarkup';
import { fetchContentByTypeAndSlug, fetchProductsForPublicContent } from '../../_actions/public';
import type { ContentType } from '@/types/index';
import styles from './page.module.css';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const VALID_CONTENT_TYPES: ContentType[] = ['best', 'review', 'comparison', 'problem', 'alternative'];

const CONTENT_TYPE_LABELS: Record<string, string> = {
  review: 'المراجعات',
  comparison: 'المقارنات',
  best: 'الأدلة',
  problem: 'الأدلة',
  alternative: 'الأدلة',
};

const CONTENT_TYPE_LINKS: Record<string, string> = {
  review: '/reviews',
  comparison: '/comparisons',
  best: '/guides',
  problem: '/guides',
  alternative: '/guides',
};

export default async function ContentPage({
  params,
}: {
  params: { contentType: string; slug: string };
}) {
  const { contentType, slug } = params;

  if (!VALID_CONTENT_TYPES.includes(contentType as ContentType)) {
    notFound();
  }

  const content = await fetchContentByTypeAndSlug(contentType as ContentType, slug);

  if (!content) {
    notFound();
  }

  const linkedProducts = await fetchProductsForPublicContent(content.id);
  const sectionLabel = CONTENT_TYPE_LABELS[contentType] || contentType;
  const sectionLink = CONTENT_TYPE_LINKS[contentType] || '/';

  const firstProduct = linkedProducts.length > 0
    ? (linkedProducts[0].products as Record<string, string | boolean | number | null> | null)
    : null;

  return (
    <>
      {contentType === 'review' ? (
        <SchemaMarkup
          type="review"
          title={content.title}
          excerpt={content.excerpt}
          author={content.author}
          publishedAt={content.published_at}
          slug={`${contentType}/${content.slug}`}
          rating={firstProduct ? (firstProduct.rating as number | null) : null}
          productName={firstProduct ? (firstProduct.name as string) : null}
        />
      ) : (
        <SchemaMarkup
          type="article"
          title={content.title}
          excerpt={content.excerpt}
          author={content.author}
          publishedAt={content.published_at}
          slug={`${contentType}/${content.slug}`}
          contentType={contentType}
        />
      )}

      {linkedProducts.map((lp: Record<string, unknown>) => {
        const prod = lp.products as Record<string, string | boolean | number | null> | null;
        if (!prod) return null;
        return (
          <SchemaMarkup
            key={lp.id as string}
            type="product"
            name={prod.name as string}
            description={prod.description as string | null}
            rating={prod.rating as number | null}
            url={prod.website_url as string}
          />
        );
      })}

      <PublicHeader />
      <div className={styles.container}>
        <nav className={styles.breadcrumb}>
          <Link href="/" className={styles.breadcrumbLink}>الرئيسية</Link>
          <span className={styles.breadcrumbSep}>/</span>
          <Link href={sectionLink} className={styles.breadcrumbLink}>{sectionLabel}</Link>
          <span className={styles.breadcrumbSep}>/</span>
          <span>{content.title}</span>
        </nav>

        <article>
          <h1 className={styles.articleTitle}>{content.title}</h1>

          <div className={styles.meta}>
            <span className={styles.tag}>{content.content_type}</span>
            {content.published_at && (
              <span>{new Date(content.published_at).toLocaleDateString('ar')}</span>
            )}
            {content.author && <span>{content.author}</span>}
          </div>

          {content.excerpt && (
            <p className={styles.excerpt}>{content.excerpt}</p>
          )}

          {content.body && (
            <div
              className={styles.body}
              dangerouslySetInnerHTML={{ __html: content.body }}
            />
          )}
        </article>

        {linkedProducts.length > 0 && (
          <section className={styles.productsSection}>
            <h2 className={styles.productsTitle}>المنتجات المرتبطة</h2>
            <ul className={styles.productsList}>
              {linkedProducts.map((lp: Record<string, unknown>) => {
                const product = lp.products as Record<string, string | boolean | null> | null;
                if (!product) return null;
                return (
                  <li key={lp.id as string} className={styles.productItem}>
                    <span className={styles.productName}>{product.name}</span>
                    {product.tagline && (
                      <span className={styles.productTagline}>
                        — {product.tagline}
                      </span>
                    )}
                    {product.affiliate_url && (
                      <div>
                        <a
                          href={product.affiliate_url as string}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.productLink}
                        >
                          اطلع عليه &larr;
                        </a>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>
      <PublicFooter />
    </>
  );
}

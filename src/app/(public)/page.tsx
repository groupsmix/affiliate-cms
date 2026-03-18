import Link from 'next/link';
import { fetchPublishedContent } from '@/app/_actions/public';
import { averageRating } from '@/lib/rating';
import { siteConfig } from '@/lib/site-config';
import ScoreBadge from '@/components/ScoreBadge';
import NewsletterForm from '@/components/NewsletterForm';
import styles from './page.module.css';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

interface ContentItem {
  id: string;
  title: string;
  slug: string;
  content_type: string;
  excerpt: string | null;
  published_at: string | null;
  averageRating?: number | null;
}


function contentUrl(item: ContentItem): string {
  return `/${item.content_type}/${item.slug}`;
}

export default async function HomePage() {
  const raw = await fetchPublishedContent();
  const articles = raw.map((a: Record<string, unknown>) => ({
    ...a,
    averageRating: averageRating(
      a.content_products as
        | Array<{ products: { rating: number | null } | null }>
        | undefined,
    ),
  })) as ContentItem[];

  const reviews = articles.filter((a) => a.content_type === 'review');
  const comparisons = articles.filter((a) => a.content_type === 'comparison');
  const guides = articles.filter((a) =>
    ['best', 'problem', 'alternative'].includes(a.content_type),
  );
  const latest = articles.slice(0, 8);
  const hasContent = articles.length > 0;

  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.heroBadge}>{siteConfig.hero.badge}</span>
          <h1 className={styles.heroTitle}>
            {siteConfig.hero.title}
          </h1>
          <p className={styles.heroDesc}>
            {siteConfig.hero.description}
          </p>
          <div className={styles.heroCtas}>
            <Link href="/reviews" className={styles.heroCtaPrimary}>
              {siteConfig.hero.ctaPrimary}
            </Link>
            <Link href="/comparisons" className={styles.heroCtaSecondary}>
              {siteConfig.hero.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>

      {/* Start Here */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>{siteConfig.startHere.title}</h2>
          <p className={styles.sectionDesc}>
            {siteConfig.startHere.description}
          </p>
          <div className={styles.startGrid}>
            {siteConfig.startHere.cards.map((card) => (
              <Link key={card.href} href={card.href} className={styles.startCard}>
                <h3 className={styles.startCardTitle}>{card.title}</h3>
                <p className={styles.startCardDesc}>{card.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Content */}
      {hasContent && (
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.sectionInner}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{siteConfig.sections.latestArticles}</h2>
            </div>
            <div className={styles.cardGrid}>
              {latest.map((article) => (
                <Link
                  key={article.id}
                  href={contentUrl(article)}
                  className={styles.card}
                >
                  <span className={styles.cardBadge}>
                    {siteConfig.typeLabels[article.content_type] || article.content_type}
                  </span>
                  <div className={styles.cardTitleRow}>
                    <h3 className={styles.cardTitle}>{article.title}</h3>
                    {typeof article.averageRating === 'number' && (
                      <ScoreBadge score={article.averageRating} max={5} />
                    )}
                  </div>
                  {article.excerpt && (
                    <p className={styles.cardExcerpt}>{article.excerpt}</p>
                  )}
                  {article.published_at && (
                    <span className={styles.cardDate}>
                      {new Date(article.published_at).toLocaleDateString('ar')}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reviews */}
      {reviews.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionInner}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{siteConfig.sections.latestReviews}</h2>
              <Link href="/reviews" className={styles.sectionLink}>
                {siteConfig.sections.viewAll}
              </Link>
            </div>
            <div className={styles.cardGrid}>
              {reviews.slice(0, 4).map((article) => (
                <Link
                  key={article.id}
                  href={contentUrl(article)}
                  className={styles.card}
                >
                  <span className={styles.cardBadge}>{siteConfig.typeLabels.review}</span>
                  <div className={styles.cardTitleRow}>
                    <h3 className={styles.cardTitle}>{article.title}</h3>
                    {typeof article.averageRating === 'number' && (
                      <ScoreBadge score={article.averageRating} max={5} />
                    )}
                  </div>
                  {article.excerpt && (
                    <p className={styles.cardExcerpt}>{article.excerpt}</p>
                  )}
                  {article.published_at && (
                    <span className={styles.cardDate}>
                      {new Date(article.published_at).toLocaleDateString('ar')}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Comparisons */}
      {comparisons.length > 0 && (
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.sectionInner}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{siteConfig.sections.latestComparisons}</h2>
              <Link href="/comparisons" className={styles.sectionLink}>
                {siteConfig.sections.viewAll}
              </Link>
            </div>
            <div className={styles.cardGrid}>
              {comparisons.slice(0, 4).map((article) => (
                <Link
                  key={article.id}
                  href={contentUrl(article)}
                  className={styles.card}
                >
                  <span className={styles.cardBadge}>{siteConfig.typeLabels.comparison}</span>
                  <div className={styles.cardTitleRow}>
                    <h3 className={styles.cardTitle}>{article.title}</h3>
                    {typeof article.averageRating === 'number' && (
                      <ScoreBadge score={article.averageRating} max={5} />
                    )}
                  </div>
                  {article.excerpt && (
                    <p className={styles.cardExcerpt}>{article.excerpt}</p>
                  )}
                  {article.published_at && (
                    <span className={styles.cardDate}>
                      {new Date(article.published_at).toLocaleDateString('ar')}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Guides */}
      {guides.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionInner}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{siteConfig.sections.guides}</h2>
              <Link href="/guides" className={styles.sectionLink}>
                {siteConfig.sections.viewAll}
              </Link>
            </div>
            <div className={styles.cardGrid}>
              {guides.slice(0, 4).map((article) => (
                <Link
                  key={article.id}
                  href={contentUrl(article)}
                  className={styles.card}
                >
                  <span className={styles.cardBadge}>
                    {siteConfig.typeLabels[article.content_type] || article.content_type}
                  </span>
                  <div className={styles.cardTitleRow}>
                    <h3 className={styles.cardTitle}>{article.title}</h3>
                    {typeof article.averageRating === 'number' && (
                      <ScoreBadge score={article.averageRating} max={5} />
                    )}
                  </div>
                  {article.excerpt && (
                    <p className={styles.cardExcerpt}>{article.excerpt}</p>
                  )}
                  {article.published_at && (
                    <span className={styles.cardDate}>
                      {new Date(article.published_at).toLocaleDateString('ar')}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trust Strip */}
      <section className={styles.trustStrip}>
        <div className={styles.trustInner}>
          <h2 className={styles.trustTitle}>{siteConfig.trust.title}</h2>
          <div className={styles.trustGrid}>
            {siteConfig.trust.items.map((item) => (
              <div key={item.title} className={styles.trustItem}>
                <h3 className={styles.trustItemTitle}>{item.title}</h3>
                <p className={styles.trustItemDesc}>{item.description}</p>
              </div>
            ))}
          </div>
          <div className={styles.trustDisclosure}>
            <p>
              {siteConfig.trust.disclosure}{' '}
              <Link href="/disclosure" className={styles.trustDisclosureLink}>
                {siteConfig.trust.disclosureLink}
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}

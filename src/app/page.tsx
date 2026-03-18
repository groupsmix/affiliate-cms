import Link from 'next/link';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';
import { fetchPublishedContent, fetchPublishedContentWithRatings } from './_actions/public';
import RatingBadge from '@/components/RatingBadge';
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
}

interface ContentItemWithRating extends ContentItem {
  topRating: number | null;
}

export default async function HomePage() {
  const [articles, reviewsWithRatings] = await Promise.all([
    fetchPublishedContent() as Promise<ContentItem[]>,
    fetchPublishedContentWithRatings('review') as Promise<ContentItemWithRating[]>,
  ]);

  const reviews = reviewsWithRatings;
  const comparisons = articles.filter((a) => a.content_type === 'comparison');
  const problems = articles.filter((a) => a.content_type === 'problem');
  const best = articles.filter((a) => a.content_type === 'best');

  return (
    <>
      <PublicHeader />

      {/* Hero */}
      <section className={styles.hero}>
        <h1 className={styles.heroHeadline}>
          أفضل أدوات النشرات البريدية والتسويق بالإيميل لصناع المحتوى العرب
        </h1>
        <p className={styles.heroSub}>
          مراجعات ومقارنات عملية تساعدك تختار الأداة المناسبة بسرعة
        </p>
        <Link href="/guides" className={styles.heroCta}>
          ابدأ من هنا
        </Link>
      </section>

      {/* Start Here */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>ابدأ من هنا</h2>
        <div className={styles.startHere}>
          <Link href="/guides" className={styles.startCard}>
            <div className={styles.startCardTitle}>أفضل الأدوات للمبتدئين</div>
            <div className={styles.startCardDesc}>
              دليل شامل لاختيار أول أداة نشرات بريدية تناسب احتياجاتك
            </div>
          </Link>
          <Link href="/comparisons" className={styles.startCard}>
            <div className={styles.startCardTitle}>كيف تختار أداة النشرات البريدية</div>
            <div className={styles.startCardDesc}>
              مقارنات عملية بين أشهر الأدوات لمساعدتك في اتخاذ القرار
            </div>
          </Link>
          <Link href="/reviews" className={styles.startCard}>
            <div className={styles.startCardTitle}>أفضل البدائل للأدوات الشائعة</div>
            <div className={styles.startCardDesc}>
              مراجعات تفصيلية لأدوات بديلة قد تكون الأنسب لمشروعك
            </div>
          </Link>
        </div>
      </section>

      {/* Latest Reviews */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>أحدث المراجعات</h2>
        {reviews.length === 0 ? (
          <p className={styles.emptyState}>لا توجد مراجعات منشورة بعد.</p>
        ) : (
          <div className={styles.cardGrid}>
            {reviews.slice(0, 6).map((article) => (
              <Link
                key={article.id}
                href={`/review/${article.slug}`}
                className={styles.card}
              >
                <div className={styles.cardTitle}>{article.title}</div>
                {(article as ContentItemWithRating).topRating !== null && (article as ContentItemWithRating).topRating !== undefined && (
                  <div className={styles.cardRating}>
                    <RatingBadge rating={(article as ContentItemWithRating).topRating as number} />
                  </div>
                )}
                {article.excerpt && (
                  <div className={styles.cardExcerpt}>{article.excerpt}</div>
                )}
                {article.published_at && (
                  <div className={styles.cardMeta}>
                    {new Date(article.published_at).toLocaleDateString('ar')}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Latest Comparisons */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>أحدث المقارنات</h2>
        {comparisons.length === 0 ? (
          <p className={styles.emptyState}>لا توجد مقارنات منشورة بعد.</p>
        ) : (
          <div className={styles.cardGrid}>
            {comparisons.slice(0, 6).map((article) => (
              <Link
                key={article.id}
                href={`/comparison/${article.slug}`}
                className={styles.card}
              >
                <div className={styles.cardTitle}>{article.title}</div>
                {article.excerpt && (
                  <div className={styles.cardExcerpt}>{article.excerpt}</div>
                )}
                {article.published_at && (
                  <div className={styles.cardMeta}>
                    {new Date(article.published_at).toLocaleDateString('ar')}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Problem-solving Guides */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>أدلة حل المشكلات</h2>
        {problems.length === 0 ? (
          <p className={styles.emptyState}>لا توجد أدلة منشورة بعد.</p>
        ) : (
          <div className={styles.cardGrid}>
            {problems.slice(0, 6).map((article) => (
              <Link
                key={article.id}
                href={`/problem/${article.slug}`}
                className={styles.card}
              >
                <div className={styles.cardTitle}>{article.title}</div>
                {article.excerpt && (
                  <div className={styles.cardExcerpt}>{article.excerpt}</div>
                )}
                {article.published_at && (
                  <div className={styles.cardMeta}>
                    {new Date(article.published_at).toLocaleDateString('ar')}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Best-of Guides */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>أدلة الأفضل</h2>
        {best.length === 0 ? (
          <p className={styles.emptyState}>لا توجد أدلة منشورة بعد.</p>
        ) : (
          <div className={styles.cardGrid}>
            {best.slice(0, 6).map((article) => (
              <Link
                key={article.id}
                href={`/best/${article.slug}`}
                className={styles.card}
              >
                <div className={styles.cardTitle}>{article.title}</div>
                {article.excerpt && (
                  <div className={styles.cardExcerpt}>{article.excerpt}</div>
                )}
                {article.published_at && (
                  <div className={styles.cardMeta}>
                    {new Date(article.published_at).toLocaleDateString('ar')}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Trust / Disclosure strip */}
      <section className={styles.trustStrip}>
        <div className={styles.trustInner}>
          <p className={styles.trustText}>
            هذا الموقع يحتوي على روابط تسويقية (affiliate links). عند الشراء من خلال هذه الروابط،
            قد نحصل على عمولة دون أي تكلفة إضافية عليك. جميع المراجعات والتوصيات مبنية على تجربة
            فعلية وتقييم موضوعي. هدفنا مساعدتك في اتخاذ القرار الأفضل، وليس بيع منتج بعينه.
          </p>
        </div>
      </section>

      <PublicFooter />
    </>
  );
}

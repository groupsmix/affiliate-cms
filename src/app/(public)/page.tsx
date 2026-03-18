import Link from 'next/link';
import { fetchPublishedContent } from '@/app/_actions/public';
import { averageRating } from '@/lib/rating';
import ScoreBadge from '@/components/ScoreBadge';
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

const TYPE_LABELS: Record<string, string> = {
  review: 'مراجعة',
  comparison: 'مقارنة',
  best: 'الأفضل',
  problem: 'حلول',
  alternative: 'بدائل',
};

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
          <span className={styles.heroBadge}>دليلك لأدوات البريد الإلكتروني</span>
          <h1 className={styles.heroTitle}>
            اختر أداة النشرات البريدية المناسبة لمشروعك
          </h1>
          <p className={styles.heroDesc}>
            مراجعات صادقة ومقارنات عملية لأشهر أدوات التسويق بالإيميل والنشرات
            البريدية، مصممة خصيصًا لصناع المحتوى والمسوقين العرب.
          </p>
          <div className={styles.heroCtas}>
            <Link href="/reviews" className={styles.heroCtaPrimary}>
              تصفح المراجعات
            </Link>
            <Link href="/comparisons" className={styles.heroCtaSecondary}>
              قارن بين الأدوات
            </Link>
          </div>
        </div>
      </section>

      {/* Start Here */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>ابدأ من هنا</h2>
          <p className={styles.sectionDesc}>
            لا تعرف من أين تبدأ؟ هذه الأدلة تساعدك تختار بسرعة.
          </p>
          <div className={styles.startGrid}>
            <Link href="/reviews" className={styles.startCard}>
              <h3 className={styles.startCardTitle}>مراجعات الأدوات</h3>
              <p className={styles.startCardDesc}>
                مراجعات تفصيلية لكل أداة بريد إلكتروني — الميزات والعيوب
                والتسعير
              </p>
            </Link>
            <Link href="/comparisons" className={styles.startCard}>
              <h3 className={styles.startCardTitle}>مقارنات مباشرة</h3>
              <p className={styles.startCardDesc}>
                مقارنات عملية بين الأدوات المتنافسة لمساعدتك في اتخاذ القرار
              </p>
            </Link>
            <Link href="/guides" className={styles.startCard}>
              <h3 className={styles.startCardTitle}>أدلة الأفضل</h3>
              <p className={styles.startCardDesc}>
                أفضل الأدوات لكل حالة استخدام — للمبتدئين والمتقدمين
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Content */}
      {hasContent && (
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.sectionInner}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>أحدث المقالات</h2>
            </div>
            <div className={styles.cardGrid}>
              {latest.map((article) => (
                <Link
                  key={article.id}
                  href={contentUrl(article)}
                  className={styles.card}
                >
                  <span className={styles.cardBadge}>
                    {TYPE_LABELS[article.content_type] || article.content_type}
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
              <h2 className={styles.sectionTitle}>أحدث المراجعات</h2>
              <Link href="/reviews" className={styles.sectionLink}>
                عرض الكل
              </Link>
            </div>
            <div className={styles.cardGrid}>
              {reviews.slice(0, 4).map((article) => (
                <Link
                  key={article.id}
                  href={contentUrl(article)}
                  className={styles.card}
                >
                  <span className={styles.cardBadge}>مراجعة</span>
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
              <h2 className={styles.sectionTitle}>أحدث المقارنات</h2>
              <Link href="/comparisons" className={styles.sectionLink}>
                عرض الكل
              </Link>
            </div>
            <div className={styles.cardGrid}>
              {comparisons.slice(0, 4).map((article) => (
                <Link
                  key={article.id}
                  href={contentUrl(article)}
                  className={styles.card}
                >
                  <span className={styles.cardBadge}>مقارنة</span>
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
              <h2 className={styles.sectionTitle}>الأدلة</h2>
              <Link href="/guides" className={styles.sectionLink}>
                عرض الكل
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
                    {TYPE_LABELS[article.content_type] || article.content_type}
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
          <h2 className={styles.trustTitle}>لماذا تثق بنا؟</h2>
          <div className={styles.trustGrid}>
            <div className={styles.trustItem}>
              <h3 className={styles.trustItemTitle}>تجربة حقيقية</h3>
              <p className={styles.trustItemDesc}>
                كل مراجعة مبنية على تجربة فعلية للأداة وليست مجرد نقل من مصادر
                أخرى
              </p>
            </div>
            <div className={styles.trustItem}>
              <h3 className={styles.trustItemTitle}>تقييم موضوعي</h3>
              <p className={styles.trustItemDesc}>
                نقدم الميزات والعيوب بصراحة لمساعدتك في اتخاذ القرار الأفضل
              </p>
            </div>
            <div className={styles.trustItem}>
              <h3 className={styles.trustItemTitle}>محتوى عربي أصيل</h3>
              <p className={styles.trustItemDesc}>
                محتوى مكتوب بالعربية من البداية وليس ترجمة آلية من مصادر أجنبية
              </p>
            </div>
          </div>
          <div className={styles.trustDisclosure}>
            <p>
              هذا الموقع يحتوي على روابط تسويقية (affiliate links). عند الشراء
              من خلال هذه الروابط، قد نحصل على عمولة دون أي تكلفة إضافية عليك.{' '}
              <Link href="/disclosure" className={styles.trustDisclosureLink}>
                اقرأ سياسة الإفصاح الكاملة
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

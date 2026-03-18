import Link from 'next/link';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';
import { fetchPublishedContentWithRatings } from '../_actions/public';
import RatingBadge from '@/components/RatingBadge';
import styles from './page.module.css';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'المراجعات — أدوات البريد',
  description: 'مراجعات تفصيلية لأدوات النشرات البريدية والتسويق بالإيميل',
};

interface ContentItem {
  id: string;
  title: string;
  slug: string;
  content_type: string;
  excerpt: string | null;
  published_at: string | null;
  topRating: number | null;
}

export default async function ReviewsPage() {
  const articles = await fetchPublishedContentWithRatings('review') as ContentItem[];

  return (
    <>
      <PublicHeader />
      <div className={styles.container}>
        <h1 className={styles.title}>المراجعات</h1>
        <p className={styles.subtitle}>مراجعات تفصيلية لأدوات النشرات البريدية والتسويق بالإيميل</p>

        {articles.length === 0 ? (
          <p className={styles.emptyState}>لا توجد مراجعات منشورة بعد.</p>
        ) : (
          <ul className={styles.list}>
            {articles.map((article) => (
              <li key={article.id}>
                <Link href={`/review/${article.slug}`} className={styles.listItem}>
                  <div className={styles.itemTitle}>{article.title}</div>
                  {article.topRating !== null && article.topRating !== undefined && (
                    <div className={styles.itemRating}>
                      <RatingBadge rating={article.topRating} />
                    </div>
                  )}
                  {article.excerpt && (
                    <div className={styles.itemExcerpt}>{article.excerpt}</div>
                  )}
                  {article.published_at && (
                    <div className={styles.itemMeta}>
                      {new Date(article.published_at).toLocaleDateString('ar')}
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <PublicFooter />
    </>
  );
}

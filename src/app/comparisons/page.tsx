import Link from 'next/link';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';
import { fetchPublishedContentByType } from '../_actions/public';
import styles from './page.module.css';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'المقارنات — أدوات البريد',
  description: 'مقارنات عملية بين أدوات النشرات البريدية والتسويق بالإيميل',
};

interface ContentItem {
  id: string;
  title: string;
  slug: string;
  content_type: string;
  excerpt: string | null;
  published_at: string | null;
}

export default async function ComparisonsPage() {
  const articles = await fetchPublishedContentByType('comparison') as ContentItem[];

  return (
    <>
      <PublicHeader />
      <div className={styles.container}>
        <h1 className={styles.title}>المقارنات</h1>
        <p className={styles.subtitle}>مقارنات عملية بين أدوات النشرات البريدية والتسويق بالإيميل</p>

        {articles.length === 0 ? (
          <p className={styles.emptyState}>لا توجد مقارنات منشورة بعد.</p>
        ) : (
          <ul className={styles.list}>
            {articles.map((article) => (
              <li key={article.id}>
                <Link href={`/comparison/${article.slug}`} className={styles.listItem}>
                  <div className={styles.itemTitle}>{article.title}</div>
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

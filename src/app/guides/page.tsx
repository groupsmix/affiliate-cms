import Link from 'next/link';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';
import { fetchPublishedContentByTypes } from '../_actions/public';
import styles from './page.module.css';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'الأدلة — أدوات البريد',
  description: 'أدلة شاملة لأفضل أدوات النشرات البريدية وحلول المشكلات الشائعة والبدائل المتاحة',
};

interface ContentItem {
  id: string;
  title: string;
  slug: string;
  content_type: string;
  excerpt: string | null;
  published_at: string | null;
}

export default async function GuidesPage() {
  const articles = await fetchPublishedContentByTypes(['best', 'problem', 'alternative']) as ContentItem[];

  const bestArticles = articles.filter((a) => a.content_type === 'best');
  const problemArticles = articles.filter((a) => a.content_type === 'problem');
  const alternativeArticles = articles.filter((a) => a.content_type === 'alternative');

  const hasContent = articles.length > 0;

  return (
    <>
      <PublicHeader />
      <div className={styles.container}>
        <h1 className={styles.title}>الأدلة</h1>
        <p className={styles.subtitle}>أدلة شاملة لأفضل الأدوات وحلول المشكلات والبدائل المتاحة</p>

        {!hasContent ? (
          <p className={styles.emptyState}>لا توجد أدلة منشورة بعد.</p>
        ) : (
          <>
            {bestArticles.length > 0 && (
              <>
                <h2 className={styles.groupTitle}>أدلة الأفضل</h2>
                <ul className={styles.list}>
                  {bestArticles.map((article) => (
                    <li key={article.id}>
                      <Link href={`/best/${article.slug}`} className={styles.listItem}>
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
              </>
            )}

            {problemArticles.length > 0 && (
              <>
                <h2 className={styles.groupTitle}>حلول المشكلات</h2>
                <ul className={styles.list}>
                  {problemArticles.map((article) => (
                    <li key={article.id}>
                      <Link href={`/problem/${article.slug}`} className={styles.listItem}>
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
              </>
            )}

            {alternativeArticles.length > 0 && (
              <>
                <h2 className={styles.groupTitle}>البدائل</h2>
                <ul className={styles.list}>
                  {alternativeArticles.map((article) => (
                    <li key={article.id}>
                      <Link href={`/alternative/${article.slug}`} className={styles.listItem}>
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
              </>
            )}
          </>
        )}
      </div>
      <PublicFooter />
    </>
  );
}

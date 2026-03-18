import { fetchPublishedContentByTypes } from '@/app/_actions/public';
import ContentList from '@/components/ContentList';
import styles from './page.module.css';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'الأدلة',
  description:
    'أدلة شاملة لأفضل أدوات النشرات البريدية وحلول المشكلات الشائعة والبدائل المتاحة',
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
  const articles = (await fetchPublishedContentByTypes([
    'best',
    'problem',
    'alternative',
  ])) as ContentItem[];

  const bestArticles = articles.filter((a) => a.content_type === 'best');
  const problemArticles = articles.filter((a) => a.content_type === 'problem');
  const alternativeArticles = articles.filter(
    (a) => a.content_type === 'alternative',
  );
  const hasContent = articles.length > 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>الأدلة</h1>
        <p className={styles.subtitle}>
          أدلة شاملة لأفضل الأدوات وحلول المشكلات الشائعة والبدائل المتاحة
        </p>
      </div>

      {!hasContent ? (
        <ContentList articles={[]} emptyMessage="لا توجد أدلة منشورة بعد." />
      ) : (
        <>
          {bestArticles.length > 0 && (
            <>
              <h2 className={styles.groupTitle}>أدلة الأفضل</h2>
              <ContentList articles={bestArticles} showBadge />
            </>
          )}

          {problemArticles.length > 0 && (
            <>
              <h2 className={styles.groupTitle}>حلول المشكلات</h2>
              <ContentList articles={problemArticles} showBadge />
            </>
          )}

          {alternativeArticles.length > 0 && (
            <>
              <h2 className={styles.groupTitle}>البدائل</h2>
              <ContentList articles={alternativeArticles} showBadge />
            </>
          )}
        </>
      )}
    </div>
  );
}

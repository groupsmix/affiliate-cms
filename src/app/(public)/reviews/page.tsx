import { fetchPublishedContentByType } from '@/app/_actions/public';
import ContentList from '@/components/ContentList';
import styles from './page.module.css';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'المراجعات',
  description: 'مراجعات تفصيلية لأدوات النشرات البريدية والتسويق بالإيميل',
};

export default async function ReviewsPage() {
  const articles = await fetchPublishedContentByType('review');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>المراجعات</h1>
        <p className={styles.subtitle}>
          مراجعات تفصيلية لأدوات النشرات البريدية والتسويق بالإيميل — الميزات
          والعيوب والتسعير وتجربة الاستخدام
        </p>
      </div>
      <ContentList
        articles={articles}
        emptyMessage="لا توجد مراجعات منشورة بعد."
      />
    </div>
  );
}

import { fetchPublishedContentByType } from '@/app/_actions/public';
import { averageRating } from '@/lib/rating';
import ContentList from '@/components/ContentList';
import styles from './page.module.css';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'المقارنات',
  description: 'مقارنات عملية بين أدوات النشرات البريدية والتسويق بالإيميل',
};

export default async function ComparisonsPage() {
  const raw = await fetchPublishedContentByType('comparison');
  const articles = raw.map((a) => ({
    ...a,
    averageRating: averageRating(
      (a as Record<string, unknown>).content_products as
        | Array<{ products: { rating: number | null } | null }>
        | undefined,
    ),
  }));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>المقارنات</h1>
        <p className={styles.subtitle}>
          مقارنات عملية بين أدوات النشرات البريدية والتسويق بالإيميل لمساعدتك في
          اتخاذ القرار
        </p>
      </div>
      <ContentList
        articles={articles}
        emptyMessage="لا توجد مقارنات منشورة بعد."
      />
    </div>
  );
}

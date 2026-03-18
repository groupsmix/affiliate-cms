import { fetchPublishedContentByType } from '@/app/_actions/public';
import { averageRating } from '@/lib/rating';
import { siteConfig } from '@/lib/site-config';
import ContentList from '@/components/ContentList';
import styles from './page.module.css';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export const metadata = {
  title: siteConfig.pages.reviews.title,
  description: siteConfig.pages.reviews.description,
};

export default async function ReviewsPage() {
  const raw = await fetchPublishedContentByType('review');
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
        <h1 className={styles.title}>{siteConfig.pages.reviews.title}</h1>
        <p className={styles.subtitle}>
          {siteConfig.pages.reviews.subtitle}
        </p>
      </div>
      <ContentList
        articles={articles}
        emptyMessage={siteConfig.pages.reviews.empty}
      />
    </div>
  );
}

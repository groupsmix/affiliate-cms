import { fetchPublishedContentByTypes } from '@/app/_actions/public';
import { averageRating } from '@/lib/rating';
import { siteConfig } from '@/lib/site-config';
import ContentList from '@/components/ContentList';
import styles from './page.module.css';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export const metadata = {
  title: siteConfig.pages.guides.title,
  description: siteConfig.pages.guides.description,
};

interface ContentItem {
  id: string;
  title: string;
  slug: string;
  content_type: string;
  excerpt: string | null;
  published_at: string | null;
  averageRating?: number | null;
}

export default async function GuidesPage() {
  const raw = await fetchPublishedContentByTypes([
    'best',
    'problem',
    'alternative',
  ]);
  const articles = raw.map((a: Record<string, unknown>) => ({
    ...a,
    averageRating: averageRating(
      a.content_products as
        | Array<{ products: { rating: number | null } | null }>
        | undefined,
    ),
  })) as ContentItem[];

  const bestArticles = articles.filter((a) => a.content_type === 'best');
  const problemArticles = articles.filter((a) => a.content_type === 'problem');
  const alternativeArticles = articles.filter(
    (a) => a.content_type === 'alternative',
  );
  const hasContent = articles.length > 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{siteConfig.pages.guides.title}</h1>
        <p className={styles.subtitle}>
          {siteConfig.pages.guides.subtitle}
        </p>
      </div>

      {!hasContent ? (
        <ContentList articles={[]} emptyMessage={siteConfig.pages.guides.empty} />
      ) : (
        <>
          {bestArticles.length > 0 && (
            <>
              <h2 className={styles.groupTitle}>{siteConfig.pages.guides.bestTitle}</h2>
              <ContentList articles={bestArticles} showBadge />
            </>
          )}

          {problemArticles.length > 0 && (
            <>
              <h2 className={styles.groupTitle}>{siteConfig.pages.guides.problemTitle}</h2>
              <ContentList articles={problemArticles} showBadge />
            </>
          )}

          {alternativeArticles.length > 0 && (
            <>
              <h2 className={styles.groupTitle}>{siteConfig.pages.guides.alternativeTitle}</h2>
              <ContentList articles={alternativeArticles} showBadge />
            </>
          )}
        </>
      )}
    </div>
  );
}

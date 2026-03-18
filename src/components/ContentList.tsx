import Link from 'next/link';
import { siteConfig } from '@/lib/site-config';
import ScoreBadge from './ScoreBadge';
import styles from './ContentList.module.css';

interface ContentItem {
  id: string;
  title: string;
  slug: string;
  content_type: string;
  excerpt: string | null;
  published_at: string | null;
  averageRating?: number | null;
}


interface Props {
  articles: ContentItem[];
  emptyMessage?: string;
  showBadge?: boolean;
}

export default function ContentList({
  articles,
  emptyMessage = 'لا يوجد محتوى منشور بعد.',
  showBadge = false,
}: Props) {
  if (articles.length === 0) {
    return <p className={styles.empty}>{emptyMessage}</p>;
  }

  return (
    <div className={styles.grid}>
      {articles.map((article) => (
        <Link
          key={article.id}
          href={`/${article.content_type}/${article.slug}`}
          className={styles.card}
        >
          {showBadge && (
            <span className={styles.badge}>
              {siteConfig.typeLabels[article.content_type] || article.content_type}
            </span>
          )}
          <div className={styles.titleRow}>
            <h3 className={styles.title}>{article.title}</h3>
            {typeof article.averageRating === 'number' && (
              <ScoreBadge score={article.averageRating} max={5} />
            )}
          </div>
          {article.excerpt && (
            <p className={styles.excerpt}>{article.excerpt}</p>
          )}
          {article.published_at && (
            <span className={styles.date}>
              {new Date(article.published_at).toLocaleDateString('ar')}
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}

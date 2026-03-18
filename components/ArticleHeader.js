import styles from './ArticleHeader.module.css';
import DisclosureBadge from './DisclosureBadge.js';

/**
 * Article header with title, optional keyword tag, author, date, and disclosure badge.
 *
 * @param {{ title: string, primaryKeyword?: string, author?: string, publishedAt?: string }} props
 */
export default function ArticleHeader({ title, primaryKeyword, author, publishedAt }) {
  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString('ar', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>

      {primaryKeyword && (
        <span className={styles.keyword}>{primaryKeyword}</span>
      )}

      <div className={styles.meta}>
        {author && <span className={styles.author}>{author}</span>}
        {formattedDate && <time className={styles.date}>{formattedDate}</time>}
      </div>

      <DisclosureBadge />
    </header>
  );
}

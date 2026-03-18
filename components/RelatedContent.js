import styles from './RelatedContent.module.css';

const TYPE_LABELS = {
  best: 'الأفضل',
  review: 'مراجعة',
  comparison: 'مقارنة',
  problem: 'حل مشكلة',
  alternative: 'بدائل',
};

/**
 * Related content links section.
 * Renders up to 3 items. Returns null if items is empty or missing.
 *
 * @param {{ items: Array<{ slug: string, title: string, content_type: string }> }} props
 */
export default function RelatedContent({ items }) {
  if (!items || items.length === 0) return null;

  const display = items.slice(0, 3);

  return (
    <section className={styles.container}>
      <h2 className={styles.heading}>مقالات ذات صلة</h2>

      <ul className={styles.list}>
        {display.map((item) => (
          <li key={item.slug} className={styles.item}>
            <a href={`/${item.content_type}/${item.slug}`} className={styles.link}>
              <span className={styles.badge}>
                {TYPE_LABELS[item.content_type] || item.content_type}
              </span>
              <span className={styles.title}>{item.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

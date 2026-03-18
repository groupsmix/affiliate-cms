import styles from './DisclosureBadge.module.css';

/**
 * Static Arabic disclosure badge.
 * Indicates the article contains sponsored/affiliate links.
 */
export default function DisclosureBadge() {
  return (
    <span className={styles.badge}>
      يحتوي هذا المقال على روابط برعاية
    </span>
  );
}

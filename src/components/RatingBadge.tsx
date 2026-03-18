import styles from './RatingBadge.module.css';

interface RatingBadgeProps {
  rating: number;
  size?: 'small' | 'large';
}

export default function RatingBadge({ rating, size = 'small' }: RatingBadgeProps) {
  const clamped = Math.max(0, Math.min(10, rating));
  const filled = Math.round(clamped / 2);
  const empty = 5 - filled;

  const className = size === 'large' ? styles.badgeLarge : styles.badge;

  return (
    <span className={className}>
      <span className={styles.stars} aria-label={`${clamped} من 10`}>
        {'★'.repeat(filled)}{'☆'.repeat(empty)}
      </span>
      <span className={styles.score}>{clamped}/10</span>
    </span>
  );
}

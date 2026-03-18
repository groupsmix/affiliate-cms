import styles from './StarRating.module.css';

interface Props {
  rating: number;
  max?: number;
}

export default function StarRating({ rating, max = 5 }: Props) {
  const clamped = Math.max(0, Math.min(rating, max));
  const fullStars = Math.floor(clamped);
  const fraction = clamped - fullStars;
  const emptyStars = max - fullStars - (fraction > 0 ? 1 : 0);

  return (
    <span className={styles.wrap} aria-label={`${clamped} من ${max}`}>
      {Array.from({ length: fullStars }, (_, i) => (
        <svg
          key={`full-${i}`}
          className={styles.star}
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.33L10 13.27l-4.77 2.45.91-5.33L2.27 6.62l5.34-.78z" />
        </svg>
      ))}

      {fraction > 0 && (
        <svg
          key="partial"
          className={styles.star}
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={`starGrad-${Math.round(fraction * 100)}`}>
              <stop offset={`${fraction * 100}%`} stopColor="currentColor" />
              <stop offset={`${fraction * 100}%`} stopColor="var(--color-border)" />
            </linearGradient>
          </defs>
          <path
            d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.33L10 13.27l-4.77 2.45.91-5.33L2.27 6.62l5.34-.78z"
            fill={`url(#starGrad-${Math.round(fraction * 100)})`}
          />
        </svg>
      )}

      {Array.from({ length: emptyStars }, (_, i) => (
        <svg
          key={`empty-${i}`}
          className={`${styles.star} ${styles.empty}`}
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.33L10 13.27l-4.77 2.45.91-5.33L2.27 6.62l5.34-.78z" />
        </svg>
      ))}

      <span className={styles.value}>{clamped.toFixed(1)}</span>
    </span>
  );
}

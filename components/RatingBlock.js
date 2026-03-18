import styles from './RatingBlock.module.css';

/**
 * Numeric rating display with optional sub-ratings.
 * Renders nothing if no rating is provided.
 *
 * @param {{ rating?: number, subRatings?: Array<{ label: string, value: number }> }} props
 */
export default function RatingBlock({ rating, subRatings }) {
  if (rating == null) return null;

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <span className={styles.value}>{rating}</span>
        <span className={styles.outOf}>/ 5</span>
      </div>

      {subRatings && subRatings.length > 0 && (
        <div className={styles.subRatings}>
          {subRatings.map((sub) => (
            <div key={sub.label} className={styles.subRow}>
              <span className={styles.subLabel}>{sub.label}</span>
              <div className={styles.barTrack}>
                <div
                  className={styles.barFill}
                  style={{ width: `${(sub.value / 5) * 100}%` }}
                />
              </div>
              <span className={styles.subValue}>{sub.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

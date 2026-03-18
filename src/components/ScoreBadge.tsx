import styles from './ScoreBadge.module.css';

interface Props {
  score: number;
  max?: number;
}

export default function ScoreBadge({ score, max = 10 }: Props) {
  const clamped = Math.max(0, Math.min(score, max));

  let tier: string;
  if (clamped >= 8) {
    tier = styles.high;
  } else if (clamped >= 5) {
    tier = styles.mid;
  } else {
    tier = styles.low;
  }

  return (
    <span className={`${styles.badge} ${tier}`} aria-label={`${clamped} / ${max}`}>
      {clamped.toFixed(1)}
    </span>
  );
}

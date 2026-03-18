import styles from './ProsConsBlock.module.css';

/**
 * Pros and cons display with Arabic headings.
 * Renders nothing if both arrays are empty or missing.
 *
 * @param {{ pros?: string[], cons?: string[] }} props
 */
export default function ProsConsBlock({ pros, cons }) {
  const hasPros = pros && pros.length > 0;
  const hasCons = cons && cons.length > 0;

  if (!hasPros && !hasCons) return null;

  return (
    <div className={styles.container}>
      {hasPros && (
        <div className={styles.section}>
          <h3 className={styles.prosHeading}>المميزات</h3>
          <ul className={styles.list}>
            {pros.map((item, i) => (
              <li key={i} className={styles.item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {hasCons && (
        <div className={styles.section}>
          <h3 className={styles.consHeading}>العيوب</h3>
          <ul className={styles.list}>
            {cons.map((item, i) => (
              <li key={i} className={styles.item}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

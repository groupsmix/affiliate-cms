import styles from './FAQBlock.module.css';

/**
 * FAQ section using native <details>/<summary> elements.
 * Renders nothing if items array is empty or missing.
 *
 * @param {{ items: Array<{ question: string, answer: string }> }} props
 */
export default function FAQBlock({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <section className={styles.container}>
      <h2 className={styles.heading}>الأسئلة الشائعة</h2>

      {items.map((item, i) => (
        <details key={i} className={styles.item}>
          <summary className={styles.question}>{item.question}</summary>
          <p className={styles.answer}>{item.answer}</p>
        </details>
      ))}
    </section>
  );
}

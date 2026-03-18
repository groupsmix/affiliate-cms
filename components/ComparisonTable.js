import styles from './ComparisonTable.module.css';
import CTABlock from './CTABlock.js';

/**
 * Simple responsive comparison table for products.
 * Renders null if fewer than 2 products are provided.
 *
 * @param {{ products: object[], rows?: Array<{ label: string, key: string }>, ctaLabel?: string }} props
 */
export default function ComparisonTable({ products, rows, ctaLabel = 'جرّب الآن' }) {
  if (!products || products.length < 2) return null;

  const defaultRows = [
    { label: 'الوصف', key: 'tagline' },
    { label: 'التسعير', key: 'pricing_model' },
    { label: 'التقييم', key: 'rating' },
  ];

  const displayRows = rows && rows.length > 0 ? rows : defaultRows;

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.headerCell}></th>
            {products.map((p) => (
              <th key={p.id || p.slug} className={styles.headerCell}>
                {p.logo_url && (
                  <img src={p.logo_url} alt={p.name} className={styles.logo} />
                )}
                <span className={styles.productName}>{p.name}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayRows.map((row) => (
            <tr key={row.key}>
              <td className={styles.labelCell}>{row.label}</td>
              {products.map((p) => (
                <td key={p.id || p.slug} className={styles.valueCell}>
                  {p[row.key] != null ? String(p[row.key]) : '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className={styles.labelCell}></td>
            {products.map((p) => (
              <td key={p.id || p.slug} className={styles.ctaCell}>
                <CTABlock
                  href={p.custom_affiliate_url || p.affiliate_url || '#'}
                  label={ctaLabel}
                />
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

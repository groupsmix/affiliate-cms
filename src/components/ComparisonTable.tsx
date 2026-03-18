import styles from './ComparisonTable.module.css';

interface ComparisonProduct {
  name: string;
  tagline: string | null;
  description: string | null;
  pricing_model: string | null;
  rating: number | null;
  affiliate_url: string;
  website_url: string;
}

interface ComparisonTableProps {
  products: ComparisonProduct[];
}

export default function ComparisonTable({ products }: ComparisonTableProps) {
  if (products.length < 2) return null;

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.featureHeader}>الميزة</th>
            {products.map((p) => (
              <th key={p.name} className={styles.productHeader}>
                {p.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={styles.featureCell}>الوصف</td>
            {products.map((p) => (
              <td key={p.name} className={styles.valueCell}>
                {p.tagline || '—'}
              </td>
            ))}
          </tr>
          <tr>
            <td className={styles.featureCell}>نموذج التسعير</td>
            {products.map((p) => (
              <td key={p.name} className={styles.valueCell}>
                {p.pricing_model || '—'}
              </td>
            ))}
          </tr>
          <tr>
            <td className={styles.featureCell}>التقييم</td>
            {products.map((p) => (
              <td key={p.name} className={styles.valueCell}>
                {p.rating !== null && p.rating !== undefined ? (
                  <span className={styles.ratingBadge}>{p.rating}/10</span>
                ) : (
                  '—'
                )}
              </td>
            ))}
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td className={styles.featureCell}></td>
            {products.map((p) => (
              <td key={p.name} className={styles.valueCell}>
                <a
                  href={p.affiliate_url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className={styles.ctaLink}
                >
                  جرّب الآن
                </a>
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

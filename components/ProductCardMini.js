import styles from './ProductCardMini.module.css';
import AffiliateLink from './AffiliateLink.js';

/**
 * Compact inline product card for inline mentions.
 * Shows logo, name, and a small CTA link.
 *
 * @param {{ product: object, href: string, ctaLabel?: string }} props
 */
export default function ProductCardMini({ product, href, ctaLabel = 'زيارة' }) {
  return (
    <div className={styles.card}>
      {product.logo_url && (
        <img
          src={product.logo_url}
          alt={product.name}
          className={styles.logo}
        />
      )}

      <span className={styles.name}>{product.name}</span>

      <AffiliateLink href={href} className={styles.cta}>
        {ctaLabel}
      </AffiliateLink>
    </div>
  );
}

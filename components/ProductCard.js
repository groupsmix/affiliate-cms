import styles from './ProductCard.module.css';
import RatingBlock from './RatingBlock.js';
import CTABlock from './CTABlock.js';

/**
 * Full product card with logo, name, tagline, rating, pricing badge, and CTA.
 *
 * @param {{ product: object, href: string, ctaLabel?: string }} props
 */
export default function ProductCard({ product, href, ctaLabel = 'جرّب الآن' }) {
  return (
    <div className={styles.card}>
      {product.logo_url && (
        <img
          src={product.logo_url}
          alt={product.name}
          className={styles.logo}
        />
      )}

      <h3 className={styles.name}>{product.name}</h3>

      {product.tagline && (
        <p className={styles.tagline}>{product.tagline}</p>
      )}

      {product.pricing_model && (
        <span className={styles.pricingBadge}>{product.pricing_model}</span>
      )}

      {product.rating != null && (
        <RatingBlock rating={product.rating} />
      )}

      <CTABlock href={href} label={ctaLabel} />
    </div>
  );
}

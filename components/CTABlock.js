import styles from './CTABlock.module.css';
import AffiliateLink from './AffiliateLink.js';

/**
 * Call-to-action block with a single affiliate button.
 *
 * @param {{ href: string, label: string }} props
 */
export default function CTABlock({ href, label }) {
  return (
    <div className={styles.container}>
      <AffiliateLink href={href} className={styles.button}>
        {label}
      </AffiliateLink>
    </div>
  );
}

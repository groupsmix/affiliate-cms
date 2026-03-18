import styles from './AffiliateLink.module.css';

/**
 * Affiliate anchor wrapper.
 * Opens in new tab with proper rel attributes for SEO and compliance.
 *
 * @param {{ href: string, children: React.ReactNode, className?: string }} props
 */
export default function AffiliateLink({ href, children, className }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="nofollow noopener sponsored"
      className={`${styles.link}${className ? ` ${className}` : ''}`}
    >
      {children}
    </a>
  );
}

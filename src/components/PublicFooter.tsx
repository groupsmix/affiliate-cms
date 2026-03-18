import Link from 'next/link';
import { siteConfig } from '@/lib/site-config';
import styles from './PublicFooter.module.css';

export default function PublicFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerGrid}>
          <div className={styles.brandCol}>
            <Link href="/" className={styles.brandName}>
              {siteConfig.name}
            </Link>
            <p className={styles.brandDesc}>
              {siteConfig.footer.description}
            </p>
          </div>

          <div className={styles.linkCol}>
            <h4 className={styles.colTitle}>{siteConfig.footer.contentColumnTitle}</h4>
            <ul className={styles.linkList}>
              {siteConfig.footer.contentLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.footerLink}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.linkCol}>
            <h4 className={styles.colTitle}>{siteConfig.footer.siteColumnTitle}</h4>
            <ul className={styles.linkList}>
              {siteConfig.footer.siteLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.footerLink}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} {siteConfig.footer.copyright}
          </p>
          <p className={styles.disclosure}>
            {siteConfig.footer.affiliateNotice}{' '}
            <Link href="/disclosure" className={styles.disclosureLink}>
              {siteConfig.footer.readMore}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

import Link from 'next/link';
import styles from './PublicFooter.module.css';

export default function PublicFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <ul className={styles.footerLinks}>
          <li><Link href="/about" className={styles.footerLink}>عن الموقع</Link></li>
          <li><Link href="/disclosure" className={styles.footerLink}>الإفصاح</Link></li>
        </ul>
        <p className={styles.copyright}>
          &copy; {new Date().getFullYear()} أدوات البريد. جميع الحقوق محفوظة.
        </p>
      </div>
    </footer>
  );
}

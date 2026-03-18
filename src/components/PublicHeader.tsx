import Link from 'next/link';
import styles from './PublicHeader.module.css';

export default function PublicHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link href="/" className={styles.logo}>
          أدوات البريد
        </Link>
        <nav>
          <ul className={styles.nav}>
            <li><Link href="/" className={styles.navLink}>الرئيسية</Link></li>
            <li><Link href="/reviews" className={styles.navLink}>المراجعات</Link></li>
            <li><Link href="/comparisons" className={styles.navLink}>المقارنات</Link></li>
            <li><Link href="/guides" className={styles.navLink}>الأدلة</Link></li>
            <li><Link href="/about" className={styles.navLink}>عن الموقع</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

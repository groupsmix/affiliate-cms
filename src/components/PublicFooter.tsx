import Link from 'next/link';
import styles from './PublicFooter.module.css';

export default function PublicFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerGrid}>
          <div className={styles.brandCol}>
            <Link href="/" className={styles.brandName}>
              أدوات البريد
            </Link>
            <p className={styles.brandDesc}>
              موقع عربي متخصص في مراجعة ومقارنة أدوات النشرات البريدية والتسويق
              بالإيميل. نساعدك تختار الأداة المناسبة بمراجعات صادقة ومقارنات
              عملية.
            </p>
          </div>

          <div className={styles.linkCol}>
            <h4 className={styles.colTitle}>المحتوى</h4>
            <ul className={styles.linkList}>
              <li>
                <Link href="/reviews" className={styles.footerLink}>
                  المراجعات
                </Link>
              </li>
              <li>
                <Link href="/comparisons" className={styles.footerLink}>
                  المقارنات
                </Link>
              </li>
              <li>
                <Link href="/guides" className={styles.footerLink}>
                  الأدلة
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.linkCol}>
            <h4 className={styles.colTitle}>الموقع</h4>
            <ul className={styles.linkList}>
              <li>
                <Link href="/about" className={styles.footerLink}>
                  عن الموقع
                </Link>
              </li>
              <li>
                <Link href="/disclosure" className={styles.footerLink}>
                  سياسة الإفصاح
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} أدوات البريد. جميع الحقوق محفوظة.
          </p>
          <p className={styles.disclosure}>
            يحتوي هذا الموقع على روابط تسويقية.{' '}
            <Link href="/disclosure" className={styles.disclosureLink}>
              اقرأ المزيد
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

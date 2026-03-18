import Link from 'next/link';
import styles from './layout.module.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.wrapper}>
      <aside className={styles.sidebar}>
        <Link href="/admin" className={styles.brand}>Admin</Link>
        <nav className={styles.nav}>
          <Link href="/admin" className={styles.navLink}>Dashboard</Link>
          <Link href="/admin/content" className={styles.navLink}>Content</Link>
          <Link href="/admin/products" className={styles.navLink}>Products</Link>
          <Link href="/admin/categories" className={styles.navLink}>Categories</Link>
          <Link href="/admin/analytics" className={styles.navLink}>Analytics</Link>
        </nav>
      </aside>
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}

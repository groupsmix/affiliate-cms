'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './PublicHeader.module.css';

const NAV_ITEMS = [
  { href: '/', label: 'الرئيسية' },
  { href: '/reviews', label: 'المراجعات' },
  { href: '/comparisons', label: 'المقارنات' },
  { href: '/guides', label: 'الأدلة' },
  { href: '/about', label: 'عن الموقع' },
];

export default function PublicHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link href="/" className={styles.logo}>
          أدوات البريد
        </Link>

        <button
          className={styles.menuBtn}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="القائمة"
          aria-expanded={isOpen}
        >
          <span
            className={`${styles.menuIcon} ${isOpen ? styles.menuIconOpen : ''}`}
          />
        </button>

        <nav className={`${styles.nav} ${isOpen ? styles.navOpen : ''}`}>
          <ul className={styles.navList}>
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={styles.navLink}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

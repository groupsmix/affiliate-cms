'use client';

import { useState } from 'react';
import { siteConfig } from '@/lib/site-config';
import styles from './NewsletterForm.module.css';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'duplicate'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else if (res.status === 409) {
        setStatus('duplicate');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{siteConfig.newsletter.title}</h2>
      <p className={styles.description}>{siteConfig.newsletter.description}</p>

      {status === 'success' ? (
        <p className={styles.success}>{siteConfig.newsletter.success}</p>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={siteConfig.newsletter.placeholder}
            required
            className={styles.input}
            dir="ltr"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className={styles.button}
          >
            {siteConfig.newsletter.button}
          </button>
        </form>
      )}

      {status === 'error' && (
        <p className={styles.error}>{siteConfig.newsletter.error}</p>
      )}
      {status === 'duplicate' && (
        <p className={styles.duplicate}>{siteConfig.newsletter.duplicate}</p>
      )}
    </div>
  );
}

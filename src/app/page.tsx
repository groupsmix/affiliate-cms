import Link from 'next/link';
import { fetchPublishedContent } from './_actions/public';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const articles = await fetchPublishedContent();

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px' }}>
      <h1>Affiliate CMS</h1>
      <p style={{ color: '#555' }}>Latest published articles</p>

      {articles.length === 0 ? (
        <p style={{ color: '#888', marginTop: '32px' }}>No published articles yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {articles.map((article: Record<string, string | null>) => (
            <li
              key={article.id}
              style={{
                borderBottom: '1px solid #eee',
                padding: '16px 0',
              }}
            >
              <Link
                href={`/${article.content_type}/${article.slug}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <h2 style={{ margin: '0 0 4px 0', fontSize: '18px' }}>
                  {article.title}
                </h2>
                {article.excerpt && (
                  <p style={{ margin: '4px 0', color: '#555', fontSize: '14px' }}>
                    {article.excerpt}
                  </p>
                )}
                <span
                  style={{
                    display: 'inline-block',
                    marginTop: '4px',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    background: '#e2e3e5',
                    color: '#383d41',
                  }}
                >
                  {article.content_type}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

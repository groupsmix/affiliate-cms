import { notFound } from 'next/navigation';
import Link from 'next/link';
import { fetchContentByTypeAndSlug, fetchProductsForPublicContent } from '../../_actions/public';
import type { ContentType } from '@/types/index';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const VALID_CONTENT_TYPES: ContentType[] = ['best', 'review', 'comparison', 'problem', 'alternative'];

export default async function ContentPage({
  params,
}: {
  params: { contentType: string; slug: string };
}) {
  const { contentType, slug } = params;

  if (!VALID_CONTENT_TYPES.includes(contentType as ContentType)) {
    notFound();
  }

  const content = await fetchContentByTypeAndSlug(contentType as ContentType, slug);

  if (!content) {
    notFound();
  }

  const linkedProducts = await fetchProductsForPublicContent(content.id);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px' }}>
      <nav style={{ marginBottom: '24px', fontSize: '14px' }}>
        <Link href="/" style={{ color: '#0070f3' }}>Home</Link>
        {' / '}
        <span style={{ color: '#888' }}>{contentType}</span>
      </nav>

      <article>
        <h1 style={{ margin: '0 0 8px 0' }}>{content.title}</h1>

        <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: '#888', marginBottom: '24px' }}>
          <span style={{
            padding: '2px 8px',
            borderRadius: '4px',
            background: '#e2e3e5',
            color: '#383d41',
          }}>
            {content.content_type}
          </span>
          {content.published_at && (
            <span>{new Date(content.published_at).toLocaleDateString()}</span>
          )}
          {content.author && <span>by {content.author}</span>}
        </div>

        {content.excerpt && (
          <p style={{ fontSize: '16px', color: '#555', fontStyle: 'italic', marginBottom: '24px' }}>
            {content.excerpt}
          </p>
        )}

        {content.body && (
          <div
            style={{ lineHeight: 1.7, fontSize: '16px' }}
            dangerouslySetInnerHTML={{ __html: content.body }}
          />
        )}
      </article>

      {linkedProducts.length > 0 && (
        <section style={{ marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '24px' }}>
          <h2>Related Products</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {linkedProducts.map((lp: Record<string, unknown>) => {
              const product = lp.products as Record<string, string | boolean | null> | null;
              if (!product) return null;
              return (
                <li
                  key={lp.id as string}
                  style={{
                    padding: '12px 0',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  <strong>{product.name}</strong>
                  {product.tagline && (
                    <span style={{ color: '#555', marginLeft: '8px', fontSize: '14px' }}>
                      — {product.tagline}
                    </span>
                  )}
                  {product.affiliate_url && (
                    <div style={{ marginTop: '4px' }}>
                      <a
                        href={product.affiliate_url as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#0070f3', fontSize: '14px' }}
                      >
                        Check it out →
                      </a>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}

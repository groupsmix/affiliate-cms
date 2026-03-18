import { fetchProductsList } from '../_actions/products';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default async function ProductsListPage() {
  const products = await fetchProductsList();

  return (
    <div>
      <h1>Products</h1>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
            <th style={{ padding: '8px' }}>Name</th>
            <th style={{ padding: '8px' }}>Slug</th>
            <th style={{ padding: '8px' }}>Active</th>
            <th style={{ padding: '8px' }}>Affiliate URL</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 && (
            <tr>
              <td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: '#888' }}>
                No products yet.
              </td>
            </tr>
          )}
          {products.map((p: Record<string, unknown>) => (
            <tr key={p.id as string} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '8px' }}>{p.name as string}</td>
              <td style={{ padding: '8px', fontFamily: 'monospace', fontSize: '13px' }}>{p.slug as string}</td>
              <td style={{ padding: '8px' }}>
                {(p.is_active as boolean) ? 'Yes' : 'No'}
              </td>
              <td style={{ padding: '8px', fontSize: '13px' }}>
                <a
                  href={p.affiliate_url as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ wordBreak: 'break-all' }}
                >
                  {p.affiliate_url as string}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import { getSupabase } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default async function AnalyticsPage() {
  const supabase = getSupabase();

  // Fetch recent clicks
  const { data: recentClicks } = await supabase
    .from('click_events')
    .select('*')
    .order('clicked_at', { ascending: false })
    .limit(50);

  // Fetch click counts by product
  const { data: clicksByProduct } = await supabase
    .from('click_events')
    .select('product_slug')
    .order('clicked_at', { ascending: false });

  // Aggregate click counts
  const productClickCounts: Record<string, number> = {};
  (clicksByProduct || []).forEach((click: Record<string, string>) => {
    const key = click.product_slug || 'unknown';
    productClickCounts[key] = (productClickCounts[key] || 0) + 1;
  });

  const sortedProducts = Object.entries(productClickCounts)
    .sort(([, a], [, b]) => b - a);

  return (
    <div>
      <h1 style={{ marginBottom: '24px' }}>Analytics</h1>

      {/* Click counts by product */}
      <h2 style={{ marginBottom: '12px' }}>Clicks by Product</h2>
      {sortedProducts.length === 0 ? (
        <p style={{ color: '#888' }}>No click data yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '32px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
              <th style={{ padding: '8px' }}>Product</th>
              <th style={{ padding: '8px' }}>Clicks</th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map(([product, count]) => (
              <tr key={product} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px' }}>{product}</td>
                <td style={{ padding: '8px', fontWeight: '600' }}>{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Recent clicks */}
      <h2 style={{ marginBottom: '12px' }}>Recent Clicks</h2>
      {(!recentClicks || recentClicks.length === 0) ? (
        <p style={{ color: '#888' }}>No clicks recorded yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
              <th style={{ padding: '8px' }}>Product</th>
              <th style={{ padding: '8px' }}>Content</th>
              <th style={{ padding: '8px' }}>Time</th>
              <th style={{ padding: '8px' }}>Referrer</th>
            </tr>
          </thead>
          <tbody>
            {recentClicks.map((click: Record<string, string>) => (
              <tr key={click.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px' }}>{click.product_slug || '—'}</td>
                <td style={{ padding: '8px' }}>{click.content_slug || '—'}</td>
                <td style={{ padding: '8px', fontSize: '13px' }}>
                  {new Date(click.clicked_at).toLocaleString()}
                </td>
                <td style={{ padding: '8px', fontSize: '13px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {click.referrer || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

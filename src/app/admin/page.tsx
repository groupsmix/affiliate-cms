import { getSupabase } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default async function AdminDashboard() {
  const supabase = getSupabase();

  const [contentRes, productsRes, subscribersRes, clicksRes] = await Promise.all([
    supabase.from('content').select('id, status', { count: 'exact', head: false }),
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('subscribers').select('id', { count: 'exact', head: true }),
    supabase.from('click_events').select('id', { count: 'exact', head: true }),
  ]);

  const contentRows = contentRes.data || [];
  const published = contentRows.filter((r) => r.status === 'published').length;
  const drafts = contentRows.filter((r) => r.status === 'draft').length;
  const inReview = contentRows.filter((r) => r.status === 'review').length;

  const stats = [
    { label: 'Total Content', value: contentRes.count ?? 0 },
    { label: 'Published', value: published },
    { label: 'Drafts', value: drafts },
    { label: 'In Review', value: inReview },
    { label: 'Products', value: productsRes.count ?? 0 },
    { label: 'Subscribers', value: subscribersRes.count ?? 0 },
    { label: 'Total Clicks', value: clicksRes.count ?? 0 },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: '24px' }}>Dashboard</h1>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '16px',
      }}>
        {stats.map((stat) => (
          <div
            key={stat.label}
            style={{
              padding: '20px',
              background: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #e9ecef',
            }}
          >
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#0070f3' }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '4px' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

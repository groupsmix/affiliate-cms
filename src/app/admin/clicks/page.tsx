import { getSupabase } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export default async function ClicksPage() {
  const supabase = getSupabase();

  const { data: clicks, error } = await supabase
    .from('click_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) {
    return <div>Error loading click events: {error.message}</div>;
  }

  return (
    <div>
      <h1>Click Events</h1>
      <p style={{ color: '#888', marginBottom: '16px' }}>Latest 200 click events</p>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
            <th style={{ padding: '8px' }}>Created At</th>
            <th style={{ padding: '8px' }}>Product Slug</th>
            <th style={{ padding: '8px' }}>Source Path</th>
            <th style={{ padding: '8px' }}>Referrer</th>
          </tr>
        </thead>
        <tbody>
          {(!clicks || clicks.length === 0) && (
            <tr>
              <td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: '#888' }}>
                No click events recorded yet.
              </td>
            </tr>
          )}
          {clicks?.map((click: Record<string, unknown>) => (
            <tr key={click.id as string} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '8px', fontSize: '13px' }}>
                {new Date(click.created_at as string).toLocaleString()}
              </td>
              <td style={{ padding: '8px', fontFamily: 'monospace', fontSize: '13px' }}>
                {click.product_slug as string}
              </td>
              <td style={{ padding: '8px', fontSize: '13px' }}>
                {(click.source_path as string) || '—'}
              </td>
              <td style={{ padding: '8px', fontSize: '13px', wordBreak: 'break-all' }}>
                {(click.referrer as string) || '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

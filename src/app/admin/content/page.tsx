import Link from 'next/link';
import { fetchContentList } from '../_actions/content';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default async function ContentListPage() {
  const rows = await fetchContentList();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h1 style={{ margin: 0 }}>Content</h1>
        <Link
          href="/admin/content/new"
          style={{
            padding: '8px 16px',
            background: '#0070f3',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '4px',
          }}
        >
          + New Content
        </Link>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
            <th style={{ padding: '8px' }}>Title</th>
            <th style={{ padding: '8px' }}>Slug</th>
            <th style={{ padding: '8px' }}>Type</th>
            <th style={{ padding: '8px' }}>Status</th>
            <th style={{ padding: '8px' }}>Updated</th>
            <th style={{ padding: '8px' }}></th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#888' }}>
                No content yet. Create your first piece of content.
              </td>
            </tr>
          )}
          {rows.map((row: Record<string, string>) => (
            <tr key={row.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '8px' }}>{row.title}</td>
              <td style={{ padding: '8px', fontFamily: 'monospace', fontSize: '13px' }}>{row.slug}</td>
              <td style={{ padding: '8px' }}>{row.content_type}</td>
              <td style={{ padding: '8px' }}>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  background: row.status === 'published' ? '#d4edda' : row.status === 'review' ? '#fff3cd' : '#e2e3e5',
                  color: row.status === 'published' ? '#155724' : row.status === 'review' ? '#856404' : '#383d41',
                }}>
                  {row.status}
                </span>
              </td>
              <td style={{ padding: '8px', fontSize: '13px' }}>
                {new Date(row.updated_at).toLocaleDateString()}
              </td>
              <td style={{ padding: '8px' }}>
                <Link href={`/admin/content/${row.id}`}>Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

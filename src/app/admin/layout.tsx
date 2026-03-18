import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '20px' }}>
      <nav style={{
        display: 'flex',
        gap: '16px',
        padding: '12px 0',
        borderBottom: '1px solid #ddd',
        marginBottom: '24px',
      }}>
        <strong style={{ marginRight: '16px' }}>Admin</strong>
        <Link href="/admin/content">Content</Link>
        <Link href="/admin/products">Products</Link>
        <Link href="/admin/clicks">Clicks</Link>
      </nav>
      {children}
    </div>
  );
}

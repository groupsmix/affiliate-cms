import { notFound } from 'next/navigation';
import { fetchContentById, updateContentAction, setContentStatusAction, deactivateContentAction } from '../../_actions/content';
import { fetchProductsForContent, linkProductAction, unlinkProductAction } from '../../_actions/content-products';
import { fetchProductsList } from '../../_actions/products';
import type { ContentStatus } from '@/types/index';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default async function EditContentPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const content = await fetchContentById(id);

  if (!content) {
    notFound();
  }

  const linkedProducts = await fetchProductsForContent(id);
  const allProducts = await fetchProductsList();

  const updateWithId = updateContentAction.bind(null, id);

  async function handleSetStatus(formData: FormData) {
    'use server';
    const status = formData.get('status') as ContentStatus;
    await setContentStatusAction(id, status);
  }

  async function handleDeactivate() {
    'use server';
    await deactivateContentAction(id);
  }

  async function handleLinkProduct(formData: FormData) {
    'use server';
    await linkProductAction(id, formData);
  }

  async function handleUnlinkProduct(formData: FormData) {
    'use server';
    const productId = formData.get('product_id') as string;
    await unlinkProductAction(id, productId);
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h1 style={{ margin: 0 }}>Edit: {content.title}</h1>
        <span style={{
          padding: '4px 12px',
          borderRadius: '4px',
          fontSize: '13px',
          background: content.status === 'published' ? '#d4edda' : content.status === 'review' ? '#fff3cd' : '#e2e3e5',
          color: content.status === 'published' ? '#155724' : content.status === 'review' ? '#856404' : '#383d41',
        }}>
          {content.status}
        </span>
      </div>

      {!content.is_active && (
        <div style={{ padding: '8px 16px', background: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '16px' }}>
          This content is deactivated.
        </div>
      )}

      {/* Status Actions */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {content.status !== 'draft' && (
          <form action={handleSetStatus}>
            <input type="hidden" name="status" value="draft" />
            <button type="submit" style={{ padding: '6px 12px', cursor: 'pointer' }}>
              Set Draft
            </button>
          </form>
        )}
        {content.status !== 'review' && (
          <form action={handleSetStatus}>
            <input type="hidden" name="status" value="review" />
            <button type="submit" style={{ padding: '6px 12px', cursor: 'pointer' }}>
              Set Review
            </button>
          </form>
        )}
        {content.status !== 'published' && (
          <form action={handleSetStatus}>
            <input type="hidden" name="status" value="published" />
            <button type="submit" style={{ padding: '6px 12px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Publish
            </button>
          </form>
        )}
        {content.is_active && (
          <form action={handleDeactivate}>
            <button type="submit" style={{ padding: '6px 12px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Deactivate
            </button>
          </form>
        )}
      </div>

      {/* Edit Content Form */}
      <form action={updateWithId} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
        <label>
          Body
          <textarea
            name="body"
            defaultValue={content.body ?? ''}
            rows={12}
            style={{ display: 'block', width: '100%', padding: '6px', marginTop: '4px', fontFamily: 'monospace', fontSize: '13px' }}
          />
        </label>

        <label>
          Excerpt
          <textarea
            name="excerpt"
            defaultValue={content.excerpt ?? ''}
            rows={3}
            style={{ display: 'block', width: '100%', padding: '6px', marginTop: '4px' }}
          />
        </label>

        <label>
          Meta Title
          <input
            name="meta_title"
            defaultValue={content.meta_title ?? ''}
            style={{ display: 'block', width: '100%', padding: '6px', marginTop: '4px' }}
          />
        </label>

        <label>
          Meta Description
          <textarea
            name="meta_description"
            defaultValue={content.meta_description ?? ''}
            rows={2}
            style={{ display: 'block', width: '100%', padding: '6px', marginTop: '4px' }}
          />
        </label>

        <button
          type="submit"
          style={{
            padding: '10px 20px',
            background: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            alignSelf: 'flex-start',
          }}
        >
          Save Changes
        </button>
      </form>

      {/* Linked Products */}
      <h2>Linked Products</h2>

      {linkedProducts.length === 0 ? (
        <p style={{ color: '#888' }}>No products linked yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
              <th style={{ padding: '8px' }}>Product</th>
              <th style={{ padding: '8px' }}>Placement</th>
              <th style={{ padding: '8px' }}>Order</th>
              <th style={{ padding: '8px' }}></th>
            </tr>
          </thead>
          <tbody>
            {linkedProducts.map((lp: Record<string, unknown>) => (
              <tr key={lp.id as string} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px' }}>
                  {(lp.products as Record<string, string> | null)?.name ?? lp.product_id as string}
                </td>
                <td style={{ padding: '8px' }}>{(lp.placement as string) ?? '—'}</td>
                <td style={{ padding: '8px' }}>{lp.display_order as number}</td>
                <td style={{ padding: '8px' }}>
                  <form action={handleUnlinkProduct}>
                    <input type="hidden" name="product_id" value={lp.product_id as string} />
                    <button type="submit" style={{ color: '#dc3545', background: 'none', border: 'none', cursor: 'pointer' }}>
                      Remove
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Attach Product Form */}
      <h3>Attach a Product</h3>
      <form action={handleLinkProduct} style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <label>
          Product
          <select name="product_id" required style={{ display: 'block', padding: '6px', marginTop: '4px' }}>
            <option value="">— Select —</option>
            {allProducts.map((p: Record<string, string>) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </label>

        <label>
          Placement
          <select name="placement" style={{ display: 'block', padding: '6px', marginTop: '4px' }}>
            <option value="">— None —</option>
            <option value="hero">Hero</option>
            <option value="sidebar">Sidebar</option>
            <option value="inline">Inline</option>
            <option value="footer">Footer</option>
          </select>
        </label>

        <label>
          Display Order
          <input
            name="display_order"
            type="number"
            defaultValue={0}
            min={0}
            style={{ display: 'block', width: '80px', padding: '6px', marginTop: '4px' }}
          />
        </label>

        <button
          type="submit"
          style={{
            padding: '8px 16px',
            background: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Attach
        </button>
      </form>
    </div>
  );
}

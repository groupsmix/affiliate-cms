import { notFound } from 'next/navigation';
import { fetchProductById, updateProductAction } from '../../_actions/products';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const product = await fetchProductById(id);

  if (!product) {
    notFound();
  }

  const updateWithId = updateProductAction.bind(null, id);

  return (
    <div>
      <h1 style={{ marginBottom: '16px' }}>Edit: {product.name}</h1>

      <form action={updateWithId} style={{ maxWidth: 500, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <label>
          Name *
          <input name="name" required defaultValue={product.name} style={{ display: 'block', width: '100%', padding: '6px', marginTop: '4px' }} />
        </label>

        <label>
          Tagline
          <input name="tagline" defaultValue={product.tagline ?? ''} style={{ display: 'block', width: '100%', padding: '6px', marginTop: '4px' }} />
        </label>

        <label>
          Description
          <textarea name="description" rows={3} defaultValue={product.description ?? ''} style={{ display: 'block', width: '100%', padding: '6px', marginTop: '4px' }} />
        </label>

        <label>
          Website URL
          <input name="website_url" type="url" defaultValue={product.website_url ?? ''} style={{ display: 'block', width: '100%', padding: '6px', marginTop: '4px' }} />
        </label>

        <label>
          Affiliate URL
          <input name="affiliate_url" type="url" defaultValue={product.affiliate_url ?? ''} style={{ display: 'block', width: '100%', padding: '6px', marginTop: '4px' }} />
        </label>

        <label>
          Logo URL (Cloudflare Images)
          <input name="logo_url" type="url" defaultValue={product.logo_url ?? ''} style={{ display: 'block', width: '100%', padding: '6px', marginTop: '4px' }} />
        </label>

        <label>
          Pricing Model
          <input name="pricing_model" defaultValue={product.pricing_model ?? ''} style={{ display: 'block', width: '100%', padding: '6px', marginTop: '4px' }} />
        </label>

        <label>
          Rating (1-5)
          <input name="rating" type="number" min="1" max="5" step="0.1" defaultValue={product.rating ?? ''} style={{ display: 'block', width: '100px', padding: '6px', marginTop: '4px' }} />
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
            marginTop: '8px',
          }}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

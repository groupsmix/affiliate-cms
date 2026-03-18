import { createProductAction } from '../../_actions/products';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default function NewProductPage() {
  return (
    <div>
      <h1>New Product</h1>
      <form action={createProductAction} style={{ maxWidth: 500, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <label>
          Name *
          <input name="name" required style={{ display: 'block', width: '100%', padding: '6px', marginTop: '4px' }} />
        </label>

        <label>
          Slug *
          <input
            name="slug"
            required
            pattern="[a-z0-9-]+"
            title="Lowercase letters, numbers, and hyphens only"
            style={{ display: 'block', width: '100%', padding: '6px', marginTop: '4px', fontFamily: 'monospace' }}
          />
        </label>

        <label>
          Tagline
          <input name="tagline" style={{ display: 'block', width: '100%', padding: '6px', marginTop: '4px' }} />
        </label>

        <label>
          Description
          <textarea name="description" rows={3} style={{ display: 'block', width: '100%', padding: '6px', marginTop: '4px' }} />
        </label>

        <label>
          Website URL
          <input name="website_url" type="url" style={{ display: 'block', width: '100%', padding: '6px', marginTop: '4px' }} />
        </label>

        <label>
          Affiliate URL
          <input name="affiliate_url" type="url" style={{ display: 'block', width: '100%', padding: '6px', marginTop: '4px' }} />
        </label>

        <label>
          Logo URL (Cloudflare Images)
          <input name="logo_url" type="url" style={{ display: 'block', width: '100%', padding: '6px', marginTop: '4px' }} />
        </label>

        <label>
          Pricing Model
          <input name="pricing_model" placeholder="e.g. freemium, paid, free" style={{ display: 'block', width: '100%', padding: '6px', marginTop: '4px' }} />
        </label>

        <label>
          Rating (1-5)
          <input name="rating" type="number" min="1" max="5" step="0.1" style={{ display: 'block', width: '100px', padding: '6px', marginTop: '4px' }} />
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
          Create Product
        </button>
      </form>
    </div>
  );
}

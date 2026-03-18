import { createContentAction } from '../../_actions/content';
import { fetchCategories } from '../../_actions/categories';

export const dynamic = 'force-dynamic';

export default async function NewContentPage() {
  const categories = await fetchCategories();

  return (
    <div>
      <h1>New Content</h1>
      <form action={createContentAction} style={{ maxWidth: 500, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <label>
          Title *
          <input
            name="title"
            required
            style={{ display: 'block', width: '100%', padding: '6px', marginTop: '4px' }}
          />
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
          Content Type *
          <select name="content_type" required style={{ display: 'block', width: '100%', padding: '6px', marginTop: '4px' }}>
            <option value="best">Best (Listicle)</option>
            <option value="review">Review</option>
            <option value="comparison">Comparison</option>
            <option value="problem">Problem/Solution</option>
            <option value="alternative">Alternative</option>
          </select>
        </label>

        <label>
          Category
          <select name="category_id" style={{ display: 'block', width: '100%', padding: '6px', marginTop: '4px' }}>
            <option value="">— None —</option>
            {categories.map((cat: Record<string, string>) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Primary Keyword
          <input
            name="primary_keyword"
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
            marginTop: '8px',
          }}
        >
          Create Content
        </button>
      </form>
    </div>
  );
}

import { fetchCategories, createCategoryAction, deleteCategoryAction } from '../_actions/categories';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default async function CategoriesPage() {
  const categories = await fetchCategories();

  async function handleDelete(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    await deleteCategoryAction(id);
  }

  return (
    <div>
      <h1 style={{ marginBottom: '16px' }}>Categories</h1>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '32px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
            <th style={{ padding: '8px' }}>Name</th>
            <th style={{ padding: '8px' }}>Slug</th>
            <th style={{ padding: '8px' }}>Description</th>
            <th style={{ padding: '8px' }}></th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 && (
            <tr>
              <td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: '#888' }}>
                No categories yet.
              </td>
            </tr>
          )}
          {categories.map((cat: Record<string, string>) => (
            <tr key={cat.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '8px' }}>{cat.name}</td>
              <td style={{ padding: '8px', fontFamily: 'monospace', fontSize: '13px' }}>{cat.slug}</td>
              <td style={{ padding: '8px', color: '#666' }}>{cat.description || '—'}</td>
              <td style={{ padding: '8px' }}>
                <form action={handleDelete}>
                  <input type="hidden" name="id" value={cat.id} />
                  <button type="submit" style={{ color: '#dc3545', background: 'none', border: 'none', cursor: 'pointer' }}>
                    Delete
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginBottom: '12px' }}>Add Category</h2>
      <form action={createCategoryAction} style={{ maxWidth: 500, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <label>
          Name *
          <input
            name="name"
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
          Description
          <textarea
            name="description"
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
          Add Category
        </button>
      </form>
    </div>
  );
}

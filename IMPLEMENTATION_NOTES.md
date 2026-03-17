# Affiliate CMS — Implementation Notes

## What Was Built

A Supabase-backed data foundation and minimal admin CLI for an Arabic-first affiliate content site CMS, focused on newsletter tools.

### Schema (4 tables + triggers)

| Table | Purpose |
|---|---|
| `categories` | Top-level grouping (e.g., "Email Marketing", "Newsletter Platforms") |
| `products` | Affiliate product entries with URLs, commission data, ratings |
| `content` | Articles/reviews with status workflow (draft → review → published) |
| `content_products` | Many-to-many mapping with ordering and optional custom affiliate URLs |

- `updated_at` auto-updates via triggers on `products` and `content`.
- All tables use UUID primary keys.
- Slugs are unique and indexed for fast lookups.

### Folder Structure

```
affiliate-cms/
├── supabase/migrations/
│   ├── 000_full_schema.sql        # All-in-one schema (convenience)
│   ├── 001_create_categories.sql
│   ├── 002_create_products.sql
│   ├── 003_create_content.sql
│   ├── 004_create_content_products.sql
│   └── 005_create_triggers.sql
├── src/
│   ├── types/index.ts             # TypeScript types matching schema
│   ├── lib/
│   │   ├── supabase.ts            # Supabase client init
│   │   ├── migrate.ts             # Lightweight migration runner
│   │   └── dal/                   # Data Access Layer
│   │       ├── index.ts           # Barrel export
│   │       ├── categories.ts      # CRUD for categories
│   │       ├── products.ts        # CRUD + filters for products
│   │       ├── content.ts         # CRUD + status workflow for content
│   │       └── content-products.ts # Product-content mapping
│   └── admin/                     # CLI admin scripts
│       ├── categories.ts
│       ├── products.ts
│       ├── content.ts
│       └── content-products.ts
├── .env.example
├── package.json
└── tsconfig.json
```

### Data Access Layer

Each DAL module provides:
- **CRUD**: create, get (by ID and slug), list (with filters), update, delete
- **Products**: filter by category, featured, active status
- **Content**: filter by status, type, category, language, featured; status workflow helpers (`publishContent`, `unpublishContent`, `setContentStatus`)
- **Content-Products**: link/unlink products, bulk-set products for content, query in both directions

### Admin CLI

Each admin script is a minimal CLI that maps to DAL functions:

```bash
npm run admin:categories -- list
npm run admin:categories -- create "أدوات البريد" email-tools "أدوات إرسال البريد الإلكتروني"
npm run admin:products -- create '{"name":"Mailchimp","slug":"mailchimp","website_url":"https://mailchimp.com","affiliate_url":"https://aff.link/mc"}'
npm run admin:content -- publish <content-id>
npm run admin:content-products -- link <content-id> <product-id> hero 1
```

### Status Workflow

Content follows: `draft` → `review` → `published`
- `publishContent(id)` sets status to `published` and auto-stamps `published_at`
- `unpublishContent(id)` reverts to `draft`
- `setContentStatus(id, status)` for arbitrary transitions

### Setup

1. Copy `.env.example` to `.env` and fill in Supabase credentials
2. `npm install`
3. Run migrations via Supabase CLI (`supabase db push`) or the SQL editor using `000_full_schema.sql`
4. Use admin CLI scripts to manage data

### Design Decisions

- **No ORM**: Direct Supabase client calls — lean, no abstraction overhead
- **CLI over UI**: Fastest path to a working admin; UI can be layered on later
- **Barrel exports**: DAL re-exports from `src/lib/dal/index.ts` for clean imports
- **Typed inserts/updates**: `Omit`-based types prevent accidentally setting auto-generated fields
- **Language default `ar`**: Arabic-first, but the field is open for future locales
- **Modular migrations**: Individual files for incremental setup; `000_full_schema.sql` for fresh installs

### Future Extensions

- RLS (Row Level Security) policies for public vs. admin access
- Supabase Edge Functions for API endpoints
- Frontend admin UI (Next.js or similar)
- Image upload via Supabase Storage
- Full-text search on content
- Analytics/click tracking on affiliate URLs

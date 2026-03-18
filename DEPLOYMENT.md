# Deployment Notes

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `SUPABASE_URL` | Yes | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes (production) | Service role key for server-side operations |
| `SUPABASE_ANON_KEY` | Fallback | Used if service role key is not set |
| `ADMIN_SECRET` | Yes | Secret token to access `/admin` routes |

## Setup

1. Copy `.env.example` to `.env` and fill in values
2. Generate a strong `ADMIN_SECRET`: `openssl rand -hex 32`
3. Run all migrations in order against your Supabase database:
   - `000_full_schema.sql` (or individual `001`-`005`)
   - `006_create_click_events.sql`
   - `007_add_structured_content.sql`
4. `npm install`

## Development

```bash
npm run dev
```

Open `http://localhost:3000/admin/content?token=YOUR_ADMIN_SECRET` to authenticate.
The admin cookie persists for 30 days.

## Production Build

```bash
npm run build
npm start
```

## Admin Access

All `/admin/*` routes are protected by the `ADMIN_SECRET` middleware.

To authenticate:
1. Visit any admin URL with `?token=YOUR_ADMIN_SECRET` appended
2. A secure HTTP-only cookie is set for 30 days
3. Subsequent visits don't need the token parameter

## Affiliate Click Tracking

- Outbound clicks go through `/go/{product-slug}`
- Optional `?from=/source-path` parameter tracks click origin
- Click events are logged to `click_events` table (non-blocking)
- View click logs at `/admin/clicks`

## CLI Admin Tools

The original CLI tools still work:

```bash
npm run admin:categories -- list
npm run admin:products -- create '{"name":"...","slug":"...","website_url":"...","affiliate_url":"..."}'
npm run admin:content -- publish <content-id>
```

Use `tsconfig.cli.json` for CLI builds: `npm run build:cli`

## What is Production-Ready

- Admin route protection via token-based auth
- Input validation on all server actions
- HTML content sanitization (safe allowlist)
- Structured content support (FAQ, pros, cons, sub-ratings)
- Affiliate click logging (non-blocking)
- Error handling with clear messages
- Empty states in all list views

## Intentionally Out of Scope

- Multi-user auth / role-based access
- Full-text search
- Content filtering / sorting in UI
- Rich text editor
- Image upload
- Analytics dashboard / charts
- Comments system
- RLS policies (use service role key for admin)

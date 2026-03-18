import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

/**
 * Image upload endpoint using Cloudflare Images API.
 *
 * Requires environment variables:
 *   CF_ACCOUNT_ID — Cloudflare account ID
 *   CF_IMAGES_TOKEN — Cloudflare Images API token
 *
 * Accepts multipart/form-data with a "file" field.
 * Returns { url: string } on success.
 */
export async function POST(request: NextRequest) {
  const accountId = process.env.CF_ACCOUNT_ID;
  const token = process.env.CF_IMAGES_TOKEN;

  if (!accountId || !token) {
    return NextResponse.json(
      { error: 'Cloudflare Images not configured. Set CF_ACCOUNT_ID and CF_IMAGES_TOKEN.' },
      { status: 500 },
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Forward to Cloudflare Images API
    const cfForm = new FormData();
    cfForm.append('file', file);

    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: cfForm,
      },
    );

    const result = await res.json();

    if (!result.success) {
      return NextResponse.json(
        { error: result.errors?.[0]?.message || 'Upload failed' },
        { status: 500 },
      );
    }

    // Return the public delivery URL
    const variants = result.result?.variants || [];
    const url = variants[0] || result.result?.id;

    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

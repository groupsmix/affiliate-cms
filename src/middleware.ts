import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const adminSecret = process.env.ADMIN_SECRET;

  if (!adminSecret) {
    return new NextResponse('ADMIN_SECRET not configured', { status: 500 });
  }

  const cookie = request.cookies.get('admin_token');

  if (cookie?.value === adminSecret) {
    return NextResponse.next();
  }

  const token = request.nextUrl.searchParams.get('token');

  if (token === adminSecret) {
    const url = new URL(request.nextUrl.pathname, request.url);
    const response = NextResponse.redirect(url);
    response.cookies.set('admin_token', adminSecret, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/admin',
      maxAge: 60 * 60 * 24 * 30,
    });
    return response;
  }

  return new NextResponse('Unauthorized. Append ?token=YOUR_ADMIN_SECRET to access admin.', {
    status: 401,
    headers: { 'Content-Type': 'text/plain' },
  });
}

export const config = {
  matcher: ['/admin/:path*'],
};

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/sitemap.xml') {
    return NextResponse.rewrite(new URL('/seo?sitemap=1', request.url))
  }

  if (pathname === '/robots.txt') {
    return NextResponse.rewrite(new URL('/seo?robots=1', request.url))
  }

  const googleVerificationRegex = /^\/google([a-zA-Z0-9_-]+)\.html$/
  const match = pathname.match(googleVerificationRegex)

  if (match) {
    // The full pathname is the filename we need. e.g. /google12345.html
    const fileName = pathname.substring(1);
    return NextResponse.rewrite(new URL(`/seo?google=${fileName}`, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/sitemap.xml', '/robots.txt', '/google*.html'],
}

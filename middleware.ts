import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Public routes that never require authentication
const PUBLIC_PATHS = ['/login', '/help', '/favicon.ico']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Ignore static assets, next internal files, and api routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const tokenCookie = request.cookies.get('razmyar_token')
  const expiresAtCookie = request.cookies.get('razmyar_expires_at')
  const roleCookie = request.cookies.get('razmyar_role')

  const now = Date.now()
  const isExpired = expiresAtCookie ? parseInt(expiresAtCookie.value, 10) <= now : true
  const isAuthenticated = Boolean(tokenCookie?.value) && !isExpired

  // 1. If user is trying to access /login while already authenticated
  if (pathname === '/login' && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // 2. Allow public paths without authentication
  if (PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    return NextResponse.next()
  }

  // 3. If accessing root '/', redirect to /dashboard (if authed) or /login (if not)
  if (pathname === '/') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 4. If user is not authenticated and trying to access protected route
  if (!isAuthenticated) {
    // If token cookie exists but was expired, redirect with expired reason
    const isSessionExpired = Boolean(tokenCookie?.value) && isExpired
    const redirectUrl = new URL('/login', request.url)
    
    if (isSessionExpired) {
      redirectUrl.searchParams.set('expired', 'true')
    } else {
      redirectUrl.searchParams.set('redirect', pathname)
    }

    const response = NextResponse.redirect(redirectUrl)
    // Clear cookies on redirect
    response.cookies.delete('razmyar_token')
    response.cookies.delete('razmyar_expires_at')
    response.cookies.delete('razmyar_role')
    return response
  }

  // 5. Role-based Route Protection (RBAC)
  // Only SUPER_ADMIN can access /super-admin routes
  if (pathname.startsWith('/super-admin')) {
    const role = roleCookie?.value
    if (role !== 'SUPER_ADMIN') {
      const unauthorizedUrl = new URL('/dashboard', request.url)
      unauthorizedUrl.searchParams.set('unauthorized', 'true')
      return NextResponse.redirect(unauthorizedUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}

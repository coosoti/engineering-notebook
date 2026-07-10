// proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const isOnAdmin = request.nextUrl.pathname.startsWith('/admin')
  const isOnLogin = request.nextUrl.pathname === '/admin/login'
  
  // Check for session cookie
  const sessionCookie = request.cookies.get('next-auth.session-token') || 
                         request.cookies.get('__Secure-next-auth.session-token')

  if (isOnAdmin && !isOnLogin && !sessionCookie) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  if (isOnLogin && sessionCookie) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

export async function proxy(request: NextRequest) {
  const session = await auth()
  const isOnAdmin = request.nextUrl.pathname.startsWith('/admin')
  const isOnLogin = request.nextUrl.pathname === '/admin/login'

  if (isOnAdmin && !isOnLogin && !session) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  if (isOnLogin && session) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
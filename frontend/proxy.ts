import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname

  const publicPaths = [
  '/',
  '/login',
  '/events',
  '/newsletter',
]

  const isPublicPath = publicPaths.includes(path)
  const token = request.cookies.get('access_token')?.value || ''

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/subscribers',
    '/newsletter/editor',
    '/profile',
  ],
}
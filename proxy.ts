import { NextResponse, type NextRequest } from 'next/server'
import { defaultLocale, getLocaleFromPathname, isLocale, withLocale } from '@/lib/i18n'
import { updateSession } from '@/lib/supabase/middleware'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const firstSegment = pathname.split('/').filter(Boolean)[0]

  if (pathname.startsWith('/admin')) {
    return await updateSession(request)
  }

  // Redirect any public route without an explicit locale prefix to the default locale.
  if (!firstSegment || !isLocale(firstSegment)) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = withLocale(defaultLocale, pathname)

    return NextResponse.redirect(redirectUrl)
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-site-locale', getLocaleFromPathname(pathname))

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|fav-icons|favicon.ico|.*\\..*).*)',
  ],
}

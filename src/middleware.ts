import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const publicPaths = ['/', '/login', '/register']

  const isPublicPath = publicPaths.includes(request.nextUrl.pathname)

  // ✅ If it's a public page and user is logged in, redirect to dashboard or books page
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/booklist', request.url))
  }


  // 🔒 If it's a protected route and user is NOT logged in
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // ✅ Otherwise, continue
  return NextResponse.next()
}

export const config = {
  matcher: ['/booklist', '/addbook', '/editbook/:path*', '/profile', '/editprofile', '/login', '/register'], // list all protected routes
};

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - _next/static (static files)
//      * - favicon.ico
//      * - images or API routes if needed
//      */
//     '/((?!_next/static|_next/image|favicon.ico|api|images).*)',
//   ],
// }





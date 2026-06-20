import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Bypass static files, internal Next.js assets, API routes, and public files with extensions
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname === "/favicon.ico" ||
    /\.(.*)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Normalize pathname by removing trailing slash (unless it is just "/")
  let path = pathname;
  if (path.endsWith("/") && path.length > 1) {
    path = path.slice(0, -1);
  }

  // Retrieve the access token from cookies
  const token = request.cookies.get("access_token")?.value;

  // Define public pages: "/", "/events", "/newsletter", and "/newsletter/[slug]"
  const isPublicPage = () => {
    if (path === "/" || path === "/events" || path === "/newsletter") {
      return true;
    }

    // Match /newsletter/[slug] where [slug] is not "editor"
    const parts = path.split("/").filter(Boolean);
    if (parts.length === 2 && parts[0] === "newsletter" && parts[1] !== "editor") {
      return true;
    }

    return false;
  };

  // 1. If the user is authenticated (has token)
  if (token) {
    // Authenticated users should not be allowed to visit the login page
    if (path === "/login") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    // Allow access to all pages (both public and protected routes like /newsletter/editor)
    return NextResponse.next();
  }

  // 2. If the user is unauthenticated (no token)
  // Allow access to "/login" page
  if (path === "/login") {
    return NextResponse.next();
  }

  // If the page is not public, redirect to the login page
  if (!isPublicPage()) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Next.js config matcher to optimize execution
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

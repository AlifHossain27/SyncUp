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

  // Check if the page is public:
  // "/", "/events", "/login", "/newsletter", and "/newsletter/[slug]"
  const isPublicPage = () => {
    if (path === "/" || path === "/events" || path === "/login" || path === "/newsletter") {
      return true;
    }

    // Match /newsletter/[slug] where [slug] is not "editor"
    const parts = path.split("/").filter(Boolean);
    if (parts.length === 2 && parts[0] === "newsletter" && parts[1] !== "editor") {
      return true;
    }

    return false;
  };

  // If the page is not public, verify authentication
  if (!isPublicPage()) {
    const token = request.cookies.get("access_token")?.value;

    if (!token) {
      // Redirect unauthorized users to the login page
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
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

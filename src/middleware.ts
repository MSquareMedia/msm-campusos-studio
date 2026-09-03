import { NextResponse, type NextRequest } from "next/server";

/**
 * Gates /admin behind HTTP Basic auth.
 *
 * Basic auth is only acceptable here because Vercel terminates TLS on every
 * deployment, so the header is never sent in clear text. The password lives in
 * ADMIN_PASSWORD and is never committed.
 *
 * Fail-closed: if ADMIN_PASSWORD is unset, /admin returns 503 rather than
 * being publicly readable. A misconfiguration must not expose the submissions
 * of everyone who filled in the form.
 */
export function middleware(request: NextRequest) {
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) {
    return new NextResponse("Admin area is not configured.", { status: 503 });
  }

  const header = request.headers.get("authorization");
  if (header?.startsWith("Basic ")) {
    let decoded = "";
    try {
      decoded = atob(header.slice(6));
    } catch {
      decoded = "";
    }
    // Username is ignored; only the password is checked.
    const supplied = decoded.slice(decoded.indexOf(":") + 1);
    if (safeEqual(supplied, expected)) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="MSM CampusOS admin", charset="UTF-8"',
    },
  });
}

/**
 * Length-independent comparison. A plain `===` on secrets returns as soon as
 * two bytes differ, which leaks the length and the matched prefix to anyone
 * timing the response.
 */
function safeEqual(a: string, b: string): boolean {
  const len = Math.max(a.length, b.length);
  let diff = a.length ^ b.length;
  for (let i = 0; i < len; i += 1) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

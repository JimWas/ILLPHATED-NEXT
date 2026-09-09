import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const previewPassword = process.env.PREVIEW_ACCESS_PASSWORD;
  if (process.env.VERCEL_ENV === "preview" && previewPassword) {
    const authorization = request.headers.get("authorization");
    let hasPreviewAccess = false;

    if (authorization?.startsWith("Basic ")) {
      try {
        const credentials = atob(authorization.slice(6));
        const separator = credentials.indexOf(":");
        const password = separator >= 0 ? credentials.slice(separator + 1) : "";
        hasPreviewAccess = password === previewPassword;
      } catch {
        // Invalid authorization falls through to the challenge.
      }
    }

    if (!hasPreviewAccess) {
      return new NextResponse("Private preview. Authentication required.", {
        status: 401,
        headers: { "WWW-Authenticate": 'Basic realm="ILLPHATED Preview", charset="UTF-8"' },
      });
    }
  }

  const hostname = request.headers.get("host")?.split(":", 1)[0]?.toLowerCase();
  if (hostname === "forum.illphated.com" && request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/boards", request.url), 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

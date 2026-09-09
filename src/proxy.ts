import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const previewPassword = process.env.PREVIEW_ACCESS_PASSWORD;
  if (process.env.VERCEL_ENV !== "preview" || !previewPassword) return NextResponse.next();

  const authorization = request.headers.get("authorization");
  if (authorization?.startsWith("Basic ")) {
    try {
      const credentials = atob(authorization.slice(6));
      const separator = credentials.indexOf(":");
      const password = separator >= 0 ? credentials.slice(separator + 1) : "";
      if (password === previewPassword) return NextResponse.next();
    } catch {
      // Invalid authorization falls through to the challenge.
    }
  }

  return new NextResponse("Private preview. Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="ILLPHATED Preview", charset="UTF-8"' },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

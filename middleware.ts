/* eslint-disable @typescript-eslint/no-unused-vars */
import { parse } from "@/lib/middleware/utils";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const config = {
    matcher: [
      /*
       * Match all paths except for:
       * 1. /api/ routes
       * 2. /_next/ (Next.js internals)
       * 3. /_proxy/ (proxies for third-party services)
       * 4. Metadata files: favicon.ico, sitemap.xml, robots.txt, manifest.webmanifest
       */
      "/((?!api/|_next/|_proxy/|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest).*)",
    ],
  };

export default async function middleware(req: NextRequest, ev: NextFetchEvent) {
    const { domain, path, key, fullKey } = parse(req);

    // Protect onboarding route
    if (path === '/onboarding') {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        
        if (!token) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
    }

    return NextResponse.next({
        request: {
            headers: req.headers,
        },
    }); 
}
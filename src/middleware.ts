/* eslint-disable @typescript-eslint/no-unused-vars */
import { parse } from "@/lib/middleware/utils";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { AppMiddleware, AxiomMiddleware } from "@/lib/middleware";

export const config = {
    matcher: [
      /*
       * Match all paths except for:
       * 1. /api/ routes
       * 2. /_next/ (Next.js internals)
       * 3. /_proxy/ (proxies for third-party services)
       * 4. Metadata files: favicon.ico, sitemap.xml, robots.txt, manifest.webmanifest
       */
      "/((?!api/|_next/|_proxy/|_static/|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest|.well-known/).*)"
    ],
};

export default async function middleware(req: NextRequest, ev: NextFetchEvent) {
    const { path } = parse(req);

    AxiomMiddleware(req, ev);

    // Páginas públicas que no requieren autenticación
    const publicPages = /^\/(login|signup|$)/; // Ruta raíz, login y signup son públicas
    console.log("Public page:", path);
    if (publicPages.test(path)) {
        console.log("Public page:", path);
        return NextResponse.next();
    }
    
    // Get user token with role information
    const token = await getToken({ 
        req, 
        secret: process.env.NEXTAUTH_SECRET 
    });
    
    
    // Si el usuario no está autenticado y la ruta no es pública, redirigir a login
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  // app middleware
  return AppMiddleware(req);

  //return NextResponse.next();
}
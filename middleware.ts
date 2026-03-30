import { NextResponse, type NextRequest } from "next/server";

export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/workspace/:path*", "/history/:path*", "/admin/:path*"],
};

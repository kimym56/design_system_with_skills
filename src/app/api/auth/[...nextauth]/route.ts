import NextAuth from "next-auth";
import type { NextRequest } from "next/server";

import { getAuthOptions } from "@/auth";

export const dynamic = "force-dynamic";

async function handler(
  request: NextRequest,
  context: { params: Promise<{ nextauth: string[] }> },
) {
  return NextAuth(request, context, getAuthOptions());
}

export { handler as GET, handler as POST };

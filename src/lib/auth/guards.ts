import { redirect } from "next/navigation";

import { getServerAuthSession } from "@/auth";

function normalizeCallbackUrl(callbackUrl: string) {
  if (callbackUrl.startsWith("/")) {
    return callbackUrl;
  }

  return "/workspace";
}

function buildSignInHref(callbackUrl: string) {
  return `/sign-in?callbackUrl=${encodeURIComponent(
    normalizeCallbackUrl(callbackUrl),
  )}`;
}

function parseAdminEmails(source: string | undefined) {
  return (source ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

export async function requireUserSession(callbackUrl: string) {
  const session = await getServerAuthSession();

  if (!session?.user) {
    redirect(buildSignInHref(callbackUrl));
  }

  return session;
}

export function isAdminEmail(email: string | null | undefined) {
  if (!email) {
    return false;
  }

  return parseAdminEmails(process.env.ADMIN_EMAILS).includes(
    email.toLowerCase(),
  );
}

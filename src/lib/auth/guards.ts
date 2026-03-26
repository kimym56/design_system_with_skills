import { redirect } from "next/navigation";

import { getServerAuthSession } from "@/auth";

function parseAdminEmails(source: string | undefined) {
  return (source ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

export async function requireUserSession() {
  const session = await getServerAuthSession();

  if (!session?.user) {
    redirect("/");
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

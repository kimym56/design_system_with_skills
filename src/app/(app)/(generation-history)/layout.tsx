import { getServerAuthSession } from "@/auth";
import { GenerationHistoryShell } from "@/components/generation-history-shell";
import { toAccountMenuUser } from "@/lib/auth/account-menu-user";

export default async function GenerationHistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  const accountUser = toAccountMenuUser(session?.user);

  return (
    <GenerationHistoryShell accountUser={accountUser}>
      {children}
    </GenerationHistoryShell>
  );
}

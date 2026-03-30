import type { Session } from "next-auth";

export type AccountMenuUser = {
  name: string | null;
  email: string | null;
  image: string | null;
};

export function toAccountMenuUser(
  user: Session["user"] | null | undefined,
): AccountMenuUser | null {
  if (!user) {
    return null;
  }

  return {
    name: user.name ?? null,
    email: user.email ?? null,
    image: user.image ?? null,
  };
}

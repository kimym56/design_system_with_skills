import { SignInRedirect } from "./sign-in-redirect";

type SignInSearchParams = Promise<{
  callbackUrl?: string | string[] | undefined;
}>;

function resolveCallbackUrl(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] || "/workspace";
  }

  if (typeof value === "string" && value.length > 0) {
    return value;
  }

  return "/workspace";
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: SignInSearchParams;
}) {
  const { callbackUrl } = await searchParams;

  return <SignInRedirect callbackUrl={resolveCallbackUrl(callbackUrl)} />;
}

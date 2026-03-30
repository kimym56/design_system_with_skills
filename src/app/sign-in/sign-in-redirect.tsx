"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SignInRedirect({ callbackUrl }: { callbackUrl: string }) {
  const hasRequestedSignIn = useRef(false);

  useEffect(() => {
    if (hasRequestedSignIn.current) {
      return;
    }

    hasRequestedSignIn.current = true;
    void signIn("google", { callbackUrl });
  }, [callbackUrl]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-6 sm:px-6">
      <Card className="w-full max-w-md shadow-[0_18px_50px_rgba(9,9,11,0.04)]">
        <CardHeader className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-primary">
            Design System AI
          </p>
          <div className="space-y-2">
            <CardTitle className="text-3xl tracking-[-0.04em]">
              Redirecting to Google
            </CardTitle>
            <CardDescription className="text-base leading-7">
              We&apos;re sending you to Google sign-in now. If nothing happens,
              continue manually.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <Button
            className="sm:flex-1"
            onClick={() => {
              void signIn("google", { callbackUrl });
            }}
            type="button"
          >
            Continue to Google
          </Button>
          <Button asChild className="sm:flex-1" variant="outline">
            <Link href="/">Back home</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}

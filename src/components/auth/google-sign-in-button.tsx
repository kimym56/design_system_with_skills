"use client";

import { signIn } from "next-auth/react";

import { Button, type ButtonProps } from "@/components/ui/button";

type GoogleSignInButtonProps = Omit<ButtonProps, "onClick" | "type"> & {
  callbackUrl: string;
};

export function GoogleSignInButton({
  callbackUrl,
  children,
  ...buttonProps
}: GoogleSignInButtonProps) {
  return (
    <Button
      {...buttonProps}
      onClick={() => {
        void signIn("google", { callbackUrl });
      }}
      type="button"
    >
      {children}
    </Button>
  );
}

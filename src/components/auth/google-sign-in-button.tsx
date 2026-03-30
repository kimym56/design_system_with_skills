"use client";

import * as React from "react";
import { signIn } from "next-auth/react";

import { Button, type ButtonProps } from "@/components/ui/button";

type GoogleSignInButtonProps = Omit<ButtonProps, "onClick" | "type"> & {
  callbackUrl: string;
};

export const GoogleSignInButton = React.forwardRef<
  HTMLButtonElement,
  GoogleSignInButtonProps
>(({ callbackUrl, children, ...buttonProps }, ref) => (
  <Button
    {...buttonProps}
    onClick={() => {
      void signIn("google", { callbackUrl });
    }}
    ref={ref}
    type="button"
  >
    {children}
  </Button>
));

GoogleSignInButton.displayName = "GoogleSignInButton";

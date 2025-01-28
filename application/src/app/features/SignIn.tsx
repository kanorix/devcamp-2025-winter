"use client";

import { Button } from "@mantine/core";
import { signIn } from "next-auth/react";

export const SignIn = () => {
  return (
    <Button onClick={() => signIn(undefined, { callbackUrl: "/scraps" })}>
      Sign in
    </Button>
  );
};

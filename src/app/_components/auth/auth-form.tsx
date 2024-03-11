"use client";

import { type getProviders, signIn } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { memo } from "react";

interface AuthFormProps {
  providers: Awaited<ReturnType<typeof getProviders>>;
}

export const AuthForm = memo(({ providers }: AuthFormProps) => {
  return (
    <>
      {Object.values(providers ?? {}).map((provider) => (
        <Button
          key={provider.id}
          onClick={() => signIn(provider.id)}
          variant={"default"}
        >
          Sign in with <strong className="ml-1">{provider.name}</strong>
        </Button>
      ))}
    </>
  );
});

AuthForm.displayName = "AuthForm";

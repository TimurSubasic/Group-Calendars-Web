"use client";

import * as React from "react";
import { OAuthStrategy } from "@clerk/types";
import { useSignIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Loading from "@/components/Loading";

export default function OauthSignIn() {
  return (
    <Suspense fallback={<Loading />}>
      <SignInInner />
    </Suspense>
  );
}

function SignInInner() {
  const { signIn } = useSignIn();

  const searchParams = useSearchParams();

  const [code, setCode] = useState<string | null>(null);

  useEffect(() => {
    const redirectUrl = searchParams.get("redirect_url");

    if (redirectUrl) {
      const decodedUrl = decodeURIComponent(redirectUrl); // step 2
      const parsedRedirectUrl = new URL(decodedUrl); // step 3
      const inviteCode = parsedRedirectUrl.searchParams.get("code"); // step 4
      setCode(inviteCode);
    }
  }, [searchParams]);

  if (code) {
    localStorage.setItem("join_code", code);
    console.log("code", code);
  }

  if (!signIn) return null;

  const signInWith = (strategy: OAuthStrategy) => {
    return (
      signIn
        .authenticateWithRedirect({
          strategy,
          redirectUrl: "/sign-in/sso-callback",
          redirectUrlComplete: "/groups",
        })
        .then((res) => {
          console.log(res);
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .catch((err: any) => {
          // See https://clerk.com/docs/custom-flows/error-handling
          // for more info on error handling
          console.log(err.errors);
          console.error(err, null, 2);
        })
    );
  };

  // Render a button for each supported OAuth provider
  // you want to add to your app. This example uses only Google.
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-5">
        <h1 className="text-3xl font-bold text-center">
          Welcome to Group Calendars
        </h1>
        <p className="text-lg text-accent-foreground text-center">
          Please sign in to continue
        </p>
        <Button
          className="flex flex-row items-center justify-center gap-5 text-xl"
          size="xl"
          onClick={() => signInWith("oauth_google")}
        >
          <p>Sign in with Google</p>
          <FcGoogle className="size-8" />
        </Button>
      </div>
    </div>
  );
}

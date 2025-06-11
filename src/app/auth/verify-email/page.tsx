"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Suspense } from "react";

export default function EmailVerified() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <EmailVerifiedContent />
    </Suspense>
  );
}

function EmailVerifiedContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your email";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight">
            Email Verified
          </h1>
          <p className="mt-2 text-center text-base text-muted-foreground">
            Your email address ({email}) has been successfully verified.
          </p>
        </div>
        
        <div className="mt-8">
          <Link 
            href="/auth/sign-in"
            className="flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Sign in to your account
          </Link>
        </div>
        
        <div className="mt-4 text-sm text-muted-foreground">
          <p>
            You can now sign in to access all features of Extract AI.
          </p>
        </div>
      </div>
    </div>
  );
} 
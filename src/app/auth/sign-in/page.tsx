"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { AlertTriangle } from "lucide-react";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [verificationNeeded, setVerificationNeeded] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const resendVerificationEmail = async () => {
    try {
      const email = unverifiedEmail || getValues("email");
      
      if (!email) {
        toast.error("Please enter an email address");
        return;
      }
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verify-email`,
        }
      });
      
      if (error) {
        toast.error(error.message || "Failed to resend verification email");
      } else {
        toast.success("Verification email sent! Please check your inbox");
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
    }
  };

  const onSubmit = async (data: SignInFormValues) => {
    setIsLoading(true);
    try {
      
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      
      if (error) {
        
        if (error.message?.includes("Email not confirmed") || 
            error.message?.includes("not verified") ||
            error.message?.includes("not confirmed")) {
          setUnverifiedEmail(data.email);
          setVerificationNeeded(true);
        } else {
          toast.error(error.message || "Failed to sign in");
        }
        setIsLoading(false);
      } else {
        
        localStorage.setItem('auth-user', JSON.stringify(authData.user));
        localStorage.setItem('auth-session', JSON.stringify(authData.session));
        
        toast.success("Sign in successful! Redirecting...");
        setRedirecting(true);
        
        
        setTimeout(() => {
          window.location.href = "/content";
        }, 1000);
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="text-center text-3xl font-bold tracking-tight">
            Sign in to Extract AI
          </h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/sign-up"
              className="font-medium text-primary hover:text-primary/90"
            >
              Sign up
            </Link>
          </p>
        </div>
        
        {redirecting ? (
          <div className="text-center p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800">Sign in successful! Redirecting to content page...</p>
            <p className="mt-2 text-sm text-green-600">
              If you're not redirected automatically, {" "}
              <a href="/content" className="font-medium underline">click here</a>
            </p>
          </div>
        ) : verificationNeeded ? (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="rounded-full bg-amber-100 p-3">
                <AlertTriangle className="h-8 w-8 text-amber-600" />
              </div>
            </div>
            
            <h2 className="text-xl font-semibold text-foreground">Email verification required</h2>
            
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-amber-800">
                Your email <span className="font-medium">{unverifiedEmail}</span> needs to be verified.
              </p>
              <p className="mt-2 text-sm text-amber-600">
                Please check your inbox for the verification link to complete your registration.
              </p>
            </div>
            
            <div className="mt-4 text-sm text-muted-foreground">
              <p className="mt-2">
                Didn't receive an email? Check your spam folder or{" "}
                <button 
                  onClick={resendVerificationEmail}
                  className="text-primary hover:underline"
                >
                  resend verification email
                </button>
              </p>
            </div>
            
            <div className="mt-4">
              <button 
                onClick={() => setVerificationNeeded(false)}
                className="text-primary hover:underline"
              >
                Return to sign in
              </button>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4 rounded-md shadow-sm">
              <div>
                <label htmlFor="email" className="block text-sm font-medium">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...register("password")}
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link
                  href="/auth/forgot-password"
                  className="font-medium text-primary hover:text-primary/90"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>
        )}
        
        
      </div>
    </div>
  );
} 
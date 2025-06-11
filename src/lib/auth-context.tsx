"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, getUser, signIn, signOut, signUp, supabase } from './supabase';

type User = {
  id: string;
  email?: string;
} | null;

type AuthContextType = {
  user: User;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    
    async function loadSession() {
      setLoading(true);
      const { data, error } = await getSession();
      
      if (data && data.session) {
        const { user, error: userError } = await getUser();
        if (user) {
          setUser(user);
        }
      }
      
      setLoading(false);
    }

    loadSession();

    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignUp = async (email: string, password: string) => {
    const { error } = await signUp(email, password);
    return { error };
  };

  const handleSignIn = async (email: string, password: string) => {
    const { error } = await signIn(email, password);
    if (!error) {
      
      window.location.href = "/content";
    }
    return { error };
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      
      window.location.href = "/auth/sign-in";
    }
    return { error };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp: handleSignUp,
        signIn: handleSignIn,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 
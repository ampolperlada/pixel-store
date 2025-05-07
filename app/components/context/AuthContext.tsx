// app/components/context/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { useSession, signIn, signOut } from 'next-auth/react';

type CustomUser = {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  wallet_address?: string;
};

type AuthResponse = {
  user: CustomUser | null;
  session: Session | null;
};

type AuthContextType = {
  user: CustomUser | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (credentials: { email: string; password: string }) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  refreshUser: () => Promise<CustomUser | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  // Get NextAuth session
  const { data: nextAuthSession, status: nextAuthStatus } = useSession();

  // Updated refreshUser implementation per the requirements
  const refreshUser = async () => {
    try {
      // Fetch user data from API endpoint
      const response = await fetch("/api/auth/me");
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        return userData;
      }
      return null;
    } catch (error) {
      console.error("Failed to refresh user data:", error);
      return null;
    }
  };

  // This function gets user data from Supabase
  const refreshUserFromSupabase = async () => {
    setLoading(true);
    try {
      const { data: { user: supabaseUser }, error } = await supabase.auth.getUser();
      
      if (error) throw error;
      
      if (supabaseUser) {
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email ?? '',
          name: supabaseUser.user_metadata?.name,
          avatar: supabaseUser.user_metadata?.avatar_url,
          wallet_address: supabaseUser.user_metadata?.wallet_address,
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = async () => {
    setLoading(true);
    try {
      // Check Supabase session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? '',
          name: session.user.user_metadata?.name,
          avatar: session.user.user_metadata?.avatar_url,
          wallet_address: session.user.user_metadata?.wallet_address,
        });
      } else if (nextAuthStatus === 'authenticated' && nextAuthSession?.user) {
        // If no Supabase session but NextAuth session exists, use NextAuth data
        setUser({
          id: nextAuthSession.user.id || '',
          email: nextAuthSession.user.email || '',
          name: nextAuthSession.user.name || '',
          avatar: nextAuthSession.user.image || '',
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Effect to watch for NextAuth session changes
  useEffect(() => {
    if (nextAuthStatus === 'authenticated' && nextAuthSession?.user) {
      // When NextAuth authenticates, update our user state
      setUser({
        id: nextAuthSession.user.id || '',
        email: nextAuthSession.user.email || '',
        name: nextAuthSession.user.name || '',
        avatar: nextAuthSession.user.image || '',
      });
      setLoading(false);
    } else if (nextAuthStatus === 'unauthenticated') {
      // Only set user to null if there's no Supabase session either
      checkAuth();
    }
  }, [nextAuthStatus, nextAuthSession]);

  // Effect to watch for Supabase auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? '',
          name: session.user.user_metadata?.name,
          avatar: session.user.user_metadata?.avatar_url,
          wallet_address: session.user.user_metadata?.wallet_address,
        });
      } else {
        // Only set user to null if there's no NextAuth session
        if (nextAuthStatus !== 'authenticated') {
          setUser(null);
        }
      }
      setLoading(false);
    });

    checkAuth();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    setLoading(true);
    try {
      // First authenticate with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) throw error;

      if (data.user) {
        // Then authenticate with NextAuth
        const result = await signIn('credentials', {
          redirect: false,
          email: credentials.email,
          password: credentials.password,
        });

        if (result?.error) {
          console.warn("NextAuth login failed, but Supabase login succeeded:", result.error);
        }

        setUser({
          id: data.user.id,
          email: data.user.email ?? '',
          name: data.user.user_metadata?.name,
          avatar: data.user.user_metadata?.avatar_url,
          wallet_address: data.user.user_metadata?.wallet_address,
        });
        
        router.push('/profile');
        router.refresh(); // Force refresh to update UI state
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            name: credentials.email.split('@')[0], // Default name
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        const customUser: CustomUser = {
          id: data.user.id,
          email: data.user.email ?? '',
          name: data.user.user_metadata?.name,
        };
        
        // Also sign in with NextAuth
        await signIn('credentials', {
          redirect: false,
          email: credentials.email,
          password: credentials.password,
        });
        
        setUser(customUser);
        router.refresh(); // Force refresh to update UI state
        
        return {
          user: customUser,
          session: data.session
        };
      }
      
      return {
        user: null,
        session: null
      };
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      // Sign out from both auth systems
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Sign out from NextAuth
      await signOut({ redirect: false });
      
      setUser(null);
      router.push('/');
      router.refresh(); // Force refresh to update UI state
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshAuth = async () => {
    await checkAuth();
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
        register, 
        logout, 
        refreshAuth,
        refreshUser 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
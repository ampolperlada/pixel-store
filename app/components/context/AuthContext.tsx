// app/components/context/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { useSession, signIn, signOut } from 'next-auth/react';

// Updated user type to explicitly include wallet information
type CustomUser = {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  wallet_address?: string | null;
  is_wallet_connected?: boolean;
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
  const { data: nextAuthSession, status: nextAuthStatus } = useSession();

  // Helper function to fetch wallet data
  const fetchUserWallet = async (userId: string) => {
    if (!userId) {
      console.warn('No user ID provided for wallet fetch');
      return {
        wallet_address: null,
        is_connected: false
      };
    }

    try {
      console.log(`Fetching wallet for user ${userId}`);
      
      const { data, error } = await supabase
        .from('user_wallets')
        .select('wallet_address, is_connected')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Detailed Supabase wallet fetch error:', error);
        throw error;
      }

      console.log('Wallet data retrieved:', data);
      return {
        wallet_address: data?.wallet_address || null,
        is_connected: data?.is_connected || false
      };
    } catch (error) {
      console.error('Unexpected error in fetchUserWallet:', error);
      return {
        wallet_address: null,
        is_connected: false
      };
    }
  };
  
  const refreshUser = async () => {
    try {
      setLoading(true);
      
      const response = await fetch("/api/auth/me");
      
      if (response.ok) {
        const userData = await response.json();
        const { wallet_address, is_connected } = await fetchUserWallet(userData.id);
        
        const updatedUser = {
          ...userData,
          wallet_address,
          is_wallet_connected: is_connected
        };
        
        setUser(updatedUser);
        return updatedUser;
      }
      
      const { data: { user: supabaseUser }, error } = await supabase.auth.getUser();
      
      if (error) throw error;
      
      if (supabaseUser) {
        const { wallet_address, is_connected } = await fetchUserWallet(supabaseUser.id);
        
        const updatedUser = {
          id: supabaseUser.id,
          email: supabaseUser.email ?? '',
          name: supabaseUser.user_metadata?.name,
          avatar: supabaseUser.user_metadata?.avatar_url,
          wallet_address: wallet_address || supabaseUser.user_metadata?.wallet_address || null,
          is_wallet_connected: is_connected
        };
        
        setUser(updatedUser);
        return updatedUser;
      }
      
      return null;
    } catch (error) {
      console.error("Failed to refresh user data:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const refreshUserFromSupabase = async () => {
    setLoading(true);
    try {
      const { data: { user: supabaseUser }, error } = await supabase.auth.getUser();
      
      if (error) throw error;
      
      if (supabaseUser) {
        const { wallet_address, is_connected } = await fetchUserWallet(supabaseUser.id);
        
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email ?? '',
          name: supabaseUser.user_metadata?.name,
          avatar: supabaseUser.user_metadata?.avatar_url,
          wallet_address: wallet_address || supabaseUser.user_metadata?.wallet_address || null,
          is_wallet_connected: is_connected
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
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      if (session?.user) {
        const { wallet_address, is_connected } = await fetchUserWallet(session.user.id);
        
        setUser({
          id: session.user.id,
          email: session.user.email ?? '',
          name: session.user.user_metadata?.name,
          avatar: session.user.user_metadata?.avatar_url,
          wallet_address: wallet_address || session.user.user_metadata?.wallet_address || null,
          is_wallet_connected: is_connected
        });
      } else if (nextAuthStatus === 'authenticated' && nextAuthSession?.user) {
        const { wallet_address, is_connected } = await fetchUserWallet(nextAuthSession.user.id);
        
        setUser({
          id: nextAuthSession.user.id || '',
          email: nextAuthSession.user.email || '',
          name: nextAuthSession.user.name || '',
          avatar: nextAuthSession.user.image || '',
          wallet_address,
          is_wallet_connected: is_connected
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

  useEffect(() => {
    if (nextAuthStatus === 'authenticated' && nextAuthSession?.user) {
      (async () => {
        const { wallet_address, is_connected } = await fetchUserWallet(nextAuthSession.user.id);
        
        setUser({
          id: nextAuthSession.user.id || '',
          email: nextAuthSession.user.email || '',
          name: nextAuthSession.user.name || '',
          avatar: nextAuthSession.user.image || '',
          wallet_address,
          is_wallet_connected: is_connected
        });
        
        setLoading(false);
      })();
    } else if (nextAuthStatus === 'unauthenticated') {
      checkAuth();
    }
  }, [nextAuthStatus, nextAuthSession]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { wallet_address, is_connected } = await fetchUserWallet(session.user.id);
        
        setUser({
          id: session.user.id,
          email: session.user.email ?? '',
          name: session.user.user_metadata?.name,
          avatar: session.user.user_metadata?.avatar_url,
          wallet_address: wallet_address || session.user.user_metadata?.wallet_address || null,
          is_wallet_connected: is_connected
        });
      } else {
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) throw error;

      if (data.user) {
        const result = await signIn('credentials', {
          redirect: false,
          email: credentials.email,
          password: credentials.password,
        });

        if (result?.error) {
          console.warn("NextAuth login failed, but Supabase login succeeded:", result.error);
        }

        const { wallet_address, is_connected } = await fetchUserWallet(data.user.id);

        setUser({
          id: data.user.id,
          email: data.user.email ?? '',
          name: data.user.user_metadata?.name,
          avatar: data.user.user_metadata?.avatar_url,
          wallet_address: wallet_address || data.user.user_metadata?.wallet_address || null,
          is_wallet_connected: is_connected
        });
        
        router.push('/profile');
        router.refresh();
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
            name: credentials.email.split('@')[0],
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
        
        await signIn('credentials', {
          redirect: false,
          email: credentials.email,
          password: credentials.password,
        });
        
        setUser(customUser);
        router.refresh();
        
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
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      await signOut({ redirect: false });
      
      setUser(null);
      router.push('/');
      router.refresh();
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
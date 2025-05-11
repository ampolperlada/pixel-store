// app/components/context/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { useSession, signIn, signOut } from 'next-auth/react';

interface User {
  id: string;
  email: string;
  name?: string;
  username?: string;
  avatar?: string;
  profile_image_url?: string;
  wallet_address: string | null;
  is_wallet_connected: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (credentials: { email: string; password: string }) => Promise<{
    user: User | null;
    session: Session | null;
  }>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
  connectWallet: (walletAddress: string) => Promise<void>;
  disconnectWallet: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { data: nextAuthSession, status: nextAuthStatus } = useSession();

  const fetchUserWallet = async (userId: string) => {
    if (!userId) {
      console.warn('No user ID provided for wallet fetch');
      return {
        wallet_address: null,
        is_connected: false
      };
    }

    try {
      const { data, error } = await supabase
        .from('user_wallets')
        .select('wallet_address, is_connected')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching wallet data:', error);
        return {
          wallet_address: null,
          is_connected: false
        };
      }

      // If no wallet data found, return default values
      if (!data) {
        return {
          wallet_address: null,
          is_connected: false
        };
      }

      return {
        wallet_address: data.wallet_address || null,
        is_connected: data.is_connected || false
      };
    } catch (error) {
      console.error('Exception fetching wallet:', error);
      return {
        wallet_address: null,
        is_connected: false
      };
    }
  };

  const fetchUserData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (nextAuthStatus === 'authenticated' && nextAuthSession?.user) {
        // Try to get wallet info, but don't fail if it doesn't exist
        const { wallet_address, is_connected } = await fetchUserWallet(nextAuthSession.user.id);
        
        setUser({
          id: nextAuthSession.user.id,
          email: nextAuthSession.user.email || '',
          name: nextAuthSession.user.name || '',
          username: nextAuthSession.user.name || '',
          avatar: nextAuthSession.user.image || '',
          profile_image_url: nextAuthSession.user.image || '',
          wallet_address,
          is_wallet_connected: is_connected
        });
        return user;
      }

      const { data: { user: supabaseUser }, error: supabaseError } = await supabase.auth.getUser();
      
      if (supabaseError) {
        console.error('Supabase auth error:', supabaseError);
        setUser(null);
        return null;
      }
      
      if (supabaseUser) {
        // Try to get wallet info, but don't fail if it doesn't exist
        const { wallet_address, is_connected } = await fetchUserWallet(supabaseUser.id);
        
        const userData = {
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          name: supabaseUser.user_metadata?.name || '',
          username: supabaseUser.user_metadata?.username || '',
          avatar: supabaseUser.user_metadata?.avatar_url || '',
          profile_image_url: supabaseUser.user_metadata?.avatar_url || '',
          wallet_address,
          is_wallet_connected: is_connected
        };
        
        setUser(userData);
        return userData;
      } else {
        setUser(null);
        return null;
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (nextAuthStatus === 'loading') return;
    fetchUserData();
  }, [nextAuthStatus, nextAuthSession]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchUserData();
      } else {
        if (nextAuthStatus !== 'authenticated') {
          setUser(null);
        }
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    setLoading(true);
    setError(null);
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

        await fetchUserData();
        router.push('/profile');
        router.refresh();
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (credentials: { email: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            name: credentials.email.split('@')[0],
            username: credentials.email.split('@')[0],
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        const newUser: User = {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name || '',
          username: data.user.user_metadata?.username || '',
          wallet_address: null,
          is_wallet_connected: false
        };
        
        await signIn('credentials', {
          redirect: false,
          email: credentials.email,
          password: credentials.password,
        });
        
        setUser(newUser);
        router.refresh();
        
        return {
          user: newUser,
          session: data.session
        };
      }
      
      return {
        user: null,
        session: null
      };
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      await signOut({ redirect: false });
      
      setUser(null);
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error('Logout failed:', err);
      setError(err instanceof Error ? err.message : 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  const refreshAuth = async () => {
    await fetchUserData();
  };

  const refreshUser = async () => {
    return fetchUserData();
  };

  const connectWallet = async (walletAddress: string) => {
    if (!user) throw new Error('User not authenticated');
    
    setLoading(true);
    setError(null);
    try {
      // Call the API route directly instead of using Supabase client-side
      const response = await fetch("/api/connect-wallet", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletAddress }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData?.message || `Failed to connect wallet (Status: ${response.status})`);
      }
      
      // Update local state after successful API call
      await fetchUserData();
    } catch (err) {
      console.error('Wallet connection failed:', err);
      setError(err instanceof Error ? err.message : 'Wallet connection failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = async () => {
    if (!user) throw new Error('User not authenticated');
    
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('user_wallets')
        .update({
          wallet_address: null,
          is_connected: false
        })
        .eq('user_id', user.id);

      if (error) throw error;

      // Also update the user's record in the database
      const userUpdateResult = await supabase
        .from('users')
        .update({
          wallet_address: null,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (userUpdateResult.error) {
        console.error('Error updating user record:', userUpdateResult.error);
      }

      await fetchUserData();
    } catch (err) {
      console.error('Wallet disconnection failed:', err);
      setError(err instanceof Error ? err.message : 'Wallet disconnection failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        error,
        login, 
        register, 
        logout, 
        refreshAuth,
        refreshUser,
        connectWallet,
        disconnectWallet
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
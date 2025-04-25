// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { supabase } from '../../../lib/supabase';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile"
        }
      }
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          // Validate credentials
          if (!credentials?.username || !credentials?.password) {
            throw new Error("Both username and password are required");
          }
    
          console.log('Attempting login for username:', credentials.username);
          
          // 1. Find user by username with enhanced debugging
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id, email, auth_user_id')
            .eq('username', credentials.username)
            .maybeSingle();
    
          console.log('User lookup results:', { userData, userError });
    
          if (userError) {
            console.error('Database error:', userError);
            throw new Error("Service temporarily unavailable");
          }
    
          if (!userData) {
            console.warn('No user found for username:', credentials.username);
            throw new Error("Invalid username or password");
          }
    
          if (!userData.email) {
            console.error('User record missing email:', userData);
            throw new Error("Account configuration error");
          }
    
          // 2. Authenticate with Supabase
          console.log('Attempting authentication for email:', userData.email);
          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: userData.email,
            password: credentials.password,
          });
    
          console.log('Authentication results:', { authData, authError });
    
          if (authError) {
            // Handle specific Supabase auth errors
            if (authError.message.includes('Invalid login credentials')) {
              throw new Error("Invalid username or password");
            }
            throw new Error(`Authentication failed: ${authError.message}`);
          }
    
          if (!authData?.user) {
            throw new Error("Authentication failed - no user data returned");
          }
    
          // 3. Verify user IDs match if using separate tables
          if (userData.auth_user_id && userData.auth_user_id !== authData.user.id) {
            console.error('User ID mismatch:', {
              localId: userData.auth_user_id,
              authId: authData.user.id
            });
            throw new Error("Account verification failed");
          }
    
          return {
            id: authData.user.id,
            email: authData.user.email,
            name: credentials.username,
            image: authData.user.user_metadata?.avatar_url
          };
    
        } catch (error) {
          console.error("Authentication error:", error);
          throw error; // Rethrow to show error in UI
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      console.log("Sign in attempt:", { user, provider: account?.provider });
      
      if (account?.provider === 'google') {
        try {
          // Existing Google OAuth flow remains unchanged
          const { data, error: checkError } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              queryParams: {
                access_type: 'offline',
                prompt: 'consent',
              },
            }
          });

          const existingUser = null;
          
          if (checkError) {
            try {
              const response = await fetch(`${process.env.NEXTAUTH_URL}/api/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  username: user.name,
                  email: user.email,
                  password: '',
                  wallet_address: null,
                  agreedToTerms: true,
                  profile_image_url: user.image,
                  isGoogleSignup: true
                }),
              });
              
              if (!response.ok) {
                console.error("Signup API error:", await response.text());
                return false;
              }
            } catch (error) {
              console.error("Detailed error in Google signup callback:", error);
              return false;
            }
          }
          
          return true;
        } catch (error) {
          console.error("Error during Google auth:", error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (token && token.sub) {
        session.user = {
          ...session.user,
          id: token.sub
        };
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    }
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  }
});

export { handler as GET, handler as POST };
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
        username: { label: "Username", type: "text" }, // Changed from email to username
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.username || !credentials?.password) {
            return null;
          }
          
          // 1. First find the user by username in your public.users table
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('username', credentials.username)
            .single();

          if (userError || !userData) {
            throw new Error(userError?.message || "User not found");
          }

          // 2. Now authenticate with Supabase using the email we found
          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: userData.email, // Use the email from the users table
            password: credentials.password,
          });

          if (authError) throw authError;
          
          if (authData.user) {
            return {
              id: authData.user.id,
              email: authData.user.email,
              name: credentials.username, // Return the username as name
              image: authData.user.user_metadata?.avatar_url
            };
          }
          
          return null;
        } catch (error) {
          console.error("Auth error:", error);
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
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
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }
          
          // Authenticate with Supabase
          const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          });
          
          if (error) throw error;
          
          if (data.user) {
            return {
              id: data.user.id,
              email: data.user.email,
              name: data.user.user_metadata?.name || data.user.email?.split('@')[0],
              image: data.user.user_metadata?.avatar_url
            };
          }
          
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      console.log("Sign in attempt:", { user: user.email, provider: account?.provider });
      
      if (account?.provider === 'google') {
        try {
          // First check if this Google user already exists in Supabase
          const { data, error: checkError } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              queryParams: {
                access_type: 'offline',
                prompt: 'consent',
              },
            }
          });

          const existingUser = null; // Adjust logic as needed since 'user' is not part of the returned data
          
          if (checkError) {
            // If no existing user, create one
            try {
              // Make a request to your signup API endpoint
              const response = await fetch(`${process.env.NEXTAUTH_URL}/api/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  username: user.name, // Use name from Google as username
                  email: user.email,
                  password: '', // No password for Google signup
                  wallet_address: null, // Can be updated later
                  agreedToTerms: true, // This should be checked before initiating Google signin
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
    signIn: '/', // Redirect to home page after sign in
    error: '/', // Redirect to home page on error
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt', // Use JWT for session handling
  }
});



// Export the handler functions for App Router
export { handler as GET, handler as POST };
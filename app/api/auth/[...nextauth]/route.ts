// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { SupabaseAdapter } from '@next-auth/supabase-adapter';
import jwt from 'jsonwebtoken';
import type { JWT } from 'next-auth/jwt';

// Add proper typing for the session
interface SessionWithSupabase extends DefaultSession {
  user: {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
  };
  supabaseToken?: string;
}

interface DefaultSession {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

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
  ],
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  callbacks: {
    async signIn({ user, account }) {
      console.log("Sign in attempt:", { user: user.email, provider: account?.provider });
      
      if (account?.provider === 'google') {
        try {
          // Generate a Supabase-compatible JWT
          const supabaseToken = jwt.sign(
            {
              aud: 'authenticated',
              exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour expiration
              sub: user.id,
              email: user.email,
              role: 'authenticated',
              app_metadata: { provider: 'google' },
              user_metadata: {
                name: user.name,
                avatar_url: user.image
              }
            },
            process.env.SUPABASE_JWT_SECRET!,
            { algorithm: 'HS256' }
          );

          // Store the Supabase token in the account object
          account.supabase_token = supabaseToken;

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
              isGoogleSignup: true,
              supabase_token: supabaseToken
            }),
          });
          
          if (!response.ok) {
            console.error("Signup API error:", await response.text());
            return false;
          }
          
          return true;
        } catch (error) {
          console.error("Detailed error in Google signup callback:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, account, user }) {
      // Persist the Supabase token to the JWT
      if (account?.supabase_token) {
        token.supabaseToken = String(account.supabase_token);
      }
      
      // Add user info to token
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      
      return token;
    },
    async session({ session, token }) {
      // Type cast to our extended session type
      const typedSession = session as SessionWithSupabase;
      
      // Send Supabase token to client
      typedSession.supabaseToken = token.supabaseToken as string;
      
      // Add user info to session
      if (token) {
        // Make sure the user object exists
        if (!typedSession.user) {
          typedSession.user = {
            id: '',
            email: '',
          };
        }
        
        typedSession.user.id = token.id as string;
        typedSession.user.name = token.name as string;
        typedSession.user.email = token.email as string;
        typedSession.user.image = token.image as string;
      }
      
      return typedSession;
    },
    async redirect({ url, baseUrl }) {
      // Handle redirects to clean up the URL
      // This prevents the callbackUrl parameter from persisting
      if (url.startsWith(baseUrl)) {
        // For same-origin URLs, just return the pathname without query params
        // This removes the callbackUrl from the URL
        const parsedUrl = new URL(url);
        
        // If we're on the homepage with the callback parameter
        if (parsedUrl.pathname === '/' && parsedUrl.searchParams.has('callbackUrl')) {
          return baseUrl; // Return just the base URL without params
        }
        
        return url;
      }
      // For external URLs, or if no callbackUrl exists, return as is
      return baseUrl;
    }
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  session: {
    strategy: 'jwt', // Required for Supabase integration
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
});

export { handler as GET, handler as POST };
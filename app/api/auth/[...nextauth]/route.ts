// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { SupabaseAdapter } from '@next-auth/supabase-adapter';
import jwt from 'jsonwebtoken';

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
      // Send Supabase token to client
      if (!session.user) {
        session.user = {};
      }
      
      session.supabaseToken = token.supabaseToken;
      
      // Add user info to session
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.image;
      }
      
      return session;
    },
    // This is what fixes the URL issue
    async redirect({ url, baseUrl }) {
      // If the URL is the same origin
      if (url.startsWith(baseUrl)) {
        // For callback with the unwanted callbackUrl parameter
        if (url.includes('callbackUrl=')) {
          // Strip querystring and just return base URL
          return baseUrl;
        }
        return url;
      }
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
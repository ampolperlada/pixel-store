import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

// Simplified version that doesn't fail when database is down
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'dummy',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Return null when database is paused - this prevents errors
        console.log('[Auth] Database paused - auth disabled for demo');
        return null;
      }
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || 'demo-secret-change-in-production',
  pages: {
    signIn: '/login',
    error: '/login'
  },
  debug: false, // Disable debug to reduce errors in console
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
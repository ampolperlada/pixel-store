import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { supabase } from '../../../lib/supabase';

async function checkDatabaseHealth() {
  try {
    const { data, error } = await supabase.rpc('health');
    if (error) throw error;
    console.log('[HealthCheck] Database is healthy');
    return true;
  } catch (error) {
    console.error('[HealthCheck] Database check failed:', error);
    return false;
  }
}

let isDatabaseHealthy = true;
const refreshHealthStatus = async () => {
  isDatabaseHealthy = await checkDatabaseHealth();
};
refreshHealthStatus();
setInterval(refreshHealthStatus, 5 * 60 * 1000);

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
          scope: 'openid email profile'
        }
      }
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        console.log('[Auth] Authorization started');
        
        if (!credentials?.username?.trim() || !credentials?.password) {
          console.log('[Auth] Missing credentials');
          throw new Error('Username and password are required');
        }
      
        const usernameInput = credentials.username.trim().toLowerCase();
        const passwordInput = credentials.password.trim();
      
        try {
          // 1. First try with case-insensitive search
          console.log('[Auth] Trying case-insensitive username search');
          let { data: users, error } = await supabase
            .from('users')
            .select('*')
            .ilike('username', `%${usernameInput}%`);
      
          if (error) throw error;
          
          // 2. If no results, try direct ID lookup (temporary debug)
          if (!users || users.length === 0) {
            console.log('[Auth] Trying direct ID lookup for debugging');
            const { data: debugUser } = await supabase
              .from('users')
              .select('*')
              .eq('user_id', 10);
            console.log('[Auth] Debug user lookup result:', debugUser);
            users = debugUser;
          }
      
          // 3. Verify we found exactly one user
          if (!users || users.length !== 1) {
            console.log('[Auth] User not found or multiple users found');
            throw new Error('Invalid credentials');
          }
      
          const user = users[0];
          console.log('[Auth] User found:', { 
            id: user.user_id,
            username: user.username 
          });
      
          // 4. Verify password
          if (!user.password_hash) {
            console.error('[Auth] No password hash found');
            throw new Error('Invalid credentials');
          }
      
          const isValid = await bcrypt.compare(passwordInput, user.password_hash);
          console.log('[Auth] Password comparison result:', isValid);
          
          if (!isValid) throw new Error('Invalid credentials');
      
          return {
            id: user.user_id.toString(),
            name: user.username,
            email: user.email
          };
      
        } catch (err) {
          console.error('[Auth] Full error:', err);
          throw new Error('Authentication failed');
        }
      }
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login?error=CredentialsSignin'
  }
});

export { handler as GET, handler as POST };
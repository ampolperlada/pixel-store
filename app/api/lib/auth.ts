import { AuthOptions, Session } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from 'bcrypt'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const TABLE = 'users'

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required");
          }

          // Fetch user from Supabase
          const userRes = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}?select=*&email=eq.${encodeURIComponent(credentials.email)}`, {
            headers: {
              'apikey': SUPABASE_KEY,
              'Authorization': `Bearer ${SUPABASE_KEY}`
            }
          });

          const users = await userRes.json();
          const user = users[0];

          if (!user || !user.password_hash) {
            throw new Error("User not found");
          }

          // Compare passwords
          const isValid = await bcrypt.compare(credentials.password, user.password_hash);
          if (!isValid) {
            throw new Error("Invalid credentials");
          }

          return {
            id: user.id,
            name: user.username,
            email: user.email,
            image: user.profile_image_url,
            walletAddress: user.wallet_address,
            // Add any additional user fields you need
          };

        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin"
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id,
          email: token.email,
          name: token.name,
          image: token.picture,
          walletAddress: token.walletAddress
        } as Session["user"];
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        token.walletAddress = user.walletAddress;
      }
      return token;
    },
  }
}
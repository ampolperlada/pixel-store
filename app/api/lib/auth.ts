import { AuthOptions, Session } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        try {
          // Add your actual authentication logic here
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required")
          }

          // Replace this with your real user lookup logic
          // This is just a hardcoded example
          if (credentials.email === "admin@admin.com" && 
              credentials.password === "admin") {
            return { 
              id: "1", 
              name: "Admin", 
              email: "admin@admin.com",
              // Add any additional user fields you need
            }
          }

          // If authentication fails
          throw new Error("Invalid credentials")
        } catch (error) {
          console.error("Authentication error:", error)
          // Return null to indicate failure
          return null
        }
      }
    })
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin" // Add error page redirect
  },
  session: {
    strategy: "jwt", // Recommended for CredentialsProvider
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development", // Enable debug in development
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id,
          email: token.email,
        } as Session["user"];
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      return token
    },
  }
}
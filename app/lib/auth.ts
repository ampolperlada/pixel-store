import { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Replace with your real logic
        if (credentials?.email === "admin@admin.com" && credentials?.password === "admin") {
          return { id: "1", name: "Admin", email: "admin@admin.com" }
        }
        return null
      }
    })
  ],
  pages: {
    signIn: "/auth/signin" // optional, if you have a custom login page
  },
  secret: process.env.NEXTAUTH_SECRET
}

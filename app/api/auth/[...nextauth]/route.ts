// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

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
  callbacks: {
    async signIn({ user, account }) {
      console.log("Sign in attempt:", { user: user.email, provider: account?.provider });
      
      if (account?.provider === 'google') {
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
          
          return true;
        } catch (error) {
          console.error("Detailed error in Google signup callback:", error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      return session;
    },
  },
  pages: {
    signIn: '/', // Redirect to home page after sign in
    error: '/', // Redirect to home page on error
  },
  secret: process.env.NEXTAUTH_SECRET,
});

// Export the handler functions for App Router
export { handler as GET, handler as POST };
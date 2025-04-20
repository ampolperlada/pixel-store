import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
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
            return false;
          }
          
          return true;
        } catch (error) {
          console.error("Error in Google signup callback:", error);
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
});
// lib/auth.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"; // Fixed spelling
import clientPromise from "./mongodb"; // Using @ alias

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }) // Removed semicolon inside object
  ], // Fixed array bracket
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.NEXTAUTH_SECRET as string, // Fixed slash to dot
};

export default NextAuth(authOptions);
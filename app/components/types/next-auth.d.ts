// types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Extend the built-in session types
   */
  interface Session {
    user: {
      /** The user's unique ID */
      id: string;
      /** Wallet address if connected */
      walletAddress?: string | null;
      /** Whether the wallet is connected */
      isWalletConnected?: boolean;
    } & DefaultSession["user"];
  }

  /**
   * Extend the built-in user types
   */
  interface User {
    /** Wallet address if connected */
    walletAddress?: string | null;
    /** Whether the wallet is connected */
    isWalletConnected?: boolean;
    /** Whether the user selected "Remember Me" */
    rememberMe?: boolean;
  }
}

declare module "next-auth/jwt" {
  /**
   * Extend the built-in JWT types
   */
  interface JWT {
    /** Wallet address if connected */
    walletAddress?: string | null;
    /** Whether the wallet is connected */
    isWalletConnected?: boolean;
  }
}
// utils/auth-utils.ts
import * as bcrypt from 'bcrypt';

/**
 * Hashes a password using bcrypt
 * @param password The plain text password to hash
 * @returns Promise resolving to the hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Compares a plain text password with a hashed password
 * @param password The plain text password to check
 * @param hashedPassword The hashed password to compare against
 * @returns Promise resolving to a boolean indicating if the passwords match
 */
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Generates a secure random token (useful for verification, password reset, etc.)
 * @param length The length of the token to generate
 * @returns A secure random token string
 */
export function generateToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  const randomValues = new Uint8Array(length);
  window.crypto.getRandomValues(randomValues);
  
  for (let i = 0; i < length; i++) {
    token += chars.charAt(randomValues[i] % chars.length);
  }
  
  return token;
}
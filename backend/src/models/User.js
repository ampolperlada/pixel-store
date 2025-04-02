import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";

// Create a new user with hashed password
async function createUser(email, password) {
  const hashedPassword = await bcrypt.hash(password, 12);
  return await prisma.user.create({
    data: { email, password: hashedPassword },
  });
}

// Find user by email
async function getUserByEmail(email) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

// Find user by ID (Added this function to fix the error)
async function getUserById(id) {
  return await prisma.user.findUnique({
    where: { id },
  });
}

// Compare password function
async function comparePassword(inputPassword, hashedPassword) {
  return await bcrypt.compare(inputPassword, hashedPassword);
}

// Export all functions
export { createUser, getUserByEmail, getUserById, comparePassword };

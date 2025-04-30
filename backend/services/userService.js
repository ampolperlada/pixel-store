// src/services/userService.js
import prisma from "../config/db.js";
import bcrypt from "bcryptjs";

// Create a new user with hashed password (Prisma)
export async function createPrismaUser(email, password) {
  const hashedPassword = await bcrypt.hash(password, 12);
  return await prisma.user.create({
    data: { email, password: hashedPassword },
  });
}

// Find user by email (Prisma)
export async function getPrismaUserByEmail(email) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

// Find user by ID (Prisma)
export async function getPrismaUserById(id) {
  return await prisma.user.findUnique({
    where: { id },
  });
}

// Compare password function
export async function comparePassword(inputPassword, hashedPassword) {
  return await bcrypt.compare(inputPassword, hashedPassword);
}
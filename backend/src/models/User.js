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

// Compare password function
async function comparePassword(inputPassword, hashedPassword) {
  return await bcrypt.compare(inputPassword, hashedPassword);
}

export { createUser, getUserByEmail, comparePassword };

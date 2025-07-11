import prisma from "./prisma";
import { User as dbUser } from "@prisma/client";

// Create a new user
export const createUser = async (
  name: string,
  email: string
): Promise<dbUser> => {
  return await prisma.user.create({
    data: {
      name,
      email,
    },
  });
};

// Get all users
export const getUsers = async (): Promise<dbUser[]> => {
  return await prisma.user.findMany();
};

// Get a user by ID
export const getUserById = async (id: string): Promise<dbUser | null> => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

// Upsert a user
export const upsertUser = async ({
  email,
  name,
  image,
}: any): Promise<dbUser> => {
  return await prisma.user.upsert({
    where: { email },
    create: {
      email,
      name,
      avatar: image,
    },
    update: {
      name,
      avatar: image,
    },
  });
};

import prisma from "./prisma";
import { User } from "@prisma/client";

// Create a new user
export const createUser = async (
  name: string,
  email: string
): Promise<User> => {
  return await prisma.user.create({
    data: {
      name,
      email,
    },
  });
};

// Get all users
export const getUsers = async (): Promise<User[]> => {
  return await prisma.user.findMany();
};

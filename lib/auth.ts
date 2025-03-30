import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { upsertUser } from "./userAPI";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    // Credentials({
    //   credentials: {
    //     email: {},
    //     password: {},
    //     name: {},
    //   },
    //   authorize: async (credentials) => {
    //     const { email, password } = credentials;

    //     const testUser = {
    //       email: "jack@test.com",
    //       password: "password",
    //     };

    //     if (email === testUser.email && password === testUser.password) {
    //       return { email, password };
    //     }

    //     throw new Error("Please enter your email and password");
    //   },
    // }),
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user?.email) {
        throw new Error("No user found");
      }

      await upsertUser(user);

      return true;
    },
  },
});

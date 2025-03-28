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
    async signIn({ profile }) {
      if (!profile?.email) {
        throw new Error("No profile");
      }

      const user = {
        email: profile.email,
        name: profile.name || "",
      };

      console.log("User profile:", user);

      const { email } = await upsertUser(user.email, user.name);

      console.log("User upserted:", email);

      return true;
    },
  },
});

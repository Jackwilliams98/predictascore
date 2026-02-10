import NextAuth, { NextAuthConfig } from "next-auth";
import { upsertUser } from "./userAPI";
import GoogleProvider from "next-auth/providers/google";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

export const authOptions: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user }) {
      if (!user?.email) {
        throw new Error("No user found");
      }

      const dbUser = await upsertUser(user);

      user.id = dbUser.id;
      user.role = dbUser.role;

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id;
      }
      if (token?.role) {
        session.user.role = token.role;
      }
      return session;
    },
  },
};

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authOptions,
});

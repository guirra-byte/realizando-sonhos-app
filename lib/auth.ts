import { allowedEmails } from "@/can-access";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    signIn: async ({ user }) => {
      const canAccess = allowedEmails(user?.email);
      if (!canAccess) return false;
      return true;
    },
  },
  pages: { signIn: "/auth/login" },
});

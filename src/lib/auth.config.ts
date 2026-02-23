import type { NextAuthConfig } from "next-auth";

// Edge ランタイム（middleware）でも使える設定
// Prisma等のNode.js専用モジュールをimportしてはいけない
export const authConfig: NextAuthConfig = {
  providers: [],
  callbacks: {
    session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};

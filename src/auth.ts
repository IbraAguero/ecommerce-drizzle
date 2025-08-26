import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "./schemas/auth";
import { db } from "./db";
import { users } from "./db/tables";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const { data, success } = loginSchema.safeParse(credentials);

        if (!success) {
          throw new Error("Credenciales invalidas");
        }

        const { email, password } = data;

        const [findUser] = await db
          .select()
          .from(users)
          .where(eq(users.email, email));

        if (!findUser || !findUser.password) {
          throw new Error("Credenciales invalidas");
        }

        const isValid = bcrypt.compare(findUser.password, password);

        if (!isValid) {
          throw new Error("Credenciales invalidas");
        }

        return findUser;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.id = user.id;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});

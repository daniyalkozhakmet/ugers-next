import NextAuth, {
  AuthOptions,
  RequestInternal,
  SessionStrategy,
} from "next-auth";
import type { NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials";
// Your own logic for dealing with plaintext password strings; be careful!
import bcrypt from "bcryptjs";
import connect from "@/utils/db";
import User from "@/app/models/User";
export const authOptions: AuthOptions = {
  providers: [
    Credentials({
      name: "credentials",
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: { type: "email" },
        password: { type: "text" },
      },
      authorize: async (credentials) => {
        if (credentials) {

          await connect();
          let user = null;

          // logic to verify if user exists
          user = await User.findOne({ email: credentials.email });

          if (!user) {
            // No user found, so this is their first attempt to login
            // meaning this is also the place you could do registration
            throw new Error("Неправильные данные");
          }
          const validPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!validPassword) {
            throw new Error("Неправильные данные");
          }

          // return user object with the their profile data
          return user;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          role: token.role,
          res: token.res,
          id: token.id,
        },
      };
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        return {
          ...token,
          role: user.role,
          res: user.role == "user" ? user.res : null,
          id: user._id.toString(),
        };
      }

      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV == "development",
};
 const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

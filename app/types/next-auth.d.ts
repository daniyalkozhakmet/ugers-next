import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: User & DefaultSession["user"];
  }
  interface User {
    role: any | null;
    res: any | null;
    _id: any | null;
  }
}

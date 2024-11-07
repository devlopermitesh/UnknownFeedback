import NextAuth from "next-auth/next";
import { Authoptions } from "./options";
const handler=NextAuth(Authoptions);
export {handler as GET, handler as POST}
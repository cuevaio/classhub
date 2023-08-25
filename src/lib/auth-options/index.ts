import type { NextAuthOptions } from "next-auth";

import EmailProvider from "next-auth/providers/email";
import { XataAdapter } from "@auth/xata-adapter";

import { sendVerificationRequest } from "./sendVerificationRequest";
import { generateVerificationToken } from "./generateVerificationToken";

import { getXataClient } from "@/lib/xata";
const xata = getXataClient();

export const authOptions: NextAuthOptions = {
  // @ts-ignore
  adapter: XataAdapter(xata),
  providers: [
    EmailProvider({
      sendVerificationRequest,
      generateVerificationToken,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify",
  },
};

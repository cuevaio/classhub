import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth-options";

export const getAuthSession = async () => {
  const session = await getServerSession(authOptions);

  return session;
};

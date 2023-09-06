import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getXataClient } from "@/lib/xata";
const xata = getXataClient();

export const getMyEmailOrThrow = async () => {
  const session_token = cookies().get(
    process.env.VERCEL === "1"
      ? "__Secure-next-auth.session-token"
      : "next-auth.session-token"
  )?.value;

  if (!session_token) {
    throw new Error("No session token");
  }

  const raw_session = await xata.db.nextauth_sessions
    .select(["*", "user.email"])
    .filter({ sessionToken: session_token })
    .getFirstOrThrow();

  const email = raw_session.user?.email ?? null;

  if (!email) {
    throw new Error("No valid session token");
  }

  return email;
};

export const getMyEmail = async () => {
  try {
    const email = await getMyEmailOrThrow();
    return email;
  } catch (error) {
    return null;
  }
};

export const getMyEmailOrSignIn = async () => {
  try {
    const email = await getMyEmailOrThrow();
    return email;
  } catch (error) {
    redirect("/auth/signin");
  }
};

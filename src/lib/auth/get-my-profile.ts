import { cache } from "react";
import { redirect } from "next/navigation";

import { getMyEmailOrThrow } from "./get-my-email";

import { getXataClient } from "@/lib/xata";
const xata = getXataClient();

export const getMyProfileOrThrow = cache(async () => {
  const email = await getMyEmailOrThrow();
  const profile = await xata.db.profile
    .select(["*", "school.*"])
    .filter({ email })
    .getFirstOrThrow();
  return profile;
});

export const getMyProfileOrConfigure = cache(async () => {
  try {
    const profile = await getMyProfileOrThrow();
    return profile;
  } catch (error) {
    redirect("/settings");
  }
});

export const getMyProfile = cache(async () => {
  try {
    const profile = await getMyProfileOrThrow();
    return profile;
  } catch (error) {
    return null;
  }
});

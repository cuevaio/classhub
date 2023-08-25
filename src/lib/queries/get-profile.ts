import { cache } from "react";
import { notFound } from "next/navigation";

import { getXataClient } from "@/lib/xata";
let xata = getXataClient();

export const getProfile = cache(async (handle: string | undefined | null) => {
  try {
    const profile = await xata.db.profile.filter({ handle }).getFirstOrThrow();
    return profile;
  } catch (error) {
    notFound();
  }
});

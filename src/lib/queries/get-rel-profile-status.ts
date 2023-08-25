import { cache } from "react";
import { notFound } from "next/navigation";

import { getXataClient } from "@/lib/xata";
let xata = getXataClient();

import { getMyProfile } from "../auth/get-my-profile";

export const getRelProfileStatus = cache(
  async (status_id: string | undefined | null) => {
    try {
      if (!status_id) throw new Error("No status id provided");

      const profile = await getMyProfile();
      if (!profile) throw new Error("Not logged in");

      const rel_profile_status = await xata.db.rel_profile_status
        .filter({ "status.id": status_id })
        .getFirstOrThrow();

      return {
        like: rel_profile_status.like,
      };
    } catch (error) {
      return null;
    }
  }
);

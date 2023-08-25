"use server";
import { getMyProfileOrThrow } from "@/lib/auth/get-my-profile";
import { getXataClient } from "@/lib/xata";
const xata = getXataClient();
async function getStatusStats(status_id: string) {
  try {
    const profile = await getMyProfileOrThrow();
    const status = await xata.db.status.readOrThrow(status_id);

    const rel_profile_status = await xata.db.rel_profile_status
      .filter({
        profile: profile.id,
        status: status.id,
      })
      .getFirst();

    return {
      like_count: status.like_count,
      is_liked: rel_profile_status?.like ?? false,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export { getStatusStats };

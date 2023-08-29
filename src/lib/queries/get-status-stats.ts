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
      is_liked: rel_profile_status?.like ?? false,
      is_saved: rel_profile_status?.save ?? false,
      is_quoted: rel_profile_status?.quote_count
        ? rel_profile_status.quote_count > 0
        : false,
      is_replied: rel_profile_status?.reply_count
        ? rel_profile_status.reply_count > 0
        : false,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export { getStatusStats };

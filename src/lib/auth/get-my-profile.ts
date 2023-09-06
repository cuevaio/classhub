import { getMyEmailOrThrow } from "./get-my-email";

import { getXataClient } from "@/lib/xata";
const xata = getXataClient();

export const getMyProfileOrThrow = async () => {
  const email = await getMyEmailOrThrow();
  const profile = await xata.db.profile
    .select([
      "bio",
      "profile_picture",
      "name",
      "handle",
      "follower_count",
      "like_count",
      "following_count",
      "email",
      "embedding",
      "school.handle",
    ])
    .filter({ email })
    .getFirstOrThrow();
  return profile;
};

export const getMyProfile = async () => {
  try {
    const profile = await getMyProfileOrThrow();
    return profile;
  } catch (error) {
    return null;
  }
};

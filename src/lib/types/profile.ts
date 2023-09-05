import { SelectedPick } from "@xata.io/client";

import { type ProfileRecord } from "@/lib/xata";

export type Profile = SelectedPick<
  ProfileRecord,
  [
    "bio",
    "profile_picture",
    "name",
    "handle",
    "follower_count",
    "like_count",
    "following_count",
    "school.handle",
    "email"
  ]
>;

import { SelectedPick } from "@xata.io/client";

import { type ProfileRecord } from "@/lib/xata";

export type Profile = SelectedPick<
  ProfileRecord,
  [
    "*",
    "school.*",
    "xata.createdAt"
  ]
>;

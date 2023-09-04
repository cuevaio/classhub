import { SelectedPick } from "@xata.io/client";

import { type StatusRecord } from "@/lib/xata";

export type Status = SelectedPick<
  StatusRecord,
  [
    "*",
    "author_profile.*",
    "quote_from.*",
    "quote_from.author_profile.*",
    "xata.createdAt"
  ]
>;

import { cache } from "react";

import { getXataClient } from "@/lib/xata";
let xata = getXataClient();

const getStatus = cache(async (id: string | undefined | null) => {
  if (!id) return null;
  const status = await xata.db.status.read(id, [
    "*",
    "author_profile.*",
    "quote_from.*",
    "quote_from.author_profile.*",
    "xata.createdAt",
  ]);

  return status;
});

export { getStatus };

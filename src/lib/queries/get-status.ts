import { cache } from "react";

import { getXataClient } from "@/lib/xata";
let xata = getXataClient();

const getStatus = cache(async (id: string | undefined | null) => {
  if (!id) return null;
  const status = await xata.db.status.read(id, ["*", "author_profile.*"]);

  return status;
});

export { getStatus };

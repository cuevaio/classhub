import { StatusCard } from "@/components/status";
import { getXataClient } from "@/lib/xata";

let xata = getXataClient();

const SimilarStatuses = async ({
  status_id,
  status_embedding,
}: {
  status_id: string;
  status_embedding: number[];
}) => {
  let raw_statuses = await xata.db.status.vectorSearch(
    "embedding",
    status_embedding,
    {
      size: 11,
    }
  );

  let statuses = await xata.db.status
    .select([
      "*",
      "author_profile.*",
      "quote_from.*",
      "quote_from.author_profile.*",
      "xata.createdAt",
    ])
    .filter({
      id: {
        $any: raw_statuses
          .filter((status) => status.id !== status_id)
          .map(({ id }) => id),
      },
    })
    .getAll();

  return (
    <div className="grid grid-cols-1 gap-4">
      {statuses.map((status) => (
        <StatusCard status={status} key={status.id} />
      ))}
    </div>
  );
};

export { SimilarStatuses };

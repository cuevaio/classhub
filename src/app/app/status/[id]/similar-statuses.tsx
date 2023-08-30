import { StatusCard } from "@/components/status";
import { getXataClient, StatusRecord } from "@/lib/xata";
import { SelectedPick } from "@xata.io/client";

let xata = getXataClient();

const SimilarStatuses = async ({
  status_id,
  status_embedding,
}: {
  status_id: string;
  status_embedding: number[];
}) => {
  let statuses = await xata.db.status.vectorSearch(
    "embedding",
    status_embedding,
    {
      size: 11,
    }
  );

  statuses = statuses.filter((status) => status.id !== status_id);

  let authors = await xata.db.profile
    .select(["*"])
    .filter({
      id: {
        $any: statuses.map(
          ({ author_profile }) => author_profile?.id as string
        ),
      },
    })
    .getAll();

  let statuses_ = statuses.map(
    (status) =>
      ({
        ...status,
        author_profile: authors.find(
          (author) => author.id === status.author_profile?.id
        ),
      } as SelectedPick<StatusRecord, ["*", "author_profile.*"]>)
  );

  return (
    <div className="grid grid-cols-1 gap-4">
      {statuses_.map((status) => (
        <StatusCard status={status} key={status.id} />
      ))}
    </div>
  );
};

export { SimilarStatuses };

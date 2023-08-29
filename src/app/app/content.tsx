import { StatusCard } from "@/components/status";
import { getXataClient } from "@/lib/xata";

const xata = getXataClient();

export const Content = async () => {
  const statuses = await xata.db.status
    .select(["*", "author_profile.*"])
    .sort("xata.createdAt", "desc")
    .sort("like_count", "desc")
    .getMany();

  return (
    <div className="grid grid-cols-1 gap-4">
      {statuses.map((status) => (
        <StatusCard status={status} key={status.id} />
      ))}
    </div>
  );
};

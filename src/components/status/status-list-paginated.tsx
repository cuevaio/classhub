import { Page, SelectedPick } from "@xata.io/client";

import { StatusRecord } from "@/lib/xata";
import { Separator } from "@/components/ui/separator";
import { StatusCard } from ".";

const StatusListPaginated = ({
  page,
}: {
  page: Page<
    StatusRecord,
    SelectedPick<StatusRecord, ("author_profile.*" | "*")[]>
  >;
}) => {
  return (
    <div className="flex flex-col">
      {page.records.map((status) => (
        <>
          <StatusCard key={status.id} status={status} />
          <Separator className="my-4" />
        </>
      ))}
    </div>
  );
};

export { StatusListPaginated };

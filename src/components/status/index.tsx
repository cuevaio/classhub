import * as React from "react";
import { SelectedPick } from "@xata.io/client";

import { StatusRecord } from "@/lib/xata";
import { Separator } from "@/components/ui/separator";
import { StatusCard } from "./status-card";

const StatusList = ({
  statuses,
}: {
  statuses: SelectedPick<StatusRecord, ["*", "author_profile.*"]>[];
}) => {
  return (
    <div className="flex flex-col">
      {statuses.map((status) => (
        <>
          <StatusCard key={status.id} status={status} />
          <Separator key={status.id + "sep"}  className="my-4" />
        </>
      ))}
    </div>
  );
};

export { StatusList };

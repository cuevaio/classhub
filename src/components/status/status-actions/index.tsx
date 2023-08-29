import { SelectedPick } from "@xata.io/client";
import { StatusRecord } from "@/lib/xata";
import { LikeAction } from "./like-button";

import { getStatusStats } from "@/lib/queries/get-status-stats";

import { Reply } from "./reply";
import { StatusBody } from "../status-body";
import { Quote } from "./quote";

const StatusActions = async ({
  status,
}: {
  status: SelectedPick<StatusRecord, ["*", "author_profile.*"]>;
}) => {
  const statusStats = await getStatusStats(status.id);

  return (
    <div className="flex gap-4">
      <Reply
        status_id={status.id}
        initial_is_replied={statusStats.is_replied}
        initial_reply_count={status.reply_count}
      >
        <StatusBody className="ml-4 mt-4 border-l py-2 pl-4 text-sm text-muted-foreground">
          {status.body}
        </StatusBody>
      </Reply>

      <Quote
        status_id={status.id}
        initial_is_quoted={statusStats.is_quoted}
        initial_quote_count={status.quote_count}
      >
        <StatusBody className="ml-4 mt-4 border-l py-2 pl-4 text-sm text-muted-foreground">
          {status.body}
        </StatusBody>
      </Quote>
      <LikeAction
        status_id={status.id}
        like_count={status.like_count}
        is_liked={statusStats.is_liked}
      />
    </div>
  );
};

export { StatusActions };

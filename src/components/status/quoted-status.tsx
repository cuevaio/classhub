import { StatusBody } from "./status-body";
import { anonymous } from "@/lib/defaults/anonymous";
import { ProfileAvatarHoverCard } from "../profile/profile-avatar";
import { ProfileHoverCard } from "../profile/profile-hover-card";
import { DateHoverCard } from "../date-hover-card";

import { SelectedPick } from "@xata.io/client";

import { type ProfileRecord, StatusRecord } from "@/lib/xata";

const QuotedStatus = ({
  status,
}: {
  status: SelectedPick<StatusRecord, ["*", "author_profile.*"]>;
}) => {
  const author_profile = (status?.author_profile as ProfileRecord) || anonymous;

  return (
    <div className="flex mt-2 space-x-4 p-2 mr-8 -ml-4 bg-muted/20 hover:bg-muted/40 border rounded-lg">
      <div className="grow-0">
        <div className="flex items-center">
          <ProfileAvatarHoverCard profile={author_profile} size="small" />
        </div>
      </div>

      <div>
        <div className="flex flex-wrap items-center gap-x-2">
          <ProfileHoverCard
            profile={author_profile}
            className="text-xs font-bold hover:underline"
          >
            {author_profile.name}
          </ProfileHoverCard>
          <ProfileHoverCard profile={author_profile} className="text-xs">
            @{author_profile.handle}
          </ProfileHoverCard>
          {status.xata.createdAt && (
            <DateHoverCard
              status_id={status.id}
              date={status.xata.createdAt}
              className="text-xs"
            />
          )}
        </div>
        <StatusBody status_id={status.id}>{status.body}</StatusBody>
      </div>
    </div>
  );
};

export { QuotedStatus };

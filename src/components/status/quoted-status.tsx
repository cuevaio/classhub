import { ProfileRecord } from "@/lib/xata";
import { StatusBody } from "./status-body";
import { anonymous } from "@/lib/defaults/anonymous";
import { getStatus } from "@/lib/queries/get-status";
import { ProfileAvatarHoverCard } from "../profile/profile-avatar";
import { ProfileHoverCard } from "../profile/profile-hover-card";
import { DateHoverCard } from "../date-hover-card";

const QuotedStatus = async ({ id }: { id: string | null }) => {
  if (!id) return null;
  const status = await getStatus(id);
  const author_profile = (status?.author_profile as ProfileRecord) || anonymous;
  if (!status) return null;

  return (
    <div className="my-2 flex space-x-4 p-2 mr-8 -ml-4 hover:bg-muted/30 border rounded-lg">
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

import { SelectedPick } from "@xata.io/client";

import { type ProfileRecord, StatusRecord } from "@/lib/xata";
import { DateHoverCard } from "@/components/date-hover-card";
import { ProfileAvatarHoverCard } from "@/components/profile/profile-avatar";
import { ProfileHoverCard } from "@/components/profile/profile-hover-card";
import { StatusActions } from "./status-actions";
import { StatusBody } from "./status-body";
import { anonymous } from "@/lib/defaults/anonymous";
import { QuotedStatus } from "./quoted-status";
import { QuoteStatus, StatusWithQuote } from "@/lib/types/status";
import { type Profile } from "@/lib/types/profile";

const StatusCard = ({ status }: { status: StatusWithQuote }) => {
  const author_profile = (status.author_profile as Profile) || anonymous;
  if (!status.body) return null;

  return (
    <div className="relative bg-muted/20 p-2 rounded-lg border hover:bg-muted/40">
      <div className="flex gap-4 mb-1">
        <div className="flex flex-col">
          <div className="flex items-center">
            <ProfileAvatarHoverCard profile={author_profile} />
          </div>
        </div>

        <div className="flex grow flex-col">
          <div className="flex flex-wrap items-center gap-x-2">
            <ProfileHoverCard
              profile={author_profile}
              className="text-sm font-bold hover:underline"
            >
              {author_profile.name}
            </ProfileHoverCard>
            <ProfileHoverCard profile={author_profile} className="text-sm">
              @{author_profile.handle}
            </ProfileHoverCard>
            {status.xata.createdAt && (
              <DateHoverCard
                status_id={status.id}
                date={status.xata.createdAt}
                className="text-sm"
              />
            )}
          </div>
          <StatusBody status_id={status.id}>{status.body}</StatusBody>
          {status.quote_from && (
            <QuotedStatus status={status.quote_from as QuoteStatus} />
          )}
        </div>
      </div>
      <StatusActions
        id={status.id}
        like_count={status.like_count}
        reply_count={status.reply_count}
        quote_count={status.quote_count}
        body={status.body}
      />
    </div>
  );
};

export { StatusCard };

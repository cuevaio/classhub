import { DateHoverCard } from "@/components/date-hover-card";
import { ProfileAvatarHoverCard } from "@/components/profile/profile-avatar";
import { ProfileHoverCard } from "@/components/profile/profile-hover-card";
import { StatusActions } from "./status-actions";
import { StatusBody } from "./status-body";
import { anonymous } from "@/lib/defaults/anonymous";
import { QuotedStatus } from "./quoted-status";
import { QuoteStatus, StatusWithQuote } from "@/lib/types/status";
import { type Profile } from "@/lib/types/profile";
import { cn } from "@/utils/cn";
import { Images } from "./images";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  status: StatusWithQuote;
}

const StatusCard = ({ status, className }: Props) => {
  const author_profile = (status.author_profile as Profile) || anonymous;
  if (!status.body) return null;

  return (
    <div
      className={cn(
        "relative bg-muted/30 p-2 rounded-lg border hover:bg-muted/50",
        className
      )}
    >
      <div className="flex gap-4 mb-1">
        <div className="flex flex-col">
          <div className="flex items-center">
            <ProfileAvatarHoverCard profile={author_profile} />
          </div>
        </div>

        <div className="space-y-1">
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
          {status.images?.records.length > 0 && (
            <Images images={status.images.records} />
          )}
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

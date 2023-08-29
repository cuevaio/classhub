import { SelectedPick } from "@xata.io/client";

import { cn } from "@/utils/cn";
import { type ProfileRecord, StatusRecord } from "@/lib/xata";
import { DateHoverCard } from "@/components/date-hover-card";
import { ProfileAvatarHoverCard } from "@/components/profile/profile-avatar";
import { ProfileHoverCard } from "@/components/profile/profile-hover-card";
import { StatusActions } from "./status-actions";
import { StatusBody } from "./status-body";
import { anonymous } from "@/lib/defaults/anonymous";
import { Suspense } from "react";
import { StatusActionsFallback } from "./status-actions/fallback";
import { QuotedStatus } from "./quoted-status";

const StatusCard = async ({
  status,
}: {
  status: SelectedPick<StatusRecord, ["*", "author_profile.*"]>;
}) => {
  const author_profile = (status.author_profile as ProfileRecord) || anonymous;

  return (
    <div>
      <div className="flex gap-4">
        <div className="flex flex-col">
          <div className="flex items-center">
            <div
              className={cn(
                "h-0.5 w-4 bg-muted",
                !status.quote_from && "bg-transparent"
              )}
            ></div>
            <ProfileAvatarHoverCard profile={author_profile} />
          </div>
        </div>
        <div
          className={cn(
            "-mb-10 -ml-[5.5rem] mt-7 border-l-[2px] border-l-muted pb-6 pl-[5.5rem]",
            !status.quote_from && "border-l-transparent"
          )}
        >
          <div className="-mt-7 flex grow flex-col">
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
                  date={status.xata.createdAt}
                  className="text-sm"
                />
              )}
            </div>
            <div className="text-muted"></div>
            <StatusBody className="pb-4">{status.body}</StatusBody>
          </div>
        </div>
      </div>

      <Suspense>
        <QuotedStatus id={status.quote_from?.id ?? null} />
      </Suspense>

      <Suspense fallback={StatusActionsFallback(status)}>
        <StatusActions status={status} />
      </Suspense>
    </div>
  );
};

export { StatusCard };

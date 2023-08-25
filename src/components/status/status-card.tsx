import Link from "next/link";
import { SelectedPick } from "@xata.io/client";

import { getStatus } from "@/lib/queries/get-status";
import { cn } from "@/utils/cn";
import { type ProfileRecord, StatusRecord } from "@/lib/xata";
import { DateHoverCard } from "@/components/date-hover-card";
import { ProfileAvatarHoverCard } from "@/components/profile/profile-avatar";
import { ProfileHoverCard } from "@/components/profile/profile-hover-card";
import { StatusActions } from "./status-actions";
import { StatusDynamicBody } from "./status-dynamic-body";
import { anonymous } from "@/lib/defaults/anonymous";

const StatusCard = async ({
  status,
}: {
  status: SelectedPick<StatusRecord, ["*", "author_profile.*"]>;
}) => {
  const author_profile = (status.author_profile as ProfileRecord) || anonymous;

  const quoted_status = await getStatus(status.quote_from?.id);
  const quoted_author_profile =
    (quoted_status?.author_profile as ProfileRecord) || anonymous;

  return (
    <div>
      <div className="flex gap-4">
        <div className="flex flex-col">
          <div className="flex items-center">
            <div
              className={cn(
                "h-0.5 w-4 bg-muted",
                !quoted_status && "bg-transparent"
              )}
            ></div>
            <ProfileAvatarHoverCard profile={author_profile} />
          </div>
        </div>
        <div
          className={cn(
            "-mb-10 -ml-[5.5rem] mt-7 border-l-[2px] border-l-muted pb-6 pl-[5.5rem]",
            !quoted_status && "border-l-transparent"
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
            <StatusDynamicBody className="pb-4">
              {status.body}
            </StatusDynamicBody>
          </div>
        </div>
      </div>
      {quoted_status && quoted_author_profile?.id && (
        <div className="mt-4 mb-2 flex space-x-4">
          <div className="grow-0">
            <div className="flex items-center">
              <div className="h-0.5 w-16 bg-muted"></div>
              <ProfileAvatarHoverCard
                profile={quoted_author_profile}
                size="small"
              />
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-x-2">
              <ProfileHoverCard
                profile={quoted_author_profile}
                className="text-xs font-bold hover:underline"
              >
                {quoted_author_profile.name}
              </ProfileHoverCard>
              <ProfileHoverCard
                profile={quoted_author_profile}
                className="text-xs"
              >
                @{quoted_author_profile.handle}
              </ProfileHoverCard>
              {quoted_status.xata.createdAt && (
                <DateHoverCard
                  date={quoted_status.xata.createdAt}
                  className="text-xs"
                />
              )}
            </div>
            <StatusDynamicBody>{quoted_status.body}</StatusDynamicBody>
          </div>
        </div>
      )}
      <StatusActions status={status} />
    </div>
  );
};

export { StatusCard };

import Link from "next/link";

import { getStatus } from "@/lib/queries/get-status";
import { cn } from "@/utils/cn";
import { type ProfileRecord } from "@/lib/xata";
import { DateHoverCard } from "@/components/date-hover-card";
import { ProfileAvatarHoverCard } from "@/components/profile/profile-avatar";
import { ProfileHoverCard } from "@/components/profile/profile-hover-card";
import { StatusActions } from "@/components/status/status-actions";
import { StatusBody } from "@/components/status/status-body";
import { StatusWithParent } from "@/components/status/with-parent";
import { Separator } from "@/components/ui/separator";

import { anonymous } from "@/lib/defaults/anonymous";
import { SimilarStatuses } from "./similar-statuses";
import { Suspense } from "react";
import { StatusActionsFallback } from "@/components/status/status-actions/fallback";

const StatusPage = async ({ params }: { params: { id: string } }) => {
  const status_id = "rec_" + params.id;

  const status = await getStatus(status_id);

  let author_profile = (status?.author_profile as ProfileRecord) || anonymous;

  if (!status?.embedding) return null;

  const quoted_status = await getStatus(status.quote_from?.id);
  const quoted_author_profile =
    (quoted_status?.author_profile as ProfileRecord) || anonymous;

  return (
    <div className="container pt-6">
      <StatusWithParent replied_status_id={status.reply_to?.id}>
        <div className="flex gap-4">
          <div className="flex items-center">
            {quoted_status && <div className="h-0.5 w-4 bg-muted"></div>}
            <ProfileAvatarHoverCard profile={author_profile} />
          </div>
          <div className="grid grid-cols-1">
            <ProfileHoverCard profile={author_profile} className="font-bold">
              {author_profile.name}
            </ProfileHoverCard>
            <ProfileHoverCard
              profile={author_profile}
              className="-mt-2 mb-1 text-sm text-muted-foreground"
            >
              @{author_profile.handle}
            </ProfileHoverCard>
          </div>
        </div>

        <StatusBody
          className={cn(
            quoted_status &&
              "-mb-6 -mt-7 border-l-[2px] border-muted pb-8 pl-4 pt-7"
          )}
        >
          {status.body}
        </StatusBody>
      </StatusWithParent>

      {quoted_status && quoted_author_profile && (
        <div className="mb-4 flex space-x-4">
          <div className="grow-0">
            <div className="flex items-center">
              <div className="h-0.5 w-16 bg-muted"></div>
              <ProfileAvatarHoverCard
                profile={quoted_author_profile}
                size="small"
              />
            </div>
          </div>

          <div className="text-sm">
            <div className="flex flex-wrap items-center gap-x-2">
              <ProfileHoverCard profile={quoted_author_profile}>
                <span className="font-bold hover:underline">
                  {quoted_author_profile.name}
                </span>
              </ProfileHoverCard>
              <ProfileHoverCard profile={quoted_author_profile}>
                @{quoted_author_profile.handle}
              </ProfileHoverCard>
              {status.xata.createdAt && (
                <DateHoverCard date={status.xata.createdAt} />
              )}
            </div>
            <Link href={`/status/${quoted_status.id.replace("rec_", "")}`}>
              <StatusBody>{quoted_status.body}</StatusBody>
            </Link>
          </div>
        </div>
      )}

      <Suspense fallback={StatusActionsFallback(status)}>
        <StatusActions status={status} />
      </Suspense>

      <Separator className="my-4" />

      <Suspense>
        <SimilarStatuses
          status_id={status.id}
          status_embedding={status.embedding}
        />
      </Suspense>
    </div>
  );
};

export default StatusPage;

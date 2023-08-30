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

        <StatusBody status_id={status.id} className="py-1">
          {status.body}
        </StatusBody>
      </StatusWithParent>

      {quoted_status && quoted_author_profile && (
        <div className="flex space-x-4 hover:bg-muted/30 border rounded-lg my-2 p-3">
          <div className="grow-0">
            <div className="flex items-center">
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
                <DateHoverCard
                  status_id={quoted_status.id}
                  date={quoted_status.xata.createdAt}
                />
              )}
            </div>
            <StatusBody status_id={quoted_status.id}>
              {quoted_status.body}
            </StatusBody>
          </div>
        </div>
      )}

      <p className="text-xs italic text-muted-foreground">
        {status.xata.createdAt.toLocaleString("es-ES", {
          dateStyle: "full",
          timeStyle: "short",
        })}
      </p>
      <Separator className="my-4" />

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

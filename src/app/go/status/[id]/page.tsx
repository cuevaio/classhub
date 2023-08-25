import Link from "next/link";
import { SelectedPick } from "@xata.io/client";

import { getStatus } from "@/lib/queries/get-status";
import { cn } from "@/utils/cn";
import { type ProfileRecord, type StatusRecord } from "@/lib/xata";
import { DateHoverCard } from "@/components/date-hover-card";
import { ProfileAvatarHoverCard } from "@/components/profile/profile-avatar";
import { ProfileHoverCard } from "@/components/profile/profile-hover-card";
import { StatusList } from "@/components/status";
import { StatusActions } from "@/components/status/status-actions";
import { StatusDynamicBody } from "@/components/status/status-dynamic-body";
import { StatusWithParent } from "@/components/status/with-parent";
import { Separator } from "@/components/ui/separator";

import { getXataClient } from "@/lib/xata";
import { anonymous } from "@/lib/defaults/anonymous";
let xata = getXataClient();

export const revalidate = 10000;
export async function generateStaticParams() {
  const statuses = await xata.db.status.getAll();

  return statuses.map((status) => ({
    id: status.id,
  }));
}

const StatusPage = async ({ params }: { params: { id: string } }) => {
  const status_id = "rec_" + params.id;

  const status = await getStatus(status_id);

  let author_profile = (status?.author_profile as ProfileRecord) || anonymous;

  if (!status?.embedding) return null;

  const quoted_status = await getStatus(status.quote_from?.id);
  const quoted_author_profile =
    (quoted_status?.author_profile as ProfileRecord) || anonymous;

  const raw_similar_statuses = await xata.db.status.vectorSearch(
    "embedding",
    status.embedding,
    {
      size: 11,
    }
  );

  const still_raw_similar_statuses = await Promise.all(
    raw_similar_statuses.map(async ({ id }) => {
      if (id !== status_id) {
        const status = await getStatus(id);
        if (status) {
          return { ...status, xata: status.xata } as SelectedPick<
            StatusRecord,
            ["author_profile.*", "*"]
          >;
        }
      }
    })
  );

  const similar_statuses = still_raw_similar_statuses.filter(
    (el) => el !== undefined
  ) as SelectedPick<StatusRecord, ["author_profile.*", "*"]>[];

  return (
    <div className="container">
      <StatusWithParent replied_status_id={status.reply_to?.id}>
        <div className="flex gap-4">
          <div className="flex items-center">
            {quoted_status && <div className="h-0.5 w-4 bg-muted"></div>}
            <ProfileAvatarHoverCard profile={author_profile} />
          </div>
          <div className="grid grid-cols-1 gap-1">
            <ProfileHoverCard profile={author_profile}>
              <span className="font-bold">{author_profile.name}</span>
            </ProfileHoverCard>
            <ProfileHoverCard profile={author_profile}>
              <span className="-mt-1 mb-1 text-sm text-muted-foreground">
                @{author_profile.handle}
              </span>
            </ProfileHoverCard>
          </div>
        </div>

        <StatusDynamicBody
          className={cn(
            quoted_status &&
              "-mb-6 -mt-7 border-l-[2px] border-muted pb-8 pl-4 pt-7"
          )}
        >
          {status.body}
        </StatusDynamicBody>
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
              <StatusDynamicBody>{quoted_status.body}</StatusDynamicBody>
            </Link>
          </div>
        </div>
      )}
      <StatusActions status={status} />

      <Separator className="my-4" />

      <div className="">
        <h2>Publicaciones similares</h2>
        <StatusList statuses={similar_statuses} />
      </div>
    </div>
  );
};

export default StatusPage;

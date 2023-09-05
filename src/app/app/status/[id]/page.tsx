import { type ProfileRecord } from "@/lib/xata";
import { DateHoverCard } from "@/components/date-hover-card";
import { ProfileAvatarHoverCard } from "@/components/profile/profile-avatar";
import { ProfileHoverCard } from "@/components/profile/profile-hover-card";
import { StatusActions } from "@/components/status/status-actions";
import { StatusBody } from "@/components/status/status-body";
import { StatusWithParent } from "@/components/status/with-parent";
import { Separator } from "@/components/ui/separator";

import { anonymous } from "@/lib/defaults/anonymous";
import { StatusCard } from "@/components/status";

import { getXataClient } from "@/lib/xata";
import { type Profile } from "@/lib/types/profile";
import { StatusWithQuote } from "@/lib/types/status";
let xata = getXataClient();

const StatusPage = async ({ params }: { params: { id: string } }) => {
  let status_id = "rec_" + params.id;
  if (!status_id) return null;

  const status = await xata.db.status
    .select([
      "*",
      "author_profile.*",
      "quote_from.*",
      "quote_from.author_profile.*",
      "xata.createdAt",
      {
        name: "<-status.reply_to",
        as: "replies",
        columns: ["*", "author_profile.*", "xata.createdAt"],
      },
    ])
    .filter({
      id: status_id,
    })
    .getFirst();

  if (!status) return null;

  let profiles: Profile[] = [];

  if (status?.replies?.records?.length > 0) {
    profiles = (await xata.db.profile
      .filter({
        id: {
          $any: status?.replies?.records?.map(
            (status) => status.author_profile.id
          ),
        },
      })
      .select(["*", "xata.createdAt", "school.*"])
      .getAll()) as Profile[];
  }

  let author_profile = (status?.author_profile as Profile) || anonymous;

  if (!status?.embedding) return null;
  if (!status.body) return null;

  const quoted_status = status.quote_from;
  const quoted_author_profile =
    (quoted_status?.author_profile as Profile) || anonymous;

  return (
    <div className="container">
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
          timeZone: "America/Lima",
        })}
      </p>
      <Separator className="my-4" />

      <StatusActions
        id={status.id}
        like_count={status.like_count}
        reply_count={status.reply_count}
        quote_count={status.quote_count}
        body={status.body}
      />

      <Separator className="my-4" />

      {status.replies?.records.length > 0 && (
        <>
          <h2 className="text-xl font-bold mb-2">Respuestas</h2>
          <div className="grid grid-cols-1 gap-4">
            {status.replies.records.map((status) => (
              <StatusCard
                status={
                  {
                    ...status,
                    author_profile: profiles.find(
                      (profile) => profile.id === status.author_profile
                    ),
                  } as StatusWithQuote
                }
                key={status.id}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default StatusPage;

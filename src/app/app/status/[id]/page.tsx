import { DateHoverCard } from "@/components/date-hover-card";
import { ProfileAvatarHoverCard } from "@/components/profile/profile-avatar";
import { ProfileHoverCard } from "@/components/profile/profile-hover-card";
import { StatusActions } from "@/components/status/status-actions";
import { StatusBody } from "@/components/status/status-body";
import { Separator } from "@/components/ui/separator";

import { anonymous } from "@/lib/defaults/anonymous";
import { StatusCard } from "@/components/status";

import { getXataClient } from "@/lib/xata";
import { type Profile } from "@/lib/types/profile";
import { StatusWithQuote } from "@/lib/types/status";
import { notFound } from "next/navigation";
let xata = getXataClient();

const StatusPage = async ({ params }: { params: { id: string } }) => {
  let status_id = "rec_" + params.id;
  if (!status_id) return null;

  const status = await xata.db.status
    .select([
      "id",
      "body",
      "like_count",
      "quote_count",
      "reply_count",
      "xata.createdAt",

      "author_profile.handle",
      "author_profile.name",
      "author_profile.profile_picture",
      "author_profile.bio",
      "author_profile.email",
      "author_profile.like_count",
      "author_profile.follower_count",
      "author_profile.following_count",
      "author_profile.school.handle",

      "quote_from.id",
      "quote_from.body",
      "quote_from.like_count",
      "quote_from.quote_count",
      "quote_from.reply_count",
      "quote_from.xata.createdAt",

      "quote_from.author_profile.handle",
      "quote_from.author_profile.name",
      "quote_from.author_profile.profile_picture",
      "quote_from.author_profile.bio",

      "reply_to.id",
      "reply_to.body",
      "reply_to.like_count",
      "reply_to.quote_count",
      "reply_to.reply_count",
      "reply_to.xata.createdAt",

      "reply_to.author_profile.handle",
      "reply_to.author_profile.name",
      "reply_to.author_profile.profile_picture",
      "reply_to.author_profile.bio",
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

  if (!status) return notFound();

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
      .select([
        "bio",
        "profile_picture",
        "name",
        "handle",
        "follower_count",
        "like_count",
        "following_count",
        "email",
        "school.handle",
      ])
      .getAll()) as Profile[];
  }

  let author_profile = (status?.author_profile as Profile) || anonymous;

  if (!status.body) return null;

  const quoted_status = status.quote_from;
  const quoted_author_profile =
    (quoted_status?.author_profile as Profile) || anonymous;

  let replied_status = status.reply_to;
  let replied_author_profile =
    (replied_status?.author_profile as Profile) || anonymous;

  return (
    <div className="container">
      {replied_status && (
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <ProfileAvatarHoverCard profile={replied_author_profile} />
            <div className="w-0.5 grow bg-muted-foreground"></div>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-x-2">
              <ProfileHoverCard profile={replied_author_profile}>
                <span className="font-bold hover:underline">
                  {replied_author_profile.name}
                </span>
              </ProfileHoverCard>
              <ProfileHoverCard profile={replied_author_profile}>
                <span>@{replied_author_profile.handle}</span>
              </ProfileHoverCard>
              {replied_status.xata.createdAt && (
                <DateHoverCard
                  status_id={replied_status.id}
                  date={replied_status.xata.createdAt}
                />
              )}
            </div>
            <div className="text-muted"></div>
            <StatusBody status_id={replied_status.id}>
              {replied_status.body}
            </StatusBody>
            <StatusActions
              id={replied_status.id}
              like_count={replied_status.like_count}
              reply_count={replied_status.reply_count}
              quote_count={replied_status.quote_count}
              body={replied_status.body || ""}
            />
          </div>
        </div>
      )}
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

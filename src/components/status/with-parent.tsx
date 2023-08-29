import { getStatus } from "@/lib/queries/get-status";
import { DateHoverCard } from "@/components/date-hover-card";
import { ProfileAvatarHoverCard } from "@/components/profile/profile-avatar";
import { ProfileHoverCard } from "@/components/profile/profile-hover-card";
import { StatusActions } from "@/components/status/status-actions";
import { StatusBody } from "@/components/status/status-body";
import { ProfileRecord } from "@/lib/xata";
import { anonymous } from "@/lib/defaults/anonymous";

interface Props {
  replied_status_id?: string | null;
  children: React.ReactNode;
}

const StatusWithParent = async ({ replied_status_id, children }: Props) => {
  const replied_status = await getStatus(replied_status_id);
  let author_profile =
    (replied_status?.author_profile as ProfileRecord) || anonymous;

  if (!replied_status?.id || !replied_status?.author_profile)
    return <>{children}</>;

  return (
    <>
      <div className="flex gap-4">
        <div className="flex flex-col items-center">
          <ProfileAvatarHoverCard profile={author_profile} />
          <div className="w-0.5 grow bg-muted-foreground"></div>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-x-2">
            <ProfileHoverCard profile={author_profile}>
              <span className="font-bold hover:underline">
                {author_profile.name}
              </span>
            </ProfileHoverCard>
            <ProfileHoverCard profile={author_profile}>
              <span>@{author_profile.handle}</span>
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
          <StatusActions status={replied_status} />
        </div>
      </div>

      {children}
    </>
  );
};

export { StatusWithParent };

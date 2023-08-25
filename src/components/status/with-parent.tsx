import { getStatus } from "@/lib/queries/get-status";
import { DateHoverCard } from "@/components/date-hover-card";
import { ProfileAvatarHoverCard } from "@/components/profile/profile-avatar";
import { ProfileHoverCard } from "@/components/profile/profile-hover-card";
import { StatusActions } from "@/components/status/status-actions";
import { StatusDynamicBody } from "@/components/status/status-dynamic-body";
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
    <StatusWithParent replied_status_id={replied_status.reply_to?.id}>
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
              <DateHoverCard date={replied_status.xata.createdAt} />
            )}
          </div>
          <div className="text-muted"></div>
          <StatusDynamicBody>{replied_status.body}</StatusDynamicBody>
          <StatusActions status={replied_status} />
        </div>
      </div>

      {children}
    </StatusWithParent>
  );
};

export { StatusWithParent };

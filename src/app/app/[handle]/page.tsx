import { getXataClient } from "@/lib/xata";
import { notFound } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProfileStatuses } from "./statuses";
let xata = getXataClient();

const ProfilePage = async ({ params }: { params: { handle: string } }) => {
  let handle = params.handle;

  let profile = await xata.db.profile
    .select([
      "handle",
      "name",
      "profile_picture",
      "bio",
      "like_count",
      "follower_count",
      "following_count",
      "school.handle",
      "email",
    ])
    .filter({ handle })
    .getFirst();

  if (!profile) return notFound();

  let profile_picture = profile?.profile_picture?.url;

  return (
    <div>
      <div className="flex gap-4 sm:gap-12">
        <Avatar className="w-16 h-16 sm:w-40 sm:h-40">
          <AvatarImage src={profile_picture} alt={`@${handle}`} />
          <AvatarFallback className="font-bold text-2xl">
            {profile.name?.slice(0, 1)}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-4 items-center">
            <h1 className="text-lg sm:text-xl">@{handle}</h1>
            <Button size="sm">Follow</Button>
          </div>
          <div className="grid grid-cols-3 gap-1 sm:gap-4 items-center text-xs sm:text-sm">
            <div className="flex gap-1">
              <span className="font-bold">{profile.follower_count}</span>
              <span>seguidores</span>
            </div>
            <div className="flex gap-1">
              <span className="font-bold">{profile.following_count}</span>
              <span>siguiendo</span>
            </div>
            <div className="flex gap-1">
              <span className="font-bold">{profile.like_count}</span>
              <span>likes</span>
            </div>
          </div>
          <div className="space-y-0.5">
            <h2 className="font-bold">{profile.name}</h2>
            <span className="text-muted-foreground text-sm">
              {profile.school?.handle?.toUpperCase()}
            </span>
            <p className="text-sm">{profile.bio}</p>
          </div>
        </div>
      </div>
      <Separator className="my-4" />
      {profile && <ProfileStatuses handle={handle} profile={profile} />}
    </div>
  );
};

export default ProfilePage;

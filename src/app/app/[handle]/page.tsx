import { getXataClient } from "@/lib/xata";
import { notFound } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ProfileStatuses } from "./statuses";
import { ProfileInteractions } from "./stats";
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
      "order",
    ])
    .filter({ handle })
    .getFirst();

  if (!profile) return notFound();

  let profile_picture = profile?.profile_picture?.url;

  return (
    <>
      <div className="flex gap-4 sm:gap-12">
        <Avatar className="w-16 h-16 sm:w-40 sm:h-40">
          <AvatarImage
            src={profile_picture}
            alt={`@${handle}`}
            className="object-cover"
          />
          <AvatarFallback className="font-bold text-2xl">
            {profile.name?.slice(0, 1)}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <div className="">
            <h1 className="text-lg sm:text-xl">
              @{handle}{" "}
              <span className="text-muted-foreground">
                #{String(profile.order).padStart(6, "0")}
              </span>
            </h1>
            <h2 className="font-bold">{profile.name}</h2>
          </div>
          <ProfileInteractions
            handle={profile.handle || handle}
            like_count={profile.like_count}
            follower_count={profile.follower_count}
            following_count={profile.following_count}
          />
          <div className="space-y-0.5">
            <span className="text-muted-foreground text-sm">
              {profile.school?.handle?.toUpperCase()}
            </span>
            <p className="text-sm">{profile.bio}</p>
          </div>
        </div>
      </div>
      <Separator className="my-4" />
      {profile && <ProfileStatuses handle={handle} profile={profile} />}
    </>
  );
};

export default ProfilePage;

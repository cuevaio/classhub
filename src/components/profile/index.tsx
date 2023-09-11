import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type Profile } from "@/lib/types/profile";

const ProfileCard = ({ profile }: { profile: Profile }) => {
  return (
    <div className="flex gap-4">
      <Link href={`/app/${profile.handle}`}>
        <Avatar className="h-14 w-14">
          <AvatarImage src={profile.profile_picture?.url} />
          <AvatarFallback className="font-bold">
            {profile.name
              ? profile.name.split(" ")[0][0]
              : profile.handle
              ? profile.handle[0]
              : "*"}
          </AvatarFallback>
        </Avatar>
      </Link>
      <div>
        <div className="flex flex-wrap gap-x-2 gap-y-1 items-center">
          <Link
            href={`/app/${profile.handle}`}
            className="font-bold hover:underline"
          >
            {profile.name}
          </Link>
          <Link
            href={`/app/${profile.handle}`}
            className="text-sm text-muted-foreground"
          >
            @{profile.handle}
          </Link>
          <div className="rounded-full border border-primary text-primary text-xs w-min px-2">{profile.school?.handle}</div>
        </div>
        <p className="text-sm">{profile.bio}</p>
      </div>
    </div>
  );
};

export { ProfileCard };

import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Profile } from "@/lib/types/profile";

const ProfileCard = ({ profile }: { profile: Profile }) => {
  return (
    <div className="flex gap-4">
      <Link href={`/u/${profile.handle}`}>
        <Avatar className="h-14 w-14">
          <AvatarImage src={profile.profile_picture || ""} />
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
        <Link
          href={`/u/${profile.handle}`}
          className="font-bold hover:underline"
        >
          {profile.name}
        </Link>
        <Link
          href={`/u/${profile.handle}`}
          className="-mt-1 mb-1 text-sm text-muted-foreground"
        >
          @{profile.handle}
        </Link>
        <p className="text-sm">{profile.bio}</p>
      </div>
    </div>
  );
};

export { ProfileCard };

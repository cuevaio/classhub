import { ProfileHoverCard } from "@/components/profile/profile-hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type Profile } from "@/lib/types/profile";

interface Props {
  profile: Profile;
  size?: "small" | "medium" | "large";
}

function getSize(size: string) {
  if (size === "small") {
    return "h-12 w-12";
  } else if (size === "medium") {
    return "h-14 w-14";
  } else {
    return "h-16 w-16";
  }
}

const ProfileAvatarHoverCard = ({ profile, size = "medium" }: Props) => (
  <ProfileHoverCard profile={profile}>
    <Avatar className={getSize(size)}>
      <AvatarImage src={profile.profile_picture?.url} />
      <AvatarFallback className="font-bold">
        {profile.name
          ? profile.name.split(" ")[0][0]
          : profile.handle
          ? profile.handle[0]
          : "*"}
      </AvatarFallback>
    </Avatar>
  </ProfileHoverCard>
);

export { ProfileAvatarHoverCard };

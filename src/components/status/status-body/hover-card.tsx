"use client";
import { useQuery } from "@tanstack/react-query";
import { ProfileHoverCard } from "@/components/profile/profile-hover-card";

const HoverCard = ({ handle }: { handle: string }) => {
  async function fetchProfile() {
    const res = await fetch(`/api/profiles/${handle}`);
    return res.json();
  }

  const { data } = useQuery({
    queryKey: ["profile", handle],
    queryFn: fetchProfile,
  });

  if (data && data.profile) {
    return (
      <ProfileHoverCard
        profile={data.profile}
        className="text-primary font-medium"
      >
        @{handle}
      </ProfileHoverCard>
    );
  }

  return <span>@{handle}</span>;
};

export { HoverCard };

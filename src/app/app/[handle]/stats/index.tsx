"use client";

import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface ProfileStats {
  follower_count: number;
  following_count: number;
  like_count: number;
  following: boolean;
}

const ProfileInteractions = ({
  handle,
  follower_count,
  following_count,
  like_count,
}: {
  handle: string;
  follower_count: number;
  following_count: number;
  like_count: number;
}) => {
  async function fetchStats() {
    const res = await fetch(`/api/profiles/${handle}/stats`);
    return res.json();
  }

  async function fetchFollow() {
    const res = await fetch(`/api/profiles/${handle}/follow`, {
      method: "POST",
    });
    if (!res.ok) throw new Error("Failed to follow");
    let json = await res.json();
    return json.data as ProfileStats;
  }

  let queryClient = useQueryClient();

  let { data: stats } = useQuery<ProfileStats>({
    queryFn: fetchStats,
    queryKey: ["profile", { handle }, "stats"],
  });

  let { mutate: follow } = useMutation({
    mutationFn: fetchFollow,
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["profile", { handle }, "stats"],
      });

      const previousStats = queryClient.getQueryData([
        "profile",
        { handle },
        "stats",
      ]) as ProfileStats;

      queryClient.setQueryData(["profile", { handle }, "stats"], (old: any) => {
        let stats = old as ProfileStats;
        console.log(stats);
        return {
          ...stats,
          following: !stats.following,
          follower_count: stats.follower_count + (stats.following ? -1 : 1),
        };
      });

      return { previousStats };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["profile", { handle }, "stats"], data);
    },
  });

  return (
    <div>
      <div className="flex gap-2 sm:gap-4 items-center text-xs sm:text-sm mb-2">
        <div className="flex gap-1">
          <span className="font-bold">
            {stats?.follower_count || follower_count}
          </span>
          <span>seguidores</span>
        </div>
        <div className="flex gap-1">
          <span className="font-bold">
            {stats?.following_count || following_count}
          </span>
          <span>siguiendo</span>
        </div>
        <div className="flex gap-1">
          <span className="font-bold">{stats?.like_count || like_count}</span>
          <span>likes</span>
        </div>
      </div>
      <Button
        size="sm"
        variant={stats?.following ? "secondary" : "default"}
        onClick={() => follow()}
      >
        {stats?.following ? "Dejar de seguir" : "Seguir"}
      </Button>
    </div>
  );
};

export { ProfileInteractions };

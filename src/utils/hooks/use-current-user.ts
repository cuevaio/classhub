import { type Profile } from "@/lib/types/profile";
import { useQuery } from "@tanstack/react-query";

export function useCurrentUser() {
  const { isLoading, data } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      let res = await fetch("/api/auth/me");
      if (!res.ok) throw new Error("Not authenticated");
      return res.json();
    },
  });

  return {
    isLoading,
    profile: data ? (data.profile as Profile) : undefined,
  };
}

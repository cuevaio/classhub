import { Profile } from "@/lib/types/profile";
import { useQuery } from "@tanstack/react-query";

export function useCurrentUser() {
  const { isLoading, data } = useQuery(["currentUser"], () =>
    fetch("/api/auth/me").then((res) => res.json())
  );

  return {
    isLoading,
    profile: (data?.profile as Profile) || undefined,
  };
}

import { type Profile } from "@/lib/types/profile";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function useCurrentUser() {
  let { status } = useSession();
  const { isLoading, data, error } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => fetch("/api/auth/me").then((res) => res.json()),
    enabled: status === "authenticated",
  });

  return {
    isLoading,
    profile: data
      ? data?.profile?.name
        ? (data?.profile as Profile)
        : null
      : undefined,
    error,
  };
}
